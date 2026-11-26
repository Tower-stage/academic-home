// =============================================================
//  unlock.js —— Thinking（backroom）整页密码解锁
//
//  Backroom 的全部内容在构建时用 PBKDF2 + AES-GCM 加密成密文：
//    backroom/content.json        文章列表 + 全部文章（一次解出来）
//    backroom/app-<slug>.json     收在里面的工具（目前只有 Model）单独一份，点开才算
//  这里在浏览器端解密，整页注入；工具塞进 iframe 里跑，样式和脚本
//  都关在自己的框里，不会污染站点。
//  密码只存在于你输入的那一下和这页的内存里，不写进仓库、不写进本地存储。
//
//  说明：这层加密能挡住随意翻看和搜索引擎，但挡不住一个拿到密文后
//  专门离线爆破的 attacker —— 所以请用足够长的密码（见 README）。
// =============================================================

(function () {
  'use strict';

  const gate = document.getElementById('backroom-gate');
  const content = document.getElementById('backroom-content');
  const input = document.getElementById('backroom-pass');
  if (!gate || !content || !input) return; // 不是 Backroom 页就什么都不做

  let secret = ''; // 解锁成功时的密码，留着给工具解密用
  const appCache = new Map(); // slug -> 已解密的 HTML，来回切换不重复解密

  function b64ToBuf(b64) {
    const bin = atob(b64);
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  }

  async function decrypt(rec, password) {
    const km = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64ToBuf(rec.salt), iterations: 200000, hash: 'SHA-256' },
      km,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBuf(rec.iv) }, key, b64ToBuf(rec.ct));
    return new TextDecoder().decode(pt);
  }

  // ---- 一次工具的解密：只有点开那一条时才去下载 ----
  async function loadApp(slug) {
    if (appCache.has(slug)) return appCache.get(slug);
    const res = await fetch('backroom/app-' + encodeURIComponent(slug) + '.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('missing');
    const rec = await res.json();
    if (rec.status === 'unavailable') throw new Error('unavailable');
    const html = await decrypt(rec, secret);
    appCache.set(slug, html);
    return html;
  }

  // ---- 列表（标题 + 日期）↔ 单篇 / 单个工具，用 hash 记录当前位置 ----
  function initEssay() {
    const postIndex = document.getElementById('post-index');
    const postView = document.getElementById('post-view');
    const appIndex = document.getElementById('app-index');
    const appView = document.getElementById('app-view');
    const frame = document.getElementById('app-frame');
    const wrap = document.getElementById('app-frame-wrap');
    const statusEl = document.getElementById('app-status');
    const openEl = document.getElementById('app-open');
    const titleEl = document.getElementById('app-title');
    const descEl = document.getElementById('app-desc');
    const sections = content.querySelectorAll('section.notes');
    let seq = 0; // 防止连点两条时，慢的那条把后点的那条覆盖掉

    function setSections(hidden) {
      for (let i = 0; i < sections.length; i++) sections[i].hidden = hidden;
    }

    function showLists() {
      setSections(false);
      if (postIndex) postIndex.hidden = false;
      if (postView) postView.hidden = true;
      if (appIndex) appIndex.hidden = false;
      if (appView) {
        appView.hidden = true;
        if (wrap) wrap.hidden = true;
        if (statusEl) statusEl.hidden = true;
        if (openEl) openEl.hidden = true;
      }
      if (frame) frame.removeAttribute('srcdoc');
    }

    function openPost(slug) {
      if (!postView) return false;
      let hit = null;
      postView.querySelectorAll('article.post').forEach(function (a) {
        const on = a.getAttribute('data-slug') === slug;
        a.hidden = !on;
        if (on) hit = a;
      });
      if (!hit) return false;
      setSections(true);
      postView.hidden = false;
      if (appView) appView.hidden = true;
      window.scrollTo(0, 0);
      return true;
    }

    function findAppLink(slug) {
      const links = document.querySelectorAll('a[data-app]');
      for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('data-app') === slug) return links[i];
      }
      return null;
    }

    async function openApp(slug) {
      const link = findAppLink(slug);
      if (!link || !appView || !frame) return false;
      const mine = ++seq;
      const title = link.getAttribute('data-title') || slug;
      const desc = link.getAttribute('data-desc') || '';

      if (titleEl) titleEl.textContent = title;
      if (descEl) {
        descEl.textContent = desc;
        descEl.hidden = !desc;
      }
      frame.title = title;
      setSections(true);
      appView.hidden = false;
      if (wrap) wrap.hidden = true;
      if (openEl) openEl.hidden = true;
      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = '正在解密…';
      }
      window.scrollTo(0, 0);

      try {
        const html = await loadApp(slug);
        if (mine !== seq) return true; // 用户已经点了别的
        frame.removeAttribute('srcdoc');
        frame.srcdoc = html;
        if (wrap) wrap.hidden = false;
        if (statusEl) statusEl.hidden = true;
        if (openEl) {
          // 想单独开一个标签页慢慢用（blob 直接指向解密结果，页面关掉即失效）
          openEl.href = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
          openEl.hidden = false;
        }
      } catch (e) {
        if (mine !== seq) return true;
        if (statusEl) {
          statusEl.hidden = false;
          statusEl.textContent =
            e && e.message === 'unavailable'
              ? '这份内容没有随站点构建（构建时没拿到站点密码），暂时打不开。'
              : '打不开这份内容：可能是密码刚换过，强刷页面重新输入一次即可。';
        }
      }
      return true;
    }

    document.addEventListener('click', function (e) {
      const target = e.target;

      const appLink = target.closest('a[data-app]');
      if (appLink) {
        e.preventDefault();
        const slug = appLink.getAttribute('data-app');
        openApp(slug).then(function (ok) {
          if (ok) history.replaceState(null, '', '#app-' + slug);
        });
        return;
      }

      const link = target.closest('a[data-post]');
      if (link) {
        e.preventDefault();
        const slug = link.getAttribute('data-post');
        if (openPost(slug)) history.replaceState(null, '', '#post-' + slug);
        return;
      }

      if (target.closest('a[data-back]') || target.closest('a[data-app-back]')) {
        e.preventDefault();
        showLists();
        history.replaceState(null, '', location.pathname + location.search);
      }
    });

    function fromHash() {
      let m = location.hash.match(/^#app-(.+)$/);
      if (m && openApp(decodeURIComponent(m[1]))) return;
      m = location.hash.match(/^#post-(.+)$/);
      if (m && openPost(decodeURIComponent(m[1]))) return;
      showLists();
    }

    window.addEventListener('hashchange', fromHash);
    if (location.hash) fromHash();
  }

  async function unlock() {
    const pw = input.value;
    if (!pw) return;
    try {
      const res = await fetch('backroom/content.json', { cache: 'no-store' });
      const rec = await res.json();
      if (rec.status === 'unavailable') return; // 没带密码构建，没有可解的内容
      const html = await decrypt(rec, pw);
      secret = pw;
      gate.style.display = 'none';
      content.innerHTML = html;
      content.hidden = false;
      initEssay();
    } catch (e) {
      // 密码不对：清空输入并抖一下，不显示任何文字提示
      input.value = '';
      input.classList.remove('shake');
      void input.offsetWidth; // 强制重排，让动画能重复触发
      input.classList.add('shake');
    }
  }

  // 表单提交：桌面按 Enter、手机点按钮或键盘的“前往”都走这里
  gate.addEventListener('submit', function (e) {
    e.preventDefault();
    unlock();
  });
})();
