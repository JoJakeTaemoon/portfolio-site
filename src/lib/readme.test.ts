// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { badge, pipelineMermaid, profileReadme, stackBadges, summaryLine } from "./readme.ts";

const job = (org: string, early = false) => ({ role: "CTO", org, place: "Vietnam", period: "2021 – 2024", points: [], early });
const site = (lang: string) => ({
  name: "Jake Tae-moon Jo",
  headline: `headline ${lang}`,
  intro: [`intro ${lang} one`, `intro ${lang} two`],
  contact: { email: "whxoans@gmail.com", phone: "+82 10-9233-7440", tel: "+821092337440" },
  github: { publicContributions: 239, privateContributions: 3493, asOf: "2026-11" },
  now: "now text",
  hub: { career: "18+ years of work in 4 countries", floatFact: "CTO at 5 companies, founder or co-founder of 6" },
  lead: ["lead a", "lead b"],
  experience: [job("A"), job("B"), { ...job("Old", true), place: "Singapore · Korea" }, job("C"), job("D"), job("E")],
}) as never;
const project = { slug: "ewa", kind: "case", title: "T", tagline: "Claim sentence.", domain: "Fintech", stack: ["Next.js", "Prisma"], metrics: [{ value: "Live" }], facts: { role: "Lead", period: "2026.06 – now" }, results: ["Did a thing. More."] } as never;
const fixture = () => ({ en: site("en"), ko: site("ko"), projects: [project], siteUrl: "https://x.test" });
const at = (md: string, s: string) => md.indexOf(s);
const proc = {
  pipelineTitle: "One feature",
  mapBand: "Agents · 8 stages",
  pipeline: {
    nodes: [
      { id: "stake", label: "Client", sub: "Briefs", col: 0, row: 0, group: "human" },
      { id: "intake", label: "Intake", col: 0, row: 1, group: "process" },
      { id: "escalate", label: "Escalation", col: 1, row: 3, group: "me", idle: true },
      { id: "ship", label: "Release \"go\"", col: 0, row: 3, group: "me" },
    ],
    edges: [{ from: "stake", to: "intake", label: "source docs" }, { from: "ship", to: "intake" }],
  },
} as never;

