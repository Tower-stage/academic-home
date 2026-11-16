# 学术个人主页 · 维护手册

一个素雅的学术主页模板。零依赖、纯静态、不装任何环境也能跑。

**一句话**：改内容只碰 `content/`，改版式只碰 `templates/` 和 `static/style/style.css`，
`site/` 是自动生成的产物，**永远不要手改**。

> **当前已填入的数据**：身份信息与 12 篇论文来自 Google Scholar 个人主页
> （DOI、完整作者、卷期页码逐条经 Crossref 核对）；教育/研究/会议/专利/获奖来自你申博时的 CV。
> **仍是占位、需要你替换的**：`static/style/avatar-empty.svg`（空圆形占位，等你有照片再换）、
> `content/backroom/hello.md` 里的示例文章。职称已设为 PhD Student、邮箱已用
> iam-bo.xiao@connect.polyu.hk。
> Backroom 要你设好密码（见第 3.3 节）后才会真正加密。

---

## 1. 三十秒上手

```bash
node build.mjs --serve      # 打开 http://127.0.0.1:4173 预览，改文件自动重建
node build.mjs              # 只生成一次，输出到 site/
```

没有 `npm install` 这一步 —— 整个项目没有依赖。只要有 Node（≥ 18）就能跑。

---

## 2. 目录：想改什么，去哪里改

| 我想改…… | 改这个文件 | 说明 |
|---|---|---|
| 名字、中文名、职称、邮箱 | `content/site.js` | 改一处，三个页面同时更新 |
| 首页自我介绍 | `content/site.js` 里的 `bio` | 每个数组元素是一段，可以写 `<a>` `<b>` `<i>` |
| 首页 News | `content/news.js` | 最新的放最上面 |
| 论文列表 | `content/publications.js` | 自动分组、排序、加粗自己的名字 |
| 经历页 | `content/experiences.js` | 研究 / 教育 / 会议 / 专利（顺序 = 数组顺序）；每条可加 `logo: "style/xxx.png"` 放校徽 |
| 背景底纹 | `content/site.js` 里的 `watermark` | 放一张淡色图到 `static/style/`，写相对路径，如校徽 |
| Backroom（私密） | `content/backroom/*.md` | 文章；整页一个密码；列表 + 单篇 |
| 头像 | `static/style/avatar-empty.svg` | 现在是空圆形占位；换照片后改 `site.js` 里的 `avatar` |
| 颜色、字号、间距 | `static/style/style.css` 顶部的 `:root` | |
| 分享卡片（微信/推特） | `content/site.js` 的 `url` | 填上线域名（结尾带 `/`）才输出 `og:url` / `og:image`；卡片图是 `static/style/og.png`（1200×630） |
| 404 页 | `templates/404.html` | GitHub Pages 会自动用它兜底；"回到首页"用的是绝对路径 `/` |
| 页面骨架（想加新栏） | `templates/*.html` | |

`site/` 里是生成结果，`.gitignore` 已经把它排除在 git 之外 —— 它随时可以重新生成，丢掉也不心疼。

---

## 3. 四个日常动作

### 3.1 加一条新闻（30 秒）

打开 `content/news.js`，在最上面加一个对象：

```js
{
  date: "2026-09",
  text: `Our paper on ... is accepted at <b>Journal Name</b>!`,
},
```

日期写 `"2026-09"` 就够了，页面会显示成 `[09/2026]`。

### 3.2 加一篇论文（1 分钟）

打开 `content/publications.js`，复制一条改字段：

```js
{
  type: "journal",                    // journal / conference / preprint / chapter / software
  authors: "Xiao, B., Zhang, S., & Min, J.",
  year: 2026,
  title: "The title of the paper",
  venue: "Nature Energy",             // 期刊名，自动斜体
  details: "11(3), 210–233",          // 卷期页码，没有就 ""
  doi: "https://doi.org/10.1038/s41560-000-0000-0",
  note: "",                           // 想标影响因子/分区才写，如 "IF: 20.4; Q1"
  highlight: true,                    // 想让这条淡黄高亮
  equal: false,                       // 共同一作就改成 true（名字后加 †）
},
```

- 分组和排序是自动的：按 `type` 分组，组内按年份从新到旧。
- 你自己的名字会自动加粗，规则写在 `site.js` 的 `me` 里（写全几种常见写法）。
  同名作者（比如另一位 `Xiao, B.`）不会被误加粗——只加粗每篇里第一次出现的那处。
