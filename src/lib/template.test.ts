// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Visual } from "../content/types.ts";
import { caseSections, chipTags, count, firstSentence, neighbors, sectionOf, shownOptions, splitIds, statusLine } from "./template.ts";

test("firstSentence stops at the first sentence end followed by space or end", () => {
  assert.equal(firstSentence("Did a thing. More."), "Did a thing.");
  assert.equal(firstSentence("v1.2 shipped. Then more."), "v1.2 shipped.");
  assert.equal(firstSentence("정수로 저장했습니다. 그 뒤에."), "정수로 저장했습니다.");
  assert.equal(firstSentence("no end"), "no end");
});

test("splitIds puts decision ids at odd indexes", () => {
  assert.deepEqual(splitIds("예: D-143, ADR-0004 · D-173"), ["예: ", "D-143", ", ", "ADR-0004", " · ", "D-173", ""]);
  assert.deepEqual(splitIds("EMP-SET-07 no id"), ["EMP-SET-07 no id"]);
});

test("chipTags keeps tags used by 2+ rows, in first-seen order", () => {
  assert.deepEqual(chipTags([["fintech", "mobile"], ["commerce", "mobile"], ["commerce"]]), ["mobile", "commerce"]);
  assert.deepEqual(chipTags([["fintech"], ["commerce"]]), []);
});

const v = (kind: Visual["kind"], extra: Partial<Visual> = {}) => ({ kind, ...extra }) as Visual;

test("sectionOf: `at` wins, `after` means decisions, otherwise the kind decides", () => {
  assert.equal(sectionOf(v("flow", { at: "problem" })), "problem");
  assert.equal(sectionOf(v("flow", { after: "ADR-0006" })), "decisions");
  assert.equal(sectionOf(v("architecture")), "architecture");
  assert.equal(sectionOf(v("flow")), "decisions");
  assert.equal(sectionOf(v("timeline")), "results");
  assert.equal(sectionOf(v("bars")), "quality");
  assert.equal(sectionOf(v("roles")), "role");
  for (const k of ["architecture", "flow", "timeline", "bars", "roles"] as const) assert.ok(caseSections.includes(sectionOf(v(k))));
});

test("case order follows D-030 with the gallery right after the results (UX C1) and the architecture before the decisions (task 25)", () => {
  assert.deepEqual(caseSections, ["results", "gallery", "problem", "role", "architecture", "decisions", "quality", "trace", "retro"]);
});

test("neighbors walks the given order", () => {
  const order = ["a", "b", "c"];
  assert.deepEqual(neighbors(order, "a"), { prev: undefined, next: "b" });
  assert.deepEqual(neighbors(order, "b"), { prev: "a", next: "c" });
  assert.deepEqual(neighbors(order, "c"), { prev: "b", next: undefined });
  assert.deepEqual(neighbors(order, "x"), { prev: undefined, next: undefined });
});

test("shownOptions hides the row below 2 options", () => {
  assert.deepEqual(shownOptions(undefined), []);
  assert.deepEqual(shownOptions(["a"]), []);
  assert.deepEqual(shownOptions(["a", "b"]), ["a", "b"]);
});

test("count: the number and an English plural ending", () => {
  assert.equal(count("{n} more figure{s}", 1), "1 more figure");
  assert.equal(count("{n} more figure{s}", 3), "3 more figures");
  assert.equal(count("나머지 그림 {n}개", 2), "나머지 그림 2개");
});

// Task 13a, M-11: the hub card's second line and the summary PDF's status column.
test("statusLine: a case's period and first metric; a brief or an empty metric, the period alone", () => {
  const facts = { period: "2026.06 – 현재", role: "", team: "", platforms: "", context: "" };
  assert.equal(statusLine({ kind: "case", facts, metrics: [{ value: "운영 데이터 이전", label: "x" }] } as never), "2026.06 – 현재 · 운영 데이터 이전");
  assert.equal(statusLine({ kind: "brief", facts, metrics: [{ value: "3일", label: "x" }] } as never), "2026.06 – 현재");
  assert.equal(statusLine({ kind: "case", facts, metrics: [] } as never), "2026.06 – 현재");
});
