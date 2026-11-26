// =============================================================
//  content/apps.js —— Essay 板块里的「工具」
//
//  这里每一条对应 content/apps/<slug>.html 一个文件（文件名 = slug）。
//  构建时每个应用会被单独加密成 site/backroom/app-<slug>.json，
//  只有点开那一条时浏览器才去下载 + 解密，所以：
//    · 首页/列表不会因为应用体积大而变慢
//    · 三个工具各占一个密文，改一个不用重传另外两个
//
//  三个源文件不是这里长出来的，是各自项目的成品，改完要重新复制回来：
//    content/apps/literature-reader.html  ← D:\Project\reading\1-三学者文献\app\pv_reader.html
//    content/apps/model-library.html      ← D:\Project\reading\4-模型库\模型库总览-v2.html
//    content/apps/opv-textbook.html       ← D:\Project\reading\6-OPV textbook\OPV-textbook.html
//
//  字段：
//    slug  必填，英文/数字/短横线，等于文件名；URL 会变成 backroom.html#app-<slug>
//    title 必填，列表里显示的名字
//    date  可选，"2026-11" 这种，显示在右侧
//    desc  可选，点开后在标题下面显示一行说明（别写双引号）
// =============================================================

export default [
  {
    slug: "literature-reader",
    title: "随机文献抽奖",
    date: "2026-11",
    desc: "Amassian / Campoy-Quiles / Feng Liu 组内直属产出 · 每天抽十篇，点「想读」才出 DOI；读完打勾、值得回看点星，都存本机",
  },
  {
    slug: "model-library",
    title: "OPV model database",
    date: "2026-11",
    desc: "四大方向（器件物理 / 高分子物理 / 计算模拟 / 流变学）· 卡片墙按热度 × 可用性筛选",
  },
  {
    slug: "opv-textbook",
    title: "OPV Textbook",
    date: "2026-11",
    desc: "能级 / 能损 / TA / 椭偏 / 结构 / 输运复合 · 六模块，带计算器与自测",
  },
];
