// Pure — relative .ts imports only so node can run it directly.
import type { ProcessPage, Site } from "../content/types.ts";
// The GitHub profile README's drawings (D-058), from values the site already shows. GitHub shows them as <img>: no web
// font loads there (system fonts), SMIL is the one motion, and each drawing comes in a light and a dark file for <picture>.

export type Theme = "light" | "dark";
export type Who = "me" | "client" | "agent" | "rule";
export type MapBox = { label: string; who: Exclude<Who, "agent"> };
export type BannerData = { name: string; headline: string; summary: string; top: MapBox[]; band: string; bottom: MapBox[]; legend: Record<Who, string> };

// The site's own tokens (system.css :root, read off the built hub): paper, ink, graphite, ledger green, its 10% tint.
const PALETTE = {
  light: { bg: "#fbfaf7", tint: "#e7eae6", ink: "#1c1c1a", muted: "#6b6a65", accent: "#2f5d50", line: "#dcd9d1", onInk: "#fbfaf7" },
  dark: { bg: "#121312", tint: "#1d2521", ink: "#ebeae5", muted: "#9b9a94", accent: "#84c7ac", line: "#34352f", onInk: "#121312" },
} as const;
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/** The banner's words and map from the site: the process page's people, top row and bottom row as its hero map draws
 *  them (an idle node is a rule that never fired), its band, the hub's legend words. */
export function bannerData(s: Site, p: ProcessPage, summary: string): BannerData {
  const people = p.pipeline.nodes.filter((n) => n.group === "human" || n.group === "me").sort((a, b) => a.row - b.row || a.col - b.col);
  const box = (n: (typeof people)[number]): MapBox => ({ label: n.label, who: n.idle ? "rule" : n.group === "me" ? "me" : "client" });
  return { name: s.name, headline: s.headline, summary, top: people.filter((n) => n.row === 0).map(box), band: p.mapBand, bottom: people.filter((n) => n.row !== 0).map(box), legend: s.ui.who };
}

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Two lines: before " with " when the headline has one (the role, then how), else at the space nearest the middle. */
export function splitHeadline(h: string): string[] {
  const w = h.indexOf(" with ");
  if (w > 0) return [h.slice(0, w), h.slice(w + 1)];
  const spaces = [...h.matchAll(/ /g)].map((m) => m.index!);
  if (!spaces.length) return [h];
  const at = spaces.reduce((a, b) => (Math.abs(b - h.length / 2) < Math.abs(a - h.length / 2) ? b : a));
  return [h.slice(0, at), h.slice(at + 1)];
}

/** The summary line's " · " parts, packed greedily into lines of at most `max` characters. */
export function wrapParts(line: string, max: number): string[] {
  const out: string[] = [];
  for (const part of line.split(" · ")) {
    const last = out.length - 1;
    if (last >= 0 && out[last].length + 3 + part.length <= max) out[last] += ` · ${part}`;
    else out.push(part);
  }
  return out;
}

const text = (x: number, y: number, size: number, fill: string, s: string, extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}"${extra}>${esc(s)}</text>`;

/** The banner: the name, the headline and the summary at the left; at the right the process page's map (client and
 *  me above and below the agents' band), a pulse running down it and along the band's stages. */
