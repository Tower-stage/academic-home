---
name: academic-home-publish
description: "发布或更新 Bo Xiao 的个人学术主页（仓库 D:\\Desk\\DSH\\academic-home，线上 https://boboxiao.cn）。当用户要求发布新文章、修改简介/论文/经历、或者直接说「帮我上线」时使用。Triggers: 上线, 发布, 更新主页, 新文章, 加论文, add essay, deploy academic-home."
---

# 学术主页上线（academic-home）

零依赖 Node 静态站点：`content/` 放数据、`templates/` 放模板，`node build.mjs` 生成 `site/`，推到 GitHub 后由 Actions 自动部署到 `https://boboxiao.cn`。

## 三步走

```bash
cd /d D:\Desk\DSH\academic-home      # 或在工具里指定 workdir
node build.mjs                        # 构建到 site/（必须先在本地确认能构建成功）
git add -A && git commit -m "改了什么" && git push origin main
```

推送后 GitHub Actions 约 60–90 秒完成。要确认真的上线了，等 75 秒后抓一次线上页面，检查关键字是否出现，不要只看 Actions 绿。

本地预览：`node build.mjs --serve` → <http://127.0.0.1:4173>（`file://` 下浏览器禁止 fetch，Essay 打不开，必须走 http）。

## 改什么去哪里

| 想改 | 文件 | 备注 |
|---|---|---|
| 名字、职称、邮箱、首页 bio（中英）、研究兴趣、导航 | `content/site.js` | 英文 `bio` / 中文 `bio_zh` 一一对应，改了记得同步 |
| News 条目 | `content/news.js` | 数组最前面是最新的 |
| 论文 | `content/publications.js` | 自动分组排序；`me` 里的写法会自动加粗 |
| 经历页 | `content/experiences.js` | 节顺序 = 数组顺序；Education 用 `inline: true` 排成一行式 |
| 文章（需要密码） | `content/backroom/*.md` | 一个新文件 = 一篇文章 |
| 工具（需要密码） | `content/apps.js` + `content/apps/<slug>.html` | 一条工具 = 一个单文件 HTML 应用 |
| 校徽 / 底纹 / favicon | `static/style/` | 图片先放这里，再在数据里写 `style/xxx.png` |
| 样式 | `static/style/style.css` | 构建时会自动加 `?v=<内容哈希>`，不用手动清缓存 |

## 新增一篇文章

在 `content/backroom/` 新建 `文件名.md`，文件名就是 URL hash（`#post-文件名`），开头写：

```markdown
---
title: 文章标题
date: 2026-11-17
---

正文，Markdown（标题、加粗、列表、引用、代码块都支持）。
```

正文用 `##` 才会渲染成小节标题（`#` 留给页面大标题）。列表按日期倒序。

**写完检查两件事**（这两个坑都真实遇到过）：

1. **不要用带反斜杠的转义**：`\---`、`\##`、`\*\*` 不会被当成 Markdown，页面会原样显示反斜杠。若文件是这样，先跑 `s.replace(/\\(?=[#*_`\[\]()>!+.-])/g,'')` 清理。
2. **CRLF 已修好，但仍建议存成 LF**：`build.mjs` 的 `parseFrontMatter` 现在会把 `\r\n` 归一成 `\n`，旧版本在 CRLF 下会读不到 title/date。

## 新增 / 更新一个「工具」

Essay 里除了文章，还有一组工具（三学者文献抽读器、模型库 v2、OPV Textbook）。工具是**独立的单文件 HTML 应用**，放在 `content/apps/<slug>.html`，构建时和文章一样用同一把密码**单独加密**成 `site/backroom/app-<slug>.json`；列表只显示标题，点开那一条才去下载 + 解密，再塞进 iframe 里跑（`srcdoc`，同源，localStorage 可用）。

三份源文件各有自己的项目，站点里存的是**复制品**，改完源文件要重新复制回来：

```powershell
Copy-Item 'D:\Project\reading\1-三学者文献\app\pv_reader.html'   content\apps\literature-reader.html -Force
Copy-Item 'D:\Project\reading\4-模型库\模型库总览-v2.html'        content\apps\model-library.html -Force
Copy-Item 'D:\Project\reading\6-OPV textbook\OPV-textbook.html'  content\apps\opv-textbook.html -Force
node build.mjs
```

- 元数据在同目录的 `content/apps.js`：`slug`（= 文件名，URL 是 `backroom.html#app-<slug>`）、`title`、`date`、`desc`（列表点开后在标题下显示，别写双引号）。数组顺序 = 列表顺序。
- 加一个新工具：放 `content/apps/<slug>.html` + 在 `apps.js` 加一条即可；`slug` 写了但文件不存在，构建会直接报错。
- 应用要能独立跑：CSS/JS 全内联、不引用外部资源（`file://` 和线上都一样）。

## 验证线上内容（含密码内容）

Essay 整页加密，光看 HTTP 200 说明不了什么。用 Node 解密确认：

```bash
node -e "const {webcrypto}=require('node:crypto');const b=s=>new Uint8Array(Buffer.from(s,'base64'));(async()=>{const r=await(await fetch('https://boboxiao.cn/backroom/content.json',{cache:'no-store'})).json();const k=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(process.env.PW),'PBKDF2',false,['deriveKey']);const key=await webcrypto.subtle.deriveKey({name:'PBKDF2',salt:b(r.salt),iterations:200000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['decrypt']);const p=await webcrypto.subtle.decrypt({name:'AES-GCM',iv:b(r.iv)},key,b(r.ct));console.log(new TextDecoder().decode(p).slice(0,400))})()"
```

工具同理，把 URL 换成 `https://boboxiao.cn/backroom/app-model-library.json`（三个 slug：`literature-reader` / `model-library` / `opv-textbook`）。

密码见下。

## 密码

- 本地：`content/.secret.js`（已 gitignore，不要提交）
- 线上：GitHub 仓库 Settings → Secrets → `SITE_PASSWORD`，Actions 构建时注入
- **改密码要两处都改**，否则本地预览能进、线上进不去

## 其他约定与坑

- **中文段落不要折行**：模板里换行会变成一个空格，中文读着会多出空隙。一句一行写完。
- **`2025 – ` 末尾那个空格是有意的**，删掉会变成 `2025 –,`。
- **改 favicon 后本地不生效**：浏览器缓存极顽固，`Ctrl+F5` 或换标签页；线上以 `https://boboxiao.cn/style/favicon.svg` 为准。
- **图片替换**：同一路径直接 `Save` 会被 GDI+ 锁住报错，先存 `.tmp.png` 再 `Move-Item` 覆盖。
- **构建失败最常见原因**：`content/*.js` 里少一个逗号或引号。`node build.mjs` 报错行号指过去即可。
- 回滚：`git log --oneline` 找到上一版，`git revert <sha>` 再 push。

## 不要做的事

- 不要提交 `content/.secret.js`。
- 不要把 `site/` 提交进仓库（已在 `.gitignore`），它是构建产物。
- 不要手改 `site/` 里的文件，下次构建会被覆盖。
