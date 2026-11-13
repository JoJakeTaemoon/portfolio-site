import type { Brief } from "../types";

// Anonymized: no company, headcount, market, trading, in-house system, vendor, tool, plan, price or person names; no seat counts.
// Every sentence and number comes from docs/facts/ai-usage-policy.md; figure from docs/reviews/2026-11-12-visuals-grid-case.md section 2.
// G-M1: the policy was written, then downgraded to a hypothesis the next day; nothing says sent, submitted or approved.
// G-M2: no identifying combination (no market, no trading, no size, no two-language guide). G-M3: no statement about the client's current state.
export const aiUsagePolicyEn: Brief = {
  kind: "brief",
  slug: "ai-usage-policy",
  title: "A policy proposal for controlling external AI use",
  tagline: "Wrote, as an approval request, a control policy in which a company uses external AI through channels it owns and classifies only its top prohibited tier; its 90-day goal of at least 3 company-controlled AI channels was reached (my own account). Under the rule of no policy text before the diagnosis, the text was left as a hypothesis pending diagnosis.",
  year: 2026,
  domain: "AI usage policy",
  tags: ["ai-agents"],
  stack: ["Markdown", "Static HTML", "CSV", "Shell"],
  facts: {
    period: "Jul – Aug 2026",
    role: "Only human on the build team; designed and ran the AI agent team",
    team: "Just me (the only commit author in the policy repository)",
    platforms: "Policy documents · asset-tagging board",
    context: "Policy proposal work for a client that wanted to use external AI at company level",
  },
  metrics: [],
  leads: {
    results: "The request's 90-day goal of at least 3 company-controlled AI channels was reached (my own account), and the policy text was left as a hypothesis pending diagnosis.",
  },
  problem: [
    "The client needed channels and rules for using external AI at company level. The first question was what may go into external AI at all, and I started the approval request from there.",
    "I downgraded the policy text to a hypothesis soon after writing it. The charter sets the order rule that no policy text is written before the diagnostic data arrives. The reset consisted of a three-stage model, a team of 5 agents, diagnostic tools and a tracker of 6 regulatory and contractual facts to settle.",
  ],
  visuals: [
    // M-19: the documents in their file-number order (00 → 02·03 → 04), then the downgrade and what followed; no time
    // claim for the numbered ones (spec §6; docs/facts/ai-usage-policy.md:39-43, :20, :27, :76, :79)
    {
      kind: "flow",
      title: "The policy documents, in order",
      caption: "The policy documents are numbered evidence → controls → approval request. After the downgrade to a hypothesis the next day, the adoption comparison and the rollout plan followed.",
      steps: [
        { id: "evidence", label: "Strategy review · regulatory check", sub: "6 strategies (A–F) · 4 rules and contracts · 12 verified findings" },
        { id: "controls", label: "Data-control policy · security approach", sub: "6 threat models · 4 control layers · 90-day roadmap" },
        { id: "approval", label: "Approval request", sub: "One page: risk → proposal → 3 decisions" },
        { id: "hypothesis", label: "Downgraded to a hypothesis", sub: "Jul 23 · no policy text before the diagnosis" },
        { id: "rollout", label: "Adoption comparison · rollout plan", sub: "2 scenarios · 11-step rollout (Aug 5–6)" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "From the draft to the rollout sequence in 15 days", // re-check recommended 9 (M-14 order): ai-usage-policy.md:8, :80
      caption: "The policy was downgraded to a hypothesis the day after it was written, the order became no policy text before diagnostic data, and only the rollout comparison and sequence followed.",
      items: [
        { date: "2026-07-22", label: "Policy draft", note: "Policy, asset tagging, security approach" },
        { date: "2026-07-23", label: "Downgraded to hypotheses, plan reset", note: "Five drafts downgraded; a charter, a team of 5 agents and a regulatory fact tracker set up" },
        { date: "2026-07-27", label: "First weekly brief" },
        { date: "2026-07-29", label: "Account switch guide" },
        { date: "2026-08-06", label: "Rollout options and sequence", note: "Two scenarios compared, a hybrid chosen and an 11-step sequence written (file dates Aug 5–6)" },
      ],
      spans: [{ from: "2026-07-22", to: "2026-08-06", label: "policy draft to rollout documents" }],
    },
  ],
  built: [
    "An approval request. One page holding risk, proposal and three decisions; I downgraded it to a hypothesis on July 23.",
    "A data control policy and a security approach: 6 threat models, 4 control layers and a 90-day roadmap.",
    "A strategy comparison and a regulatory check. It compares 6 strategy types (A to F), reviews 4 regulations and contracts and lists 12 verified findings.",
    "An asset-tagging board: a static HTML board that looks up an inventory of 36 assets by class in 3 seconds, a CSV, and a shell script that checks the schema and the invariant that the top prohibited class means prohibited.",
    "Rollout comparison and execution documents. They compare two scenarios over 14 pages plus 5 appendices, and add an 11-step sequence for the chosen hybrid, with an application form, a notice, an account-switch guide, a receipt-forwarding rule and a tracker.",
  ],
  decision: {
    title: "The company owns the channel; classification applies only to the top prohibited class",
    problem: "The question was how to control external AI use. Classifying every asset and controlling by class is a documented failure pattern, because the upkeep becomes too heavy.",
    options: [
      "A classification first (partly adopted)",
      "B channel control (adopted as the backbone)",
      "C local or dedicated deployment (dropped)",
      "D de-identifying proxy (dropped)",
      "E use-case allow-list (partly adopted)",
      "F hybrid (finally adopted)",
    ],
    chosen: 5,
    decision: "I compared 6 strategy types and chose a hybrid. The proposal has the company own the external AI channel and applies asset classification only to the top prohibited class (P3). Data-loss-prevention tooling, detection of unapproved AI use, authentication, a governance committee and a de-identifying proxy were deliberately left out of the proposal; the approval request lists them under \"what this proposal does not do\", with the conditions for revisiting each.",
    result: "On July 23 the five policy documents were downgraded to hypotheses, and the charter set the rule that no policy text is written before the diagnostic data arrives. The approval request's 90-day goal was to have at least 3 company-controlled AI channels, and that goal was reached.",
    cost: "Under the proposal, with no detection tool, control would rest on providing the channel and prohibiting the top class. It is also a hypothesis that diagnostic data has not yet tested.",
  },
  results: [
    "The approval request's 90-day goal, at least 3 company-controlled AI channels, was reached (my own account). The policy text was downgraded to a hypothesis the day after it was written, with the rule that no policy text is written before the diagnostic data arrives.",
    "In the 15 days from the policy draft (July 22) to the rollout documents (August 6) I wrote the approval request, the control policy, the strategy comparison, the asset-tagging board and the rollout comparison and sequence.",
  ],
  note: "The policy documents are proposals downgraded to hypotheses. The goal was reached by my own account, with no dated record or channel list, so no result metrics are given.",
  code: [],
  gallery: [],
};
