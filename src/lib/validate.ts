// Content checks the type system can't express. Run at module load by src/content/index.ts,
// so any problem fails the build with the list.
import type { Decision, ProcessPage, Project, Visual } from "../content/types.ts";
import { caseSections, sectionOf } from "./template.ts";
import { dayOf } from "./timeline.ts";

const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const FORMAL = /니다\.$/; // D-038: text inside a figure is 해라체
const LIMITS = { problem: 2, built: 5 } as const; // D-032, briefs only
const STATUS_MAX = { ko: 12, en: 26 } as const; // a case's metrics[0].value (M-11)
// the /process harness table's cells (spec §1): characters, ko / en
const CELL_MAX = { roles: [16, 36], enforced: [36, 80], gate: [18, 40], changed: [34, 76] } as const;

export function projectProblems(p: Project): string[] {
  const out: string[] = [];
  const say = (m: string) => out.push(`${p.slug}: ${m}`);

  if (p.kind === "case")
    for (const k of ["architecture", "flow", "timeline"] as const)
      if (!p.visuals.some((v) => v.kind === k)) say(`missing ${k} visual`);

  const figureText = (t: string | undefined) => t && FORMAL.test(t.trim()) && say(`figure text must be 해라체, not 합쇼체: "${t}"`);
  const caption = (t: string) => {
    if (t.includes("`")) say(`backtick in caption "${t}"`);
    figureText(t);
  };
  const chosen = (d: Decision) => {
    const n = d.options?.length ?? 0;
    if (d.chosen !== undefined && (n < 2 || d.chosen < 0 || d.chosen >= n)) say(`decision "${d.title}": chosen ${d.chosen} is not one of 2+ options`);
  };

  if (p.kind === "case") {
    const ids = new Set(p.decisions.map((d) => d.id));
    for (const v of p.visuals) {
      if (v.at && !caseSections.includes(v.at)) say(`visual "${v.title}" at "${v.at}" is not a case section`);
      if (v.after && !ids.has(v.after)) say(`visual "${v.title}" after unknown decision "${v.after}"`);
      if (v.at && v.after) say(`visual "${v.title}" has both at and after`);
      // CaseView renders these two only when they have their own content.
      const s = sectionOf(v);
      if ((s === "results" && !p.results.length) || (s === "gallery" && !p.gallery.length && !p.video)) say(`visual "${v.title}" is in "${s}", which has no content to render`);
    }
    p.decisions.forEach(chosen);
  } else {
    // BriefView renders a visual in "visuals" (default) or "results" only.
    for (const v of p.visuals) {
      if (v.at && v.at !== "visuals" && v.at !== "results") say(`visual "${v.title}" at "${v.at}" is not rendered by a brief (visuals, results)`);
      if (v.after) say(`visual "${v.title}" has after, which a brief does not render`);
      if (v.at === "results" && !p.results.length) say(`visual "${v.title}" is in "results", which has no content to render`);
    }
    for (const k of ["problem", "built"] as const)
      if (p[k].length > LIMITS[k]) say(`${k} has ${p[k].length} ${k === "problem" ? "paragraphs" : "items"} (max ${LIMITS[k]})`);
    if (p.decision) chosen(p.decision);
  }

  for (const v of p.visuals) {
    if (!v.caption.trim()) say("visual without caption");
    caption(v.caption);
    if (v.kind === "architecture") Object.values(v.notes).forEach(figureText);
    if (v.kind === "flow") for (const s of v.steps) figureText(s.sub);
    if (v.kind === "roles")
      for (const l of v.lanes) {
        l.items.forEach(figureText);
        if (l.stats && (l.stats.length < 1 || l.stats.length > 2)) say(`roles lane "${l.label}" has ${l.stats.length} stats (1-2)`);
        for (const st of l.stats ?? []) if (!st.value.trim() || !st.label.trim()) say(`roles lane "${l.label}" has an empty stat`);
      }
    if (v.kind === "timeline") {
      if (!v.items.length) say("timeline without items");
      for (const it of v.items) figureText(it.note);
      for (const it of v.items) if (!DATE.test(it.date)) say(`bad timeline date "${it.date}"`);
      // ponytail: string compare is enough — "2026-06" < "2026-06-13" < "2026-07"
      if (v.items.some((it, i) => i > 0 && it.date < v.items[i - 1].date)) say("timeline dates not ascending");
      if (v.stats) {
        if (v.stats.length < 1 || v.stats.length > 3) say(`timeline "${v.title}" has ${v.stats.length} stats (1-3)`);
        for (const st of v.stats) {
          if (!st.value.trim() || !st.label.trim()) say(`timeline "${v.title}" has an empty stat`);
          figureText(st.label);
        }
      }
      for (const s of v.spans ?? []) {
        if (!DATE.test(s.from) || !DATE.test(s.to)) say(`bad span date "${s.from}" - "${s.to}"`);
        else if (dayOf(s.from) > dayOf(s.to)) say(`span "${s.label}" from is after to`);
        else if (v.items.length && v.items.every((it) => DATE.test(it.date)) && (dayOf(s.from) < dayOf(v.items[0].date) || dayOf(s.to) > dayOf(v.items[v.items.length - 1].date))) say(`span "${s.label}" is outside the timeline range`);
      }
    }
    if (v.kind === "bars") {
      if (!v.source.trim()) say("bars without source");
      figureText(v.source);
      const vals = v.bars.flatMap((b) => (b.value2 === undefined ? [b.value] : [b.value, b.value2]));
      if (v.series) {
        if (v.bars.some((b) => b.value2 === undefined)) say("bars series without value2");
      } else {
        if (v.bars.some((b) => b.value2 !== undefined)) say("bars value2 without series");
        if (vals.some((x) => x < 0)) say("negative bar value");
      }
      if (v.max !== undefined && vals.some((x) => Math.abs(x) > v.max!)) say("bar value above max");
    }
  }

  if (p.cover && !p.cover.alt.trim()) say("cover without alt");
  for (const g of p.gallery) {
    if (!g.caption.trim()) say("gallery image without caption");
    if (g.frame && g.frame !== "laptop" && g.frame !== "phone") say(`gallery frame "${g.frame}" is not laptop or phone`);
  }
  for (const c of p.code) {
    if (!c.alt.trim()) say("code image without alt");
    caption(c.caption);
  }
  return out;
}

