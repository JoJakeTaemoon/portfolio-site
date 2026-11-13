// Pure timeline geometry (UTC, so DST and the build machine's timezone cannot move a date).
import type { TimelineSpan as Span } from "../content/types.ts";

const DAY = 86_400_000;
/** Days since epoch for YYYY-MM (the 1st) or YYYY-MM-DD. */
export const dayOf = (d: string): number => Date.parse(d.length === 7 ? `${d}-01` : d) / DAY;

/** Items whose dates fall within 7 days of a group's first item share one axis dot. `from`/`to` are 1-based item numbers. */
export function weekGroups(days: number[]): { from: number; to: number; count: number }[] {
  const out: { from: number; to: number; count: number }[] = [];
  let start = -Infinity;
  days.forEach((d, i) => {
    if (d - start < 7) {
      const g = out[out.length - 1];
      g.to = i + 1;
      g.count++;
    } else {
      start = d;
      out.push({ from: i + 1, to: i + 1, count: 1 });
    }
  });
  return out;
}

const AXIS_PX = 300; // narrowest axis (375px phone); wider axes just get a little extra air
const dotPx = (label: string) => Math.max(18, label.length * 6 + 14); // matches .tband-dot: min 18, 4px padding, 2px border, 0.65rem digits

/** Nudge dot centres (percent of the axis) apart so numbered dots never overlap at AXIS_PX; keeps order and the 0–100 range. */
export function spreadDots(pcts: number[], labels: string[], gap = 3): number[] {
  const w = labels.map(dotPx);
  const need = (i: number) => (w[i - 1] + w[i]) / 2 + gap;
  const p = pcts.map((x) => (x * AXIS_PX) / 100);
  for (let i = 1; i < p.length; i++) p[i] = Math.max(p[i], p[i - 1] + need(i));
  if (p.length) p[p.length - 1] = Math.min(p[p.length - 1], AXIS_PX);
  for (let i = p.length - 2; i >= 0; i--) p[i] = Math.min(p[i], p[i + 1] - need(i + 1));
  return p.map((x) => (Math.max(0, x) * 100) / AXIS_PX);
}

export function timelineBand(items: { date: string }[], spans: Span[] = []) {
  const first = dayOf(items[0].date);
  const total = dayOf(items[items.length - 1].date) - first || 1; // one-day range: avoid /0
  const pct = (day: number) => ((day - first) / total) * 100;

  // Over 8 ticks: only calendar quarters are named. A range crossing a year names January by its year.
  const end = first + total;
  const ticks: { pct: number; month: number; year: number; label: "month" | "year" | null }[] = [];
  const crossesYear = new Date(first * DAY).getUTCFullYear() !== new Date(end * DAY).getUTCFullYear();
  const f = new Date(first * DAY);
  // first 1st-of-month at or after the first date
  let t = Date.UTC(f.getUTCFullYear(), f.getUTCMonth() + (f.getUTCDate() === 1 ? 0 : 1), 1);
  for (; t / DAY <= end; t = Date.UTC(new Date(t).getUTCFullYear(), new Date(t).getUTCMonth() + 1, 1))
    ticks.push({ pct: pct(t / DAY), month: new Date(t).getUTCMonth(), year: new Date(t).getUTCFullYear(), label: null });
  const quarters = ticks.length > 8;
  for (const k of ticks) k.label = quarters && k.month % 3 ? null : crossesYear && k.month === 0 ? "year" : "month";

  return {
    dots: items.map((it) => pct(dayOf(it.date))),
    groups: (() => {
      const gs = weekGroups(items.map((it) => dayOf(it.date)));
      const label = (g: { from: number; to: number }) => (g.to > g.from ? `${g.from}–${g.to}` : String(g.from));
      const at = spreadDots(gs.map((g) => pct(dayOf(items[g.from - 1].date))), gs.map(label));
      return gs.map((g, i) => ({ ...g, pct: at[i] }));
    })(),
    spans: spans.map((s) => ({ left: pct(dayOf(s.from)), width: pct(dayOf(s.to)) - pct(dayOf(s.from)), days: dayOf(s.to) - dayOf(s.from) })),
    ticks,
  };
}