- `equal: true` 会在你名字后加一个 †，页面顶部自动出现 "† co-first author" 图例。
- DOI 一定要用 `https://doi.org/...` 形式，这个链接永久有效，换出版社也不用改。

### 3.3 设密码 + 写 Backroom（博客 / 航拍 / 随手记）

Backroom 是一个**整页加密**的私密角落：导航里的 "Backroom" 点进去，只有一个居中的密码输入框，
输对密码才显示内容（输入框旁边没有任何提示文字）。内容就是一串文章；
文章**只显示标题和日期**，点标题才展开那一篇（URL 会变成 `backroom.html#post-文件名`，可以直接收藏分享单篇），
篇内左上角有"← 全部文章"返回列表。所以写多少篇都不会把页面拉长。

**先设密码。** 复制 `content/.secret.js.example` 成 `content/.secret.js`，把里面改成你的密码：

```js
export default "你的密码";
```

这个文件已被 `.gitignore` 忽略，不会进仓库。本地预览时它自动生效。

**写一篇文章**（在 `content/backroom/` 新建 `.md`，航拍记录等都用这个形式）：

```md
---
title: 航拍 · 某地
date: 2026-11-16
---
正文用 Markdown 写：**加粗**、*斜体*、`代码`、链接、列表、引用都支持。
```

- `title`、`date` 两行是 front-matter，`---` 包起来，正文从下一行开始。
- 文件名随便；`title` 就是文章标题。列表按 `date` 从新到旧排列，文件名决定 URL 里的锚点
  （`hello.md` → `#post-hello`）。文件名用英文/数字，别用空格和中文，免得链接难敲。
- 所有文章都在 Backroom 里、都要密码——没有"公开"这一说了。

**上线时**：在 GitHub 仓库 Settings → Secrets and variables → Actions 新建 secret，
名字 `SITE_PASSWORD`，值就是你的密码。这样 CI 构建时才会把 Backroom 加密进去。
没设的话，Backroom 会是空的（不报错、也不挡其他页面）。

> ⚠️ **安全边界，务必看**：静态站没有服务器，所谓"密码"其实是**浏览器端解密**——密文是公开的，
> 密码只用来在访客浏览器里解锁。它能挡住随意翻看和搜索引擎，但挡不住一个拿到密文后
> 专门离线爆破的人。所以：① 密码要够长（建议 12 位以上随机）；② 别拿它当银行密码；
> ③ 真正不能见光的东西不要放进来。

### 3.4 改自我介绍 / 换头像（2 分钟）

- 文字：`content/site.js` 的 `bio` 数组，一段一个元素。
- 头像：现在是 `static/style/avatar-empty.svg`，一个空的圆形占位（不要头像就把 `avatar` 设成 `""`，
  正文会占满整行）。等有照片了，把透明底 PNG 放进 `static/style/`，再把 `avatar` 改成
  `"style/你的文件.png"`。没有照片就别放别人的、也别放卡通图——这一格宁空勿凑。

---

## 4. 本地预览

```bash
node build.mjs --serve
```

- 浏览器打开 <http://127.0.0.1:4173>
- 改了 `content/`、`templates/`、`static/` 里任何文件，保存即自动重建，刷新就看到了
- 端口被占用就换一个：`PORT=5000 node build.mjs --serve`

**报错怎么看**：如果改了 `content/*.js` 之后报 `build 失败`，错误信息里会带文件名和原因，
最常见的是少了逗号、少了引号、括号不配对。修好保存，它会自动重试，不用重启。

---

## 5. 发布上线

### 5.1 第一次：建仓库

```bash
git init
git add .
git commit -m "init: 个人主页"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<你的用户名>.github.io.git
git push -u origin main
```

> 仓库名用 `<用户名>.github.io` 的话，站点地址就是 `https://<用户名>.github.io`；
> 用别的名字就是 `https://<用户名>.github.io/<仓库名>`。

### 5.2 开启自动构建（推荐，一次性设置）

1. 仓库 → **Settings → Pages → Build and deployment → Source**，选 **GitHub Actions**
2. 仓库里已带 `.github/workflows/deploy.yml`：每次 `git push` 到 `main`，它会自动
   跑 `node build.mjs` 并把 `site/` 发到 Pages
3. 等一分钟，Actions 里出现绿勾，站点就更新了

