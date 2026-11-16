// =============================================================
//  content/publications.js —— 论文列表
//
//  数据来源：Google Scholar 个人主页（12 篇），DOI / 完整作者 / 卷期页码
//  由 Crossref 逐条核对后写入。
//
//  加一篇 = 复制一条，改字段。字段说明：
//    type      "journal"（期刊）| "conference"（会议）| "preprint"（预印本）
//              | "chapter"（书章）| "software"（软件/数据）
//    authors   作者，照 CV 抄，顺序别改。你自己按 site.js 里的 me 自动加粗
//    year      年份（数字，不加引号）
//    title     论文标题（行内可写 HTML，比如分子式下标）
//    venue     期刊名 / 会议名（自动斜体）
//    details   卷期页码，没有就写 ""
//    doi       完整链接，推荐 https://doi.org/10.xxxx/xxxxx（这个链接永远不变）
//    note      想标的影响因子/分区/获奖，写 "IF: 5.3; Q1"；不想标就 ""
//    highlight 想高亮这条（淡黄底）就写 true
//    equal     共同一作就写 true：页面会在你名字后面加一个 †，并自动出现图例
//
//  排版规则：按 type 分组、组内按年份从新到旧；同一年按本文件里的先后顺序。
//
//  ⚠️ 加粗规则：每个作者列表里只加粗「第一次出现」的 Xiao, B.。
//     有 4 篇（Joule 2026 的 Mechanisms、Angew 2026、EES 2025 的 19.46%、
//     EES 2024 的 dithieno）原文里出现了两个 Xiao, B.，第二个是另一位学者
//     Xiao Biao，不再加粗。
//
//  ⚠️ 标黄的 4 条（一作 2 条 + 共一 2 条）：
//     Joule 2026 Mechanisms、AFM 2025 Unraveling（一作）；
//     Sci China Chem 2023（第 2 作者）、EES 2025 的 19.46%（第 2 作者，一作是 Wu, X.）——这两条为共一，带 †。
//     EES 2024 的 dithieno 一篇按作者本人说明不是共一，已取消标黄和 †。
// =============================================================

