import { site } from "@/content";
import type { Site, TimelineVisual } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { count } from "@/lib/template";
import { timelineBand } from "@/lib/timeline";
import { Ids } from "@/components/blocks";
import { TimelineSync } from "@/components/TimelineSync";
import { Fig } from "./Fig";

// One format per locale: "2026년 6월 13일" / "Jun 13, 2026"; month-only dates drop the day.
const fmt = (lang: Locale, d: string) =>
  new Intl.DateTimeFormat(lang, { timeZone: "UTC", year: "numeric", month: lang === "ko" ? "long" : "short", day: d.length > 7 ? "numeric" : undefined }).format(new Date(d));
const monthName = (lang: Locale, m: number) => new Intl.DateTimeFormat(lang, { timeZone: "UTC", month: "short" }).format(new Date(Date.UTC(2000, m, 1)));

const ROWS = 5; // dated rows shown before the fold

/* The band of dates and spans, drawn (task 27): an SVG at the figure's width, so its ticks and labels are one picture,
   not text blocks of the page off its lines. x is a percentage of the band; each dot, tick label and span label is a
   nested <svg> at its percentage, its own content in px round it. A span's label sits under its bar, from the bar's
   start (or ending at its end past the middle); a label too long for the narrowest band (300px) starts on the band's
   left edge instead. */
const NARROW = 300;
const textPx = (t: string) => [...t].reduce((w, c) => w + (c.charCodeAt(0) > 0x2e80 ? 11.5 : 6.6), 0);
const AXIS_Y = 12, SPAN_Y = 52, SPAN_H = 40;
function Band({ v, lang, days, day }: { v: TimelineVisual; lang: Locale; days: string; day: string }) {
  const band = timelineBand(v.items, v.spans);
  const spans = (v.spans ?? []).map((s, i) => {
    const { left, width, days: d } = band.spans[i];
    const text = `${s.label} · ${d}${lang === "en" ? " " : ""}${d === 1 ? day : days}`;
    const w = textPx(text), end = left + width;
    // from the bar's start; past the middle, ending at the bar's end; else from the band's left edge
    const at = left <= 50 && (left / 100) * NARROW + w <= NARROW ? { x: left, anchor: "start" as const } : left > 50 && (end / 100) * NARROW >= w ? { x: end, anchor: "end" as const } : { x: 0, anchor: "start" as const };
    return { left, width, text, ...at };
  });
  return (
    <div className="tband">
      <svg className="tband-svg" width="100%" height={SPAN_Y + spans.length * SPAN_H - 8} role="img" aria-label={spans.map((s) => s.text).join("; ") || v.title}>
        <line className="tband-line" x1="0" x2="100%" y1={AXIS_Y} y2={AXIS_Y} />
        {band.ticks.map((t, i) => (
          <svg key={i} x={`${t.pct}%`} y={AXIS_Y} overflow="visible" className="tband-tick">
            <line x1="0" x2="0" y1="0" y2="9" />
            {t.label && (
              <text y="25" textAnchor={t.pct < 4 ? "start" : t.pct > 96 ? "end" : "middle"}>
                {t.label === "year" ? t.year : monthName(lang, t.month)}
              </text>
            )}
          </svg>
        ))}
        {band.groups.map((g) => {
          const label = g.count > 1 ? `${g.from}–${g.to}` : String(g.from);
          const w = Math.max(22, label.length * 6.5 + 12);
          return (
            <svg key={g.from} x={`${g.pct}%`} y={AXIS_Y} overflow="visible" className="tband-dot" data-n={g.count} data-from={g.from} data-to={g.to}>
              <rect x={-w / 2} y={-11} width={w} height={22} rx={11} />
              <text y="4" textAnchor="middle">{label}</text>
            </svg>
          );
        })}
        {spans.map((s, i) => (
          <g key={i} className="tband-span">
            <rect x={`${s.left}%`} y={SPAN_Y + i * SPAN_H} width={`${Math.max(s.width, 0.8)}%`} height={16} rx={4} />
            <text x={`${s.x}%`} y={SPAN_Y + i * SPAN_H + 31} textAnchor={s.anchor}>{s.text}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function TimelineView({ v, lang, ui, rows: shown = ROWS, rowsTab }: { v: TimelineVisual; lang: Locale; ui: Site["ui"]["visual"]; rows?: number; rowsTab?: number }) {
  // under 1280px a case may show fewer rows (rowsTab, task 27): the ones between stand open from 1280px
  const tab = Math.min(rowsTab ?? shown, shown);
  const rows = (items: TimelineVisual["items"], from: number) => (
    <ol className="timeline vtimeline" start={from + 1}>
        {items.map((it, k) => {
          const i = from + k;
          return (
          <li key={it.date + it.label}>
            <span className="tnum" aria-hidden="true">
              {i + 1}
            </span>
            <time dateTime={it.date}>{fmt(lang, it.date)}</time>
            <div>
              <strong>
                <Ids t={it.label} />
              </strong>
              {it.note && (
                <p className="muted small">
                  <Ids t={it.note} />
                </p>
              )}
            </div>
          </li>
        );
        })}
    </ol>
  );
  const rest = v.items.length > shown && (
    <details className="fold">
      <summary>{count(site[lang].ui.rowsMore, v.items.length - shown)}</summary>
      {rows(v.items.slice(shown), shown)}
    </details>
  );
  return (
    <Fig title={v.title} caption={v.caption}>
      <TimelineSync>
      {v.stats && (
        <dl className="t-stats">
          {v.stats.map((t) => (
            <div key={t.label}>
              <dt>{t.label}</dt>
              <dd>{t.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Band v={v} lang={lang} days={ui.days} day={ui.day} />
      {/* the first rows, then the rest folded (task 25: one section holds its screens; print opens it) */}
      {rows(v.items.slice(0, tab), 0)}
      {tab < shown ? (
        <details className="fold wide-fold">
          <summary>{count(site[lang].ui.rowsMore, shown - tab)}</summary>
          {rows(v.items.slice(tab, shown), tab)}
          {rest}
        </details>
      ) : (
        rest
      )}
      </TimelineSync>
    </Fig>
  );
}
