import type { ProcessPage } from "./types";

// D-035 as amended by D-057 ①: the 2026 EWA platform, plus the six-project harness table. Every sentence traces to docs/facts/_process.md;
// pipeline layout from docs/reviews/2026-11-10-visuals-round1.md §7 (N4).
export const processEn: ProcessPage = {
  title: "How I work",
  lead: "This is how I set up and ran the work on the 2026 EWA platform, and how that setup changed across six 2026 projects. Every change request from the client was shipped within 24 hours. I defined an 8-stage pipeline and assigned design, implementation, QA and review to a 13-role AI agent team. The client's stakeholders supplied the requirements and the decision-sheet answers; I confirmed or gave input on decisions taken by default, and gave the go for production.",
  pipelineTitle: "One feature, from spec to production",
  mapBand: "Agents · 8 stages · 13 roles", // ewa.md:242 (8 stages, 13 roles); _process.md:44
  pipeline: {
    intro: "The eight stages in the middle are assigned to role agents. At the top the client supplies requirements and I confirm or give input on decisions taken by default; at the bottom I give the go for production.",
    cols: 4,
    rows: 4,
    // Array order = Tab order = the order work moves in (plan §7.2).
    nodes: [
      { id: "stake", label: "Client", sub: "Briefs · decision sheet", col: 0, row: 0, group: "human" },
      { id: "intake", label: "Intake", sub: "Story · AC check", col: 0, row: 1, group: "process" },
      { id: "architect", label: "Architect", sub: "Model · API contract", col: 1, row: 1, group: "process" },
      { id: "decide", label: "Sign-off · input", sub: "Of 199: a person 68 · me 37", col: 1, row: 0, group: "me" },
      { id: "design", label: "Design", sub: "Screens · flow spec", col: 2, row: 1, group: "process" },
      { id: "develop", label: "Develop", sub: "TDD · backend, web, app", col: 3, row: 1, group: "process" },
      { id: "qa", label: "QA", sub: "Verdict per AC", col: 3, row: 2, group: "process" },
      { id: "review", label: "Review gate", sub: "Security · code · contract", col: 2, row: 2, group: "process" },
      { id: "escalate", label: "Escalation", sub: "Same finding > 2 loops", col: 2, row: 3, group: "me", idle: true },
      { id: "integrate", label: "Integrate", sub: "Local merge, pre-checked", col: 1, row: 2, group: "process" },
      { id: "document", label: "Document", sub: "READMEs · runbooks", col: 0, row: 2, group: "process" },
      { id: "ship", label: "Release go-ahead", sub: "Push · deploy · store", col: 1, row: 3, group: "me" },
      { id: "deploy", label: "Deploy", sub: "Staging · production", col: 0, row: 3, group: "process" },
    ],
    edges: [
      { from: "stake", to: "intake", label: "source docs" },
      { from: "intake", to: "architect" },
      { from: "architect", to: "decide", label: "defaults logged" },
      { from: "architect", to: "design" },
      { from: "design", to: "develop" },
      { from: "develop", to: "qa" },
      { from: "qa", to: "review" },
      { from: "review", to: "develop", label: "rejected" },
      { from: "review", to: "escalate", label: "rule" },
      { from: "review", to: "integrate" },
      { from: "integrate", to: "document" },
      { from: "document", to: "deploy" },
      { from: "ship", to: "deploy", label: "on my go" },
    ],
    notes: {
      stake: "Features come from five documents by the client's stakeholders, merged into the spec that the story IDs come from. The answers in the stakeholders' decision sheet of 3 July went in together as decisions D-128 to D-131 on 4–5 July.",
      intake: "Checks the story ID and its acceptance criteria. The rule is that every feature traces to a story ID in the spec; 61.4% of the 1,855 non-merge commits carry one.",
      architect: "Data model, API contract and ADRs. When a choice is needed, it goes ahead on a recommended default so work never blocks, and logs it in the decision register.",
      decide: "68 of the 199 rows carry a person's confirmation or input, 37 of them with my name. 3 of the 11 hard-to-reverse ones were confirmed when logged; the rest follow the default-now, review-later mode. 26 earlier rows were reversed by later ones (some the same day), and a row that reverses an earlier one names it.",
      design: "Screen and flow specs per story. Some rows reversed an earlier decision because of the design file (D-141, D-156).",
      develop: "The rule is to write the failing test first; 86.4% of the 398 non-merge fix commits also changed a test file. Web types are generated from the OpenAPI snapshot, and the app's models are written by hand (D-009).",
      qa: "A pass or fail verdict for each acceptance criterion; a failure goes back to the responsible developer with the repro.",
      review: "Three reviewers are in the pipeline: security when money, auth or personal data is touched, code always, and API contract when the contract or a client changes. An unresolved blocker or major finding, or any CRITICAL or HIGH security finding, fails the gate and goes back to development. Since 28 Sep, when records begin, they ran 24 times (code 12, security 10, contract 2); the spec coverage auditor sits outside the pipeline and ran 0 times.",
      escalate: "If a review-and-fix loop repeats more than twice on the same finding, it stops and comes to me. This is a rule in the orchestrator's instructions; no case is on record.",
      integrate: "Merges happen locally, without PRs (275 merge commits). The merge order is agreed first and conflicts are checked with git merge-tree.",
      document: "Updates READMEs, runbooks and the decision register. Rules such as \"a row that reverses an earlier decision says which one\" also end up in the README.",
      ship: "Pushing, production deploys and store submission run on my go; that is the rule. On staging, any delete-like command makes a hook ask for confirmation first.",
      deploy: "On my go, an agent session rolls the change out to production. Deploys are manual (ship a source archive, rebuild on the server).",
    },
  },
  practices: [
    {
      title: "Story-ID tracing",
      ev: "ewa#trace",
      at: ["intake"],
      body: "The rule: every feature traces to a story ID in the spec, and branches, commits and PRs carry the ID. In practice 61.4% of the 1,855 non-merge commits carry a story ID, and 70.8% carry a story ID or a decision number. There were no PRs, and 15 of the 200 branch names contain a story ID.",
    },
    {
      title: "Decision register",
      ev: "ewa#decisions",
      at: ["architect", "decide"],
      body: "Instead of blocking, go ahead on a recommended default, log it, and review the defaults later in one pass. 192 of the 199 rows say how hard the decision is to reverse, and 11 are hard, locking in data or contracts. Of those, 3 were confirmed by a person when logged and 8 went ahead on the default. A row that reverses an earlier decision names it.",
    },
    {
      title: "Test first",
      ev: "ewa#quality",
      at: ["develop"],
      body: "The rule: write the failing test first. 86.4% of the 398 non-merge fix commits and 87.7% of the 764 feat commits also changed a test file. That includes edits to existing tests, so it does not mean a regression test was added each time.",
    },
    {
      title: "Contract first",
      ev: "ewa#architecture",
      at: ["architect"],
      body: "The one contract between repos is the backend's OpenAPI snapshot. The web generates its types from it; the app's models are written by hand (D-009, code generation deferred). When the contract changes, the API contract check looks for drift between the web, the app and the backend.",
    },
    {
      title: "Parallel sessions",
      at: ["develop", "integrate"],
      body: "Several agent sessions run at once. Each session uses its own worktree and announces the files, decision numbers and migration names it will touch. A decision number is taken as max + 1 at the moment of writing.",
    },
  ],
  gates: [
    {
      title: "Security review",
      at: ["review"],
      body: "An adversarial review of any change that touches withdrawals, settlement, payouts, auth, permissions or personal data; it does not edit code. Since 28 Sep, when records begin, it ran 10 times. 30 fix commits mention security review or a security fix (Jun 14 – Oct 29).",
    },
    {
      title: "Code review",
      at: ["review"],
      body: "Correctness, repo conventions, simplicity and test quality on every change. Findings are graded blocker, major, minor or nit, and the verdict is APPROVE or REQUEST-CHANGES. It ran 12 times since 28 Sep.",
    },
    {
      title: "API contract check",
      at: ["review"],
      body: "When the contract or a client changes, it checks that the web and the app match the backend's OpenAPI. It ran twice since 28 Sep.",
    },
    {
      title: "Rejection and escalation",
      at: ["review", "escalate"],
      body: "An unresolved blocker or major finding, or any CRITICAL or HIGH security finding, counts as a failed gate and goes back to development. A further rule sends a review-and-fix loop to me once it repeats more than twice on the same finding. Both are rules in the orchestrator's instructions, and no escalation is on record.",
    },
    {
      title: "Guardrails",
      at: ["ship", "deploy"],
      body: "Permission settings block force-push, reset --hard and rm -rf, and three of the four repos also block reading .env. A hook asks for confirmation before every delete-like command sent to the staging server.",
    },
  ],
  // M-12 (D-057 ①): the six 2026 projects in time order; each cell from docs/facts/_process.md §17 (:326-331, Task 13c),
  // labels from docs/reviews/2026-11-13-visuals-round2.md §1 where 13c kept them. Title and column heads: spec §1.
  harness: {
    title: "How the setup changed, project by project",
    intro: "", // task 13b: left empty — any line puts this #harness on two screens at 1440 (694 → 749) and three at 390; the lead names the table
    focus: "ewa",
    cols: { project: "Project", roles: "Agent roles", enforced: "What enforced the gates", gate: "Last gate, held by", changed: "Changed from the row above" },
    rows: [
      { slug: "construction-pmis", roles: "11 · 1 reviewer", enforced: "Agent instructions (test first · 80% · commit after review and QA)", gate: [{ who: "me", text: "Merged 106 PRs" }], changed: "Start: 7 roles, grown to 11" },
      { slug: "field-service-ops", roles: "11 · 1 reviewer (copied)", enforced: "CI (types · tests · build) · deploy after CI · typed phrase to delete", gate: [{ who: "me", text: "Merged 139 PRs" }, { who: "me", text: "Ran the pre-go-live reset" }], changed: "Team copied; added CI on every PR and deploy once it passes" },
      { slug: "ewa", roles: "13 = 9 + 4 reviewers", enforced: "Instructions · deny list · delete-command check hook", gate: [{ who: "me", text: "Push · deploy · store go-ahead" }], changed: "Reviewers 1 → 4 · check hook · reversibility per decision" },
      { slug: "grid-constraint-analysis", roles: "1 analyst agent · 2 review passes", enforced: "Stops at first failure · 21 gate checks · publish stamp", gate: [{ who: "me", text: "Adopt or revert hypotheses" }], changed: "Rules moved into code checks · one analyst instead of a role team" },
      { slug: "screenplay-translation", roles: "11 crew roles · a skill conducts", enforced: "Instructions · tool exit codes · gates tested on broken copies", gate: [{ who: "me", text: "3 direction calls" }, { who: "client", text: "Per-film checks pending" }], changed: "Back to an 11-role team · gates test themselves" },
      { slug: "reputation-market", roles: "13, EWA's role names", enforced: "Instructions · deny list (same as EWA) · one sensitive change at a time", gate: [{ who: "me", text: "Check per bundle · commit on request" }, { who: "client", text: "Answered the planning questions" }], changed: "Deny list back · work in bundles" },
    ],
  },
};
