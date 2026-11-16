#!/usr/bin/env node
// =============================================================
//  build.mjs —— 把 content/ + templates/ + static/ 生成 site/
//
//  用法：
//    node build.mjs            只生成一次（GitHub Actions 用这个）
//    node build.mjs --serve    本地预览 + 自动重建
//
//  不需要 npm install，不需要 Hugo / Python / 任何二进制。
//  只用到 Node 自带模块，所以三年后它还能跑。
// =============================================================

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { watch } from 'node:fs';
import { dirname, join, resolve, sep, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { webcrypto } from 'node:crypto';
import http from 'node:http';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, process.env.SITE_OUT || 'site');
const SERVE = process.argv.includes('--serve');
const PORT = Number(process.env.PORT || 4173);

// =============================================================
//  一、极简模板引擎（约 70 行，够用就好）
//  支持四种写法：
//    {{ 变量 }}              插入内容（原样输出，不转义，所以能写 HTML）
//    {{#each 数组}}…{{/each}} 遍历
//    {{#if 值}}…{{/if}}       有值就渲染
//    {{#unless 值}}…{{/unless}} 没值才渲染
//  变量路径可以用点号：{{ site.name }}、{{ entries }}
// =============================================================

const TAG = /\{\{\s*([#/]?)\s*([^{}]*?)\s*\}\}/g;

function parse(src, where) {
  const root = { children: [], kind: 'root' };
  const stack = [root];
  const cur = () => stack[stack.length - 1];
  const append = (n) => (cur().elseActive ? cur().elseChildren : cur().children).push(n);
  let last = 0;
  let m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(src)) !== null) {
    if (m.index > last) append({ text: src.slice(last, m.index) });
    last = m.index + m[0].length;
    const sigil = m[1];
    const body = m[2];
    if (sigil === '#') {
      const parts = body.split(/\s+/);
      const kind = parts[0];
      if (kind === 'else') {
        const top = cur();
        if (top === root) throw new Error(`${where}: {{else}} 没有对应的 {{#…}}`);
        top.elseChildren = [];
        top.elseActive = true;
      } else {
        const node = { kind, expr: parts.slice(1).join(' '), children: [], elseChildren: null, elseActive: false };
        append(node);
        stack.push(node);
      }
    } else if (sigil === '/') {
      if (stack.length === 1) throw new Error(`${where}: 多余的 {{/${body}}}，没有对应的 {{#…}}`);
      stack.pop();
    } else if (body.trim() === 'else') {
      const top = cur();
      if (top === root) throw new Error(`${where}: {{else}} 没有对应的 {{#…}}`);
      top.elseChildren = [];
      top.elseActive = true;
    } else {
      append({ expr: body, where });
    }
  }
  if (stack.length > 1) throw new Error(`${where}: {{#${cur().expr}}} 没有闭合`);
  if (last < src.length) append({ text: src.slice(last) });
  return root.children;
}

function lookup(expr, scopes) {
  if (!expr) return '';
  if (expr === 'this' || expr === '.') return scopes[scopes.length - 1];
  const parts = expr.split('.');
  for (let i = scopes.length - 1; i >= 0; i--) {
    const scope = scopes[i];
    if (scope && typeof scope === 'object' && parts[0] in scope) {
      let v = scope;
      for (const p of parts) {
        if (v === null || v === undefined) return '';
        v = v[p];
      }
      return v;
    }
  }
  return '';
}

function truthy(v) {
  if (v === false || v === null || v === undefined || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function render(nodes, scopes) {
  let out = '';
  for (const n of nodes) {
    if (n.text !== undefined) { out += n.text; continue; }
    if (n.expr !== undefined && n.children === undefined) {
      const v = lookup(n.expr, scopes);
      out += v === null || v === undefined ? '' : String(v);
      continue;
    }
    const v = lookup(n.expr, scopes);
    if (n.kind === 'each') {
      if (Array.isArray(v)) for (const item of v) out += render(n.children, scopes.concat(item));
      else if (v && typeof v === 'object') for (const item of Object.values(v)) out += render(n.children, scopes.concat(item));
    } else if (n.kind === 'if') {
      out += render(truthy(v) ? n.children : (n.elseChildren || []), scopes);
    } else if (n.kind === 'unless') {
      out += render(truthy(v) ? (n.elseChildren || []) : n.children, scopes);
    } else {
      throw new Error(`未知模板指令 {{#${n.kind}}}，只支持 each / if / unless`);
    }
  }
  return out;
}

// =============================================================
//  二、格式化的小工具
// =============================================================

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-08" / "2026/8" / "2026" -> "[08/2026]" / "[2026]"
function fmtDate(value) {
  const m = String(value ?? '').trim().match(/^(\d{4})(?:[-/.](\d{1,2}))?/);
  if (!m) return value ? `[${value}]` : '';
  return m[2] ? `[${String(m[2]).padStart(2, '0')}/${m[1]}]` : `[${m[1]}]`;
}

function monthYear(d) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 把作者列表里的自己加粗（作者里出现 site.me 中任意一种写法）
// 注意：同一个名字可能出现两次（例：Xiao, B. 与另一位同名作者 Xiao Biao），
// 只加粗“第一次出现”的那一个，后面的保持原样。
function boldMe(authors, me = []) {
  let out = String(authors || '');
  for (const name of me) {
    if (!name) continue;
    const re = new RegExp(`(?<!<b>)${escapeRe(name)}(?!</b>)`);
    out = out.replace(re, `<b>${name}</b>`);
  }
  return out;
}

// 共一：在自己名字后面挂一个 †（紧跟第一个 </b>）
function markEqual(authors) {
  const s = String(authors || '');
  const i = s.indexOf('</b>');
  return i === -1 ? s : `${s.slice(0, i + 4)}<sup class="eq">&dagger;</sup>${s.slice(i + 4)}`;
}

// 标题末尾补句号（已经以 . ? ! 结尾就不补）
function sentence(text) {
  const t = String(text ?? '').trim();
  if (!t) return '';
  return /[.?!。？！]$/.test(t) ? t : `${t}.`;
}

function slugify(text, fallback) {
  const s = String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s || fallback;
}

// =============================================================
//  三、把 content 数据整理成模板要的形状
// =============================================================

// 论文分组：顺序 = 这里的顺序；组内按年份从新到旧（同年保持文件里的先后）
const PUB_SECTIONS = [
  { type: 'journal',    title: 'Journal Articles',   anchor: 'journal' },
  { type: 'conference', title: 'Conference Papers',  anchor: 'conference' },
  { type: 'preprint',   title: 'Preprints',          anchor: 'preprint' },
  { type: 'chapter',    title: 'Book Chapters',      anchor: 'chapter' },
  { type: 'software',   title: 'Software & Data',    anchor: 'software' },
];

function groupPublications(pubs, site) {
  const sections = [];
  for (const def of PUB_SECTIONS) {
    const entries = pubs
      .filter((p) => (p.type || 'journal') === def.type)
      .map((p) => ({
        authors: p.equal ? markEqual(boldMe(p.authors, site.me)) : boldMe(p.authors, site.me),
        year: p.year ?? '',
        title: sentence(p.title),
        venue: p.venue ?? '',
        details: p.details ?? '',
        doi: p.doi ?? '',
        note: p.note ?? '',
        highlight: !!p.highlight,
      }))
      .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    if (entries.length) sections.push({ ...def, entries });
  }
  return sections;
}

function groupExperiences(sections) {
  return sections.map((s, i) => ({
    title: s.title ?? '',
    anchor: s.anchor || slugify(s.title, `section-${i + 1}`),
    entries: (s.entries || []).map((e) => ({
      when: e.when ?? '',
      main: e.main ?? '',
      sub: e.sub ?? '',
      extra: e.extra ?? '',
      logo: e.logo ?? '',
    })),
  }));
}

// =============================================================
//  三·五、Markdown 渲染 + 加密（博客 / 自省）
// =============================================================

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  let t = escapeHtml(s);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">');
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\s][^*]*)\*(?!\*)/g, '$1<em>$2</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return t;
}

// 极简 Markdown 渲染：标题 / 段落 / 无序·有序列表 / 引用 / 分隔线 / 围栏代码块 / 行内格式
function mdToHtml(src) {
  const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  const para = [];
  const flush = () => { if (para.length) { out.push(`<p>${para.map(inline).join('<br>')}</p>`); para.length = 0; } };
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
      i++;
      out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }
    if (!line.trim()) { flush(); i++; continue; }
    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) { flush(); const lvl = Math.min(m[1].length + 1, 6); out.push(`<h${lvl}>${inline(m[2])}</h${lvl}>`); i++; continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flush(); out.push('<hr>'); i++; continue; }
    if ((m = line.match(/^\s*[-*+]\s+(.*)$/))) { flush(); const items = []; while (i < lines.length) { const x = lines[i].match(/^\s*[-*+]\s+(.*)$/); if (!x) break; items.push(`<li>${inline(x[1])}</li>`); i++; } out.push(`<ul>${items.join('')}</ul>`); continue; }
    if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) { flush(); const items = []; while (i < lines.length) { const x = lines[i].match(/^\s*\d+[.)]\s+(.*)$/); if (!x) break; items.push(`<li>${inline(x[1])}</li>`); i++; } out.push(`<ol>${items.join('')}</ol>`); continue; }
    if ((m = line.match(/^\s*>\s?(.*)$/))) { flush(); const items = []; while (i < lines.length) { const x = lines[i].match(/^\s*>\s?(.*)$/); if (!x) break; items.push(inline(x[1])); i++; } out.push(`<blockquote>${items.join('<br>')}</blockquote>`); continue; }
    para.push(line);
    i++;
  }
  flush();
  return out.join('\n');
}

