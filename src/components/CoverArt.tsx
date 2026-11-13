// Hand-drawn cover art for projects whose generated cover says too little (decorative, no real names or data).
// Colours come from CSS classes (.ca-*) so dark mode and print follow the site theme. viewBox matches COVER_W x COVER_H.
import type { ReactElement } from "react";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Screenplay translation: a film strip whose frames carry two scripts and a two-way arrow, with subtitle lines. */
function FilmCover() {
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      <rect x="0" y="26" width="320" height="88" className="ca-strip" />
      {range(16).map((i) => (
        <rect key={`t${i}`} x={6 + i * 20} y="31" width="10" height="7" rx="1.5" className="ca-hole" />
      ))}
      {range(16).map((i) => (
        <rect key={`b${i}`} x={6 + i * 20} y="102" width="10" height="7" rx="1.5" className="ca-hole" />
      ))}
      {range(3).map((i) => (
        <rect key={`f${i}`} x={16 + i * 100} y="44" width="88" height="52" rx="3" className="ca-frame" />
      ))}
      <text x="60" y="76" className="ca-glyph">가</text>
      <rect x="38" y="83" width="44" height="3.5" rx="1.75" className="ca-sub" />
      <rect x="46" y="89" width="28" height="3.5" rx="1.75" className="ca-sub" />
      <path d="M134 62 H186 M179 56 L186 62 L179 68" className="ca-arrow" />
      <path d="M186 78 H134 M141 72 L134 78 L141 84" className="ca-arrow" />
      <text x="260" y="76" className="ca-glyph">A</text>
      <rect x="238" y="83" width="44" height="3.5" rx="1.75" className="ca-sub" />
      <rect x="246" y="89" width="28" height="3.5" rx="1.75" className="ca-sub" />
    </svg>
  );
}

/** Power market: three transmission towers with conductors over a faint bus network; one span is bound (highlighted). */
function GridCover() {
  const towers = [70, 160, 250];
  const top = 46, base = 128;
  const tower = (x: number) =>
    `M${x - 13} ${base} L${x - 3} ${top} L${x + 3} ${top} L${x + 13} ${base} ` + // legs
    `M${x - 18} ${top + 14} H${x + 18} M${x - 14} ${top + 30} H${x + 14} ` + // cross arms
    `M${x - 10} ${base - 20} L${x + 8} ${top + 40} M${x + 10} ${base - 20} L${x - 8} ${top + 40} ` + // lattice
    `M${x - 6} ${top + 30} L${x + 4} ${top + 14} M${x + 6} ${top + 30} L${x - 4} ${top + 14}`;
  const span = (x1: number, x2: number, y: number, dx: number) => `M${x1 + dx} ${y} Q${(x1 + x2) / 2} ${y + 14} ${x2 - dx} ${y}`;
  const net = [[18, 30], [48, 18], [110, 26], [205, 16], [292, 28], [300, 70], [30, 74]];
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      {net.slice(1).map(([x, y], i) => (
        <line key={`n${i}`} x1={net[i][0]} y1={net[i][1]} x2={x} y2={y} className="ca-net" />
      ))}
      {net.map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="3.5" className="ca-node" />
      ))}
      {towers.map((x) => (
        <path key={x} d={tower(x)} className="ca-tower" />
      ))}
      {towers.slice(1).map((x, i) => (
        <g key={`s${x}`}>
          <path d={span(towers[i], x, top + 14, -18)} className={i === 1 ? "ca-hot" : "ca-wire"} />
          <path d={span(towers[i], x, top + 14, 18)} className="ca-wire" />
          <path d={span(towers[i], x, top + 30, 14)} className="ca-wire" />
        </g>
      ))}
      <path d={`M${towers[0] - 18} ${top + 14} Q40 ${top + 22} 0 ${top + 18}`} className="ca-wire" />
      <path d={`M${towers[2] + 18} ${top + 14} Q290 ${top + 22} 320 ${top + 18}`} className="ca-wire" />
      <line x1="0" y1={base} x2="320" y2={base} className="ca-ground" />
    </svg>
  );
}


// Inline colour helpers: theme variables, so dark mode and print follow the site (no extra CSS needed).
const fill = (v: string, o = 1) => ({ fill: `var(--${v})`, fillOpacity: o });
const line = (v: string, w = 2, o = 1) => ({ fill: "none", stroke: `var(--${v})`, strokeWidth: w, strokeOpacity: o, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });
const box = { fill: "var(--card)", stroke: "var(--fg)", strokeOpacity: 0.7, strokeWidth: 1.6 };
const glyph = (size = 22) => ({ fill: "var(--accent)", fontSize: size, fontWeight: 800, textAnchor: "middle" as const });
const arrow = (x1: number, y: number, x2: number) => `M${x1} ${y} H${x2} M${x2 - 6} ${y - 5} L${x2} ${y} L${x2 - 6} ${y + 5}`;
const star = (cx: number, cy: number, r: number) =>
  range(10).map((i) => { const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; }).join(" ") + "Z";