export function bannerSvg(d: BannerData, theme: Theme, stages = 8): string {
  const c = PALETTE[theme];
  const W = 1280, H = 440, x0 = 756, x1 = 1216, mid = (x0 + x1) / 2;
  const head = splitHeadline(d.headline);
  const summary = wrapParts(d.summary, 44);
  const box = (b: MapBox, x: number, y: number, w: number) => {
    const h = 54;
    const shape =
      b.who === "me"
        ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c.ink}"/>`
        : `<rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="9" fill="${c.bg}" stroke="${c.ink}" stroke-width="3"${b.who === "rule" ? ` stroke-dasharray="1 6" stroke-linecap="round"` : ""}/>`;
    return shape + text(x + w / 2, y + 34, 19, b.who === "me" ? c.onInk : c.ink, b.label, ` text-anchor="middle" font-weight="500"`);
  };
  const row = (boxes: MapBox[], y: number) => {
    const gap = 16, w = (x1 - x0 - gap * (boxes.length - 1)) / boxes.length;
    return boxes.map((b, i) => box(b, x0 + i * (w + gap), y, w)).join("");
  };
  // the legend: a swatch drawn as each kind of box, then its word (widths estimated at 0.56em a character)
  let lx = x0;
  const legend = (["me", "client", "agent", "rule"] as const)
    .map((w) => {
      const sw =
        w === "me" ? `<rect x="${lx}" y="58" width="14" height="14" rx="3" fill="${c.ink}"/>`
        : w === "client" ? `<rect x="${lx + 1}" y="59" width="12" height="12" rx="3" fill="none" stroke="${c.ink}" stroke-width="2"/>`
        : w === "agent" ? `<rect x="${lx + 1}" y="59" width="12" height="12" rx="3" fill="none" stroke="${c.muted}" stroke-width="1.5" stroke-dasharray="3 2"/>`
        : `<rect x="${lx + 1}" y="59" width="12" height="12" rx="3" fill="none" stroke="${c.ink}" stroke-width="2" stroke-dasharray="1 3" stroke-linecap="round"/>`;
      const s = sw + text(lx + 22, 71, 16, c.muted, d.legend[w]);
      lx += 22 + Math.ceil(d.legend[w].length * 16 * 0.56) + 22;
      return s;
    })
    .join("");
  // one 4-second cycle: down the first arrow (0-0.5 s), along the eight stages (0.5-2.6 s), down the second (2.6-3.1 s)
  const T = 4, sx0 = x0 + 40, sx1 = x1 - 40, step = (sx1 - sx0) / (stages - 1), sy = 268;
  const k = (s: number) => (s / T).toFixed(3);
  const dots = Array.from({ length: stages }, (_, i) => {
    const x = sx0 + i * step, at = 0.5 + i * 0.3;
    return `<circle cx="${x}" cy="${sy}" r="8" fill="${c.bg}" stroke="${c.accent}" stroke-width="2.5"><animate attributeName="fill" values="${c.bg};${c.accent};${c.accent};${c.bg};${c.bg}" keyTimes="0;0.04;0.35;0.5;1" dur="${T}s" begin="${at}s" repeatCount="indefinite"/></circle>`;
  }).join("");
  const pulse = (attr: "cx" | "cy", values: string, keyTimes: string, fixed: string) =>
    `<circle ${fixed} r="6" fill="${c.accent}"><animate attributeName="${attr}" values="${values}" keyTimes="${keyTimes}" dur="${T}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${values.split(";").map((_, i, a) => (i === 0 || i === a.length - 1 ? 0 : 1)).join(";")}" keyTimes="${keyTimes}" dur="${T}s" repeatCount="indefinite"/></circle>`;
  const arrow = (y0: number, y1: number) =>
    `<path d="M${mid} ${y0}V${y1 - 2}M${mid - 7} ${y1 - 9}l7 7 7-7" fill="none" stroke="${c.ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="${esc(`${d.name}: ${d.headline}. ${d.summary}`)}">`,
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="28" fill="${c.bg}" stroke="${c.line}" stroke-width="2"/>`,
    `<rect x="64" y="64" width="40" height="4" rx="2" fill="${c.accent}"/>`,
    text(64, 106, 24, c.accent, d.name, ` font-weight="600"`),
    ...head.map((l, i) => text(62, 176 + i * 64, 56, c.ink, l, ` font-weight="500" letter-spacing="-1"`)),
    ...summary.map((l, i) => text(64, 176 + head.length * 64 + 18 + i * 32, 21, c.muted, l)),
    legend,
    row(d.top, 92),
    arrow(146, 196),
    `<rect x="${x0 + 1}" y="198" width="${x1 - x0 - 2}" height="110" rx="14" fill="${c.tint}" stroke="${c.muted}" stroke-width="1.5" stroke-dasharray="7 6"/>`,
    text(mid, 234, 18, c.muted, d.band, ` text-anchor="middle" font-weight="500"`),
    `<line x1="${sx0}" y1="${sy}" x2="${sx1}" y2="${sy}" stroke="${c.line}" stroke-width="3"/>`,
    dots,
    pulse("cy", `146;196;196`, `0;${k(0.5)};1`, `cx="${mid}"`),
    pulse("cx", `${sx0};${sx0};${sx1};${sx1}`, `0;${k(0.5)};${k(2.6)};1`, `cy="${sy}"`),
    arrow(310, 358),
    pulse("cy", `310;310;358;358`, `0;${k(2.6)};${k(3.1)};1`, `cx="${mid}"`),
    row(d.bottom, 360),
    `</svg>`,
  ].join("\n");
}