// 读取 markdown 的 front-matter（顶部 --- 之间那几行）
function parseFrontMatter(md) {
  const m = String(md).replace(/^\uFEFF/, '').match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: m[2] };
}

// 收集一个目录下的 .md 文件 -> [{ slug, meta, bodyHtml }]
function collectMarkdown(dir) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { meta, body } = parseFrontMatter(readFileSync(join(abs, f), 'utf8'));
      return { slug: f.replace(/\.md$/, ''), meta, bodyHtml: mdToHtml(body) };
    });
}

function b64(u8) {
  let s = '';
  for (const b of u8) s += String.fromCharCode(b);
  return Buffer.from(s, 'latin1').toString('base64');
}

// 构建时用密码加密一段 HTML（PBKDF2 + AES-GCM，标准 Web Crypto，浏览器端可解）
async function encryptHtml(plain, password) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const km = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await webcrypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200000, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ct = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain));
  return { v: 1, salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}

// 密码来源：环境变量 SITE_PASSWORD，或本地的 content/.secret.js（后者已 gitignore）
async function getPassword() {
  if (process.env.SITE_PASSWORD) return process.env.SITE_PASSWORD;
  const f = join(ROOT, 'content', '.secret.js');
  if (existsSync(f)) return (await import(pathToFileURL(f).href + '?v=' + Date.now())).default;
  return null;
}

