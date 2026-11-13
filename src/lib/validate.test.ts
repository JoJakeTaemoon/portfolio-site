// Run: npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import type { BarsVisual, Brief, CaseStudy, HarnessRow, ProcessPage, Project, TimelineVisual } from "../content/types.ts";
import { harnessProblems, pairProblems, processProblems, projectProblems } from "./validate.ts";

const bars = (): BarsVisual => ({ kind: "bars", title: "t", caption: "c", unit: "u", source: "s", bars: [{ label: "a", value: 1 }] });

const base = {
  title: "t",
  tagline: "t",
  year: 2026,
  domain: "d",
  stack: ["x"],
  facts: { period: "p", role: "r", team: "t", platforms: "p", context: "c" },
  code: [],
  gallery: [],
};

function caseFixture(): CaseStudy {
  return {
    ...base,
    kind: "case",
    slug: "ewa",
    tags: ["fintech"],
    metrics: [
      { value: "174", label: "a" },
      { value: "2", label: "b" },
      { value: "3", label: "c" },
      { value: "4", label: "d" },
    ],
    visuals: [
      { kind: "architecture", title: "t", caption: "c", cols: 1, rows: 1, nodes: [{ id: "a", label: "a", col: 0, row: 0 }], edges: [], notes: {} },
      { kind: "flow", title: "t", caption: "c", steps: [{ id: "a", label: "a" }] },
      { kind: "timeline", title: "t", caption: "c", items: [{ date: "2026-06-13", label: "a" }, { date: "2026-07", label: "b" }] },
    ],
    problem: ["p"],
    myRole: ["r"],
    decisions: [{ title: "t", problem: "p", options: ["o"], decision: "d", result: "r" }],
    quality: ["q"],
    trace: { intro: "i", steps: [{ step: "s", evidence: "e" }] },
    results: ["r"],
    retro: ["r"],
  };
}

function briefFixture(): Brief {
  return { ...base, kind: "brief", slug: "gw", tags: ["commerce"], metrics: [], visuals: [bars()], problem: ["p"], built: ["b"], results: ["r"] };
}

const timelineOf = (p: Project) => p.visuals.find((v): v is TimelineVisual => v.kind === "timeline")!;

test("case needs architecture, flow and timeline", () => {
  const p = caseFixture(); p.visuals = [bars(), bars(), bars()];
  assert.deepEqual(projectProblems(p).sort(), ["ewa: missing architecture visual", "ewa: missing flow visual", "ewa: missing timeline visual"]);
});

test("timeline dates are YYYY-MM[-DD] and ascending", () => {
  const p = caseFixture(); timelineOf(p).items = [{ date: "2026-07", label: "b" }, { date: "2026-06", label: "a" }];
  assert.deepEqual(projectProblems(p), ["ewa: timeline dates not ascending"]);
  timelineOf(p).items = [{ date: "June", label: "a" }];
  assert.deepEqual(projectProblems(p), ["ewa: bad timeline date \"June\""]);
});

test("timeline spans: dates, order, range, ko/en count", () => {
  const p = caseFixture(); // items 2026-06-13 .. 2026-07
  const t = timelineOf(p);
  t.spans = [{ from: "2026-06-13", to: "2026-06-20", label: "ok" }];
  assert.deepEqual(projectProblems(p), []);
  t.spans = [{ from: "June", to: "2026-06-20", label: "x" }];
  assert.deepEqual(projectProblems(p), ['ewa: bad span date "June" - "2026-06-20"']);
  t.spans = [{ from: "2026-06-20", to: "2026-06-14", label: "x" }];
  assert.deepEqual(projectProblems(p), ['ewa: span "x" from is after to']);
  t.spans = [{ from: "2026-06-01", to: "2026-06-20", label: "early" }];
  assert.deepEqual(projectProblems(p), ['ewa: span "early" is outside the timeline range']);
  t.spans = [{ from: "2026-06-20", to: "2026-07-02", label: "late" }];
  assert.deepEqual(projectProblems(p), ['ewa: span "late" is outside the timeline range']);
  const en = caseFixture();
  assert.deepEqual(pairProblems(p, en), ["ewa: timeline 3 spans differ (2026-06-20..2026-07-02 vs )"]);
  timelineOf(en).spans = [{ from: "2026-06-20", to: "2026-07-01", label: "x" }];
  assert.deepEqual(pairProblems(p, en), ["ewa: timeline 3 spans differ (2026-06-20..2026-07-02 vs 2026-06-20..2026-07-01)"]);
  timelineOf(p).items = [];
  assert.ok(projectProblems(p).includes("ewa: timeline without items"));
});

