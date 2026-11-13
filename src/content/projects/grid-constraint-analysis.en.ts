import type { CaseStudy } from "../types";

// Anonymized: no client, market operator, neighbouring operator, client DB, data vendor, commercial screen, repo, equipment/node/corridor, model or job-title names; no headcount.
// Every sentence and number comes from docs/facts/grid-constraint-analysis.md (D-048, task-16 rulings R1-R11);
// visuals and placement from docs/reviews/2026-11-12-visuals-grid-case.md (figure 1.7 is drawn as paired bars: train and dev).
// Net gain is always rows fixed minus rows broken (R9); the unit is stated once, in the bars source.
// The policy work lives in ai-usage-policy. No sentence says the traders used the memos (R2); no "July" work (R1).
export const gridConstraintAnalysisEn: CaseStudy = {
  kind: "case",
  slug: "grid-constraint-analysis",
  title: "Wholesale power-price analysis pipeline, North America", // M-21 K5: ≤ 60 characters
  tagline: "Built a pipeline that writes transmission-constraint memos, refined it through 22 hypothesis experiments, and rolled back an adopted one on finding the scoring code was not the code that writes the memos.",
  year: 2026,
  domain: "Power market price analysis",
  tags: ["energy", "ai-agents"],
  stack: ["Node.js · TypeScript", "Python (stdlib)", "Claude Code CLI", "Shell", "CSV"],
  facts: {
    period: "Aug – Sep 2026",
    role: "Only human on the build team; designed and ran the AI agent team",
    team: "Me plus AI agents (the only commit author)",
    platforms: "Command-line analysis pipeline · CSV memos · hypothesis experiment harness",
    context: "Client work automating the hand analysis traders did to explain why a transmission constraint bound in a North American wholesale power market",
  },
  metrics: [
    { value: "6 hypotheses adopted", label: "of 22 (6 rejected, 8 open, 2 adopted as input)" }, // M-11 status: grid-constraint-analysis.md:366-367
    { value: "29→46%", label: "lead-trigger hits, one hypothesis (dev; train 22→32%)" }, // M-05: :355
    { value: "−39 pts", label: "agreement, production path (train)" }, // M-05: a level, :351
    { value: "+22 · +13", label: "from the definition split (train · dev)" }, // M-05: a change, :352-354
  ],
  leads: {
    results: "Over 42 days I logged 22 hypothesis experiments, adopting 6 and rejecting 6; one of the rejections is hypothesis 04, which was merged and then rolled back.",
    problem: "The job was to generate, in numbers that can be traced, the \"why did it bind\" memos that traders wrote by hand.",
    role: "I set the direction and made the adopt and roll-back calls; the code and the experiment reports were written almost entirely together with AI agents.",
    decisions: "Four of the six decisions I confirmed or gave as input. The biggest, scoring with the same function production uses, was the agent's move; rolling back hypothesis 04 as a result was my call.",
    quality: "I rejected five hypotheses that won on train and lost on dev, and the limits of this work are written out below.",
    trace: "Hypothesis 04 was adopted, merged and rolled back within a day.",
    retro: "The approval on the old path had no effect on the pipeline output, and that only came out once the scorer matched production.",
  },
  problem: [
    "In North American wholesale power markets, prices split when a transmission constraint binds in the real-time market. The people who watch congestion-price swings analysed \"why did it bind\" by hand and left a memo. The job was to generate that explanation automatically in numbers that can be traced; the output is a CSV with one row per constraint.",
    "For every constraint the memo had to answer three questions in numbers: which price node moves, in which direction and by how much; whether the cause is load or thermal limits, a transmission outage, renewables, a neighbouring corridor or a border flow; and whether the day-ahead market already knew. What the day-ahead market has already priced is not an edge. Causes are classified in a table of six causes (the last being \"no supporting cause\") against three day-ahead columns, and \"no supporting cause\" is not a default: it is what remains after the other causes were tested and all failed.",
    "The reference answers are the traders' past memos, written by hand. On August 11 I surveyed all of them: 1,482 memos and 4,853 cause lines.",
    "The sample was small. Hours bound per constraint have a median of 7, and 0 of 192 exceed 100 hours. On August 28 I diagnosed that regression, ML and hierarchical models were out, leaving only deterministic decomposition, which needs no sample.",
  ],
  visuals: [
    {
      kind: "timeline",
      at: "results",
      title: "42 days and 22 experiments",
      caption: "Over 42 days I logged 22 hypothesis experiments, adopting 6 and rejecting 6; one of the rejections is hypothesis 04, which was merged and then rolled back.",
      stats: [
        { value: "42 days", label: "first commit to last push" },
        { value: "22", label: "logged experiments" },
        { value: "6", label: "adopted" },
      ],
      items: [
        { date: "2026-08-03", label: "First commit" },
        { date: "2026-08-11", label: "Survey of all the traders' memos", note: "1,482 memos and 4,853 cause lines" },
        { date: "2026-08-12", label: "Separate repo for service migration", note: "89 constraint profiles as the regression baseline (through Aug 13); the service itself not started" },
        { date: "2026-08-17", label: "Two CSVs shipped without passing the gate", note: "Steps had been run by hand" },
        { date: "2026-08-18", label: "Publish stamp", note: "Publishing needs a stamp whose note fingerprint matches" },
        { date: "2026-08-19", label: "One entry point and a step-table check", note: "Two-way check between the step table and the script found 4 missing steps" },
        { date: "2026-08-24", label: "Blind by default", note: "So the comparison is not circular" },
        { date: "2026-09-09", label: "Inputs from the client DB first", note: "One DB for collection by Sep 11" },
        { date: "2026-09-13", label: "Hypothesis harness", note: "Pre-register, score on train/dev, verdict; 44 reports across Sep 13–14" },
        { date: "2026-09-14", label: "Hypothesis 04 rolled back", note: "Re-measured on the production path and rejected" },
        { date: "2026-09-14", label: "Last push", note: "6 adopted, 6 rejected, 8 open, 2 taken as inputs" },
      ],
      spans: [
        { from: "2026-08-03", to: "2026-08-12", label: "measuring and surveying" },
        { from: "2026-08-16", to: "2026-08-25", label: "controls and wider analysis" },
        { from: "2026-09-09", to: "2026-09-11", label: "DB first" },
        { from: "2026-09-13", to: "2026-09-14", label: "experiments" },
      ],
    },
    {
      kind: "flow",
      at: "problem",
      title: "From one binding constraint to a memo",
      caption: "One constraint passes 73 calls, an LLM analyse-then-refute step, an independent recomputation and 21 gate checks to become one CSV row, and by design a person puts that row into the system.",
      steps: [
        { id: "ask", label: "Three questions", sub: "Which node moves and by how much · what caused it · did the day-ahead market already know", actor: "system" },
        { id: "collect", label: "Collect one day", sub: "Client DB first, public market and weather feeds as backup; no start without required inputs", actor: "system" },
        { id: "measure", label: "Break it down in numbers", sub: "Outages, load, renewables, neighbouring corridors and cross-border flow in 73 calls; stops at the first failure", actor: "system" },
        { id: "analyst", label: "LLM analyst", sub: "Reviews the draft in 20 parallel lanes; with the next step about 85% of the time", actor: "agent" },
        { id: "refute", label: "LLM refute", sub: "Default verdict REFUTED; CONFIRMED needs a cited source", actor: "agent" },
        { id: "recompute", label: "Independent recomputation", sub: "Counts as passing only if it reproduces 8 past errors", actor: "system" },
        { id: "gate", label: "Gate and stamp", sub: "21 checks; a pass writes a stamp with the note fingerprint, a failure deletes it", actor: "system" },
        { id: "paste", label: "A person", sub: "By design, never written into the system automatically", actor: "human" },
      ],
    },
    {
      kind: "roles",
      at: "role",
      title: "Who decided what",
      caption: "I alone set the direction and made the adopt and roll-back calls, 422 of 433 commits carry the AI co-author mark, and publishing is left to the gate and the stamp.",
      lanes: [
        {
          who: "human",
          label: "Me, the only person",
          items: [
            "Aug 23: the analysis starts only once the required inputs are in",
            "Aug 24: blind by default",
            "Sep 2: critical means a surprise to the day-ahead market; more verdicts at 52% accuracy",
            "Sep 7: fix the pipeline on 4–10-case windows first",
            "Sep 14: opened the holdout once, merged hypothesis 04, then rolled it back",
          ],
        },
        {
          who: "agent",
          label: "AI agent team",
          items: [
            "AI co-author mark on 422 of 433 commits (97.5%)",
            "The author field of all 44 experiment reports points to the AI",
            "Analyse and refute per constraint, 20 parallel lanes",
            "No record of the human-to-AI split",
          ],
        },
        {
          who: "gate",
          label: "Gates",
          items: [
            "Pre-registered; train/dev; holdout once",
            "21 gate checks and a publish stamp",
            "Two-way step-table check",
            "No PRs and no human review on record",
          ],
        },
      ],
    },
    {
      kind: "architecture",
      at: "architecture",
      title: "System architecture",
      caption: "Two inputs merge into one collection step and flow in a single line from front to back, and the hypothesis harness, measured against frozen answers, wires only the changes that pass into that line.",
      cols: 4,
      rows: 4,
      nodes: [
        { id: "db", label: "Client DB", sub: "first source", col: 0, row: 0, group: "data" },
        { id: "collect", label: "Collection", sub: "one day · cache first · lock", col: 1, row: 0, group: "process" },
        { id: "steps", label: "Breakdown steps", sub: "73 calls", col: 2, row: 0, group: "core" },
        { id: "harness", label: "Hypothesis harness", sub: "pre-registered · train/dev", col: 3, row: 0, group: "process" },
        { id: "feeds", label: "Public feeds", sub: "market, weather · backup", col: 0, row: 1, group: "external" },
        { id: "analyst", label: "LLM analyst", sub: "20 parallel lanes", col: 1, row: 1, group: "core" },
        { id: "refute", label: "LLM refute", sub: "default REFUTED", col: 2, row: 1, group: "core" },
        { id: "truth", label: "Frozen answers", sub: "labels from the traders' memos", col: 3, row: 1, group: "data" },
        { id: "stamp", label: "Stamp + CSV", sub: "fingerprint must match", col: 0, row: 2, group: "core" },
        { id: "gate", label: "Gate", sub: "21 checks", col: 1, row: 2, group: "core" },
        { id: "oracle", label: "Independent recomputation", sub: "8-error reproduction test", col: 2, row: 2, group: "core" },
        { id: "trader", label: "A person", sub: "by design, the one who pastes", col: 0, row: 3, group: "human" },
      ],
      edges: [
        { from: "db", to: "collect" },
        { from: "feeds", to: "collect" },
        { from: "collect", to: "steps" },
        { from: "steps", to: "analyst" },
        { from: "analyst", to: "refute" },
        { from: "refute", to: "oracle" },
        { from: "oracle", to: "gate" },
        { from: "gate", to: "stamp" },
        { from: "stamp", to: "trader" },
        { from: "truth", to: "harness" },
        { from: "harness", to: "steps" },
      ],
      notes: {
        db: "When the client DB has the same data, it is the first source. Before switching, I cross-checked the data value by value.",
        feeds: "Backup input for the days the DB does not cover: public market feeds and public weather, renewables and generation data.",
        collect: "Collects one day, uses the cache first and takes a lock. Outage history never trusts an old cache and is fetched fresh. The analysis starts only once the required inputs are in.",
        steps: "Runs fact settling, sensitivity, outage matching and grading (four-axis counterfactual), load, weather, ramp, forecast error and renewables, then flow, neighbouring corridors and trigger notes, in 61 step calls plus 12 soft calls that tolerate partial failure. Stops at the first failure.",
        analyst: "The draft-review step. It runs 20 lanes in parallel, and with the next step it takes about 85% of the time.",
        refute: "Runs in refute mode: the default verdict is REFUTED and CONFIRMED needs a cited source. A numeric sentence without a source cannot enter the claim ledger.",
        harness: "Pre-registers a hypothesis, scores it on train/dev with changes to at most three files, then judges adopt, reject or open. Only adopted changes are wired into the outage-grade, condition and lead-trigger steps. The holdout is opened once, when merging to main.",
        truth: "Labels taken from the traders' past hand-written memos and then frozen. The default run does not read these memos (blind).",
        oracle: "Recomputes separately from the pipeline. It counts as passing only if it reproduces 8 past errors.",
        gate: "The gate has 21 numbered checks. A pass writes a stamp that holds the note fingerprint; a failure deletes it.",
        stamp: "The publish function writes no file unless the stamp and the fingerprint match. One constraint is one CSV row.",
        trader: "By design a person copies and pastes the memo. Nothing is written into the system automatically, and only a person signs in.",
      },
    },
    {
      kind: "flow",
      at: "quality",
      title: "The life of one hypothesis",
      caption: "A hypothesis is registered first, scored on train and dev and given a verdict before it is wired into the pipeline, and the same hypothesis can never be registered twice.",
      steps: [
        { id: "register", label: "Pre-registration", sub: "Hypothesis and verdict criteria written as JSON first", actor: "human" },
        { id: "change", label: "Change", sub: "Three files at most", actor: "agent" },
        { id: "score", label: "Score on train and dev", sub: "Split 60/20/20 by constraint-id hash; two backtests of about 79 seconds per cycle", actor: "system" },
        { id: "verdict", label: "Verdict", sub: "Adopt, reject or open; the unit is a connected component of flipped rows, and dev only confirms direction", actor: "system" },
        { id: "wire", label: "Wire in", sub: "Only adopted changes", actor: "system" },
        { id: "holdout", label: "Holdout once", sub: "Opened once, before merging to main", actor: "human" },
      ],
      loops: [{ from: "verdict", to: "register", label: "next hypothesis (the same one cannot be registered twice)" }],
    },
    {
      kind: "bars",
      at: "quality",
      title: "Five hypotheses that won on train and lost on dev",
      caption: "Five hypotheses had a positive net gain on train but a negative one on dev and were rejected.",
      unit: "rows",
      source: "Net gain = rows fixed − rows broken (the cycle summary table of the experiment registry, 22 rows). Every net gain on this page uses this unit.",
      series: ["train", "dev"],
      bars: [
        { label: "03 outage-repeat proxy", value: 23, value2: -8 },
        { label: "05 two bindings in one outage", value: 16, value2: -5 },
        { label: "10 critical on one overlap", value: 12, value2: -1 },
        { label: "47 binding hours at 80%", value: 9, value2: -2 },
        { label: "29 adaptive training floor", value: 4, value2: -3 },
      ],
    },
    {
      kind: "timeline",
      at: "trace",
      title: "Hypothesis 04, from adoption to roll-back",
      caption: "The approval on the old path had no effect on the pipeline output: only 3 of 50 scored pairs existed in the window verdicts, and once scoring matched production the agreement fell from +4 to −39 points and hypothesis 04 was rolled back.",
      stats: [
        { value: "+4 → −39 pts", label: "agreement, old path to production path" },
        { value: "3 (of 50 pairs)", label: "scored pairs present in window verdicts" },
      ],
      items: [
        { date: "2026-09-13", label: "Hypothesis 04 registered", note: "Raise the \"20x density\" bar so a single overlap with low day-ahead density is not called critical" },
        { date: "2026-09-13", label: "Scored on the old path, adopted", note: "Train net +15 rows (27 to 12), components 13 to 2, p 0.002, dev 6 to 2" },
        { date: "2026-09-14", label: "Holdout opened once, merged", note: "9 fixed, 6 broken, p 0.34: the same direction, p above the 0.05 bar" },
        { date: "2026-09-14", label: "Path mismatch found", note: "Only 3 of 50 pairs exist in the window verdicts" },
        { date: "2026-09-14", label: "Scored with the production function", note: "Scoring becomes +1, 0, −1; agreement +4 to −39 points" },
        { date: "2026-09-14", label: "Re-measured on the production path, rejected and rolled back", note: "Only 1 train row and 1 dev row moved, both for the worse" },
        { date: "2026-09-14", label: "Outage grade redefined", note: "Grade is physical necessity, advance notice an attribute; agreement up 22 points on train, 13 on dev" },
      ],
      spans: [{ from: "2026-09-13", to: "2026-09-14", label: "adoption to roll-back" }],
    },
  ],
  myRole: [
    "I am the commit author of all 433 commits in this repo, and there are no commits, PRs or reviews from another person. 422 of the 433 (97.5%) carry an AI co-author mark, and the author field of all 44 experiment reports points to the AI. There is no record of how the writing was split between me and the AI, so the role is not \"wrote it myself\" but \"designed and ran the AI agent team\".",
    "What I decided is recorded in the documents with dates. Outage history never trusts an old cache and is fetched fresh (Aug 17). The analysis starts only once the required inputs are in (Aug 23). Reference memos are not read by default (Aug 24). The definition of critical and the scoring rule (Sep 2). The pipeline is fixed on small windows first (Sep 7). And three on September 14: take from the client DB first, adopt experiment 16, which switched an input to the DB, and open the holdout once before merging hypothesis 04, then roll it back.",
    "I built four things. The analysis pipeline: from one entry point, a day's collection and 73 calls, two LLM review steps (analyse, refute), an independent recomputation, 21 gate checks and a publish stamp, ending in a CSV. The memo, whose lint fails raw decimal notation. The hypothesis harness, which scores six memo segments separately. And a separate repository holding the pipeline for service migration: its README lists the pipeline at 15 steps, and it uses 89 constraint profiles as a regression baseline. The service itself was not started.",
    "I also set the working rules. Only a person signs in or authenticates, the pipeline never writes into the system's memo field and only produces output, and fixes start on 4–10-case windows. These rules are written down as standing instructions.",
  ],
  decisions: [
    {
      setBy: "own-confirmed", // Task 13c M-03
      title: "The unit of adoption: a 60/20/20 split by constraint-id hash, connected components of flipped rows",
      problem: "To judge whether a hypothesis really improved things, I first had to decide what counts as one unit and how to split the data. The sample was small, so the statistics wobbled easily.",
      options: [
        "A 4–10-case pilot window as the unit (v1): drawing 1,000 subsets of 8 cases put the quartiles of critical precision at 0.33, 0.50 and 0.75, a 42-point spread, so it was unfit",
        "Split by connected components of the whole corpus (v6): one giant component swallowed 33–71% of the pairs, so it was dropped",
        "A 60/20/20 split by constraint-id hash; the unit is a connected component of flipped rows; dev only confirms direction",
      ],
      chosen: 2,
      decision: "I split train, dev and holdout 60/20/20 by constraint-id hash. The unit of adoption is a connected component of flipped rows grouped by the same constraint, ticket and equipment. Dev only confirms direction, and a power model sets the minimum effect (11 rows on train, later 14).",
      result: "The first power model treated rows as independent, which inflated the power to 96%; I fixed it with a per-ticket model. This frame was used to judge the 22 hypotheses.",
      cost: "Dev only confirms direction, so the evidence that a change generalises is weak. Adopting hypothesis 04 rested on 4 dev components, p 0.25. Each cycle runs two backtests of about 79 seconds.",
    },
    {
      setBy: "own-confirmed", // Task 13c M-03
      title: "Scoring rule: right +1, abstain 0, wrong −WRONG_COST",
      problem: "To tell whether a hypothesis that issues more verdicts is a good one, the cost of a wrong verdict had to be in the score.",
      options: [
        "Two cells, right or not right: turning an abstain into a wrong answer loses nothing, so guessing is free",
        "Right +1, abstain or unscored 0, wrong −WRONG_COST (WRONG_COST = 1)",
      ],
      chosen: 1,
      decision: "Per row: right +1, abstain or unscored 0, wrong −WRONG_COST. The wrong-answer cost sets the accuracy bar for a new verdict (WRONG_COST ÷ (1 + WRONG_COST)), and turning a verdict back into an abstain earns the same. On September 2 I chose the side that issues more verdicts at 52% accuracy and set the cost to 1.",
      result: "Under the earlier rule, turning 72 abstains in train into supporting would have been adopted 45 to 0 while publishing 27 wrong answers. After the rule changed, that example fell to open (+18 against a minimum effect of 27 points). Hypotheses 03 to 05 got the same verdict at a wrong-answer cost of 1 and 2.",
      cost: "Whether to raise the wrong-answer cost to 2 is still open. Raising it would need 67% accuracy for a new verdict.",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      title: "Score with the same function the pipeline uses",
      problem: "Hypothesis 04 had been adopted and merged into main, but the path the backtest scored was not the production path.",
      options: [
        "The backtest chains candidate ranking, flow gate and onset gate in its own order, and misses the matched control group, the planned-outage cap, the neighbouring-corridor test, the abstain for uncollected history and the link ceiling that production applies (the old way)",
        "The backtest and production call the same grading function; only the input differs",
      ],
      chosen: 1,
      decision: "I merged the outage-grade logic into one function that the backtest and production both call. Only the input differs (observation days, that day's 5-minute stamps and so on). Every score since then is taken on the production path.",
      result: "Measured on the same basis, the agreement fell from +4 points (51%) to −39 points (35%, 5 of 10 critical right). Hypothesis 04, adopted earlier, moved only 1 train row and 1 dev row on the production path, both for the worse, so I rejected it and rolled it back.",
      cost: "That the work starts at −39 points is a weakness of this model.",
    },
    {
      setBy: "own-confirmed", // Task 13c M-03
      title: "Outage grade is physical necessity; advance notice is a separate attribute",
      problem: "The September 2 rule did not let a pre-announced outage be called critical. One cell folded two questions together: \"would it have bound without this outage\" and \"did the day-ahead market know\".",
      options: [
        "The September 2 rule: a pre-announced outage cannot be critical (only a surprise to the day-ahead market is critical)",
        "The grade is physical necessity only; whether it was announced goes at the end of the note line as a separate fact",
      ],
      chosen: 1,
      decision: "The grade is decided only by \"would it have bound without this outage\", and whether it was announced is written separately at the end of the note line.",
      result: "The split raised the memo agreement by 22 points on train and 13 on dev, and critical precision rose from 55% to 64%.",
      cost: "As a definition decision it was applied at p 0.068, short of the 0.05 bar for adopting a hypothesis. On the production path critical recall only goes from 2% to 9% (27 of 303).",
    },
    {
      setBy: "own-input", // Task 13c M-03
      title: "Do not read the traders' memos by default (blind)",
      problem: "The reference answers are the traders' memos, and if the analysis reads the same memos the comparison becomes circular.",
      options: [
        "Read the memos as input and switch them off with an option (the old default)",
        "The default run never reads the memos; an option switches them on",
      ],
      chosen: 1,
      decision: "I changed the default on August 24. The old commands keep working.",
      result: "Two leaks of the blind were measured. With only an environment variable set, two tools still read the memos (measured on September 5), and the same sentences sat inside an input dump. I named three doors as forbidden (the memo cache, the author block of the input dump, external viewing) and passed the switch only as an argument flag.",
      cost: "The generation-outage axis always abstains and the outage grade stands on the four-axis counterfactual alone, so a note with a dead axis becomes normal operation. Why a note got shorter has to be left in a sidecar.",
    },
    {
      setBy: "agent-default", // Task 13c M-03
      title: "Publishing requires the gate stamp",
      problem: "On August 17 two CSVs that had not passed the gate were published. The steps had been listed and run by hand, and 14 of 20 working directories had no step log.",
      options: [
        "A person watches each step's exit code (a rule that existed only on paper)",
        "A pass writes a stamp that holds the note fingerprint, and the publish function checks the stamp and the fingerprint",
      ],
      chosen: 1,
      decision: "When the gate passes it writes a stamp with the note fingerprint, and a failure deletes it. The publish function writes no file unless the stamp and the fingerprint match. Four tests cover it: no stamp, normal, note changed after approval, and a failed pass.",
      result: "I added the publish stamp on August 18, and on the 19th a single entry point and a two-way step-table check. That check found 4 steps that had been missing.",
      cost: "The stamp guarantees only that \"it passed\". The items still marked \"person\" in the rules document are the next work list.",
    },
  ],
  quality: [
    "I measured quality with the hypothesis harness. The 22 hypotheses came out as 6 adopted, 6 rejected, 8 open and 2 adopted as input (counted by hand from the 22 rows of the experiment table). Every number on this page is a value left in an experiment report or its result JSON; I did not re-run them for this write-up.",
    "What this method caught was false improvements. Five hypotheses were positive on train and negative on dev, so I rejected them; judged on train scores alone they might have been adopted. Some gains held on both, such as experiment 45 (wind-forecast variables from a neighbouring region). The lead-trigger hit rate rose from 22% to 32% on train and from 29% to 46% on dev, with a net gain of +57 rows on train and +27 on dev. Rows where the wind condition was on had 103 hits against 51 misses (67%), and the other conditions 36%.",
    "There are limits I will not hide. Experiment 49 (hold off when a connected outage is mostly scheduled over the next 90 days) was adopted at +59 rows on train, but its dev net gain is 0, and the report itself says the effect shows only on train. The three experiments that switched outage inputs to the client DB did not raise the net gain (rows), and on the production path critical recall for outages is 9%. The agreement started at −39 points. Eight hypotheses are still open.",
    "Checks were built up item by item: 19 input-contract checks, the rule \"a tool's silence is not the data's silence\", and an independent recomputation that passes only if it reproduces 8 past errors. A numeric sentence without a source cannot enter the claim ledger, and what is not in the ledger cannot reach a report. The step table and the script are checked against each other in both directions.",
    "On tests: 110 of the 123 Python tools carry a self-test string. I made no run record this time, so I give no pass count. One 4–10-case window takes about 20 minutes, and a 69-case window takes more than an hour in the LLM steps alone. Running the same window five times, four runs were cut off by a limit or by the gate.",
  ],
  trace: {
    intro: "This follows one hypothesis from registration to roll-back in a day. The question of the trace is: when did I learn that an approved improvement had changed nothing in production?",
    steps: [
      {
        step: "① Hypothesis 04 registered (Sep 13)",
        evidence: "The hypothesis raises the \"20x density\" bar so that a single overlap with low day-ahead density is not called critical.",
      },
      {
        step: "② Scored on the old path, adopted (Sep 13)",
        evidence: "Train net +15 rows (27 to 12), components 13 to 2, p 0.002, dev 6 to 2. Adopted.",
      },
      {
        step: "③ Holdout opened once, merged (Sep 14)",
        evidence: "Before merging to main I opened the holdout once. 9 fixed, 6 broken, p 0.34: the same direction but not significant, and I merged it as it stood.",
      },
      {
        step: "④ Path mismatch found (Sep 14)",
        evidence: "Of the 50 pairs the backtest scored, only 3 existed in the production window verdicts. The scored path and the production path differed.",
      },
      {
        step: "⑤ Scored with the production function (Sep 14)",
        evidence: "I changed the scoring rule to right +1, abstain 0, wrong −1 and scored with the same grading function as production; the agreement fell from +4 to −39 points.",
      },
      {
        step: "⑥ Re-measured on the production path, rejected and rolled back (Sep 14)",
        evidence: "Measuring hypothesis 04 again on the production path moved only 1 train row and 1 dev row, both for the worse. I rejected it and rolled it back.",
      },
      {
        step: "⑦ Outage grade redefined (Sep 14)",
        evidence: "I split the grade (physical necessity) from the advance-notice attribute. The agreement rose by 22 points on train and 13 on dev.",
      },
    ],
  },
  results: [
    "Every client change request was shipped within 24 hours.",
    "From the first commit on August 3 to the last push on September 14, 42 days, I logged 22 hypothesis experiments: 6 adopted and 6 rejected, with 8 open and 2 adopted as input.",
    "Experiment 45 raised the lead-trigger hit rate from 22% to 32% on train and from 29% to 46% on dev.",
    "Scoring with the same function as production exposed the memo agreement at −39 points on train; splitting the outage grade's definition then raised it by 22 points on train and 13 on dev (the effect of a definition change, not of an adopted hypothesis). On the production path critical recall for outages went from 2% to 9%.",
    "I rejected five hypotheses that won on train and lost on dev. Experiment 49 was adopted with a dev net gain of 0.",
    "Whether the traders actually used these CSV memos is not recorded in the repo. The result stops at what was built and what was measured.",
  ],
  retro: [
    "An approved improvement had no effect on the pipeline output. I merged hypothesis 04 although its holdout was not significant (p 0.34), and that the backtest scored a different path than production only came out once the scorer matched production. Since then every score is taken on the production path.",
    "On August 17 I listed and ran the steps by hand, and two CSVs that had not passed the gate were published. The rule was in a document but nothing checked it. I replaced it with the publish stamp and a two-way step-table check, and split the skill document, which had grown to 1,523 lines, into run order, rules with checks, and an incident log.",
    "Things have passed while hollow. All 233 binding days were \"no supporting cause\" and the check still passed, the linter failed to load and reported \"0 violations\", and a travel-leg feed missing 5 days kept the same file name and flipped a threshold verdict. That led to the input-contract checks and the rule that a tool's silence is not the data's silence.",
    "Explanations I wrote without checking were wrong twice in a day. I then set a rule to write down the whole state before answering. Running a big window (69 cases) repeatedly and being cut off by a limit led to the rule of fixing on small windows first.",
    "Some things are still open: 8 open hypotheses, the decision on raising the wrong-answer cost to 2, critical recall for outages that stays at 9% on the production path, and experiment 49 with a dev net gain of 0.",
  ],
  code: [
    {
      src: "/img/grid-constraint-analysis/code-same-grade.png",
      path: "tools/batch/outage_class.py",
      caption: "Production and scoring call the same grading function and only the input differs. The docstring lists the checks the old backtest skipped. (Docstring condensed)",
      alt: "The head of the function that decides the final grade of an outage candidate. Its docstring explains why scoring and production were made to call the same function, the five checks the old backtest skipped, and the inputs that differ by call site.",
    },
    {
      src: "/img/grid-constraint-analysis/code-score-rule.png",
      path: "tools/batch/scorecard.py",
      caption: "A right grade is +1, an abstain 0 and a wrong grade −WRONG_COST. The wrong-answer cost sets the accuracy bar for a new verdict. (Comment condensed)",
      alt: "A constant and a short function holding the scoring rule. A comment gives the basis for the wrong-answer cost, and the function returns 0 when the grade is not a verdict, 1 when it equals the memo and minus the wrong-answer cost otherwise.",
    },
  ],
  gallery: [],
};