export default [
  // ---------------- 2026 ----------------
  {
    type: "journal",
    authors: "Wan, J., Yang, X., Sun, R., Xiao, B., Zhang, M., & Min, J.",
    year: 2026,
    title:
      "Redefining the industrial evaluation of high-speed printable organic photovoltaic materials through a manufacturing-oriented figure of merit",
    venue: "Energy & Environmental Science",
    details: "19(17), 5749–5760",
    doi: "https://doi.org/10.1039/d6ee04349f",
  },
  {
    type: "journal",
    authors:
      "Xiao, B., Sun, R., Wan, J., Xu, L., Shao, Y., Zhao, J., Ma, Y., Zheng, Q., Xiao, B., & Min, J.",
    year: 2026,
    title:
      "Mechanisms for improved high-speed processability of active layer materials in bulk-heterojunction organic photovoltaics",
    venue: "Joule",
    details: "10(6), 102379",
    doi: "https://doi.org/10.1016/j.joule.2026.102379",
    highlight: true,
  },
  {
    type: "journal",
    authors:
      "Yang, X., Wu, X., Mei, L., Sun, R., Xiao, B., Zhang, S., Qu, T., Li, S., Chen, H., Chen, X., & Min, J.",
    year: 2026,
    title:
      "All-small-molecule solar cells with over 19% efficiency and superior stability via a dual-asymmetric-acceptor strategy",
    venue: "Joule",
    details: "102592",
    doi: "https://doi.org/10.1016/j.joule.2026.102592",
  },
  {
    type: "journal",
    authors: "Wu, W., Xiao, B., Zhao, J., Wan, J., Gao, Y., Sun, R., & Min, J.",
    year: 2026,
    title:
      "From carrier generation to collection: Unraveling the origin of composition tolerance differences in polymer/NFA and all-polymer solar cells",
    venue: "Advanced Functional Materials",
    details: "36(18), e13820",
    doi: "https://doi.org/10.1002/adfm.202513820",
  },
  {
    type: "journal",
    authors:
      "Chen, Z., Zhang, S., Sun, R., Mei, L., Yang, W., Xing, Z., Yang, X., Xiao, B., Wu, X., Chen, X., & Min, J.",
    year: 2026,
    title:
      "Enhanced ε<sub>r</sub>/LD and improved acceptor crystal growth enable all-polymer solar cells with outstanding efficiency, stability, and processability from a chlorinated solvent",
    venue: "Energy & Environmental Science",
    details: "19(3), 946–957",
    doi: "https://doi.org/10.1039/d5ee06663h",
  },
  {
    type: "journal",
    authors:
      "Xu, L., Gao, Y., Sun, R., Xing, Z., Xiao, B., Yang, X., Shao, Y., Chang, B., Wu, X., Xiao, B., Zhang, M., & Min, J.",
    year: 2026,
    title:
      "Controlled-disorder asymmetrical donors enable efficient all-small-molecule solar cells with excellent solution-processability",
    venue: "Angewandte Chemie",
    details: "138(2), e19713",
    doi: "https://doi.org/10.1002/ange.202519713",
  },

  // ---------------- 2025 ----------------
  {
    type: "journal",
    authors:
      "Wu, X., Xiao, B., Sun, R., Yang, X., Zhang, M., Gao, Y., Xiao, B., Papkovskaya, E. D., Luponosov, Y., Brabec, C. J., & Min, J.",
    year: 2025,
    title:
      "19.46%-efficiency all-polymer organic solar cells with excellent outdoor operating stability enabled by active layer reconstruction",
    venue: "Energy & Environmental Science",
    details: "18(4), 1812–1823",
    doi: "https://doi.org/10.1039/d4ee05083e",
    highlight: true,
    equal: true,
  },
  {
    type: "journal",
    authors: "Xiao, B., Wu, W., Wang, S., Wan, J., Shao, Y., Sun, R., & Min, J.",
    year: 2025,
    title:
      "Unraveling the formation process of an organic photovoltaic active layer during high-speed coating via a synergistic concentration–temperature gradient control strategy",
    venue: "Advanced Functional Materials",
    details: "35(5), 2414463",
    doi: "https://doi.org/10.1002/adfm.202414463",
    highlight: true,
  },
  {
    type: "journal",
    authors: "Yang, X., Shao, Y., Wang, S., Chen, M., Xiao, B., Sun, R., & Min, J.",
    year: 2025,
    title: "Processability considerations for next-generation organic photovoltaic materials",
    venue: "Advanced Materials",
    details: "37(31), 2307863",
    doi: "https://doi.org/10.1002/adma.202307863",
  },
  {
    type: "journal",
    authors: "Zhao, J., Shao, Y., Sun, R., Wu, W., Xiao, B., Wan, J., Zhang, Y., & Min, J.",
    year: 2025,
    title:
      "Leveraging rhodamine-terminated small molecule acceptors for high open-circuit voltage and improved efficiency in organic solar cells",
    venue: "Organic Electronics",
    details: "145, 107311",
    doi: "https://doi.org/10.1016/j.orgel.2025.107311",
  },

  // ---------------- 2024 ----------------
  {
    type: "journal",
    authors:
      "Yang, X., Gao, Y., Xu, L., Wu, X., Chen, X., Shao, Y., Xiao, B., Liu, S., Xia, J., Sun, R., & Min, J.",
    year: 2024,
    title:
      "Efficient and stable all-small-molecule solar cells enabled by incorporating a designed giant molecule acceptor",
    venue: "Energy & Environmental Science",
    details: "17(16), 5962–5971",
    doi: "https://doi.org/10.1039/d4ee01705f",
  },
  {
    type: "journal",
    authors:
      "Wang, S., Xu, L., Xiao, B., Chen, M., Zhang, M., Gao, W., Xiao, B., Jen, A. K., Yang, R., Min, J., & Sun, R.",
    year: 2024,
    title:
      "Designing dithieno-benzodithiophene-based small molecule donors for thickness-tolerant and large-scale polymer solar cells",
    venue: "Energy & Environmental Science",
    details: "17(7), 2610–2620",
    doi: "https://doi.org/10.1039/d3ee04300b",
  },

  // ---------------- 2023 ----------------
  {
    type: "journal",
    authors: "Gao, Y., Xiao, B., Wang, S., Chen, M., Wang, W., Yang, X., Shao, Y., Sun, R., & Min, J.",
    year: 2023,
    title:
      "Narrow bandgap molecular dyads incorporating Y-series acceptor backbones for efficient single-molecular organic solar cells",
    venue: "Science China Chemistry",
    details: "66(11), 3205–3212",
    doi: "https://doi.org/10.1007/s11426-023-1720-x",
    highlight: true,
    equal: true,
  },
];
