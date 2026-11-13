import { test } from "node:test";
import assert from "node:assert/strict";
import type { Brief } from "../content/types.ts";
import { COVER_H, COVER_W, coverShape } from "./cover.ts";

const brief = (visuals: Brief["visuals"], slug = "gw"): Brief => ({
  kind: "brief", slug, title: "t", tagline: "t", year: 2026, domain: "d", tags: ["commerce"], stack: ["x"],
  facts: { period: "p", role: "r", team: "t", platforms: "p", context: "c" }, code: [], gallery: [], metrics: [], visuals, problem: ["p"], built: ["b"], results: ["r"],
});
const arch: Brief["visuals"][0] = { kind: "architecture", title: "t", caption: "c", cols: 3, rows: 2, nodes: [{ id: "a", label: "a", col: 0, row: 0 }, { id: "b", label: "b", col: 2, row: 1, group: "data" }], edges: [{ from: "a", to: "b" }], notes: {} };
const flow: Brief["visuals"][0] = { kind: "flow", title: "t", caption: "c", steps: [{ id: "a", label: "a" }, { id: "b", label: "b", actor: "human" }] };
const tl: Brief["visuals"][0] = { kind: "timeline", title: "t", caption: "c", items: [{ date: "2026-01", label: "a" }, { date: "2026-03", label: "b" }], spans: [{ from: "2026-01", to: "2026-02", label: "s" }] };

test("architecture first, then flow, timeline, seed", () => {
  assert.equal(coverShape(brief([flow, arch])).source, "architecture");
  assert.equal(coverShape(brief([tl, flow])).source, "flow");
  assert.equal(coverShape(brief([tl])).source, "timeline");
  assert.equal(coverShape(brief([{ kind: "bars", title: "t", caption: "c", unit: "u", source: "s", bars: [{ label: "a", value: 1 }] }])).source, "seed");
});

test("deterministic, and everything stays inside the cover", () => {
  for (const v of [arch, flow, tl]) {
    const a = coverShape(brief([v])), b = coverShape(brief([v]));
    assert.deepEqual(a, b);
    for (const d of a.dots) assert.ok(d.x >= 0 && d.x <= COVER_W && d.y >= 0 && d.y <= COVER_H);
  }
  assert.equal(coverShape(brief([arch])).lines.length, 1);
  assert.notDeepEqual(coverShape(brief([] as never, "a")).dots, coverShape(brief([] as never, "b")).dots); // seed differs by slug
});