test("bars max must cover every value", () => {
  const p = briefFixture(); p.visuals = [{ ...bars(), max: 100, bars: [{ label: "a", value: 83 }, { label: "b", value: 101 }] }];
  assert.deepEqual(projectProblems(p), ["gw: bar value above max"]);
});

test("bars need a source and non-negative values", () => {
  const p = briefFixture(); p.visuals = [{ ...bars(), source: "", bars: [{ label: "x", value: -1 }] }];
  assert.deepEqual(projectProblems(p).sort(), ["gw: bars without source", "gw: negative bar value"]);
});

test("paired bars: series allows negatives, needs value2 on every row", () => {
  const p = briefFixture();
  p.visuals = [{ ...bars(), series: ["train", "dev"], bars: [{ label: "a", value: 23, value2: -8 }, { label: "b", value: 12, value2: 4 }] }];
  assert.deepEqual(projectProblems(p), []);
  p.visuals = [{ ...bars(), series: ["train", "dev"], bars: [{ label: "a", value: 23 }] }];
  assert.deepEqual(projectProblems(p), ["gw: bars series without value2"]);
  p.visuals = [{ ...bars(), bars: [{ label: "a", value: 23, value2: 1 }] }];
  assert.deepEqual(projectProblems(p), ["gw: bars value2 without series"]);
});

test("empty caption or code alt is a problem", () => {
  const p = briefFixture(); p.visuals[0].caption = ""; p.code = [{ src: "/img/gw/code-a.png", path: "src/a.ts", caption: "c", alt: "" }];
  assert.deepEqual(projectProblems(p).sort(), ["gw: code image without alt", "gw: visual without caption"]);
});

test("gallery: caption required, frame is laptop or phone, ko/en frames match", () => {
  const p = briefFixture(), en = briefFixture();
  p.gallery = [{ src: "/img/gw/a.png", caption: "c", frame: "laptop" }]; en.gallery = [{ src: "/img/gw/a.png", caption: "c", frame: "laptop" }];
  assert.deepEqual(projectProblems(p), []);
  assert.deepEqual(pairProblems(p, en), []);
  en.gallery[0].frame = "phone";
  assert.deepEqual(pairProblems(p, en), ["gw: gallery frames differ (/img/gw/a.png:laptop vs /img/gw/a.png:phone)"]);
  p.gallery = [{ src: "/img/gw/a.png", caption: " ", frame: "tablet" as "phone" }];
  assert.deepEqual(projectProblems(p).sort(), ["gw: gallery frame \"tablet\" is not laptop or phone", "gw: gallery image without caption"]);
});

test("valid fixtures have no problems", () => { assert.deepEqual(projectProblems(caseFixture()), []); assert.deepEqual(projectProblems(briefFixture()), []); });

test("ko/en must match in shape and numbers", () => {
  const ko = caseFixture(), en = caseFixture();
  en.visuals = en.visuals.slice(0, 3) as typeof en.visuals; ko.visuals.push(bars());
  en.metrics[0] = { ...en.metrics[0], value: "175" };
  assert.deepEqual(pairProblems(ko, en).sort(), ["ewa: metric 1 differs (174 vs 175)", "ewa: visuals differ (architecture,flow,timeline,bars vs architecture,flow,timeline)"]);
});

test("metric values compare by number, not wording", () => {
  const ko = caseFixture(), en = caseFixture();
  ko.metrics[2] = { ...ko.metrics[2], value: "약 7,000" };
  en.metrics[2] = { ...en.metrics[2], value: "~7,000" };
  assert.deepEqual(pairProblems(ko, en), []);
});

test("ko/en bars values must match", () => {
  const ko = briefFixture(), en = briefFixture();
  en.visuals = [{ ...bars(), bars: [{ label: "a", value: 2 }] }];
  assert.deepEqual(pairProblems(ko, en), ["gw: bars 1 values differ (1 vs 2)"]);
});