const gear = (cx: number, cy: number, r: number, teeth = 8) =>
  range(teeth * 4).map((i) => { const a = (Math.PI * 2 * i) / (teeth * 4), rr = i % 4 < 2 ? r : r * 0.78; return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; }).join(" ") + "Z";

/** Delivery gateway: a shop, an API gateway, and a delivery truck. */
function GatewayCover() {
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      <rect x="28" y="62" width="58" height="46" style={box} />
      <path d="M24 64 L32 48 H82 L90 64 Q83 72 76 64 Q69 72 62 64 Q55 72 48 64 Q41 72 34 64 Q29 70 24 64Z" style={fill("accent")} />
      <rect x="48" y="84" width="16" height="24" style={fill("accent-soft")} />
      <path d={arrow(96, 84, 126)} style={line("accent", 2.4)} />
      <rect x="132" y="56" width="58" height="56" rx="10" style={box} />
      <text x="161" y="92" style={glyph(24)}>{"{ }"}</text>
      <path d={arrow(198, 84, 222)} style={line("accent", 2.4)} />
      <rect x="228" y="62" width="44" height="34" rx="2" style={fill("accent")} />
      <path d="M272 70 H288 L298 82 V96 H272Z" style={fill("fg", 0.8)} />
      <circle cx="242" cy="99" r="7" style={fill("fg", 0.85)} />
      <circle cx="286" cy="99" r="7" style={fill("fg", 0.85)} />
      <rect x="240" y="38" width="16" height="16" style={box} />
      <rect x="258" y="44" width="12" height="10" style={box} />
      <line x1="10" y1="108" x2="310" y2="108" style={line("muted", 1, 0.4)} />
    </svg>
  );
}

/** Manufacturing AI diagnosis: a factory, an AI gear, and a checklist under a magnifier. */
function FactoryCover() {
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      <rect x="132" y="34" width="12" height="30" style={fill("fg", 0.7)} />
      <path d="M26 112 V74 L56 58 V74 L86 58 V74 L116 58 V74 L148 58 V112Z" style={box} />
      {range(4).map((i) => <rect key={i} x={36 + i * 28} y="86" width="14" height="12" style={fill("accent-soft")} />)}
      <path d={gear(196, 76, 24)} style={fill("accent")} />
      <circle cx="196" cy="76" r="9" style={fill("card")} />
      <path d={star(222, 44, 8)} style={fill("g-external-s")} />
      <rect x="242" y="34" width="56" height="78" rx="4" style={box} />
      {range(4).map((i) => (
        <g key={i}>
          <path d={`M252 ${52 + i * 15} l4 4 l7 -8`} style={line("accent", 2)} />
          <rect x="268" y={50 + i * 15} width="22" height="4" rx="2" style={fill("muted", 0.6)} />
        </g>
      ))}
      <circle cx="286" cy="96" r="14" style={line("fg", 2.4, 0.8)} />
      <path d="M296 106 L308 118" style={line("fg", 4, 0.8)} />
      <line x1="10" y1="112" x2="230" y2="112" style={line("muted", 1, 0.4)} />
    </svg>
  );
}

/** Webtoon translator: three comic panels; a source bubble, an OCR box, a translated bubble. */
function ComicCover() {
  const bubble = (cx: number, cy: number) => `M${cx - 28} ${cy} a28 18 0 1 0 56 0 a28 18 0 1 0 -56 0 M${cx - 8} ${cy + 16} l-8 12 l16 -9`;
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      {[24, 120, 216].map((x) => <rect key={x} x={x} y="18" width="80" height="104" rx="3" style={box} />)}
      {[64, 160, 256].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="98" r="9" style={fill("muted", 0.45)} />
          <path d={`M${cx - 16} 122 q16 -18 32 0`} style={fill("muted", 0.45)} />
        </g>
      ))}
      <path d={bubble(64, 50)} style={box} />
      <text x="64" y="58" style={glyph(20)}>가</text>
      <path d={bubble(160, 50)} style={box} />
      <rect x="140" y="38" width="40" height="24" rx="2" style={{ ...line("g-external-s", 1.6), strokeDasharray: "4 3" }} />
      <rect x="146" y="46" width="28" height="4" rx="2" style={fill("muted", 0.7)} />
      <path d={bubble(256, 50)} style={box} />
      <text x="256" y="58" style={glyph(20)}>A</text>
      <path d={arrow(100, 50, 126)} style={line("accent", 2.2)} />
      <path d={arrow(196, 50, 222)} style={line("accent", 2.2)} />
    </svg>
  );
}

