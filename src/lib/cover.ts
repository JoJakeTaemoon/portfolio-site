// Generated project covers: the project's own diagram reduced to dots and lines. Pure and deterministic
// (same project in, same shape out), so the static HTML never changes between builds.
import type { Project, Visual } from "../content/types.ts";
import { dayOf } from "./timeline.ts";

export const COVER_W = 320;
export const COVER_H = 140;
const PAD = 22;

export type CoverDot = { x: number; y: number; group: string };
export type CoverLine = { x1: number; y1: number; x2: number; y2: number };
export type CoverShape = { source: "architecture" | "flow" | "timeline" | "seed"; dots: CoverDot[]; lines: CoverLine[]; bars: { x: number; y: number; w: number }[] };

const r1 = (n: number) => Math.round(n * 10) / 10;
const pick = <K extends Visual["kind"]>(p: Project, kind: K) => p.visuals.find((v): v is Extract<Visual, { kind: K }> => v.kind === kind);

/** Fit a cols x rows grid into the cover, centred, cells square. */
function gridPoint(cols: number, rows: number) {
  const cell = Math.min((COVER_W - 2 * PAD) / Math.max(cols, 1), (COVER_H - 2 * PAD) / Math.max(rows, 1), 64);
  const ox = (COVER_W - cell * cols) / 2;
  const oy = (COVER_H - cell * rows) / 2;
  return (col: number, row: number) => ({ x: r1(ox + (col + 0.5) * cell), y: r1(oy + (row + 0.5) * cell) });
}

const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

export function coverShape(p: Project): CoverShape {
  const dots: CoverDot[] = [];
  const lines: CoverLine[] = [];
  const bars: CoverShape["bars"] = [];
  const link = (a: CoverDot, b: CoverDot) => lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

  const arch = pick(p, "architecture");
  if (arch) {
    const at = gridPoint(arch.cols, arch.rows);
    const byId = new Map(arch.nodes.map((n) => [n.id, { ...at(n.col, n.row), group: n.group ?? "core" }]));
    byId.forEach((d) => dots.push(d));
    arch.edges.forEach((e) => byId.has(e.from) && byId.has(e.to) && link(byId.get(e.from)!, byId.get(e.to)!));
    return { source: "architecture", dots, lines, bars };
  }

  const flow = pick(p, "flow");
  if (flow) {
    const n = flow.steps.length;
    const per = Math.min(n, 6); // wrap long flows into rows of 6
    const at = gridPoint(per, Math.ceil(n / per));
    const ds = flow.steps.map((s, i) => ({ ...at(i % per, Math.floor(i / per)), group: s.actor === "human" ? "human" : s.actor === "external" ? "external" : s.actor === "agent" ? "process" : "core" }));
    ds.forEach((d, i) => (dots.push(d), i && link(ds[i - 1], d)));
    return { source: "flow", dots, lines, bars };
  }

  const tl = pick(p, "timeline");
  if (tl && tl.items.length > 1) {
    const days = tl.items.map((i) => dayOf(i.date));
    const first = days[0];
    const span = Math.max(days[days.length - 1] - first, 1);
    const x = (d: number) => r1(PAD + ((d - first) / span) * (COVER_W - 2 * PAD));
    const y = COVER_H / 2;
    (tl.spans ?? []).forEach((s, i) => {
      const x1 = x(Math.max(dayOf(s.from), first));
      bars.push({ x: x1, y: r1(y - 26 - (i % 2) * 14), w: Math.max(r1(x(Math.min(dayOf(s.to), first + span)) - x1), 4) });
    });
    days.forEach((d) => dots.push({ x: x(d), y, group: "data" }));
    if (dots.length > 1) link(dots[0], dots[dots.length - 1]);
    return { source: "timeline", dots, lines, bars };
  }

  // Neutral pattern seeded by the slug: 7 dots on a wobbling path.
  let seed = hash(p.slug);
  const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
  const groups = ["client", "core", "data", "process"];
  for (let i = 0; i < 7; i++) dots.push({ x: r1(PAD + (i * (COVER_W - 2 * PAD)) / 6), y: r1(PAD + rnd() * (COVER_H - 2 * PAD)), group: groups[Math.floor(rnd() * groups.length)] });
  dots.forEach((d, i) => i && link(dots[i - 1], d));
  return { source: "seed", dots, lines, bars };
}
