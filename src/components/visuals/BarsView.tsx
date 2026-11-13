import type { BarsVisual, Site } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { Fig } from "./Fig";

// Baseline 0, one color per series, values written out. Bars are border-free blocks with print-color-adjust.
// With `series`, each row has two bars (value, value2) and values may be negative: the zero line moves right.
export function BarsView({ v, lang, ui }: { v: BarsVisual; lang: Locale; ui: Site["ui"]["visual"] }) {
  const vals = v.bars.flatMap((b) => (b.value2 === undefined ? [b.value] : [b.value, b.value2]));
  const pos = v.max ?? Math.max(0, ...vals);
  const neg = Math.max(0, ...vals.map((x) => -x));
  const w = (n: number) => `calc((100% - 6.5rem) * ${n / (pos + neg || 1)})`;
  const num = (x: number) => (x < 0 ? "−" : "") + Math.abs(x).toLocaleString(lang);
  const track = (x: number, cls: string, name?: string) => (
    <span className={neg ? "bar-track signed" : "bar-track"} style={neg ? { backgroundPosition: `${w(neg)} 0` } : undefined}>
      {neg > 0 && <span className="bar-pad" style={{ width: w(neg - Math.max(0, -x)) }} />}
      <span className={cls} style={{ width: w(Math.abs(x)) }} />
      <span className="bar-val">
        {name && <span className="muted">{name} </span>}
        {num(x)}
        {lang === "ko" ? "" : " "}
        <span className="muted">{v.unit}</span>
      </span>
    </span>
  );
  return (
    <Fig title={v.title} caption={v.caption} source={`${ui.source}: ${v.source}`}>
      <ul className="bars" aria-label={v.unit}>
        {v.bars.map((b) => (
          <li key={b.label}>
            <span className="bar-label">{b.label}</span>
            {b.value2 === undefined ? (
              track(b.value, "bar")
            ) : (
              <span className="bar-pair">
                {track(b.value, "bar", v.series?.[0])}
                {track(b.value2, "bar bar-2", v.series?.[1])}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Fig>
  );
}
