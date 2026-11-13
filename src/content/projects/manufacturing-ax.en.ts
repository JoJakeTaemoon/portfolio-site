import type { Brief } from "../types";

// Anonymized: no client, parent company, country, region, headcount, founding year, buyer brands or vendor names; no quote amounts, payment terms or client operating figures.
// Documents only (no git, no code): every verb is "wrote"; nothing says submitted, won or adopted (Q-034, facts line 114).
// Every sentence and number comes from docs/facts/manufacturing-ax.md; figures are 6.1 and 6.2 in docs/reviews/2026-11-11-visuals-wave2.md.
export const manufacturingAxEn: Brief = {
  kind: "brief",
  slug: "manufacturing-ax",
  title: "AI adoption diagnosis, PoC and system proposals for an overseas manufacturer",
  tagline: "Wrote a set of documents proposing a system that leaves the MRP untouched and joins the spreadsheet-and-paper steps before and after it, from the first PoC proposal to the differentiation document, in 18 days.",
  year: 2026,
  domain: "Manufacturing AI diagnosis · system proposal",
  tags: ["manufacturing"],
  stack: ["Python document generators", "docx · xlsx · pptx", "HTML → PDF slides", "Mermaid diagrams"],
  facts: {
    period: "May – Jun 2026",
    role: "Ran the diagnosis and wrote every document (AI-assisted)",
    team: "Just me (as the author line on the documents)",
    platforms: "A set of documents (no code)",
    context: "Client work: ran an AI adoption diagnosis and wrote system proposals, for an overseas manufacturer",
  },
  metrics: [
    { value: "18 days", label: "first PoC proposal to last system doc" },
    { value: "88", label: "client files received as evidence" },
    { value: "3", label: "parallel system proposals" },
    { value: "4", label: "PoC proposals written" },
  ],
  leads: {
    results: "I wrote the diagnostic proposal, four PoC proposals, three system variants, screen mockups and a differentiation document in 18 days. The diagnosis was actually carried out; system development is on hold.",
  },
  problem: [
    "Four directions set by the management framed the diagnosis: efficiency in high-mix low-volume production, a proactive supply chain, a move from OEM to ODM, and quality in early-stage, subcontracted and outside inspection. I had to propose an AI adoption diagnosis along those lines.",
    "The client's files showed a solid material requirements planning (MRP) system in the materials area. The front end (sales, orders) and the back end (production results, cutting, subcontracting, finished goods, shipping and customs, payments) ran on per-department spreadsheets and paper, so the data broke between them. The diagnosis was \"what is missing is not a system but connection and analysis\", and the proposal's premise was \"do not change the MRP; only link to it\".",
  ],
  visuals: [
    {
      kind: "architecture",
      at: "visuals",
      title: "Proposed structure (combined variant)",
      caption: "The proposal leaves the materials MRP untouched, joins the spreadsheet-and-paper steps before and after it into one integrated system, and adds AI on top as the last phase.",
      cols: 3,
      rows: 3,
      nodes: [
        { id: "front", label: "Front-end teams", sub: "sales, orders · sheets", col: 0, row: 0, group: "human" },
        { id: "mrp", label: "Materials MRP", sub: "left unchanged", col: 1, row: 0, group: "external" },
        { id: "back", label: "Back-end teams", sub: "6 steps · spreadsheets", col: 2, row: 0, group: "human" },
        { id: "hub", label: "Integrated system", sub: "proposed · 8 stages", col: 1, row: 1, group: "core" },
        { id: "ai", label: "AI layer", sub: "proposed · last phase", col: 1, row: 2, group: "process" },
      ],
      edges: [
        { from: "front", to: "hub" },
        { from: "mrp", to: "hub", label: "link only" },
        { from: "back", to: "hub" },
        { from: "hub", to: "ai", label: "structured data" },
      ],
      notes: {
        front: "Sales and orders run on per-department spreadsheets and paper. The data does not reach material planning.",
        mrp: "The materials area has a solid MRP system. The proposal's hard constraint is \"do not change the MRP; only link to it\".",
        back: "Production results, cutting, subcontracting, finished goods, shipping and customs, and payments run on per-department sheets and paper, so the data breaks. \"What is missing is not a system but connection and analysis.\"",
        hub: "The combined variant (C) roadmap: shared base and core quick wins (months 0–4), a wave of all modules (4–12), integration and control (12–16), AI orchestration (16–24). Focused (A) and all-area (B) variants were also written from the same evidence.",
        ai: "\"AI is the peak of the roadmap, not an afterthought.\" The writing rules say quantified effects only with stated assumptions, and a person makes the final decision.",
      },
    },
    {
      kind: "timeline",
      at: "results",
      title: "From the PoC and diagnostic proposals to the system proposal",
      caption: "It took 18 days from the PoC and diagnostic proposals to the system proposal, built on 88 operating documents and photos the client sent in between.",
      stats: [{ value: "18 days", label: "from proposal to proposal" }, { value: "88", label: "operating documents and photos as evidence" }],
      items: [
        { date: "2026-05-28", label: "Four PoC proposals, assessment sheet", note: "Vision QC, demand forecasting, sales automation, costing; 4–6 weeks each" },
        { date: "2026-05-30", label: "AX diagnostic proposal", note: "4 directions × 8 areas; 4-week standard, 2-week light" },
        { date: "2026-06-01", label: "Client documents received", note: "Through Jun 4: 64 documents and 24 photos" },
        { date: "2026-06-12", label: "Three system proposal variants", note: "Focused, all-area, combined; 24-page deck, 15-page mockups" },
        { date: "2026-06-15", label: "Custom vs packaged ERP", note: "Seven-axis comparison, 8-stage feature catalogue" },
      ],
      spans: [{ from: "2026-05-28", to: "2026-06-15", label: "PoC and diagnostic → system proposal" }],
    },
  ],
  built: [
    "An AX diagnostic proposal. It covers 4 directions × 8 diagnostic areas (high-mix low-volume, supply chain, ODM, quality, sales, data, communication, organisation), a 4-week standard plan (site survey → use cases → priorities and ROI → report) and a 2-week light plan. It lists 6 deliverables, and my part is written as diagnostic lead, interviews, roadmap and ROI design.",
    "Four PoC proposals. Vision quality inspection, demand forecasting, sales automation and costing, each with a 4–6 week plan and an \"obstacles and mitigations\" table. The vision one starts with anomaly detection trained on good items, then widens to an inspection-bench aid and then inline.",
    "Three whole-company system proposals. A focuses on three core areas (materials and cost, payments and cash flow, production and cutting profit) and adds AI; B is a tool-neutral system covering the whole 8-stage chain evenly; C combines the two. Every fact in the diagnosis cites the client file it came from.",
    "A 15-page mockup of the 8-stage screens and a 24-page pitch deck. Slides are rendered from HTML to PDF, and the documents are generated by Python scripts.",
    "The case for custom over a packaged ERP. A seven-axis comparison table and an 8-stage feature catalogue that marks the level of automation (semi, full, AI). \"No invented facts, no exaggeration\" was set as a writing rule.",
  ],
  decision: {
    title: "Write three variants in parallel from one evidence base, and make the combined one the full-scope proposal for the first report",
    problem: "The question was what scope and framing to propose from the same diagnostic evidence.",
    options: [
      "A: three core areas plus AI (distinct and quick to show impact; depends on data readiness)",
      "B: the whole 8-stage chain evenly, a tool-neutral system (complete and objective; heavy in scale and cost)",
      "C: the combined variant of A and B",
    ],
    chosen: 2,
    decision: "I wrote the three variants in parallel from the same evidence (the data-gap diagnosis and the MRP coverage). The combined C is the full-scope proposal for the first executive report, with a table for choosing A or B by situation, and the staged order is A first, then widening to B. Strengths and weaknesses went into one table. I set \"AI is the peak of the roadmap, not an afterthought\" and \"do not change the MRP\" as hard constraints.",
    result: "Later I wrote more of the differentiation document to answer a question expected in the pitch meeting: \"why custom when you can buy a packaged ERP?\". The records do not show whether this proposal led to a contract or adoption.",
  },
  results: [
    "Wrote the diagnostic proposal, four PoC proposals, three system variants, screen mockups and a differentiation document in 18 days (May 28 to Jun 15).",
    "Used 88 operating files sent by the client as diagnostic evidence, and wrote a data inventory appendix that sorts the 64 documents by six departments.",
    "The AI adoption diagnosis was actually carried out; system development is on hold. Dates and scope of the diagnosis, and any contract or adoption outcome, are not recorded, so none is stated.",
  ],
  note: "There is no code or commit history, so dates follow the writing dates inside the documents. Amounts and the client's operating figures are not given.",
  code: [],
  gallery: [],
};