// D-038 / R-02: text inside a figure is 해라체, so 합쇼체 endings fail.
test("figure text must not end with 니다.", () => {
  const p = caseFixture();
  p.visuals[0].caption = "API 하나를 씁니다.";
  if (p.visuals[0].kind === "architecture") p.visuals[0].notes = { a: "앱 모델은 손으로 작성한다.", b: "고객사 제품입니다." };
  timelineOf(p).items[0].note = "명세를 합쳤습니다.";
  p.code = [{ src: "/img/ewa/code-a.png", path: "src/a.ts", caption: "돈을 옮깁니다.", alt: "a" }];
  assert.deepEqual(projectProblems(p), [
    'ewa: figure text must be 해라체, not 합쇼체: "API 하나를 씁니다."',
    'ewa: figure text must be 해라체, not 합쇼체: "고객사 제품입니다."',
    'ewa: figure text must be 해라체, not 합쇼체: "명세를 합쳤습니다."',
    'ewa: figure text must be 해라체, not 합쇼체: "돈을 옮깁니다."',
  ]);
  const b = briefFixture(); b.visuals = [{ ...bars(), source: "실행 결과입니다." }];
  assert.deepEqual(projectProblems(b), ['gw: figure text must be 해라체, not 합쇼체: "실행 결과입니다."']);
});

// M-12: paths go in CodeShot.path; no markdown in captions.
test("captions have no backticks", () => {
  const p = briefFixture(); p.visuals[0].caption = "`src/x.ts` — c"; p.code = [{ src: "/img/gw/code-a.png", path: "src/x.ts", caption: "see `x`", alt: "a" }];
  assert.deepEqual(projectProblems(p), ['gw: backtick in caption "`src/x.ts` — c"', 'gw: backtick in caption "see `x`"']);
});

// D-032 / M-18: short pages stay short.
test("brief: problem <= 2 paragraphs, built <= 5 items", () => {
  const p = briefFixture(); p.problem = ["a", "b", "c"]; p.built = ["1", "2", "3", "4", "5", "6"];
  assert.deepEqual(projectProblems(p), ["gw: problem has 3 paragraphs (max 2)", "gw: built has 6 items (max 5)"]);
});

// D-030 / M-08: a visual must land in a section the case renders.
test("case visual placement: at is a case section, after is a decision id", () => {
  const p = caseFixture();
  p.decisions[0].id = "D-1";
  p.visuals[0].at = "built";
  p.visuals[1].after = "D-9";
  assert.deepEqual(projectProblems(p), ['ewa: visual "t" at "built" is not a case section', 'ewa: visual "t" after unknown decision "D-9"']);
  p.visuals[0].at = "problem"; p.visuals[1].after = "D-1";
  assert.deepEqual(projectProblems(p), []);
});

// D-031 / M-09: `chosen` points at one of 2+ shown options.
test("decision chosen must index a shown option", () => {
  const p = caseFixture();
  p.decisions = [
    { title: "one", problem: "p", options: ["o"], chosen: 0, decision: "d", result: "r" },
    { title: "two", problem: "p", options: ["a", "b"], chosen: 2, decision: "d", result: "r" },
    { title: "ok", problem: "p", options: ["a", "b"], chosen: 1, decision: "d", result: "r" },
  ];
  assert.deepEqual(projectProblems(p), ['ewa: decision "one": chosen 0 is not one of 2+ options', 'ewa: decision "two": chosen 2 is not one of 2+ options']);
  const b = briefFixture(); b.decision = { title: "b", problem: "p", chosen: 0, decision: "d", result: "r" };
  assert.deepEqual(projectProblems(b), ['gw: decision "b": chosen 0 is not one of 2+ options']);
});

test("ko/en must place visuals the same way and match the brief decision", () => {
  const ko = caseFixture(), en = caseFixture();
  ko.decisions[0].id = "D-1"; en.decisions[0].id = "D-1";
  ko.visuals[1].after = "D-1";
  assert.deepEqual(pairProblems(ko, en), ["ewa: visual placement differs (architecture,decisions>D-1,results vs architecture,decisions,results)"]);
  const kb = briefFixture(), eb = briefFixture();
  kb.decision = { title: "b", problem: "p", decision: "d", result: "r" };
  assert.deepEqual(pairProblems(kb, eb), ["gw: decision count differs (1 vs 0)"]);
});

// Review round 1, finding 1: pairs also compare the structure fields.
test("ko/en must match decision options, chosen, cost, code paths and leads keys", () => {
  const ko = caseFixture(), en = caseFixture();
  ko.decisions[0] = { title: "t", problem: "p", options: ["a", "b"], chosen: 0, decision: "d", result: "r", cost: "c" };
  en.decisions[0] = { title: "t", problem: "p", options: ["a", "b", "c"], chosen: 1, decision: "d", result: "r" };
  ko.code = [{ src: "/i/a.png", path: "src/a.ts", caption: "c", alt: "a" }];
  en.code = [{ src: "/i/a.png", path: "src/b.ts", caption: "c", alt: "a" }];
  ko.leads = { results: "x" }; en.leads = { problem: "x" };
  assert.deepEqual(pairProblems(ko, en), [
    "ewa: decision 1 option count differs (2 vs 3)",
    "ewa: decision 1 chosen differs (0 vs 1)",
    "ewa: decision 1 cost presence differs (true vs false)",
    "ewa: code paths differ (src/a.ts vs src/b.ts)",
    "ewa: leads keys differ (results vs problem)",
  ]);
});