/** D-038 for the /process figure: node notes, node sub and edge labels are 해라체. en never ends in 「니다.」, so it passes. */
export function processProblems(page: ProcessPage, lang: string): string[] {
  const { intro, notes, nodes, edges } = page.pipeline;
  return [intro, ...Object.values(notes), ...nodes.map((n) => n.sub), ...edges.map((e) => e.label)]
    .filter((t): t is string => !!t && FORMAL.test(t.trim()))
    .map((t) => `process (${lang}): figure text must be 해라체, not 합쇼체: "${t}"`);
}

// "약 7,000" and "~7,000" are the same metric: compare the digits only.
const numbers = (s: string) => (s.match(/\d[\d,.]*/g) ?? []).map((n) => n.replace(/,/g, "")).join(" ");
const kinds = (vs: Visual[]) => vs.map((v) => v.kind).join(",");
const placement = (vs: Visual[]) => vs.map((v) => sectionOf(v) + (v.after ? `>${v.after}` : "")).join(",");
const decisionsOf = (p: Project): Decision[] => (p.kind === "case" ? p.decisions : p.decision ? [p.decision] : []);
const spanKey = (v: Visual) => (v.kind === "timeline" ? (v.spans ?? []).map((s) => `${s.from}..${s.to}`).join(",") : "");
const statKey = (v: Visual) => (v.kind === "timeline" ? (v.stats ?? []).map((t) => numbers(t.value)).join(",") : "");
const laneKey = (v: Visual) => (v.kind === "roles" ? v.lanes.map((l) => (l.stats ?? []).map((t) => numbers(t.value)).join("+")).join(",") : "");
const barValues = (v: Visual) => (v.kind === "bars" ? v.bars.map((b) => (b.value2 === undefined ? `${b.value}` : `${b.value}/${b.value2}`)).join(",") + (v.max === undefined ? "" : ` max ${v.max}`) : "");

