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
  title_zh: "香港理工大学博士研究生",

  // ---------- 头像 ----------
  // 放在 static/style/ 下。透明底 PNG 最好看，高度 200–260 px 即可。
  // 现在是 ""（暂时不显示头像，正文占满整行）；有照片后改成 "style/avatar.jpg" 或自己的文件名。
  // 备选：留空圆占位写 "style/avatar-empty.svg"，字母占位写 "style/avatar.svg"。
  avatar: "",

  // ---------- 首页正文 ----------
  // 每个数组元素是一段。段落里可以写链接、加粗、斜体。
  // 写 {EMAIL} 会被替换成一个「📧」邮件链接（点它就发邮件）。
  bio: [
    `Hello! I am a Ph.D. student in the Department of Electrical and
     Electronic Engineering at <a href="https://www.polyu.edu.hk/">The Hong Kong Polytechnic
     University</a>, where I work with
     <a href="https://www.polyu.edu.hk/eee/people/academic-staff-and-teaching-staff/prof-li-gang/">Prof. Gang Li</a>
     on organic photovoltaics (OPV). My work covers the processability and physical
     mechanisms of OPV, optoelectronic structure simulation, and the printing of
     semi-transparent OPV devices.`,

    `Before coming to PolyU, I received my M.E. in Materials Science and Engineering from
     <a href="https://en.whu.edu.cn/">Wuhan University</a>, advised by
     <a href="https://scholars.whu.edu.cn/en/persons/jie-min/">Prof. Jie Min</a>, and worked
     closely with <a href="https://scholars.whu.edu.cn/en/persons/rui-sun/">Dr. Rui Sun</a>.
     I hold a B.E. in Materials Science and Engineering from
     <a href="https://www.hust.edu.cn/">Huazhong University of Science and Technology</a>.`,

    `I am always happy to talk about OPV 🔆 or archery 🏹.`,
  ],

  // 中文正文：与上面 bio 一一对应，改了英文记得同步改这里
  // 注意：中文不要折行，换行会变成一个空格，中文里看着会多出空隙
  bio_zh: [
    `你好！我是<a href="https://www.polyu.edu.hk/">香港理工大学</a>电子及资讯工程学系的博士研究生，在<a href="https://www.polyu.edu.hk/eee/people/academic-staff-and-teaching-staff/prof-li-gang/">李刚教授</a>课题组从事有机光伏研究。我的工作包括有机光伏的可加工性和物理机制，光电学结构仿真，以及半透明有机光伏器件印刷。`,

    `来香港理工大学之前，我在<a href="https://en.whu.edu.cn/">武汉大学</a>取得材料科学与工程硕士学位，导师<a href="https://scholars.whu.edu.cn/en/persons/jie-min/">闵杰教授</a>，并与<a href="https://scholars.whu.edu.cn/en/persons/rui-sun/">孙瑞博士</a>密切合作；本科就读于<a href="https://www.hust.edu.cn/">华中科技大学</a>，专业为材料科学与工程。`,

    `欢迎交流有机光伏🔆和反曲🏹。`,
  ],

  // 研究兴趣（首页 📊 那一节；删成空数组就不显示）
  interests: [
    `Investigating how physical mechanisms govern the processability of organic photovoltaic materials.`,
    `Using thermodynamic and kinetic models to predict the printability of new materials.`,
    `Semi-transparent OPV devices.`,
  ],

  interests_zh: [
    `研究物理机制如何决定有机光伏材料的加工性。`,
    `用热力学和动力学模型预测新材料的可印刷性。`,
    `半透明有机光伏器件。`,
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
