// Career route: places and years come from site.experience, nothing hard-coded per person.
import type { Experience } from "../content/types.ts";

// Flags from flag-icons (MIT, public/img/flags/LICENSE). Keys are the place names used in site.ko / site.en.
export const FLAG: Record<string, string> = { 한국: "kr", Korea: "kr", 베트남: "vn", Vietnam: "vn", 싱가포르: "sg", Singapore: "sg", 미국: "us", US: "us" };

/** Pacific-centred equirectangular projection shared by the route map and the land silhouette (scripts/world-map.ts).
 * Longitudes west of 30°W wrap past 180°, so Asia sits left, the Pacific in the middle, the Americas right. */
export const MAP = { k: 4, lon0: 60, latTop: 72 };
export const wrapLon = (lon: number) => (lon < MAP.lon0 - 90 ? lon + 360 : lon);
export const project = (lon: number, lat: number) => ({ x: (wrapLon(lon) - MAP.lon0) * MAP.k, y: (MAP.latTop - lat) * MAP.k });
/** Map crops in projected px: wide for screens ≥ 720px, narrow (East Asia to the US) for phones. */
export const VIEW = { wide: { x: 0, y: 40, w: 960, h: 300 }, narrow: { x: 120, y: 70, w: 720, h: 262 } };

/** Approximate country centroids [lon, lat] for the schematic map. */
export const CENTROID: Record<string, [number, number]> = { kr: [127.8, 36.5], vn: [106, 16], sg: [103.8, 1.35], us: [-98, 39] };

export type Stop = { code: string; name: string; span: string };
export type Route = { stops: Stop[]; legs: [string, string][] };

const years = (period: string) => {
  const [a, b = ""] = period.split(/\s*[–-]\s*/);
  const from = parseInt(a, 10);
  const to = /\d{4}/.test(b) ? parseInt(b, 10) : b ? Infinity : from; // "현재"/"present" = still there
  return { from, to, end: b || a };
};

/** Stops in order of first arrival; legs between consecutive different places, oldest role first. */
export function careerRoute(items: Experience[]): Route {
  const seq = items
    .map((e, i) => ({ e, i, y: years(e.period) }))
    .sort((a, b) => a.y.from - b.y.from || b.i - a.i) // list is newest first: same start year = later in the list came first
    .flatMap(({ e, y }) => e.place.split(" · ").filter((n) => FLAG[n]).map((name) => ({ name, code: FLAG[name], y })));

  const stops: Stop[] = [];
  const range = new Map<string, { from: number; to: number; end: string }>();
  for (const { name, code, y } of seq) {
    const r = range.get(code);
    if (!r) {
      stops.push({ code, name, span: "" });
      range.set(code, { ...y });
    } else if (y.to > r.to) {
      r.to = y.to;
      r.end = y.end;
    }
  }
  for (const s of stops) {
    const r = range.get(s.code)!;
    const end = r.end.match(/\d{4}/)?.[0] ?? r.end;
    s.span = String(r.from) === end ? `${r.from}` : `${r.from} – ${end}`;
  }

  const legs: [string, string][] = [];
  seq.forEach(({ code }, i) => i && seq[i - 1].code !== code && legs.push([seq[i - 1].code, code]));
  return { stops, legs };
}
