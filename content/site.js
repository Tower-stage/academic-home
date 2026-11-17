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
  // 中文副标题 + 中文正文。填了之后首页会多一个「中文 / English」切换。
  // 不想做双语就把这两项写成 "" 或删掉。
  title_zh: "香港理工大学 博士研究生",

  // ---------- 头像 ----------
  // 放在 static/style/ 下。透明底 PNG 最好看，高度 200–260 px 即可。
  // 现在是 ""（暂时不显示头像，正文占满整行）；有照片后改成 "style/avatar.jpg" 或自己的文件名。
  // 备选：留空圆占位写 "style/avatar-empty.svg"，字母占位写 "style/avatar.svg"。
  avatar: "",

  // ---------- 首页正文 ----------
  // 每个数组元素是一段。段落里可以写链接、加粗、斜体。
  bio: [
    `I am a researcher at <a href="https://www.polyu.edu.hk/">The Hong Kong Polytechnic
     University</a>, working on organic photovoltaics (OPV).`,

    `My work centres on processability: the physical mechanisms that govern film formation
     during high-speed coating, process simulation, and semi-transparent OPV devices.`,

    `I am always happy to talk about OPV, processing, or collaborations. The fastest way
     to reach me is email.`,
  ],

  // 中文正文：与上面 bio 一一对应，改了英文记得同步改这里
  bio_zh: [
    `我在香港理工大学做研究，方向是有机光伏（OPV）。`,

    `我的工作围绕加工性展开：高速涂布过程中决定成膜的物理机制、过程仿真，以及半透明 OPV 器件。`,

    `欢迎交流 OPV、加工或合作，邮件是最快的方式。`,
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
  // ICP 备案号：拿到号之后填这里（如 "粤ICP备2026000000号-1"），页脚会自动出现一行带工信部链接的小字。
  // 没备案就留空，页脚不显示。
  icp: "",
  // 站点根路径：自有域名（boboxiao.cn）是 "/"；GitHub Pages 项目站才是 "/仓库名/"。
  // 只有 404 页会用到它——404 会在任意深度被访问，相对链接会指错地方。
  base: "/",
  // 上线后的完整地址（结尾带斜杠）。分享卡片（og:url / og:image）用它。
  url: "https://boboxiao.cn/",
  watermark: "style/logo-polyu.png",   // 底纹：把一张淡色图片放到 static/style/，这里写 "style/watermark.png"
  analytics: "",   // 统计脚本（可选）；留空则没有
};