// D-037 skeleton as made visual by D-058
test("readme has the parts in order", () => {
  const md = profileReadme({ ...fixture(), process: proc });
  const order = ["assets/banner-light.svg", `<p align="center">`, "intro en one", "> [!NOTE]", "239 public", "## Now", "```mermaid", "## Selected work", "## Stack", "## Experience", "## How I lead", "<summary>한국어 소개", "## Contact"];
  assert.deepEqual(order.filter((h, i) => at(md, h) < 0 || (i > 0 && at(md, h) < at(md, order[i - 1]))), []);
  assert.ok(md.includes("<details>\n<summary>One feature: the full pipeline</summary>\n\n```mermaid"), "folded, under its title");
  assert.ok(!profileReadme(fixture()).includes("```mermaid"), "no process data, no diagram");
});
test("banner: light and dark files, the summary line in its alt text, linked to the site", () => {
  const md = profileReadme(fixture());
  assert.ok(md.startsWith(`<a href="https://x.test/en/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">`));
  assert.ok(md.includes(`alt="Jake Tae-moon Jo: headline en. ${summaryLine(site("en"))}"`));
});
test("badge row: site EN/KO, both PDFs, email; badge images carry words only, never the name or the address", () => {
  const md = profileReadme(fixture());
  const row = md.slice(at(md, `<p align="center">`), at(md, "</p>"));
  for (const s of [`href="https://x.test/en/"`, `href="https://x.test/ko/"`, `href="https://x.test/pdf/jake-jo-portfolio-en.pdf"`, `href="https://x.test/pdf/jake-jo-portfolio-ko.pdf"`, `href="mailto:whxoans@gmail.com"`]) assert.ok(row.includes(s), s);
  for (const url of md.match(/https:\/\/img\.shields\.io\/[^"]+/g) ?? []) assert.ok(!/jake|whxoans|tae-?moon|%40/i.test(url), url);
  assert.equal(badge("Career summary-PDF_x", "1c1c1a"), "https://img.shields.io/badge/Career%20summary--PDF__x-1c1c1a?style=for-the-badge");
  assert.equal(badge("Portfolio", "2f5d50", { message: "EN" }), "https://img.shields.io/badge/Portfolio-EN-2f5d50?style=for-the-badge&labelColor=1c1c1a");
});
test("selected work: picture cards with title, status, outcome and links to the case pages and PDF", () => {
  const md = profileReadme(fixture());
  for (const s of ["assets/work-ewa-light.png", "assets/work-ewa-dark.png", "<b><a href=\"https://x.test/en/work/ewa/\">T</a></b>", "<sub>2026.06 – now · Live</sub>", "<p>Claim sentence.</p>", "https://x.test/ko/work/ewa/", "https://x.test/pdf/jake-jo-ewa-en.pdf"])
    assert.ok(md.includes(s), s);
  assert.ok(!md.includes("Fintech"));
});
test("summary line from the site's own values", () => {
  assert.equal(summaryLine(site("en")), "18+ years · CTO at 5 companies · founder or co-founder of 6 · Vietnam / Singapore / Korea");
});
test("one role for every project: a line over the cards; different roles go on each card", () => {
  const two = { ...fixture(), projects: [project, { ...(project as object), slug: "b", tagline: "With an AI agent team, built it." } as never] };
  const md = profileReadme(two);
  assert.ok(md.includes("All 2: lead.\n\n<table>"));
  assert.ok(md.includes("<p>Built it.</p>"), "the shared opening is dropped");
  const mixed = { ...two, projects: [project, { ...(project as object), slug: "c", facts: { role: "Solo", period: "2020" } } as never] };
  assert.ok(profileReadme(mixed).includes("<p><sub>Solo</sub></p>"));
});
test("Now drops a first clause the intro already says", () => {
  const f = fixture();
  const md = profileReadme({ ...f, en: { ...(f.en as object), intro: ["I design a team: more."], now: "I design a team: I define a pipeline. Then more." } as never });
  assert.ok(md.includes("## Now\n\nI define a pipeline. Then more."));
  assert.ok(profileReadme(f).includes("## Now\n\nnow text"), "kept when it is not a repeat");
});
test("experience: the top 4 entries, early career left out", () => {
  const md = profileReadme(fixture());
  const lines = md.split("## Experience\n\n")[1].split("\n\n")[0].split("\n");
  assert.deepEqual(lines, ["- **CTO** · A (Vietnam) · 2021 – 2024", "- **CTO** · B (Vietnam) · 2021 – 2024", "- **CTO** · C (Vietnam) · 2021 – 2024", "- **CTO** · D (Vietnam) · 2021 – 2024"]);
});
test("no third-party stats cards, emoji or repo links but the site's own source", () => {
  const md = profileReadme({ ...fixture(), process: proc, sourceRepo: "https://github.com/JoJakeTaemoon/portfolio-site" });
  assert.ok(!/github-readme-stats|readme-typing-svg|streak-stats|\p{Extended_Pictographic}/u.test(md));
  assert.deepEqual([...new Set(md.match(/github\.com\/JoJakeTaemoon\/[\w-]+/g))], ["github.com/JoJakeTaemoon/portfolio-site"]);
  assert.ok(md.includes("[portfolio-site](https://github.com/JoJakeTaemoon/portfolio-site)") && md.includes("Source-portfolio--site-2f5d50"));
  assert.ok(!profileReadme(fixture()).includes("github.com/"), "no source repo given, no link");
});
test("contact has email and phone", () => {
  const md = profileReadme(fixture());
  assert.ok(md.includes("- Email: whxoans@gmail.com") && md.includes("- Phone: +82 10-9233-7440"));
});
test("pipeline diagram: the band holds the agents' stages, people outside it, styled by who, quotes escaped", () => {
  const m = pipelineMermaid(proc);
  assert.ok(m.startsWith("```mermaid\nflowchart TB\n"));
  assert.ok(m.includes(`subgraph band ["Agents · 8 stages"]\ndirection TB\nintake["Intake"]:::agent\nend`));
  for (const s of [`stake["Client<br/>Briefs"]:::client`, `escalate["Escalation"]:::rule`, `ship["Release #quot;go#quot;"]:::me`, "stake -->|source docs| intake", "ship --> intake"]) assert.ok(m.includes(s), s);
});
test("stack badges: names folded to one spelling, logo-less tools left out, most-used first", () => {
  const b = stackBadges([{ stack: ["Prisma", "Python 3"] }, { stack: ["Prisma", "Python (stdlib)", "CSV"] }, { stack: ["Next.js"] }] as never);
  assert.deepEqual(b.map((s) => s.match(/alt="([^"]+)"/)![1]), ["Prisma", "Python", "Next.js"]);
  assert.ok(b[0].includes("logo=prisma"));
});
