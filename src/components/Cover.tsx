/* eslint-disable @next/next/no-img-element -- static export, pre-sized files */
import type { Project } from "@/content/types";
import { COVER_H, COVER_W, coverShape } from "@/lib/cover";
import { srcSet } from "@/lib/thumbs";
import { COVER_ART } from "./CoverArt";
import { DeviceFrame } from "./DeviceFrame";

// `sizes` per place, from the rendered widths (so the browser picks a variant no more than ~2x the display size):
// phone frames are at most 10rem; laptop frames are 80% of the card (lead card = the wide first one) or the case rail.
const SIZES = {
  phone: "160px",
  card: "(min-width: 1000px) 250px, (min-width: 720px) 340px, 80vw",
  lead: "(min-width: 1100px) 370px, (min-width: 720px) 32vw, 80vw",
  thumb: "(min-width: 1100px) 300px, 224px",
  tiny: "64px", // archive row
};

/** Real screenshot when the project has `cover`, otherwise a generated dots-and-lines cover (decorative, no text). */
export function Cover({ p, size = "card", lead = false }: { p: Project; size?: "card" | "thumb" | "tiny"; lead?: boolean }) {
  if (p.cover) {
    const sizes = size === "tiny" ? SIZES.tiny : p.cover.frame === "phone" ? SIZES.phone : size === "thumb" ? SIZES.thumb : lead ? SIZES.lead : SIZES.card;
    return (
      <div className="cover" data-size={size} data-real>
        <DeviceFrame frame={p.cover.frame}>
          <img src={p.cover.src} srcSet={srcSet(p.cover.src)} sizes={sizes} alt={p.cover.alt} loading="lazy" />
        </DeviceFrame>
      </div>
    );
  }
  const Art = COVER_ART[p.slug];
  if (Art)
    return (
      <div className="cover" data-size={size} aria-hidden="true">
        <Art />
      </div>
    );
  const { dots, lines, bars } = coverShape(p);
  return (
    <div className="cover" data-size={size} aria-hidden="true">
      <svg viewBox={`0 0 ${COVER_W} ${COVER_H}`} focusable="false">
        {bars.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={5} rx={2.5} className="cv-bar" />
        ))}
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="cv-line" />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={size === "thumb" ? 9 : 7} className="cv-dot" data-group={d.group} />
        ))}
      </svg>
    </div>
  );
}