**你本地永远不需要 `git add site/`**，产物在 CI 里生成。

### 5.3 用自己的域名

1. 新建文件 `static/CNAME`，内容只有一行：`www.example.com`（不要带 `https://`）
2. DNS 加一条 CNAME 记录指向 `<用户名>.github.io`
3. Settings → Pages → Custom domain 填同一个域名，勾上 **Enforce HTTPS**

`static/` 下的东西会被原样复制到 `site/`，所以 CNAME 放那里就行。

---

## 6. 维护纪律（比工具更重要）

页面难维护，几乎从来不是技术问题，而是这几件事没定下来：

1. **事件驱动，不要定时驱动。** 论文接收、做完报告、拿到奖学金 —— 当天顺手加一条，
   花 30 秒。攒到年底补，就会变成"要重新翻一遍邮箱和 CV"的大工程。
2. **一次提交只做一件事**，提交信息带前缀：
   ```bash
   git commit -m "news: 论文接收"
   git commit -m "pub: 加 2026 年两篇"
   git commit -m "backroom: 新文章一篇"
   ```
   两年后 `git log --oneline` 就是你的学术年表。
3. **首页 News 只留最近 2–3 年、8 条以内。** 旧的删掉或挪去别处，
   首页永远短，这是"素雅"的前提。
4. **每年一月做一次对账。** 拿 `publications.js` 对一遍 Google Scholar 和 CV：
   有没有漏的新论文、失效的 DOI 链接、写错的卷期页码。
5. **不要为了美观加快捷的东西。** 这个模板克制的原因就是：没有侧栏、没有标签云、
   没有暗色模式、没有动画。每加一个，维护成本翻一倍。

---

## 7. 为什么不用 Hugo / WordPress / 现成主题

| 方案 | 装了要维护什么 | 三年后 |
|---|---|---|
| WordPress | PHP + MySQL + 插件 + 安全补丁 + 备份 | 大概率被黑、或者升不动了 |
| Hugo 主题 | hugo 二进制版本 + 主题仓库 fork + 升级 breaking change | 主题升级一次，页面全乱 |
| Astro / Next | `node_modules` 几百个包 + 每年大版本迁移 | 依赖树烂掉，重装装不回来 |
| **本方案** | 一个 ~500 行的 `build.mjs` + 几个数据文件 | 只要 Node 还在，它就能跑 |

代价是：自定义能力止步于模板层。博客、密码、分组排序这些都已经内置了，
想加更复杂的东西（比如全文搜索、标签云）需要自己写循环——但对一个主页来说，这已经够了。

---

## 8. 常见问题

**改了文件但页面没变？**
浏览器缓存。`Ctrl+F5` 硬刷新；或者确认你改的是 `site/` 外面那份源文件。

**图片不显示？**
图片必须放在 `static/` 里，路径写相对 `site/` 的路径。`static/style/a.png` → 引用写 `style/a.png`。

**导航点了 404？**
`site.js` 里 `nav` 的 `href` 要和 `templates/` 里的文件名对应；新加页面还要在 `build.mjs`
的 `pages` 数组里登记一行。

**中文名显示成方块？**
名字那一栏用的是 `STFangsong`（华文仿宋）。没装的系统会回退到宋体，一般没问题；
实在介意就改 `style.css` 里 `--cn` 这个变量。

**想加数学公式？**
在 `templates/base.html` 的 `</head>` 前加两行 CDN 引用（KaTeX），
然后在正文里写 `$...$`。只在一个页面用就把链接加到那个模板里。

---

## 9. 还可以加什么（按性价比排序）

1. **打印样式** —— 已经有了。`Ctrl+P` 直接存 PDF，就是一份干净的简历。
2. **访问统计** —— 别自建。用 [Umami](https://umami.is/) 或 Plausible 的免费额度，
   把脚本粘到 `site.js` 的 `analytics` 里。
3. **中英双语** —— 把 `content/site.js` 拆成 `site.zh.js` / `site.en.js`，构建两次生成
   `site/` 和 `site/en/`。工作量约半小时，但 bilingual 主页确实加分。

---

## 10. 相关

- 设计参考：<https://lijinzhang.com/>（800 px 单列 / 虚线链接 / Stanford Cardinal `#8C1515`）
- 字体栈 `Optima, Candara, Calibri` 来自 [hugo-xmin](https://github.com/yihui/hugo-xmin) 主题
- 许可证：随便用，改成你自己的就行
