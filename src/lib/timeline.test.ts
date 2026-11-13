import { test } from "node:test";
import assert from "node:assert/strict";
import { dayOf, spreadDots, timelineBand, weekGroups } from "./timeline.ts";

test("positions, span days and month ticks", () => {
  const b = timelineBand([{ date: "2026-06-13" }, { date: "2026-06-15" }, { date: "2026-08-12" }], [{ from: "2026-06-13", to: "2026-06-15", label: "x" }]);
  assert.deepEqual(b.dots.map(Math.round), [0, 3, 100]);
  assert.equal(b.spans[0].days, 2);
  assert.equal(b.spans[0].left, 0);
  assert.deepEqual(b.ticks.map((t) => t.month), [6, 7]); // Jul 1, Aug 1
  assert.ok(b.ticks.every((t) => t.pct > 0 && t.pct < 100));
});

test("YYYY-MM is the 1st; a tick on the first date is kept; DST does not shift days", () => {
  assert.equal(dayOf("2026-07"), dayOf("2026-07-01"));
  assert.equal(dayOf("2026-11-02") - dayOf("2026-03-01"), 246);
  const b = timelineBand([{ date: "2026-06" }, { date: "2026-08" }]);
  assert.deepEqual(b.ticks.map((t) => [t.month, Math.round(t.pct)]), [[5, 0], [6, 49], [7, 100]]);
});

test("real spans: ewa 2 and 55 days, gateway 77 and 127 days", () => {
  const e = timelineBand([{ date: "2026-06-13" }, { date: "2026-11-10" }], [{ from: "2026-06-13", to: "2026-06-15", label: "" }, { from: "2026-09-13", to: "2026-11-07", label: "" }]);
  assert.deepEqual(e.spans.map((s) => s.days), [2, 55]);
  const g = timelineBand([{ date: "2020-10-05" }, { date: "2021-12-02" }], [{ from: "2020-10-05", to: "2020-12-21", label: "" }, { from: "2020-12-09", to: "2021-04-15", label: "" }]);
  assert.deepEqual(g.spans.map((s) => s.days), [77, 127]);
});

test("tick labels: all months when short; quarters and a year label when long", () => {
  const short = timelineBand([{ date: "2026-06-13" }, { date: "2026-11-10" }]);
  assert.ok(short.ticks.every((t) => t.label === "month"));
  const g = timelineBand([{ date: "2020-10-05" }, { date: "2021-12-02" }]);
  const named = g.ticks.filter((t) => t.label).map((t) => [t.year, t.month, t.label]);
  assert.deepEqual(named, [[2021, 0, "year"], [2021, 3, "month"], [2021, 6, "month"], [2021, 9, "month"]]);
  assert.ok(g.ticks.some((t) => !t.label)); // unlabelled ticks stay
});

test("week merge: items within 7 days of the group's first share one dot; numbers are 1-based", () => {
  const d = (s: string) => dayOf(s);
  assert.deepEqual(weekGroups([d("2026-05-25"), d("2026-05-26"), d("2026-05-31"), d("2026-06-01"), d("2026-06-20")]), [
    { from: 1, to: 3, count: 3 },
    { from: 4, to: 4, count: 1 },
    { from: 5, to: 5, count: 1 },
  ]);
  assert.deepEqual(weekGroups([d("2026-05-01"), d("2026-05-08")]).map((g) => g.count), [1, 1]); // 7 days apart: separate
  const b = timelineBand([{ date: "2026-06-01" }, { date: "2026-06-03" }, { date: "2026-08-01" }]);
  assert.deepEqual(b.groups.map((g) => [g.from, g.to, Math.round(g.pct)]), [[1, 2, 0], [3, 3, 100]]);
});

test("spreadDots: close dots are pushed apart inside 0-100, order kept", () => {
  const out = spreadDots([0, 0.8, 5, 99, 100], ["1–3", "4", "5", "10", "11"]);
  assert.ok(out.every((x, i) => x >= 0 && x <= 100 && (i === 0 || x - out[i - 1] >= 7)));
  assert.deepEqual(spreadDots([0, 50, 100], ["1", "2", "3"]), [0, 50, 100]); // far apart: untouched
});
