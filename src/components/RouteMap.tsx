/* eslint-disable @next/next/no-img-element -- static export, 16px SVG flags */
import type { Experience } from "@/content/types";
import { careerRoute, CENTROID, project, VIEW } from "@/lib/route";

// Pacific-centred land silhouette (public/img/world-land.svg, built by scripts/world-map.ts in the same projection).
const proj = (code: string) => {
  const { x, y } = project(...CENTROID[code]);
  return { x: Math.round(x), y: Math.round(y) };
};
type Crop = keyof typeof VIEW;
// Label anchor per country and crop: [dx, dy, text-anchor]. Chosen so the four labels never meet and stay inside the crop.
const LABEL: Record<Crop, Record<string, [number, number, "start" | "end"]>> = {
  wide: { us: [14, 4, "start"], kr: [14, -6, "start"], vn: [-14, 4, "end"], sg: [14, 8, "start"] },
  narrow: { us: [-16, -8, "end"], kr: [16, -8, "start"], vn: [18, -4, "start"], sg: [18, 4, "start"] },
};

/** Arc bending to the left of travel, so A→B and B→A separate. */
const arc = (a: string, b: string) => {
  const p = proj(a);
  const q = proj(b);
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const bend = Math.min(0.28, 40 / Math.hypot(dx, dy) + 0.12);
  return `M${p.x},${p.y} Q${Math.round((p.x + q.x) / 2 + dy * bend)},${Math.round((p.y + q.y) / 2 - dx * bend)} ${q.x},${q.y}`;
};

/** Career route: dot grid, pins at country centroids, arcs in order. The ordered list is the text alternative (screen readers, phones, print). */
export function RouteMap({ items, label }: { items: Experience[]; label: string }) {
  const { stops, legs } = careerRoute(items);
  if (stops.length < 2) return null;
  return (
    // One picture with its words in the label (the ordered list below stays for print and readers that skip roles).
    <figure className="route" role="img" aria-label={`${label}: ${stops.map((s) => `${s.name} ${s.span}`).join(", ")}`}>
      {(["wide", "narrow"] as Crop[]).map((crop) => {
        const v = VIEW[crop];
        return (
          <svg key={crop} className={`route-map route-${crop}`} viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`} aria-hidden="true" focusable="false">
            <defs>
              <marker id={`route-arrow-${crop}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" className="route-head" />
              </marker>
            </defs>
            <use href="/img/world-land.svg#land" className="route-land" />
            {legs.map(([a, b], i) => (
              <path key={i} d={arc(a, b)} className="route-arc" style={{ strokeOpacity: 0.35 + (0.6 * i) / Math.max(legs.length - 1, 1) }} markerEnd={`url(#route-arrow-${crop})`} />
            ))}
            {stops.map((s) => {
              const { x, y } = proj(s.code);
              const [dx, dy, anchor] = LABEL[crop][s.code] ?? [14, 4, "start"];
              const tx = x + dx;
              const fw = crop === "narrow" ? 24 : 16;
              return (
                <g key={s.code}>
                  <circle cx={x} cy={y} r={crop === "narrow" ? 8 : 6} className="route-pin" />
                  <text x={tx} y={y + dy} textAnchor={anchor} className="route-name">
                    {s.name}
                  </text>
                  <image href={`/img/flags/${s.code}.svg`} x={anchor === "start" ? tx : tx - fw} y={y + dy + (crop === "narrow" ? 8 : 5)} width={fw} height={fw * 0.75} />
                  <text x={anchor === "start" ? tx + fw + 6 : tx - fw - 6} y={y + dy + (crop === "narrow" ? 24 : 16)} textAnchor={anchor} className="route-span">
                    {s.span}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      })}
      <ol className="route-list">
        {stops.map((s) => (
          <li key={s.code}>
            {s.name} <img className="flag" src={`/img/flags/${s.code}.svg`} alt="" width={16} height={12} loading="lazy" /> <span className="muted">{s.span}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
