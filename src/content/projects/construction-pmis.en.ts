import type { CaseStudy } from "../types";

// Anonymized: no client, site, people, domain, city, country, language list, scale, logo or cost figures (D-017;
// the facts flag country + language list + scale as an identifying combination).
// Result stops at client UAT (D-044 ③): no production-use claim. No client-system internals (D-043, Q-025):
// hosting and code-level details stay out.
// Agent roles are described as defined, not as invoked (no invocation records in the facts).
// Every sentence and number comes from docs/facts/construction-pmis.md;
// visuals and their placement from docs/reviews/2026-11-11-visuals-wave2.md §3.
export const constructionPmisEn: CaseStudy = {
  kind: "case",
  slug: "construction-pmis",
  title: "Daily site reports and project management for a construction company",
  tagline: "Started from a general construction project management system (PMIS), rebuilt it around the client's paper daily reports, cut finance features already built, and took it to client acceptance testing (UAT).",
  year: 2026,
  domain: "Construction site management",
  tags: ["construction", "operations", "ai-agents"],
  stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "next-intl", "TanStack Query", "puppeteer-core", "pdf-lib", "Playwright"],
  facts: {
    period: "Apr – Jul 2026",
    role: "Only human on the build team; designed and ran the AI agent team",
    team: "Me plus an AI agent team (11 roles defined)",
    platforms: "Web app (per-role screens for head office and sites, 3 languages), daily-report PDF",
    context: "A general contractor. Two of the client's paper daily reports served as the template for the input screens",
  },
  metrics: [
    { value: "Client UAT", label: "acceptance testing reached" }, // M-11 status: construction-pmis.md:441-442
    { value: "1 day", label: "redesign to report-core merge" },
    { value: "2 scope cuts", label: "of features already built" },
    { value: "12", label: "manuals: 4 roles × 3 languages" },
  ],
  leads: {
    results: "It began as a general-purpose PMIS, was rebuilt around the daily site report, and went as far as client UAT.",
    problem: "The job was to turn the client's paper daily report into a web flow where one designated person per project writes it and the site manager approves it.",
    role: "I was the only human; I defined the agent team from the first commit and ran it, and I decided the design direction and the merges.",
    decisions: "Two of the six cut features already built; four keep the client's real report and the approved record, three of them on agent defaults.",
    quality: "A work log records 1,001 tests passing, but the test rules lived only in agent instructions and the nightly QA swallowed failures.",
    retro: "Features already built were cut from scope twice, and every recorded incident has its cause and its fix on file.",
  },
  problem: [
    "The client is a general contractor. The users are head-office admins, directors, site managers and staff. The product centres on the daily site report. Each project has one designated reporter who writes one report a day, and the site manager or a director reviews and approves it. A report covers the work done, direct labour, subcontractor labour (7 trades × day and night), equipment, materials used, photos, drawings and other attachments. The subcontractor, equipment and material masters, the notifications and the photo and drawing uploads all exist to support this flow.",
    "It did not start this way. In April it was a general-purpose PMIS with a task WBS and Gantt chart, document approval and schedule performance analysis (EVM). On May 9 it was redesigned around the daily report, using two of the client's paper daily reports as the template, and on May 20 the finance features already built were taken out of scope (key decisions 1 and 2).",
    "Permissions were the hard part. The same staff member writes reports on one project and only reads them on another. The site manager differs from project to project as well. An approved report is both the unit of audit and the basis for progress figures, so who may change what after approval had to be settled too. The screens had to come in 3 languages, and notifications had to go out in each recipient's language.",
  ],
  visuals: [
    {
      kind: "timeline",
      at: "results",
      title: "From a general PMIS to client UAT",
      caption: "It began as a general-purpose PMIS, was rebuilt around the daily report and shed finance, and went as far as client UAT.",
      items: [
        { date: "2026-04-05", label: "First commit", note: "Started with a 7-role agent team" },
        { date: "2026-04-07", label: "First deploy", note: "Up to document management and access control" },
        { date: "2026-04-19", label: "Schedule analytics", note: "Status lights, S-curve, critical path (through Apr 20)" },
        { date: "2026-05-09", label: "Redesigned around the daily report", note: "Built on two of the client's paper reports; schedule and EVM archived" },
        { date: "2026-05-10", label: "Daily-report core merged", note: "Seven phases; first manual" },
        { date: "2026-05-11", label: "Finance built", note: "Orders, receipts, payments, cost (through May 12)" },
        { date: "2026-05-20", label: "Finance taken out of scope", note: "\"Orders, payments and cost belong to the external accounting system\"; three material catalogues" },
        { date: "2026-05-24", label: "Manuals rewritten", note: "4 roles × 3 languages = 12" },
        { date: "2026-05-30", label: "Staging built", note: "Incremental deploy script (through May 31)" },
        { date: "2026-07-08", label: "Staging on the client's domain", note: "Certificate applied" },
        { date: "2026-07-09", label: "Email notifications; last commit" },
      ],
      spans: [
        { from: "2026-04-05", to: "2026-04-20", label: "first take: general PMIS" },
        { from: "2026-05-11", to: "2026-05-20", label: "finance built → dropped" },
        { from: "2026-05-30", to: "2026-07-08", label: "staging → client domain" },
      ],
    },
    {
      kind: "flow",
      at: "problem",
      title: "One daily report, end to end",
      caption: "Each project has one designated reporter who writes one daily report a day; the site manager approves it, and only approved rows count toward progress.",
      steps: [
        { id: "assign", label: "Assign the reporter", sub: "The director sets the site manager and members and names one reporter (the DB allows one active)", actor: "human" },
        { id: "draft", label: "Today's draft", sub: "One per project and day; yesterday's plan for tomorrow pre-fills today's work", actor: "human" },
        { id: "save", label: "Save sections", sub: "Saving is never blocked; each row: lock check, change, audit, cache invalidation; other projects' ids rejected", actor: "system" },
        { id: "submit", label: "Submit", sub: "The editor checks 11 rules first, the server re-checks 6; weather attached after submit", actor: "human" },
        { id: "review", label: "Review", sub: "The site manager approves or rejects with a reason; nobody can edit the report or its files meanwhile", actor: "human" },
        { id: "approved", label: "Approved", sub: "Read-only; only a director can edit in place, keeping the status, and it is logged", actor: "system" },
        { id: "pdf", label: "Daily-report PDF", sub: "Server-built HTML into headless Chrome, drawing PDFs appended, cached", actor: "system" },
        { id: "rollup", label: "Progress roll-up", sub: "Only approved rows feed material usage and plan progress", actor: "system" },
      ],
      loops: [{ from: "review", to: "save", label: "rejected: fix and resubmit (no limit)" }],
    },
    {
      kind: "architecture",
      at: "architecture",
      title: "System architecture",
      caption: "Changes to a daily report's rows go through one recipe in the daily-report module: lock check, change, audit log, PDF cache invalidation.",
      cols: 3,
      rows: 4,
      nodes: [
        { id: "browser", label: "Browser", sub: "3 languages · per-role home", col: 0, row: 0, group: "client" },
        { id: "api", label: "API routes", sub: "token guard · live check", col: 1, row: 0, group: "core" },
        { id: "cron", label: "Scheduled jobs", sub: "deadlines · tests · weather", col: 0, row: 1, group: "process" },
        { id: "perm", label: "Permission layer", sub: "roles · membership · state", col: 1, row: 1, group: "core" },
        { id: "notify", label: "Notifications", sub: "in-app · email", col: 2, row: 1, group: "process" },
        { id: "pdf", label: "PDF renderer", sub: "HTML → headless Chrome", col: 0, row: 2, group: "process" },
        { id: "report", label: "Daily-report module", sub: "transitions · checks · audit", col: 1, row: 2, group: "core" },
        { id: "db", label: "PostgreSQL", sub: "Prisma 7 · pg.Pool", col: 2, row: 2, group: "data" },
        { id: "files", label: "File storage", sub: "Range · ETag · private", col: 0, row: 3, group: "data" },
        { id: "weather", label: "Weather API", sub: "daily summary on submit", col: 2, row: 3, group: "external" },
      ],
      edges: [
        { from: "browser", to: "api" },
        { from: "api", to: "perm" },
        { from: "perm", to: "report" },
        { from: "report", to: "db" },
        { from: "report", to: "notify" },
        { from: "report", to: "pdf" },
        { from: "pdf", to: "files", label: "drawings" },
        { from: "report", to: "files" },
        { from: "cron", to: "report" },
        { from: "report", to: "weather" },
      ],
      notes: {
        browser: "3 languages (1,600 keys each); every time is shown in one fixed local time zone. Each role lands on a different home: directors on a portfolio dashboard, site managers on a review queue, staff on project tiles.",
        api: "Home-grown JWT. Access tokens last 120 minutes, refresh tokens 7 days (httpOnly cookie + DB). Refresh tokens rotate on every use, and a detected reuse ends all of that user's sessions. The auth guard re-checks in the DB on every request that the user is still active.",
        cron: "Submission-deadline reminders (reporter and site manager), a test reminder 28 days after concrete is used, and an hourly weather backfill.",
        perm: "Four base roles + project membership + one site manager per project + the designated reporter (a designation kept apart from the four roles; a partial unique index in the DB allows one active) + locks that follow the report's state. Whether a document's edit button is disabled is decided by the server and sent in the detail response.",
        notify: "All notifications go through one service and are rendered in the recipient's language when written. Polling pauses while the page is hidden. Email and a signed-token web view were added on Jul 9.",
        pdf: "One page per report. The server builds HTML, feeds it to headless Chrome and appends the drawing PDFs. The cache is cleared from 18 mutation paths; concurrent renders are merged into one and cut off after 30 seconds.",
        report: "State transitions are one pure function. Saving is never blocked; only submission is checked (6 rules enforced by the server). Row changes go through lock check, change, audit log and PDF cache invalidation, and another project's ids are rejected at save time.",
        db: "PostgreSQL + Prisma 7. The audit log never blocks a response when it fails, and edits and deletes are stored as per-attribute diffs.",
        files: "Files sit behind a storage abstraction. Downloads stream, with Range, a weak ETag and a private cache, so that a shared CDN never serves one user's bytes to another.",
        weather: "When a submission succeeds, 14 daily-summary values and derived indicators (including a concrete curing index) are stored. A failure never blocks the submission; there is a retry button and a backfill.",
      },
    },
    {
      kind: "timeline",
      at: "retro",
      title: "Incidents and what changed",
      caption: "Every recorded incident has its cause and its fix on file; five deploy and PDF incidents were fixed on May 13 alone.",
      stats: [{ value: "5", label: "deploy and PDF incidents fixed on May 13 alone" }],
      items: [
        { date: "2026-04-07", label: "Type errors only in the build", note: "Local dev skipped type checks → prisma generate in the build, one type path" },
        { date: "2026-05-13", label: "Five deploy and PDF incidents", note: "Connection limit, demo deploys with an empty DB, missing Chrome files, PDFs of the login page, missing fonts → pool size, an explicit seed that stops at zero users, file tracing, server-built HTML, bundled fonts" },
        { date: "2026-05-22", label: "Document upload page 404", note: "Restored a page lost in the redesign" },
        { date: "2026-05-24", label: "Manuals showed removed features", note: "The capture script swallowed 404s → fail fast; all 12 manuals rewritten" },
        { date: "2026-05-25", label: "Rows could take another project's ids", note: "A check lost in the May 10 refactor → project-scope check at save time (7 routes)" },
        { date: "2026-05-30", label: "Eleven pitfalls on the first staging build", note: "Folded into runbook v0.3" },
      ],
    },
  ],
  myRole: [
    "I was the only human on the build team. I am the only git author, and 177 of the 290 commits (61%) carry an AI co-author trailer; leaving out merge commits, it is 177 of 239 (74%). Commits cannot separate what I wrote by hand from what the agents wrote, so the role reads \"Only human on the build team; designed and ran the AI agent team\".",
    "The agent team was in the repo as definition files from the first commit (Apr 5). It started with 7 roles: orchestrator, designer, frontend, backend, reviewer, API docs and QA. TDD guide, git flow (Apr 19), manuals (May 10) and devops (May 22) followed, for 11 roles. Orchestrator, backend, frontend and devops were set to Opus; the other 7 to Sonnet. The definitions differ from the public templates and were written for this project. The pipeline was written into the instructions as: start branch → design → failing test first → implement → tests pass (80% coverage) → review and API docs → QA (e2e) → manuals → PR.",
    "There were 110 PRs, and the 106 that were merged were all merged from my account. No person reviewed a PR. Some decisions are visibly a person's in the record. On May 12 I closed a PR that moved the UI onto the IBM Carbon design system, noting that it was \"not the design direction this product is shipping\". The design went to its own grayscale system, with shadcn ruled out. On May 14 I prepared a proposal for a client meeting (a workforce-management module, 16 pages) asking for sign-off on the screen designs. That module was never built.",
    "The decision log holds 42 entries, 25 of which list alternatives. As its header says, these are decisions the agent made with its recommended defaults and then carried out. The scope-change design document lists 8 more decisions confirmed on May 20. The alternatives and reasons on the decision cards come from these two documents and from commit messages.",
  ],
  decisions: [
    {
      title: "From a schedule- and EVM-centred general PMIS to one built around the daily report",
      problem: "What existed in April was a general-purpose PMIS with a task WBS and Gantt chart, document approval and schedule performance analysis (status lights, S-curve, critical path). Then two of the client's paper daily reports came in as design input. The client's form had sections for work, labour, subcontractor labour, equipment, materials, photos and drawings.",
      options: [
        "Auto-collect plus manual notes: gather the day's changes from the activity log and let the site manager add weather and remarks (option C in the Apr 7 plan)",
        "Follow the client's form: the designated reporter fills in each section and the site manager approves",
      ],
      chosen: 1,
      decision: "The design followed the client's form. Each project has one designated reporter who writes one report a day, and the site manager or a director approves it. The subcontractor, equipment and material masters, notifications and photo and drawing uploads were all repositioned to support that flow. The schema was rewritten and the migration history discarded; schedules, tasks, labour, attendance and document approval moved to an archive folder. Why option C was dropped is not on record; the plan only says it was \"superseded by SPEC.md\".",
      result: "The next day (May 10) daily-report phases 1–7 were merged (PRs #12–#19). EVM was kept in the archive as a \"future visualization phase\".",
      cost: "The schedule analytics and task management built in April left the product.",
    },
    {
      title: "Take the finance features already built out of scope, and fix materials to three catalogues",
      problem: "On May 11–12 purchase orders (three-step approval), receipts (with evidence), payment requests and a cost summary (Excel and PDF) were built. That left the question of whether a site PMIS should carry the flow of money or only the flow of materials.",
      options: [
        "Keep finance in the PMIS (the orders, receipts, payments and cost built on May 11–12)",
        "Archive finance; the site PMIS handles only the physical flow of materials",
      ],
      chosen: 1,
      decision: "All finance menus and models were archived. The design document records two reasons: \"orders, payments and cost are handled separately in the external accounting system (not PMIS scope)\" and \"fixing materials to three kinds cuts the data-entry load and simplifies testing and tracking\". The site PMIS would focus on the flow of materials: supplier → truck → site location → use → test. Materials became three fixed catalogues (concrete, rebar and stone), the daily report got a single \"usage (= receipt)\" event, and tasks got a two-level location. The 8 decisions confirmed that day also record what was deferred: locations stop at two levels (three or more later), concrete tests are only marked complete (structured strength and slump later), and notifications stay in the app (email and SMS later).",
      result: "It shipped on May 20 as 9 PRs (#57–#65). For concrete, a scheduled job sends the test reminder 28 days after the day of use. The deferred email notifications were added on Jul 9.",
      cost: "Twelve finance UI routes, ten API routes and their tables were removed. Per the work log, the passing unit-test count fell from 1,855 (May 18) to 790 (May 20).",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      title: "Permissions from roles, membership and the designated reporter; attachment locks from the report's state",
      problem: "The same staff member writes reports on one project and only reads them on another. The site manager differs from project to project too. And the photos, drawings and documents attached to a report were also documents in their own right that could be opened and edited from the document list.",
      options: [
        "Use only the documents' existing creator and role rules",
        "Add a separate \"freeze\" flag",
        "Follow the report's state: in draft or rejected, the reporter plus directors and system admins; under review, nobody; after approval, directors and system admins only",
      ],
      chosen: 2,
      decision: "There are only four roles (system admin, director, manager, staff); everything else is settled inside the project: membership, one site manager per project, and the designated reporter. The designated reporter is a designation kept apart from the four roles, and a partial unique index in the DB keeps it to one active per project (code below). Edit rights on documents attached to a report were tied to the report's state, because, as the decision log puts it, \"the daily report is the audit unit\". Evidence must not change while a report is under review, and after approval only directors and system admins may touch it, the same rule as for the report body. On May 18 the permission checks scattered across routes were gathered into named verbs such as canManageProjectMembers (5 paths).",
      result: "While a report is under review, nobody can edit its photos, drawings or documents (REPORT_UNDER_REVIEW); after approval, only directors and system admins can. Documents not attached to a report keep their usual document rules.",
      cost: "One site manager per project is held by an application check (409); the reporter rule is held by the DB. Permission checks also come in two styles: the subcontractor and equipment masters use table-based RBAC, while projects and reports use membership predicates.",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      title: "The server decides the lock; the screen only receives the verdict",
      problem: "The document detail screen had to disable the edit button on locked documents. But the screen's guess and the server's actual decision could disagree.",
      options: [
        "The screen recomputes the lock from role, creator and attachment type",
        "Put the result of the server's gate function (canMutate, lockedCode) into the detail response",
      ],
      chosen: 1,
      decision: "The server's verdict goes into the response. The decision log gives the reason: \"the client heuristic missed the active-reporter check, so the disabled state diverged from the server\". The screen and the API now use the same gate function. In the same spirit, permission overrides are not put in the JWT but read from the DB on every request, so an admin can revoke them without forcing a token re-issue.",
      result: "The document detail response carries canMutate and lockedCode, and the screen sets the button state from them. In the same direction, on May 18 the submission rules were moved into one module shared by the server and the editor. Of the 11 rules the server enforces 6; a missing weather entry is checked only in the editor.",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      title: "Equipment quantities as decimals to two places",
      problem: "The client's sample reports recorded equipment quantities such as \"0.5 day\". The first schema took the day and night equipment counts as integers.",
      options: [
        "Keep integers and have reporters round",
        "Switch to Decimal(12,2)",
      ],
      chosen: 1,
      decision: "They became decimals. The decision log's reason: \"integer-only forced reporters to fake the data\". On May 21 equipment time, until then entered in three blocks (morning, afternoon, extra), became a single start and end time (24-hour, past midnight allowed). The morning, lunch (excluded), afternoon and extra segments and the work-day count (hours worked ÷ 7) are computed for display, and existing rows were filled in by a migration.",
      result: "Each equipment row in a report now takes a plate number and one start and end time per machine; the segments and work days are computed on screen.",
    },
    {
      title: "Daily-report PDFs: the server builds HTML from data and renders it in headless Chrome",
      problem: "Every report needed a one-page PDF with the attached drawing PDFs appended. The cost-summary PDF built in the same period used browser printing.",
      options: [
        "Browser printing (the cost-summary PDF's approach): no new runtime dependency",
        "Open the print-view URL in headless Chrome and capture it",
        "The server builds HTML from DB data and feeds it straight to headless Chrome",
      ],
      chosen: 2,
      decision: "Rendering moved to the server (May 12). puppeteer-core drives headless Chrome, and pdf-lib appends the drawing PDFs. The first version navigated to the print view, but the headless browser had no login context, so it captured the login page. The next day it switched to building HTML on the server from DB data and feeding it in directly. Finished PDFs are cached as files, and 18 paths that change a report clear the cache. Concurrent renders of the same report are merged into one and cut off after 30 seconds.",
      result: "A download is served straight from the cache when there is one and rendered on the spot when there is not. One report becomes one PDF file, drawings included.",
      cost: "It brought in the runtime dependency the browser-printing option avoided. On May 13 the Chrome files went missing from the deploy bundle and text broke for lack of a font; file-tracing settings and a bundled font fixed both.",
    },
  ],
  quality: [
    "Counted statically, there are 45 unit test files (542 test blocks), 28 integration (API) files (255), 23 component files (190) and 45 e2e specs (429). The e2e suite is split into desktop and mobile projects. I did not re-run any of them for this write-up.",
    "Most run results are work logs in commit messages. One May 25 commit records 1,001 unit, integration and component tests passing. Another commit the same day records 358 desktop e2e tests passing, 4 flaky, 54 skipped and 0 failing. A May 21 commit puts e2e coverage at about 85%: 28 of 33 use cases fully covered and 5 partly (per the work log).",
    "On May 24, 86 stale e2e failures were cleaned up, and 43 tests (12 specs) that need rewriting were left skipped.",
    "One run left a record file of its own: on May 21, all 6 smoke tests passed against a demo deploy running on seed data. From May 20 a nightly GitHub Actions job also ran per-role screen QA against that deploy. Its QA step, however, swallows a non-zero exit, so a \"successful\" run does not mean QA passed.",
    "The pipeline rules (test first, 80% coverage, commit only after the reviewer, QA and manuals pass) lived only in the instructions. There were no agent hooks and no CI running on PRs.",
    "Two reviews are on record. On May 18 candidates from an architecture review run as an agent command became 5 refactoring PRs (#47–#51); sharing the submission rules between server and editor and gathering permission checks into named verbs both came from there. On May 25, 6 findings from a design review were applied.",
  ],
  trace: {
    intro: "This follows one daily report from the reporter's assignment to the PDF and the progress roll-up.",
    steps: [
      {
        step: "① Assignment — director",
        evidence: "A director creates the project, names the site manager, adds staff and designates the reporter. A new designation closes the previous active record and notifies both the previous and the new reporter.",
      },
      {
        step: "② Draft — designated reporter",
        evidence: "The reporter creates today's draft. There is one report per project and date. Yesterday's \"plan for tomorrow\" pre-fills today's \"work done\".",
      },
      {
        step: "③ Save",
        evidence: "Saving is never blocked. Row changes go through a shared recipe: check the edit lock, apply the change, record the edit time if the report was approved, clear the PDF cache and write the audit log. Trade, location or subcontractor ids from another project are rejected at this step.",
      },
      {
        step: "④ Submit",
        evidence: "The editor blocks first with the 11 shared rules, and the server re-checks 6 of them. On success the status becomes SUBMITTED and the site manager is notified in their own language. After the response is sent, the day's weather summary is fetched and attached.",
      },
      {
        step: "⑤ Locked under review",
        evidence: "Until the review ends, nobody can edit the photos, drawings or documents attached to the report (REPORT_UNDER_REVIEW).",
      },
      {
        step: "⑥ Rejection and resubmission",
        evidence: "A site manager must give a reason to reject. The reporter's editor shows that reason, and the submit button turns into \"Resubmit\". There is no limit on resubmissions.",
      },
      {
        step: "⑦ Approval",
        evidence: "An approved report is read-only. Only a director can edit it in place; the status stays the same and no notification goes out. The edit time and the audit log are still recorded.",
      },
      {
        step: "⑧ PDF",
        evidence: "If a cached copy exists it is served at once. Otherwise the server builds the HTML, renders it to PDF in headless Chrome, appends the drawing PDFs and caches the result.",
      },
      {
        step: "⑨ Progress roll-up",
        evidence: "Only approved rows are added to the project's material usage and to the actuals on the work-plan timeline.",
      },
      {
        step: "⑩ Scheduled reminders",
        evidence: "If nothing is submitted by the deadline, a scheduled job reminds the reporter and the site manager. 28 days after concrete is used, a test reminder goes out.",
      },
    ],
  },
  results: [
    "Every change request from the client was shipped within 24 hours.",
    "Built a site PMIS centred on the daily report, as a web app in 3 languages. One flow covers designating the reporter, writing, submission checks, site-manager approval, director edits after approval, the daily-report PDF and the roll-up of approved rows.",
    "Put staging on the client's domain on Jul 8, and took the system as far as client acceptance testing.",
    "Merged the 7-phase daily-report core the day after the redesign around two of the client's paper reports (May 10).",
    "Took the schedule/EVM and finance features already built out of scope, fitting the product to the daily report and the physical flow of materials.",
    "Produced 12 user manuals, for 4 roles in 3 languages. Their 450 screenshots are re-shot by a capture script.",
  ],
  retro: [
    "Features were cut from scope after they were built, twice. Schedule and EVM were built on Apr 19–20 and archived on May 9; finance was built on May 11–12 and archived on May 20. When finance was planned, I handed it over with \"do it all; I'll check at the end\". Across the two cuts, 251 files went to the archive.",
    "The documentation once lagged the code. The manual capture script passed over 404 and 403 pages without an error, so the manuals kept pointing at screens for features removed in the daily-report redesign. On May 24 the script was changed to stop at the first failure, and all 12 manuals were rewritten from scratch.",
    "A refactor once removed a check. On May 10, when the trade on a task row became a selectable item, the only check that stopped another project's trade, location or subcontractor ids from going into a report row disappeared. On May 25 a project-scope check went in at save time, covering 7 routes.",
    "The decision log's header says decisions would be revisited and adjusted after phase 7, but there is no record of that review. The gates were only instructions, too. The payroll-advance platform I started afterwards added hooks, a security reviewer, story IDs and decision markers.",
  ],
  code: [
    {
      src: "/img/construction-pmis/code-reporter-unique.png",
      path: "prisma/migrations/…_major_reporter_active_unique/migration.sql",
      caption: "One active reporter per project is enforced in the DB itself, by a partial unique index. An ended designation has effectiveTo set and drops out of the index. (The whole migration.)",
      alt: "A single SQL migration. It creates a unique index on the reporter table keyed by project id, applied only to rows whose end date is empty, that is, the designations active now. So each project can have only one active reporter.",
    },
    {
      src: "/img/construction-pmis/code-document-gate.png",
      path: "src/lib/auth/document-permissions.ts",
      caption: "A document attached to a report follows the report's state: after approval only directors and system admins may edit it, under review nobody may, and in draft or rejected the active reporter may too. (Comments condensed from the source; the source builds each error object inline, folded here into an illustrative deny.)",
      alt: "A function that decides whether a document may be edited. If the document is not attached to a daily report, the usual document rules apply. If it is, the report's state decides: an approved report lets only directors and system admins through, a submitted one lets nobody through, and a draft or rejected one lets through directors, system admins and the project's active reporter.",
    },
    {
      src: "/img/construction-pmis/code-report-mutation.png",
      path: "src/lib/daily-report/mutate.ts",
      caption: "The routes that change a daily report's child rows go through this one function: edit lock, change, edit time if approved, then PDF cache invalidation and the audit log. (Comments condensed from the source; the refusal mapping is folded into an illustrative refuse and the audit-log arguments are written out.)",
      alt: "A function that wraps every change to a daily report's child rows. It first checks the edit lock from the report's state and the caller and returns a refusal if blocked. Otherwise it runs the caller's change, records the last edit time and editor if the report was approved, and finally clears that report's PDF cache and writes the audit log.",
    },
  ],
  gallery: [
    { src: "/img/construction-pmis/shot-2.png", caption: "PDF download dialog on a daily report. Pick one of three languages (Korean, English, Vietnamese), generate, then download. Seed data; logo and vendor names masked.", frame: "laptop" },
  ],
  cover: { src: "/img/construction-pmis/shot-1.png", alt: "Director dashboard: project status, today's report submissions and reports pending review", frame: "laptop" },
};
