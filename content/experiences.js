// =============================================================
//  content/experiences.js —— 经历页（研究 / 教育 / 会议 / 专利 / 获奖）
//
//  数据来源：你申博时的 CV（Boxiao-CV.pdf），逐条整理。
//  结构：一个数组，每个元素是一节（section），节里每一条是 entries 的一项。
//    when  时间，左边那一列，越短越好："2022 – 2025"、"Nov 2023 –"
//    main  主标题（学位/项目/报告题目/奖项名）
//    sub   副标题（单位、地点、角色），没有就 ""
//    extra 补充说明（导师、一句话要点），没有就 ""
//
//  想加一节：复制任意一节，改 title 和 entries。
// =============================================================

export default [
  {
    title: "Research Experience",
    entries: [
      {
        when: "Nov 2023 –",
        main: "A framework for understanding high-throughput processability of OPV",
        sub: "",
        extra: "Combined coating tests, COMSOL flow modelling and Hansen parameter analysis.",
      },
      {
        when: "May 2023 – Oct 2023",
        main: "High-throughput printing of organic solar cells",
        sub: "",
        extra: "Raised blade-coating speed from 1 to 6 m/min.",
      },
      {
        when: "Sep 2022 – Apr 2023",
        main: "Single-molecular organic solar cells",
        sub: "",
        extra: "Characterised electrical properties, carrier dynamics and recombination.",
      },
    ],
  },
  {
    title: "Education",
    entries: [
      {
        when: "2025 –",
        main: "Ph.D. Student",
        sub: "The Hong Kong Polytechnic University",
        extra: 'Supervisor: <a href="https://www.polyu.edu.hk/eee/people/academic-staff-and-teaching-staff/prof-li-gang/">Prof. Gang Li</a>',
        logo: "style/logo-polyu.png",
      },
      {
        when: "2022 – 2025",
        main: "M.E. in Materials Science and Engineering",
        sub: "Wuhan University",
        extra: 'Supervisor: <a href="https://scholars.whu.edu.cn/en/persons/jie-min/">Prof. Jie Min</a><br>Research Mentor: <a href="https://scholars.whu.edu.cn/en/persons/rui-sun/">Dr. Rui Sun</a>',
        logo: "style/logo-wuhan.png",
      },
      {
        when: "2018 – 2022",
        main: "B.E. in Functional Material",
        sub: "Huazhong University of Science & Technology",
        extra: "",
        logo: "style/logo-hust.png",
      },
    ],
  },
  {
    title: "Conference Presentations",
    entries: [
      {
        when: "2024",
        main: "Modification of metastable phase in organic solar cells – degree of polymerization",
        sub: "Sino-Germany Workshop on Printable Photovoltaics, Erlangen, Germany",
        extra: "Presented on behalf of Prof. Jie Min",
      },
      {
        when: "2023",
        main: "Attendee",
        sub: "The 4th National Conference on Organic Field-Effect Transistors & 2nd International Conference on Flexible Printed Optoelectronic Materials and Devices, Xi'an, China",
        extra: "",
      },
    ],
  },
  {
    title: "Patents",
    entries: [
      {
        when: "2024",
        main: "A deposition method and device for high-throughput printing of organic solar cells",
        sub: "Xiao, B., Sun, R., & Min, J. · Invention patent, CN117563877A",
        extra: "",
      },
    ],
  },
];
