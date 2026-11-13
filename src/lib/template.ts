// Pure template helpers — type-only imports so node can run them directly.
import type { Project, SectionId, Tag, Visual } from "../content/types.ts";

/** A count label: "{n}" the number, "{s}" an English plural ending ("1 more figure", "2 more figures"). */
export const count = (label: string, n: number): string => label.replace("{n}", String(n)).replace("{s}", n === 1 ? "" : "s");

export const firstSentence = (s: string): string => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s;

/** Splits around decision ids (D-142, ADR-0004): ids land at odd indexes, so the renderer can keep each on one line. */
export const splitIds = (s: string): string[] => s.split(/\b((?:ADR|D)-\d+)/);

/** Filter chips: only tags that 2+ rows share (a chip that selects one row is noise). */
export function chipTags(rows: Tag[][]): Tag[] {
  const count = new Map<Tag, number>();
  for (const tags of rows) for (const t of new Set(tags)) count.set(t, (count.get(t) ?? 0) + 1);
  return [...count].filter(([, n]) => n >= 2).map(([t]) => t);
}

/** Case study reading order (D-030, amended by UX C1: the screen gallery follows the results). Code excerpts render at the end of "decisions".
 *  Task 25 (one section per screen): the architecture diagram is its own section before the decisions, and the
 *  process pointer closes the retrospective (it has no section of its own). */
export const caseSections: SectionId[] = ["results", "gallery", "problem", "role", "architecture", "decisions", "quality", "trace", "retro"];

const byKind: Record<Visual["kind"], SectionId> = { architecture: "architecture", flow: "decisions", timeline: "results", bars: "quality", roles: "role" };

/** Which case section a visual renders in. */
export const sectionOf = (v: Visual): SectionId => (v.after ? "decisions" : (v.at ?? byKind[v.kind]));

export function neighbors<T>(order: readonly T[], item: T): { prev?: T; next?: T } {
  const i = order.indexOf(item);
  return i < 0 ? { prev: undefined, next: undefined } : { prev: order[i - 1], next: order[i + 1] };
}

/** D-031: the options row shows only when 2+ alternatives were recorded. */
export const shownOptions = (options: string[] | undefined): string[] => (options && options.length >= 2 ? options : []);

/** "Period · status" (M-11, D-057 ⑤): a case's first metric is its status or result; anything else, the period alone.
 *  The hub's featured cards and the summary PDF's project table share it. */
export const statusLine = (p: Pick<Project, "kind" | "facts" | "metrics">): string =>
  p.kind === "case" && p.metrics[0]?.value ? `${p.facts.period} · ${p.metrics[0].value}` : p.facts.period;