/** ko and en must have the same shape and the same numbers; only the wording may differ. */
export function pairProblems(ko: Project, en: Project): string[] {
  const out: string[] = [];
  const diff = (what: string, a: string | number | boolean, b: string | number | boolean) => {
    if (String(a) !== String(b)) out.push(`${ko.slug}: ${what} (${a} vs ${b})`);
  };

  diff("kind differs", ko.kind, en.kind);
  diff("slug differs", ko.slug, en.slug);
  diff("year differs", ko.year, en.year);
  diff("tags differ", ko.tags.join(","), en.tags.join(","));
  diff("stack differs", ko.stack.join(","), en.stack.join(","));

  diff("metric count differs", ko.metrics.length, en.metrics.length);
  ko.metrics.forEach((m, i) => {
    const e = en.metrics[i];
    if (e && numbers(m.value) !== numbers(e.value)) out.push(`${ko.slug}: metric ${i + 1} differs (${m.value} vs ${e.value})`);
  });

  const kk = kinds(ko.visuals);
  const ek = kinds(en.visuals);
  diff("visuals differ", kk, ek);
  // Per-visual values only make sense once the kinds line up.
  if (kk === ek) {
    ko.visuals.forEach((v, i) => v.kind === "bars" && diff(`bars ${i + 1} values differ`, barValues(v), barValues(en.visuals[i])));
    ko.visuals.forEach((v, i) => v.kind === "timeline" && diff(`timeline ${i + 1} spans differ`, spanKey(v), spanKey(en.visuals[i])));
    ko.visuals.forEach((v, i) => v.kind === "timeline" && diff(`timeline ${i + 1} stats differ`, statKey(v), statKey(en.visuals[i])));
    ko.visuals.forEach((v, i) => v.kind === "roles" && diff(`roles ${i + 1} lane stats differ`, laneKey(v), laneKey(en.visuals[i])));
    diff("visual placement differs", placement(ko.visuals), placement(en.visuals));
  }

  const kd = decisionsOf(ko);
  const ed = decisionsOf(en);
  diff("decision count differs", kd.length, ed.length);
  kd.forEach((d, i) => {
    const e = ed[i];
    if (!e) return;
    diff(`decision ${i + 1} option count differs`, d.options?.length ?? 0, e.options?.length ?? 0);
    diff(`decision ${i + 1} chosen differs`, d.chosen ?? "none", e.chosen ?? "none");
    diff(`decision ${i + 1} cost presence differs`, !!d.cost, !!e.cost);
    diff(`decision ${i + 1} setBy differs`, d.setBy ?? "none", e.setBy ?? "none");
  });
  // M-11: a case's first metric is its status on the hub card's one line (390px) and in the summary PDF's table
  if (ko.kind === "case") {
    const len = (m: { value: string } | undefined) => [...(m?.value ?? "")].length;
    if (len(ko.metrics[0]) > STATUS_MAX.ko) out.push(`${ko.slug}: metric 1 "${ko.metrics[0].value}" over ${STATUS_MAX.ko} characters (ko)`);
    if (len(en.metrics[0]) > STATUS_MAX.en) out.push(`${ko.slug}: metric 1 "${en.metrics[0]?.value}" over ${STATUS_MAX.en} characters (en)`);
  }
  diff("cover differs", `${ko.cover?.src ?? ""}:${ko.cover?.frame ?? ""}`, `${en.cover?.src ?? ""}:${en.cover?.frame ?? ""}`);
  diff("gallery frames differ", ko.gallery.map((g) => `${g.src}:${g.frame ?? ""}`).join(","), en.gallery.map((g) => `${g.src}:${g.frame ?? ""}`).join(","));
  diff("code images differ", ko.code.map((c) => c.src).join(","), en.code.map((c) => c.src).join(","));
  diff("code paths differ", ko.code.map((c) => c.path).join(","), en.code.map((c) => c.path).join(","));
  diff("leads keys differ", Object.keys(ko.leads ?? {}).sort().join(","), Object.keys(en.leads ?? {}).sort().join(","));
  return out;
}

/** M-12: the harness table, six case rows in the same order in ko and en, 1-2 last gates, cells within their widths. */
export function harnessProblems(ko: ProcessPage, en: ProcessPage, cases: string[]): string[] {
  const out: string[] = [];
  const len = (t: string) => [...t].length;
  ([["ko", ko, 0], ["en", en, 1]] as const).forEach(([lang, page, i]) => {
    const { rows, focus } = page.harness;
    const say = (m: string) => out.push(`process harness (${lang}): ${m}`);
    if (rows.length !== 6) say(`${rows.length} rows (6)`);
    if (focus && !rows.some((r) => r.slug === focus)) say(`focus "${focus}" is not a row`);
    for (const r of rows) {
      if (!cases.includes(r.slug)) say(`"${r.slug}" is not a case`);
      if (r.gate.length < 1 || r.gate.length > 2) say(`${r.slug}: ${r.gate.length} last gates (1-2)`);
      for (const k of ["roles", "enforced", "changed"] as const) if (len(r[k]) > CELL_MAX[k][i]) say(`${r.slug}: ${k} "${r[k]}" over ${CELL_MAX[k][i]} characters`);
      for (const g of r.gate) if (len(g.text) > CELL_MAX.gate[i]) say(`${r.slug}: gate "${g.text}" over ${CELL_MAX.gate[i]} characters`);
    }
  });
  const order = (p: ProcessPage) => p.harness.rows.map((r) => `${r.slug}:${r.gate.map((g) => g.who).join("+")}`).join(",");
  if (order(ko) !== order(en)) out.push(`process harness: ko and en rows differ (${order(ko)} vs ${order(en)})`);
  return out;
}