/** External AI usage policy: AI chat, a shield with a lock, and a checklist. */
function PolicyCover() {
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      <path d="M26 36 H96 a8 8 0 0 1 8 8 V78 a8 8 0 0 1 -8 8 H54 l-12 12 V86 H26 a8 8 0 0 1 -8 -8 V44 a8 8 0 0 1 8 -8Z" style={box} />
      <text x="61" y="70" style={glyph(22)}>AI</text>
      <path d={arrow(112, 70, 134)} style={line("accent", 2.4)} />
      <path d="M160 26 L190 38 V68 Q190 100 160 114 Q130 100 130 68 V38Z" style={{ ...fill("accent-soft"), stroke: "var(--accent)", strokeWidth: 2.4 }} />
      <rect x="148" y="66" width="24" height="20" rx="3" style={fill("fg", 0.8)} />
      <path d="M153 66 V58 a7 7 0 0 1 14 0 V66" style={line("fg", 3, 0.8)} />
      <path d={arrow(198, 70, 220)} style={line("accent", 2.4)} />
      <rect x="228" y="30" width="66" height="84" rx="4" style={box} />
      {range(4).map((i) => (
        <g key={i}>
          <path d={`M238 ${50 + i * 16} l4 4 l7 -8`} style={line("accent", 2)} />
          <rect x="254" y={48 + i * 16} width="30" height="4" rx="2" style={fill("muted", 0.6)} />
        </g>
      ))}
    </svg>
  );
}

/** Recommendation data prep: ragged rows, a funnel, clean rows with stars. */
function DataPrepCover() {
  const ragged = [[24, 70], [38, 52], [22, 80], [44, 40], [28, 64], [36, 58]];
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      {ragged.map(([x, w], i) => <rect key={i} x={x} y={30 + i * 14} width={w} height="7" rx="3.5" style={fill("muted", 0.55)} />)}
      <path d="M128 34 H196 L172 70 V104 L152 112 V70Z" style={box} />
      <path d={arrow(108, 70, 124)} style={line("accent", 2.2)} />
      <path d={arrow(200, 70, 214)} style={line("accent", 2.2)} />
      {range(5).map((i) => (
        <g key={i}>
          <rect x="222" y={34 + i * 16} width="48" height="8" rx="4" style={fill("accent", 0.85)} />
          <path d={star(286, 38 + i * 16, 6)} style={fill(i < 3 ? "g-external-s" : "muted", i < 3 ? 1 : 0.4)} />
        </g>
      ))}
    </svg>
  );
}

/** Academy student portfolio: a graduation cap and a grid of work cards. */
function AcademyCover() {
  return (
    <svg viewBox="0 0 320 140" focusable="false">
      <path d="M22 58 L66 40 L110 58 L66 76Z" style={fill("fg", 0.8)} />
      <path d="M40 66 V86 Q66 100 92 86 V66 L66 76Z" style={fill("fg", 0.6)} />
      <path d="M104 60 V84" style={line("accent", 2.4)} />
      <circle cx="104" cy="88" r="4" style={fill("accent")} />
      {range(6).map((i) => {
        const x = 132 + (i % 3) * 58, y = 22 + Math.floor(i / 3) * 52;
        return (
          <g key={i}>
            <rect x={x} y={y} width="50" height="44" rx="4" style={box} />
            <rect x={x + 6} y={y + 6} width="38" height="20" rx="2" style={fill(i === 1 ? "accent" : "accent-soft", i === 1 ? 0.85 : 1)} />
            <rect x={x + 6} y={y + 31} width="26" height="4" rx="2" style={fill("muted", 0.6)} />
          </g>
        );
      })}
      <path d={star(222, 26, 7)} style={fill("g-external-s")} />
    </svg>
  );
}

export const COVER_ART: Partial<Record<string, () => ReactElement>> = {
  "screenplay-translation": FilmCover,
  "grid-constraint-analysis": GridCover,
  "commerce-delivery-gateway": GatewayCover,
  "manufacturing-ax": FactoryCover,
  "webtoon-translation": ComicCover,
  "ai-usage-policy": PolicyCover,
  "recsys-data-prep": DataPrepCover,
  "academy-portfolio": AcademyCover,
};