// =============================================================
//  四、读内容（每次都重新 import，改了文件刷新就能看到）
// =============================================================

async function load(rel) {
  const url = pathToFileURL(join(ROOT, rel)).href + `?v=${Date.now()}`;
  try {
    const mod = await import(url);
    return mod.default ?? {};
  } catch (err) {
    throw new Error(`${rel} 里有错误：${err.message}\n  修好这个文件再保存，构建会自动重试。`);
  }
}

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

// =============================================================
//  五、构建
// =============================================================

async function build() {
  const t0 = Date.now();

  const site = await load('content/site.js');
  const news = await load('content/news.js');
  const pubs = await load('content/publications.js');
  const exps = await load('content/experiences.js');

  const password = await getPassword();
  const backroomPosts = collectMarkdown('content/backroom');

  const now = new Date();
  const siteView = { ...site, year_now: now.getFullYear() };
  // 邮箱防爬：页面只显示 "name [at] host [dot] tld"，真实地址 base64 放在 data 属性里，
  // 由 base.html 的小脚本点击时还原成 mailto。爬虫抓 HTML 抓不到完整地址。
  const email = String(site.email || '');
  siteView.email_b64 = email ? Buffer.from(email, 'utf8').toString('base64') : '';
  siteView.email_text = email
    ? email.replace('@', ' [at] ').replace(/\.(?=[^.]*$)/, ' [dot] ')
    : '';
  const scope = { site: siteView };

  const written = [];

  const pages = [
    {
      out: 'index.html',
      tpl: 'home.html',
      navTitle: 'Home',
      title: siteView.name || 'Home',
      data: {
        news: (news || []).map((n) => ({ date: fmtDate(n.date), text: n.text || '' })),
        bio: siteView.bio || [],
        interests: siteView.interests || [],
      },
    },
    {
      out: 'publications.html',
      tpl: 'publications.html',
      navTitle: 'Publications',
      title: `Publications | ${siteView.name}`,
      data: {
        sections: groupPublications(pubs || [], siteView),
        legend: (pubs || []).some((p) => p.equal) ? '&dagger; co-first author' : '',
      },
    },
    {
      out: 'experiences.html',
      tpl: 'experiences.html',
      navTitle: 'Experiences',
      title: `Experiences | ${siteView.name}`,
      data: { sections: groupExperiences(exps || []), updated: monthYear(now) },
    },
    {
      out: 'backroom.html',
      tpl: 'backroom.html',
      navTitle: 'Backroom',
      title: `Backroom | ${siteView.name}`,
      data: {},
    },
    {
      out: '404.html',
      tpl: '404.html',
      navTitle: '',
      title: `404 | ${siteView.name}`,
      // 404 会在任意深度被访问，相对链接会指错，所以这一页用根路径前缀
      base: siteView.base || '/',
      data: {},
    },
  ];

  const baseNodes = parse(read('templates/base.html'), 'templates/base.html');

  // 清空 dist 但不删 dist 目录本身（Windows 上删除被占用的目录会 EPERM，删内容则不会）
  mkdirSync(DIST, { recursive: true });
  for (const name of readdirSync(DIST)) {
    rmSync(join(DIST, name), { recursive: true, force: true });
  }

  for (const page of pages) {
    const where = `templates/${page.tpl}`;
    const nav = (siteView.nav || []).map((n) => ({ ...n, active: n.label === page.navTitle }));
    const body = render(parse(read(where), where), [scope, { ...page.data, prefix: page.base || '' }]);
    const html = render(baseNodes, [
      {
        site: siteView,
        nav,
        body,
        page_title: page.title,
        meta_description: siteView.title ? `${siteView.name} — ${siteView.title}` : siteView.name,
        page_path: page.out,
        prefix: page.base || '',
      },
    ]);
    writeFileSync(join(DIST, page.out), html, 'utf8');
    written.push(page.out);
  }

  // ===== Backroom：整页加密（文章列表 + 单篇，一个密文）=====
  const posts = backroomPosts
    .map((p) => ({ slug: p.slug, title: p.meta.title || p.slug, date: p.meta.date || '', body: p.bodyHtml }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const backroomBodyNodes = parse(read('templates/backroom-body.html'), 'templates/backroom-body.html');
  const backroomHtml = render(backroomBodyNodes, [{ posts }]);
  mkdirSync(join(DIST, 'backroom'), { recursive: true });
  const rec = password ? await encryptHtml(backroomHtml, password) : { status: 'unavailable' };
  writeFileSync(join(DIST, 'backroom', 'content.json'), JSON.stringify(rec), 'utf8');
  written.push('backroom/content.json');

  // static/ 下的东西整包复制（样式、附件、CNAME 都放这里）
  const staticDir = join(ROOT, 'static');
  if (existsSync(staticDir)) {
    for (const name of readdirSync(staticDir)) {
      cpSync(join(staticDir, name), join(DIST, name), { recursive: true });
    }
  }
  writeFileSync(join(DIST, '.nojekyll'), '');

  const ms = Date.now() - t0;
  const stamp = now.toLocaleTimeString('zh-CN', { hour12: false });
  console.log(`✓ 已生成 ${written.length} 个页面到 ${basename(DIST)}/  (${stamp}, ${ms} ms)`);
  return written;
}

// =============================================================
//  六、本地预览（--serve）
// =============================================================

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

function serve() {
  http
    .createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      } catch {
        res.writeHead(400).end('Bad request');
        return;
      }
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = resolve(join(DIST, pathname));
      if (!file.startsWith(resolve(DIST) + sep) || !existsSync(file)) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('404 — 没有这个文件');
        return;
      }
      const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
      res.writeHead(200, {
        'content-type': MIME[ext] || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(readFileSync(file));
    })
    .listen(PORT, '127.0.0.1', () => {
      console.log(`\n  本地预览  http://127.0.0.1:${PORT}`);
      console.log(`  改 content/ 或 templates/ 里任意文件，保存即自动重建（Ctrl+C 退出）\n`);
    });

  let timer = null;
  const rebuilt = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        await build();
      } catch (err) {
        console.error(`\n✗ ${err.message}\n`);
      }
    }, 120);
  };

  for (const dir of ['content', 'templates', 'static']) {
    const abs = join(ROOT, dir);
    if (existsSync(abs)) watch(abs, { recursive: true }, rebuilt);
  }
}

// =============================================================

try {
  await build();
  if (SERVE) serve();
} catch (err) {
  console.error(`\n✗ 构建失败：${err.message}\n`);
  process.exit(1);
}
