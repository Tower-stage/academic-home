// =============================================================
//  content/site.js —— 全站身份信息
//
//  改这一处，三个页面（首页 / 论文 / 经历）同时更新。
//  · 单引号、双引号、反引号都能用；最后一项后面多留一个逗号也没关系
//  · 行内可以直接写 HTML，比如 <a href="...">导师主页</a>、<i>斜体</i>
//  · 以 // 开头的是注释，不会出现在页面上
//  · 改完保存，浏览器会自动刷新（见 README 第 3 节）
//
//  下面全部来自 Google Scholar 个人主页 + ORCID 公开记录。
// =============================================================

export default {
  // ---------- 基本身份 ----------
  name: "Bo Xiao",                                // 英文名，用于标题栏、页脚
  name_cn: "肖博",                                // 中文名，仿宋显示；填上就显示
  title: "PhD Student, The Hong Kong Polytechnic University",  // 副标题；不要就写成 ""

  // ---------- 头像 ----------
  // 放在 static/style/ 下。透明底 PNG 最好看，高度 200–260 px 即可。
  // 现在是 ""（暂时不显示头像，正文占满整行）；有照片后改成 "style/avatar.jpg" 或自己的文件名。
  // 备选：留空圆占位写 "style/avatar-empty.svg"，字母占位写 "style/avatar.svg"。
  avatar: "",

  // ---------- 首页正文 ----------
  // 每个数组元素是一段。段落里可以写链接、加粗、斜体。
  bio: [
    `I am a researcher at <a href="https://www.polyu.edu.hk/">The Hong Kong Polytechnic
     University</a>, working on organic photovoltaics (OPV) and organic solar cells (OSC).`,

    `My work centres on the active layer: how donor and acceptor molecules are designed,
     how the film forms during high-speed coating, and how these choices propagate into
     efficiency and operational stability. I have worked with all-polymer and
     all-small-molecule systems, and I care a good deal about
     <i>processability</i> — thickness tolerance, composition tolerance, and what survives
     an industrial coating speed.`,

    `I am always happy to talk about OPV/OSC, processing, or collaborations. The fastest way
     to reach me is email.`,
  ],

  // ---------- 研究兴趣 ----------
  interests: [
    "Organic photovoltaics: all-polymer and all-small-molecule solar cells",
    "Active-layer film formation and high-speed coating",
    "Molecular design of donors and acceptors, and device stability",
  ],

  // ---------- 联系方式 ----------
  email: "iam-bo.xiao@connect.polyu.hk",   // 来自 ORCID 公开记录；不想公开就写 ""

  // ---------- 链接清单（显示在首页底部，一行一个） ----------
  links: [
    { label: "Google Scholar", href: "https://scholar.google.com/citations?user=e4uxz_UAAAAJ" },
    { label: "ORCID", href: "https://orcid.org/0009-0009-2898-8317" },
  ],

  // ---------- 你的名字在作者列表里的写法 ----------
  // 论文里出现这些字符串会自动加粗。写全几种常见格式。
  me: ["Xiao, B.", "B Xiao", "Bo Xiao"],

  // ---------- 页脚 ----------
  copyright_from: 2023,   // 页脚显示 © 名字 2023 - 今年（你最早一篇论文的年份；不喜欢就改）

  // ---------- 导航 ----------
  // 顺序 = 显示顺序；href 对应生成的 HTML 文件名。
  nav: [
    { label: "Home", href: "index.html" },
    { label: "Publications", href: "publications.html" },
    { label: "Experiences", href: "experiences.html" },
    { label: "Backroom", href: "backroom.html" },
  ],

  // ---------- 可选装饰 ----------
  // 上线后的站点地址，如 "https://boxiao.com/"（结尾带斜杠）。只为社交分享卡片（og:url / og:image）用；
  // 留空就不输出这两项，不影响页面。
  url: "",
  watermark: "style/logo-polyu.png",   // 底纹：把一张淡色图片放到 static/style/，这里写 "style/watermark.png"
  analytics: "",   // 统计脚本（可选）；留空则没有
};
