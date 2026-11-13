// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { bannerData, bannerSvg, splitHeadline, wrapParts } from "./profile-svg.ts";

const data = {
  name: "Jake <Jo> & co",
  headline: "Engineering lead with an AI agent team",
  summary: "18+ years · CTO at 5 companies · 50-person Vietnam R&D centre in 6 months · Korea / Vietnam / Singapore / US",
  top: [{ label: "Client", who: "client" }, { label: "Sign-off · input", who: "me" }],
  band: "Agents · 8 stages · 13 roles",
  bottom: [{ label: "Escalation", who: "rule" }, { label: "Release go-ahead", who: "me" }],
  legend: { me: "Me", client: "Client", agent: "Agent", rule: "Rule only" },
} as const;

test("headline splits before ' with ', else at the space nearest the middle", () => {
  assert.deepEqual(splitHeadline("Engineering lead with an AI agent team"), ["Engineering lead", "with an AI agent team"]);
  assert.deepEqual(splitHeadline("one two three four"), ["one two", "three four"]);
  assert.deepEqual(splitHeadline("single"), ["single"]);
});
test("summary parts pack into lines of at most the width, never split inside a part", () => {
  assert.deepEqual(wrapParts(data.summary, 44), ["18+ years · CTO at 5 companies", "50-person Vietnam R&D centre in 6 months", "Korea / Vietnam / Singapore / US"]);
});
test("banner: escaped words, every box and the band drawn, the theme's colours", () => {
  const light = bannerSvg(data as never, "light"), dark = bannerSvg(data as never, "dark");
  assert.ok(light.startsWith("<svg") && light.trimEnd().endsWith("</svg>"));
  assert.ok(light.includes("Jake &lt;Jo&gt; &amp; co") && !light.includes("<Jo>"));
  for (const s of ["Client", "Sign-off · input", "Escalation", "Release go-ahead", "Agents · 8 stages · 13 roles", "Rule only", "R&amp;D centre"]) assert.ok(light.includes(s), s);
  assert.equal((light.match(/<circle /g) ?? []).length, 8 + 3, "eight stages and three pulses");
  assert.ok(light.includes("#fbfaf7") && dark.includes("#121312") && !dark.includes("#fbfaf7"));
});
test("banner data: the process page's people in two rows, an idle one a rule", () => {
  const site = { name: "N", headline: "H", ui: { who: data.legend } } as never;
  const p = { mapBand: "B", pipeline: { nodes: [
    { id: "a", label: "Client", group: "human", row: 0, col: 0 }, { id: "b", label: "Sign", group: "me", row: 0, col: 1 },
    { id: "x", label: "Stage", group: "process", row: 1, col: 0 },
    { id: "c", label: "Esc", group: "me", idle: true, row: 3, col: 2 }, { id: "d", label: "Ship", group: "me", row: 3, col: 1 },
  ], edges: [] } } as never;
  const d = bannerData(site, p, "S");
  assert.deepEqual(d.top, [{ label: "Client", who: "client" }, { label: "Sign", who: "me" }]);
  assert.deepEqual(d.bottom, [{ label: "Ship", who: "me" }, { label: "Esc", who: "rule" }]);
  assert.equal(d.band, "B");
});
