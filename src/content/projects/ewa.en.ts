import type { CaseStudy } from "../types";

// Anonymized: no brand, client, vendor, domain or production figures.
// Every sentence and number comes from docs/facts/ewa.md and docs/facts/_process.md;
// visuals and their placement from docs/reviews/2026-11-10-visuals-round1.md.
export const ewaEn: CaseStudy = {
  kind: "case",
  slug: "ewa",
  title: "Earned Wage Access fintech platform, Vietnam",
  tagline: "Built the employee app, the operator CMS and the employer and partner portals from scratch over five months, then moved the running v1's data onto the v2 production server.",
  year: 2026,
  domain: "Earned wage access fintech",
  tags: ["fintech", "payments", "mobile", "ai-agents"],
  stack: ["NestJS", "Prisma", "PostgreSQL", "Redis", "BullMQ", "Next.js", "Flutter", "Docker Compose", "Caddy"],
  facts: {
    period: "Jun 2026 – present",
    role: "Only human on the build team; designed and ran the AI agent team",
    team: "Me plus a 13-role AI agent team",
    platforms: "iOS and Android app, web CMS and portals, API server (3 languages)",
    context: "An earned wage access operator in Vietnam, with a v1 built by another developer already in production",
  },
  metrics: [
    { value: "Data migrated", label: "v1 → v2, Nov 7" }, // M-11 status: ewa.md:565-566
    { value: "5 months", label: "first commit to the migration" },
    { value: "Matched", label: "loaded vs expected totals" }, // M-05 scope: ewa.md:557
    { value: "7,080", label: "asserting tests, from run records" },
  ],
  leads: {
    results: "Within five months, v1's production data was on v2, and the reconciliation of the loaded counts and amounts against the values expected from v1 matched.",
    problem: "The job was to rebuild, from scratch, a service that moves real money, next to a v1 that was already running.",
    role: "I designed and ran the team and its pipeline, and made it the rule that releases to production run on my instruction. I read and approved the code on the money paths myself, and the code the agents wrote is mine to answer for once it ships.",
    decisions: "The three money-path decisions started as agent defaults, two then changed by the stakeholder sheet and security-review findings; PII encryption and the v1 migration started from my input.",
    quality: "Two thirds of the 7,080 automated tests sit in the backend, where the money paths are, and the e2e tests aim at the boundaries of money and permissions.",
    retro: "For the flaky e2e suite I set a rule that tells an environment problem from a bug by the shape of the failures, and used it to narrow the cause.",
  },
  problem: [
    "Workers in Vietnam who need money before payday turn to high-interest loans or to manual pay advances from their employer. Those manual advances also eat up the payroll staff's time.",
    "With Earned Wage Access, workers draw wages they have already earned through an app, and the employer deducts the amount from the next payroll and settles with the operator. Workers pay a fee per withdrawal. For the employer it is a benefit that costs nothing.",
    "Six actors work on the same flow of money, each with their own screens and permissions: the operator's admin, finance and HR staff, employers, employees and sales partners.",
    "Real money moves, so a double payout or a false success was not acceptable. Regulation required the data to stay on servers inside Vietnam. A v1 built by another developer was already in production, and v2 was a new system built from scratch. The rule for the move was that no v1 data is ever deleted.",
  ],
  visuals: [
    {
      kind: "timeline",
      at: "results",
      title: "From first commit to production migration",
      caption: "The spec and the money model were settled in the first three days; getting from the first server release in September to the production data migration in November took two months.",
      items: [
        { date: "2026-06-13", label: "Spec v0.2 and the first ADR", note: "One spec merged from the v1 and v2 plans" },
        { date: "2026-06-14", label: "Four repos; agent team starts", note: "13 roles, 8-stage pipeline" },
        { date: "2026-06-15", label: "Money data model", note: "Integer amounts, append-only ledger, withdrawal transaction" },
        { date: "2026-07-26", label: "Staging environment", note: "VPS + Caddy" },
        { date: "2026-08-11", label: "Live adapters for both PSPs", note: "First end-to-end sandbox transfer on Aug 23" },
        { date: "2026-09-13", label: "PSP failover; first server release 0.0.2", note: "App force-update rule the same day" },
        { date: "2026-09-30", label: "PII encryption; v1 migration tool", note: "First rehearsal on real v1 data, rolled back" },
        { date: "2026-10-14", label: "Production stack" },
        { date: "2026-11-07", label: "Production data migration, v1 → v2", note: "Run after a rollback rehearsal that morning" },
        { date: "2026-11-08", label: "Later transactions moved; v1 app retired", note: "Reconciliation matched; v1 app requests get an update notice" },
        { date: "2026-11-10", label: "Now (ongoing)", note: "Server 0.4.22 after 43 releases; 199 logged decisions" },
      ],
      spans: [
        { from: "2026-06-13", to: "2026-06-15", label: "Spec and money model" },
        { from: "2026-09-13", to: "2026-11-07", label: "First server release → production cutover" },
      ],
    },
    {
      kind: "flow",
      at: "problem",
      title: "One pay cycle",
      caption: "The operator pays out first, the employer repays it from the next payroll, and the employee only pays a fee per withdrawal.",
      steps: [
        { id: "work", label: "Work", sub: "Wages already earned become available to withdraw", actor: "human" },
        { id: "request", label: "Request", sub: "Pick an amount and a voucher in the app; extra authentication", actor: "human" },
        { id: "payout", label: "Payout", sub: "Operator's PSP account → employee's bank account, minus the fee", actor: "external" },
        { id: "invoice", label: "Fee invoice", sub: "VAT e-invoice for the fee; vouchers can reduce it", actor: "system" },
        { id: "payroll", label: "Payday deduction", sub: "Employer submits a settlement file: salary minus EWA deductions", actor: "human" },
        { id: "settle", label: "Settlement approval", sub: "Operator approves, then employer; processed after both (auto-processing off)", actor: "human" },
        { id: "monitor", label: "Settlement check", sub: "Status monitoring and unsettled alerts", actor: "system" },
      ],
      loops: [{ from: "monitor", to: "work", label: "next pay cycle" }],
    },
    {
      kind: "roles",
      at: "role",
      title: "Who did what",
      caption: "I designed and ran a 13-role agent team, and kept decision sign-off and input and the go-ahead for production myself.",
      lanes: [
        {
          who: "human",
          label: "Me",
          stats: [{ value: "1", label: "person on the build team (me)" }], // R-06: _process.md:13, :44, :31-41; ewa.md:12-13, :547 (Task 13c)
          items: [
            "Designed the 13-role team and the 8-stage pipeline (Jun 14)",
            "Decision sign-off or input: 68 of 199 rows marked by a person, 37 of them with my name (13 confirmed · 24 input)",
            "Migration rule: no v1 data may be deleted",
            "Go-ahead for production: push approval, production deploy, store submission",
          ],
        },
        {
          who: "agent",
          label: "Agents",
          stats: [{ value: "9", label: "roles" }, { value: "87%", label: "commits co-authored by AI (1,853 of all 2,130)" }], // R-06: _process.md:13, :44, :31-41; ewa.md:12-13, :547 (Task 13c)
          items: [
            "Lead: orchestrator",
            "Design: architect, designer",
            "Build: backend, web, app developers",
            "QA, DevOps, docs",
          ],
        },
        {
          who: "gate",
          label: "Review gate",
          stats: [{ value: "4", label: "reviewers (9 + 4 = 13 roles; 3 in the pipeline)" }], // R-06: _process.md:13, :44, :31-41; ewa.md:12-13, :547 (Task 13c)
          items: [
            "30 fix commits mention security review or a security fix (Jun 14 – Oct 29)", // M-05: _process.md:316-319 (keep "mention")
            "Three reviewers in the pipeline: security (when money, auth or personal data changes), code (always), API contract (when the contract changes)",
            "PSP failover: fixed 4 findings from 3 security reviews", // ewa.md:534
          ],
        },
      ],
    },
    {
      kind: "bars",
      at: "role",
      title: "How hard the 199 recorded decisions are to reverse",
      caption: "192 of the 199 decisions are tagged with how hard they are to reverse; 11 are hard, locking in data or contracts.",
      unit: "records",
      source: "Counted row by row from the reversibility column of the decision register (D-001 to D-199). The 5 rows marked both moderate and hard are grouped on their own.",
      bars: [
        { label: "Easy", value: 102 },
        { label: "Moderate (migration or refactor)", value: 74 },
        { label: "Moderate and hard together", value: 5 },
        { label: "Hard (data or contract lock-in)", value: 11 },
        { label: "Not marked", value: 7 },
      ],
    },
    {
      kind: "architecture",
      at: "architecture",
      title: "System architecture",
      caption: "The app and the web share one API, and only the API process moves money; the worker just sends push notifications.",
      cols: 3,
      rows: 4,
      nodes: [
        { id: "app", label: "Employee app", sub: "Flutter · iOS/Android", col: 0, row: 0, group: "client" },
        { id: "proxy", label: "Reverse proxy", sub: "Caddy · auto TLS", col: 1, row: 0, group: "core" },
        { id: "cms", label: "Web CMS · portals", sub: "Next.js · 3 portals", col: 2, row: 0, group: "client" },
        { id: "providers", label: "Providers", sub: "SMS · email · e-invoice", col: 0, row: 1, group: "external" },
        { id: "api", label: "API process", sub: "NestJS · 9 ports", col: 1, row: 1, group: "core" },
        { id: "psp", label: "Two PSPs", sub: "PSP A · PSP B", col: 2, row: 1, group: "external" },
        { id: "redis", label: "Redis 7", sub: "BullMQ queue only", col: 0, row: 2, group: "data" },
        { id: "db", label: "PostgreSQL 16", sub: "ledger · encrypted PII", col: 1, row: 2, group: "data" },
        { id: "v1", label: "Legacy v1", sub: "read-only", col: 2, row: 2, group: "external" },
        { id: "worker", label: "Worker process", sub: "BullMQ · push only", col: 0, row: 3, group: "process" },
        { id: "push", label: "Push service", sub: "FCM", col: 1, row: 3, group: "external" },
      ],
      edges: [
        { from: "app", to: "proxy", label: "HTTPS" },
        { from: "cms", to: "proxy", label: "HTTPS" },
        { from: "proxy", to: "api", label: "/api/v1" },
        { from: "api", to: "providers", label: "via ports" },
        { from: "api", to: "psp", label: "payout · balance" },
        { from: "api", to: "db" },
        { from: "api", to: "redis", label: "jobs" },
        { from: "redis", to: "worker" },
        { from: "worker", to: "db" },
        { from: "worker", to: "push" },
        { from: "v1", to: "db", label: "migration · delta" },
      ],
      notes: {
        app: "The Flutter app for employees (iOS and Android): sign-up, the withdrawal limit, withdrawals (two-factor, biometrics, PIN), vouchers, map-based check-in and on-device ID-card text recognition. 45 screens. Its models are written by hand.",
        proxy: "Caddy adds TLS automatically. On staging a single domain sends only /api/v1 to the API; production splits the API and CMS domains. The proxy also serves the CMS pages.",
        cms: "The operator CMS, the employer portal and the sales-partner portal in one Next.js app, 123 pages. API types are generated from the OpenAPI snapshot (604 operations).",
        providers: "SMS codes, email, VAT e-invoices for the fee, and business-registry lookups. Every port has a mock and a real adapter, so development makes zero external calls. Payments have no path that falls back to a mock.",
        api: "42 NestJS modules, 96 controllers, 605 routes. The 18 kinds of scheduled job (settlement reconciliation, voucher issuing, e-invoices, store-version checks, contract expiry and more) run only in this process. Every external call goes through one of 9 integration ports.",
        psp: "Two PSPs. Requests carry an RSA signature, and one PSP reports results through a callback webhook. A balance query every 2 minutes tracks health and drives failover (D-142).",
        redis: "Only the BullMQ queue broker.",
        db: "PostgreSQL 16 with Prisma: 112 models, 150 migrations. Money tables are an append-only ledger, and six employee PII fields are encrypted at rest.",
        v1: "The previous production system. The migration tool only reads from it. One full migration on Nov 7, then a delta on Nov 8 for what came in between.",
        worker: "A separate process started from the same code. It only sends push notifications taken from the queue. Scheduled jobs are switched off here, so no money-moving job ever runs in two processes at once.",
        push: "FCM. Only the worker calls it.",
      },
    },
    {
      kind: "flow",
      after: "ADR-0006",
      title: "One withdrawal, end to end",
      caption: "Money moves only after the record is committed, and the router is designed to move to the next PSP only on a definite failure; an ambiguous result stays with that PSP so two PSPs don't both pay.",
      steps: [
        { id: "request", label: "Request", sub: "Amount, voucher, two-factor code; resending the same Idempotency-Key returns the original result", actor: "human" },
        { id: "check", label: "Eligibility", sub: "Attendance, limit and usage history; company and account checks", actor: "system" },
        { id: "plan", label: "PSP plan", sub: "Company's PSP first, then the other; only configured, active, healthy and funded. If none: 503 before the code is consumed, zero ledger rows", actor: "system" },
        { id: "txn", label: "One transaction", sub: "Inside a Serializable transaction: recompute the limit, recheck status, write withdrawal, voucher and ledger; if two overlap, one is rolled back and recomputed (up to 5 times)", actor: "system" },
        { id: "pay", label: "Pay after commit", sub: "Signed request outside the transaction; the same reference on every PSP", actor: "external" },
        { id: "judge", label: "Classify result", sub: "success, pending, failed, unavailable; pending or an exception stays with that PSP and stops", actor: "system" },
        { id: "record", label: "Apply result", sub: "Short second transaction, payout notice, reconciliation", actor: "system" },
      ],
      loops: [{ from: "judge", to: "pay", label: "definite failure or unavailable → next PSP" }],
    },
    {
      kind: "bars",
      at: "quality",
      title: "Automated tests by layer",
      caption: "About two thirds of the 7,080 asserting tests sit in the backend, where the money paths are.",
      unit: "tests",
      source: "Backend unit, web and app run on 2026-11-10 (all passing); backend e2e from the full run on 2026-11-03 (1 of 1,508 failed, passed on rerun of that spec). Capture-only tests without assertions (143 app goldens, 314 web Playwright) are excluded.",
      bars: [
        { label: "Backend unit (Jest)", value: 3156 },
        { label: "Backend e2e (full run, Nov 3)", value: 1508 },
        { label: "Web unit & component (Vitest)", value: 1460 },
        { label: "App widget & unit (Flutter)", value: 956 },
      ],
    },
  ],
  myRole: [
    "I designed the 13-role AI agent team and its 8-stage pipeline (intake → architect → design → develop → QA → review → integrate → document), committed it on Jun 14, and ran the team from then on. I am the only git author, and 1,853 of the 2,130 commits (87%) carry an AI co-author trailer.",
    "I set the decision mode: so that work never stalls, go ahead on a recommended default, log it in the decision register, and review it later. 68 of the 199 rows (34%) carry a person's confirmation or input, 37 of them with my name. Of the 11 hard-to-reverse decisions, 3 (D-036, D-159, D-161) were confirmed when logged and 8 went ahead on the default. The answers in the stakeholders' decision sheet of 3 July went in together as decisions D-128 to D-131 on 4–5 July.",
    "The rule is that push approvals, production deploys and store submissions run on my instruction; agent sessions carried them out. The production data migration on Nov 7 ran after a rollback rehearsal that morning, and the migration tool does not commit if any reconciliation item differs. The migration rule \"no v1 data may be deleted\" is in the decision register (D-173) as my input.",
  ],
  decisions: [
    {
      setBy: "agent-default", // Task 13c M-03
      id: "ADR-0004",
      title: "Integer money, append-only ledger",
      problem: "The Vietnamese dong has no minor unit, and one company's monthly settlement can exceed the 32-bit integer limit (about 2.1 billion).",
      options: [
        "Full double-entry: the right long-term model for a licensed fintech, but heavier than the current stories need and slower to deliver",
        "Single-entry, append-only ledger, with the fields for a later move to double-entry in place",
      ],
      chosen: 1,
      decision: "The ledger is single-entry but append-only: no updates or deletes, and a cancellation is a REVERSAL row. Account, direction, reference and batch fields are there from the start, so a later move to double-entry needs no rewrite of history. Amounts are stored as BigInt whole dong and rates as integer basis points (60% = 6000). The dong has no minor unit, so Decimal and float are banned from money paths, and a monthly settlement can exceed the 32-bit limit, so the type is BigInt rather than Int.",
      result: "All limit and fee math is integer arithmetic. Because the ledger is append-only, race tests could later assert \"ledger sum = 0\" as an invariant.",
      cost: "If strict double-entry is ever required, it takes a migration that adds a parent transaction table and a balance constraint (the ADR rates it moderate). The ADR is still marked provisional.",
    },
    {
      setBy: "revised", // Task 13c M-03
      id: "ADR-0006",
      title: "One transaction for the withdrawal, payout after commit",
      problem: "A double click or a race could pay twice, and no DB lock may be held during a network call.",
      options: [
        "Saga / outbox: not needed in the first wave, since booking a withdrawal happens entirely inside one database",
        "Single Postgres transaction + payout after commit",
      ],
      chosen: 1,
      decision: "A withdrawal is booked in one Serializable transaction. Inside it, the cycle's withdrawals are summed again to compute the limit, the employee's status is rechecked, and the withdrawal, voucher and ledger rows are written. If two requests overlap, PostgreSQL rolls one back with a serialization failure; after up to 5 retries it returns 409. The ADR text says FOR UPDATE locking, but the implementation has worked this way from the start. The PSP is called after commit, outside the transaction, and a short second transaction applies the result. The Idempotency-Key is unique globally and forever: the same key returns the original result, and a different employee or amount gets 409.",
      result: "An e2e test checks that when one employee confirms twice at once with different keys, exactly one succeeds. On Sep 4 a race was found and fixed: two manual rejections arriving at once wrote the reversal twice. The fix is a conditional claim that updates only when the status is the expected one and continues only when exactly one row changed, plus race e2e tests asserting that the ledger sums to zero. Security review approved the fix, and on Sep 13 the same pattern went onto the sibling payout paths it had flagged.",
      cost: "Instead of row locks, the design relies on Serializable conflict detection: overlapping requests are recomputed, and more than 5 conflicts return 409. Idempotency keys are never garbage-collected and stay unique forever. The ADR said to revisit this design once there were several PSPs; two arrived in September and the ADR was not updated.",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      id: "D-142",
      title: "Two PSPs with health-based failover",
      problem: "One PSP going down blocked every withdrawal.",
      decision: "Payout results are success, pending, failed or unavailable. Only decline codes on an allow-list count as failed; everything else is pending and is not passed on to the other PSP. The order is the company's PSP, then the other, and only PSPs that are configured, active, healthy and funded are tried. Failed or unavailable moves to the next PSP; pending or an exception stays with that PSP and stops. Health is a balance query every 2 minutes, and two transport errors in a row mark a PSP down. If none is available, the API returns 503 before the two-factor (TOTP) code is consumed and writes nothing to the ledger. Payments have no path that falls back to a mock.",
      result: "Merged on Sep 13. Three rounds of security review fixed a manual-payout race, a double payout caused by treating unknown codes as failed, flags that came back after being resolved, and payouts stuck in pending for good.",
      cost: "An ambiguous result is pending: it stays with that PSP until a status query resolves it or an operator closes it, and closing it does not restore the limit. Payments never fall back to a mock: with no usable PSP the API returns 503 before 2FA.",
    },
    {
      setBy: "own-input", // Task 13c M-03
      id: "D-172",
      title: "Employee PII encrypted at rest",
      problem: "v1 had been encrypting some personal data, and a DB dump alone must not expose it.",
      decision: "AES-256-GCM sits in a Prisma query extension that encrypts on write and decrypts on read, so service code only sees plaintext. Six fields are covered: phone number, account number, account holder, national ID number, date of birth and base salary. A random IV on every field would rule out equality lookups, so only the phone and national ID numbers (the latter since Oct 27), which need lookups, use a deterministic IV, derived from an HMAC of the field name and value, to keep uniqueness and equality lookup; the rest use a random IV. Only the last four digits of the phone number stay in plain text, for search.",
      result: "The v1 migration tool commits only after reconciliation confirms that all six fields of every migrated employee are sealed (zero plaintext).",
      cost: "A lost key cannot be recovered, and partial search works only on the last four phone digits. For the two deterministic fields, the ciphertext alone shows whether two numbers are the same.",
    },
    {
      setBy: "own-input", // Task 13c M-03
      id: "D-173",
      title: "The v1 → v2 data migration",
      problem: "The data in the running v1 had to move to v2. The rule was \"no v1 data may be deleted\".",
      decision: "The migration tool fixes only v1's column list and rules, and reads every row at run time. It uses deterministic IDs and stops on any enum value missing from its rules. It loads everything in one transaction, reconciles, and does not commit if anything differs. Reconciliation compares per-company counts, amounts and fees, per-employee payout totals, the number of settled withdrawals, ledger offsets for failed withdrawals, and zero plaintext PII. The expected values are built while transforming the rows read from v1, so it checks the transformed result against what was actually loaded. By default a run is a rehearsal that loads, reconciles and rolls back, and a test fails if any string sent to v1 contains a destructive keyword.",
      result: "The rehearsals on Sep 30 and the morning of Nov 7 found problems in v1's own data (swapped date fields in attendance records, broken account numbers), and on the tool side withdrawal codes were kept, clashes with numbers already in v2 were handled and unsettled months were listed. Transactions that reached v1 after the one-off migration on Nov 7 were added with a delta migration on Nov 8, and reconciliation matched.",
      cost: "Reconciliation does not query v1 again to compare against the source. Times, attendance days, notifications and files are not reconciled.",
    },
  ],
  quality: [
    "There are 7,080 automated tests with assertions. The 3,156 backend unit, 1,460 web and 956 app tests were run on Nov 10 and all passed. The backend e2e tests need a real database; the count comes from the full run on Nov 3, where 1 of 1,508 failed and passed when that spec was rerun.",
    "The e2e tests aim at the boundaries of money and permissions. Counted by test name, so approximate: 32 on tenant isolation and cross-company access, 94 expecting a 403, and 45 on idempotency, retries and concurrency.",
    "Every external call goes through one of 9 integration ports. Each port has a mock adapter, so development makes zero external calls. Only the payment port has its path to a mock blocked.",
    "The pipeline's three reviewers (security, code and API contract) ran 24 times since 28 Sep, when records begin. 30 fix commits mention security review or a security fix (Jun 14 – Oct 29). PSP failover (D-142) went through security review three times.",
    "I also built a map of screen states. App golden captures and web Playwright captures drew 131 screens, 597 states and 1,245 transitions as a wireframe map. These captures have no assertions, so they are not counted as tests.",
    "The rule was to write the failing test first: 344 of the 398 non-merge fix commits (86%) also changed a test file. That includes edits to existing tests, so it does not mean a regression test was added each time.", // M-05: off the metrics row; _process.md §5
  ],
  trace: {
    intro: "This follows one story from the spec to a deploy: the forced app update.",
    steps: [
      {
        step: "① Spec and decision — EMP-SET-07 / ADM-SET-03 → D-143",
        evidence: "An X.Y.Z version rule. A bump to X or Y shows a blocking screen with only a store button; a bump to Z alone shows a dismissible prompt for 5 seconds. If the check fails, the app opens normally (fail-open). The public GET was made a deliberate exception to the \"role guard on every endpoint\" rule. The trigger was that v1's app had a forced update and v2 did not.",
      },
      {
        step: "② Backend — version registry and a public check API",
        evidence: "One commit added the version registry, a public GET /app-version and an admin PUT with an audit record, together with 3 unit tests and 7 e2e tests. The same commit wrote the reason for the role-guard exception into the project rules file.",
      },
      {
        step: "③ Web CMS — latest-version registry page",
        evidence: "The commits went: settings page, then a dialog that confirms the forced update on first registration, then a regenerated OpenAPI snapshot. 7 tests and 1 fix commit.",
      },
      {
        step: "④ App — update gate on cold start",
        evidence: "6 widget tests (forced, optional, 5-second auto-dismiss, fail-open on API error, malformed body, no Android row) and 6 unit tests for version comparison. The iOS branch was narrowed with a test variant. Captures of the forced and optional screens came 9 days later in a separate commit, for the wireframes; they are not regression tests.",
      },
      {
        step: "⑤ First use — the rule picks the version on staging",
        evidence: "On Sep 21, removing the invite-code route and blocking account writes meant installed apps had to update. Following the rule, the server went from 0.1.5 to 0.2.0 and the app got a Y bump too. It was a staging round and the build was not in the stores, so CMS registration was skipped on purpose. The production order (store release → server deploy → CMS registration) and why the reverse order is worse were written down as well.",
      },
      {
        step: "⑥ Hardening — the rule enforced in code",
        evidence: "\"Register a version only once it is live in the store\" was still just a convention. On Oct 26, a job started reading the store version daily at 06:00 (ICT), and registering anything above it now returns 400 (VERSION_ABOVE_STORE). Admins are alerted if the store drops below the forced baseline.",
      },
    ],
  },
  results: [
    "Every change request from the client was shipped within 24 hours.",
    "Built the employee app (iOS and Android), the operator CMS and the employer and sales-partner portals in three languages. The API and the web run on the staging and production servers, and the app has a build pointing at the production server.",
    "Moved v1's production data to v2 on Nov 7; after the transactions that reached v1 later were added on Nov 8, reconciliation still matched (its scope is on the “The v1 → v2 data migration” decision card). Requests from the v1 app now get an update notice, which retired the v1 app.",
    "Integrated two PSPs. The first end-to-end sandbox transfer succeeded on Aug 23, and on Oct 30 the production connection and a healthy status were confirmed. Failover keeps withdrawals going when one PSP is down, and an ambiguous result is designed to stay with that PSP so two PSPs don't both pay.",
    "All 7,080 asserting tests come with a run record. Backend unit, web and app tests all passed on Nov 10; in the Nov 3 full run of the backend tests that call the API end to end against a real database, 1 of 1,508 failed (it passed on rerun).",
  ],
  retro: [
    "A flaky e2e suite gave me a rule for diagnosis. About 3 failures in 90 runs, a different single test each time. The rule: many failures at once means the environment, one failure that moves around means a bug not yet found. With it, the cause was narrowed from the app to the test transport (a temporary port opened and closed per request), and the server now binds once.",
  ],
  code: [
    {
      src: "/img/ewa/code-payment-router.png",
      path: "src/integrations/payment-router.ts",
      caption: "Only a returned decline or outage moves on to the next PSP; an exception stays on that PSP as pending. (comments condensed from the source)",
      alt: "The loop that walks an ordered list of PSPs to attempt a payout. If a PSP returns declined or unavailable, the next one is tried; success or pending stops the walk. An exception during the call may mean money moved, so it is recorded as pending and nothing further is tried.",
    },
  ],
  gallery: [
    { src: "/img/ewa/shot-3.png", caption: "Worker app home. Available withdrawal amount, the activity score that raises the limit, recommended activities, and history and voucher menus. Mocked data from the app golden tests; name masked.", frame: "phone" },
    { src: "/img/ewa/shot-4.png", caption: "Withdrawal confirmation. Pay cycle, available amount, requested amount, fees and the amount received on one screen. Receiving account details masked.", frame: "phone" },
    { src: "/img/ewa/shot-1.png", caption: "Operator CMS dashboard: key figures such as withdrawn amount, withdrawal count and fee revenue, with period trend charts. Mock data; logo masked.", frame: "laptop" },
    { src: "/img/ewa/shot-2.png", caption: "Manual withdrawal approval queue. Request time, employee, company, amount, net payout and waiting time sit on one row, with approve and reject buttons per row. Mocked API data; logo masked.", frame: "laptop" },
  ],
  cover: { src: "/img/ewa/shot-3.png", alt: "Worker app home: available withdrawal amount, the activity score that raises the limit, and suggested activities", frame: "phone" },
};
