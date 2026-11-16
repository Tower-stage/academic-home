// =============================================================
//  content/news.js —— 首页 "News" 列表
//
//  加一条新闻 = 在数组最上面加一行。日期写 "2026-08" 就行，
//  页面会显示成 [08/2026]。只想写年份就写 "2026"（显示成 [2026]）。
//  页面按数组顺序显示（最新的放最上面），不会自动排序。
//  text 里可以写 <a href="...">链接</a> 和 <b>加粗</b>。
//
//  日期与链接来自 Crossref 的 published-print / published-online。
//  ⚠️ EES 那篇 Crossref 只给了年份（没有月份），所以仍是 "[2025]"，
//     你知道月份的话改成 "2025-xx" 即可。
//
//  维护建议：只留最近 2–3 年、8 条以内。旧的一律删掉或挪去 About 页，
//  首页永远短，才显得干净。
// =============================================================

export default [
  {
    date: "2026-06",
    text: `Our paper on <i>high-speed processability</i> of OPV active layers is out in <b>Joule</b> <a href="https://doi.org/10.1016/j.joule.2026.102379">[doi]</a>.`,
  },
  {
    date: "2026-07",
    text: `All-small-molecule solar cells over <b>19%</b> efficiency, via a dual-asymmetric-acceptor strategy, published in <b>Joule</b> <a href="https://doi.org/10.1016/j.joule.2026.102592">[doi]</a>.`,
  },
  {
    date: "2025",
    text: `<b>19.46%</b>-efficiency all-polymer solar cells with excellent outdoor operating stability, in <b>Energy &amp; Environmental Science</b> <a href="https://doi.org/10.1039/d4ee05083e">[doi]</a>.`,
  },
  {
    date: "2025-08",
    text: `Our perspective on <i>processability</i> of next-generation OPV materials is out in <b>Advanced Materials</b> <a href="https://doi.org/10.1002/adma.202307863">[doi]</a>.`,
  },
];