// Finding 3-5: placement guards.
test("visual cannot have both at and after, nor sit in a section that will not render", () => {
  const p = caseFixture();
  p.decisions[0].id = "D-1";
  p.visuals[1].at = "problem"; p.visuals[1].after = "D-1";
  assert.deepEqual(projectProblems(p), ['ewa: visual "t" has both at and after']);
  p.visuals[1] = { ...p.visuals[1], at: undefined, after: undefined };
  p.results = []; p.visuals[0].at = "gallery";
  assert.deepEqual(projectProblems(p).sort(), ['ewa: visual "t" is in "gallery", which has no content to render', 'ewa: visual "t" is in "results", which has no content to render']);
});

// Finding 6: flow step sub and roles items are figure text.
test("flow step sub and roles lane items must be 해라체", () => {
  const p = caseFixture();
  p.visuals.push({ kind: "flow", title: "f", caption: "c", steps: [{ id: "a", label: "a", sub: "돈을 옮깁니다." }] });
  p.visuals.push({ kind: "roles", title: "r", caption: "c", lanes: [{ who: "human", label: "l", items: ["승인합니다."] }] });
  assert.deepEqual(projectProblems(p), [
    'ewa: figure text must be 해라체, not 합쇼체: "돈을 옮깁니다."',
    'ewa: figure text must be 해라체, not 합쇼체: "승인합니다."',
  ]);
});

// Finding 2: the /process figure follows D-038 too.
test("process pipeline notes, node sub and edge labels must be 해라체", () => {
  const pipe = { intro: "i", cols: 1, rows: 1, nodes: [{ id: "a", label: "a", sub: "확인합니다.", col: 0, row: 0 }], edges: [{ from: "a", to: "a", label: "반려합니다." }], notes: { a: "본다.", b: "봅니다." } };
  const page = { title: "t", lead: "l", pipelineTitle: "p", mapBand: "b", pipeline: pipe, practices: [], gates: [], harness: { title: "h", intro: "", cols: { project: "", roles: "", enforced: "", gate: "", changed: "" }, rows: [] } };
  assert.deepEqual(processProblems(page, "ko"), [
    'process (ko): figure text must be 해라체, not 합쇼체: "봅니다."',
    'process (ko): figure text must be 해라체, not 합쇼체: "확인합니다."',
    'process (ko): figure text must be 해라체, not 합쇼체: "반려합니다."',
  ]);
});

// Task 11c: a brief renders visuals only in "visuals" (default) or "results".
test("brief visual placement: only visuals/results, no after, results needs content", () => {
  const b = briefFixture();
  b.visuals = [{ ...bars(), at: "results" }];
  assert.deepEqual(projectProblems(b), []);
  b.visuals = [{ ...bars(), at: "quality" }, { ...bars(), at: "visuals", after: "D-1" }];
  assert.deepEqual(projectProblems(b), ['gw: visual "t" at "quality" is not rendered by a brief (visuals, results)', 'gw: visual "t" has after, which a brief does not render']);
  b.visuals = [{ ...bars(), at: "results" }];
  b.results = [];
  assert.deepEqual(projectProblems(b), ['gw: visual "t" is in "results", which has no content to render']);
});

test("process pipeline intro must be 해라체 too", () => {
  const pipe = { intro: "지나갑니다.", cols: 1, rows: 1, nodes: [{ id: "a", label: "a", col: 0, row: 0 }], edges: [], notes: {} };
  const page = { title: "t", lead: "l", pipelineTitle: "p", mapBand: "b", pipeline: pipe, practices: [], gates: [], harness: { title: "h", intro: "", cols: { project: "", roles: "", enforced: "", gate: "", changed: "" }, rows: [] } };
  assert.deepEqual(processProblems(page, "ko"), ['process (ko): figure text must be 해라체, not 합쇼체: "지나갑니다."']);
});

test("timeline stats: 1-3 chips, ko/en numbers match", () => {
  const p = caseFixture();
  const t = timelineOf(p);
  t.stats = [{ value: "123일", label: "첫 커밋 → 실사용" }, { value: "26일", label: "이전" }];
  assert.deepEqual(projectProblems(p), []);
  const en = caseFixture();
  timelineOf(en).stats = [{ value: "123 days", label: "to use" }, { value: "26 days", label: "later" }];
  assert.deepEqual(pairProblems(p, en), []);
  timelineOf(en).stats = [{ value: "123 days", label: "to use" }];
  assert.deepEqual(pairProblems(p, en), ["ewa: timeline 3 stats differ (123,26 vs 123)"]);
  t.stats = [];
  assert.deepEqual(projectProblems(p), ['ewa: timeline "t" has 0 stats (1-3)']);
  t.stats = [1, 2, 3, 4].map((n) => ({ value: String(n), label: "x" }));
  assert.deepEqual(projectProblems(p), ['ewa: timeline "t" has 4 stats (1-3)']);
});

// Task 13a, M-03: who set a decision is the same in ko and en (an absent value is "none").
test("decision setBy must match between ko and en", () => {
  const ko = caseFixture();
  const en = caseFixture();
  ko.decisions[0].setBy = "own-input";
  assert.deepEqual(pairProblems(ko, en), ["ewa: decision 1 setBy differs (own-input vs none)"]);
  en.decisions[0].setBy = "own-input";
  assert.deepEqual(pairProblems(ko, en), []);
});

// Task 13a, M-11: a case's first metric is its status on one line (ko 12, en 26 characters).
test("case status metric fits its line", () => {
  const ko = caseFixture();
  const en = caseFixture();
  ko.metrics[0] = { value: "6건 채택 · 가설 22건 중", label: "a" }; // 15
  en.metrics[0] = { value: "6 of 22 hypotheses adopted", label: "a" }; // 26
  assert.deepEqual(pairProblems(ko, en), ['ewa: metric 1 "6건 채택 · 가설 22건 중" over 12 characters (ko)']);
  en.metrics[0] = { value: "6 of 22 hypotheses adopted!", label: "a" };
  assert.equal(pairProblems(ko, en).length, 2);
});

// Task 13a, R-06: a roles lane carries 1-2 stats, and ko and en carry the same numbers.
test("roles lane stats: 1-2, ko/en numbers match", () => {
  const lane = (stats: { value: string; label: string }[]) => ({ kind: "roles" as const, title: "t", caption: "c", lanes: [{ who: "agent" as const, label: "a", stats, items: ["x"] }] });
  const ko = caseFixture();
  const en = caseFixture();
  ko.visuals.push(lane([{ value: "9", label: "역할" }, { value: "87%", label: "a" }, { value: "4", label: "b" }]));
  en.visuals.push(lane([{ value: "9", label: "roles" }]));
  assert.deepEqual(projectProblems(ko), ['ewa: roles lane "a" has 3 stats (1-2)']);
  assert.deepEqual(pairProblems(ko, en), ["ewa: roles 4 lane stats differ (9+87+4 vs 9)"]);
});

// Task 13a, M-12: six case rows, same order and chips in ko and en, 1-2 gates, cells within their widths.
test("harness table: rows, cases, gates, widths, ko/en order", () => {
  const row = (slug: string, gate: HarnessRow["gate"] = [{ who: "me", text: "g" }]): HarnessRow => ({ slug, roles: "r", enforced: "e", gate, changed: "c" });
  const cases = ["a", "b", "c", "d", "e", "f"];
  const page = (rows: HarnessRow[]) => ({ harness: { title: "t", intro: "", focus: "c", cols: { project: "", roles: "", enforced: "", gate: "", changed: "" }, rows } }) as unknown as ProcessPage;
  assert.deepEqual(harnessProblems(page(cases.map((s) => row(s))), page(cases.map((s) => row(s))), cases), []);
  const ko = cases.map((s) => row(s));
  ko[0] = { ...row("x", []), roles: "열여섯 글자를 넘는 역할 칸의 긴 글" };
  const out = harnessProblems(page(ko.slice(0, 5).concat(row("f"))), page(cases.map((s) => row(s))), cases);
  assert.ok(out.includes('process harness (ko): "x" is not a case'));
  assert.ok(out.includes("process harness (ko): x: 0 last gates (1-2)"));
  assert.ok(out.some((m) => m.startsWith("process harness (ko): x: roles")));
  assert.ok(out.some((m) => m.startsWith("process harness: ko and en rows differ")));
  assert.deepEqual(harnessProblems(page(cases.slice(1).map((s) => row(s))), page(cases.slice(1).map((s) => row(s))), cases), ["process harness (ko): 5 rows (6)", "process harness (en): 5 rows (6)"]);
});
