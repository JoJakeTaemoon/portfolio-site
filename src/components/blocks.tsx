// Server components: all content lands in the static HTML.
import { Fragment, type CSSProperties, type ReactNode } from "react";
import type { CaseStudy, CodeShot, Decision, Diagram, DiagramNode, Experience, Metric, Paragraphs, SetBy, Site } from "@/content/types";
import { FLAG } from "@/lib/route";
import { count, firstSentence, shownOptions, splitIds } from "@/lib/template";

export function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="section">
      <h2 id={`${id}-h`}>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
      {children}
    </section>
  );
}

/** Keeps "D-173" / "ADR-0004" on one line (R-08); the text itself is unchanged. */
export const Ids = ({ t }: { t: string }) =>
  splitIds(t).map((part, i) => (i % 2 ? <span key={i} className="nowrap">{part}</span> : <Fragment key={i}>{part}</Fragment>));

export const Prose = ({ p }: { p: Paragraphs }) => (
  <div className="prose">
    {p.map((t) => (
      <p key={t}>
        <Ids t={t} />
      </p>
    ))}
  </div>
);

const RESULTS_SHOWN = 3; // lead + first 3 results; the rest sit behind a native disclosure (open in print)

/** A list shown up to a fold: `desk` items from 1280px, `tab` from 640px, `phone` (no more than desk) under 640px. The
 *  items between phone and the lower of tab and desk stand open from 640px by CSS (details.fig-fold); with fewer on a
 *  tablet, those up to desk stand open from 1280px (details.wide-fold), with more, those up to tab stand open from 640
 *  to 1279px only (details.tab-fold; task 27); with more on a phone than on a tablet, those between stand open under
 *  640px and from 1280px (details.mid-fold). The rest fold at every width. All of it stays in the HTML, open in print. */
export function Folded<T>({ items, desk, tab = desk, phone, label, render }: { items: T[]; desk: number; tab?: number; phone?: number; label: (n: number) => string; render: (xs: T[]) => ReactNode }) {
  const n = items.length;
  const d = Math.min(desk, n);
  const t = Math.min(tab, n);
  const lo = Math.min(d, t), hi = Math.max(d, t);
  const m = Math.min(phone ?? lo, lo);
  const rest = n > hi && (
    <details className="fold">
      <summary>{label(n - hi)}</summary>
      {render(items.slice(hi))}
    </details>
  );
  // between the tablet's count and the desktop's: open from 1280px (fewer on a tablet) or from 640 to 1279px (more)
  const tail =
    lo < hi ? (
      <details className={t < d ? "fold wide-fold" : "fold tab-fold"}>
        <summary>{label(hi - lo)}</summary>
        {render(items.slice(lo, hi))}
        {rest}
      </details>
    ) : (
      rest
    );
  // more on a phone than on a tablet: those between stand open under 640px and from 1280px (details.mid-fold)
  const p = Math.min(phone ?? lo, d);
  if (p > t)
    return (
      <>
        {t > 0 && render(items.slice(0, t))}
        <details className="fold mid-fold">
          <summary>{label(d - t)}</summary>
          {render(items.slice(t, p))}
          {p < d ? (
            <details className="fold wide-fold">
              <summary>{label(d - p)}</summary>
              {render(items.slice(p, d))}
              {rest}
            </details>
          ) : (
            rest
          )}
        </details>
      </>
    );
  return (
    <>
      {m > 0 && render(items.slice(0, m))}
      {m < lo ? (
        <details className="fold fig-fold">
          <summary>{label(lo - m)}</summary>
          {render(items.slice(m, lo))}
          {tail}
        </details>
      ) : (
        tail
      )}
    </>
  );
}

/** Result items: the first 3 (or the case's own count), then the rest folded. */
export function ResultList({ items, more, shown = RESULTS_SHOWN, phone }: { items: string[]; more: string; shown?: number; phone?: number }) {
  return (
    <Folded
      items={items}
      desk={shown}
      phone={phone}
      label={(n) => count(more, n)}
      render={(xs) => (
        <ul className="case-list">
          {xs.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    />
  );
}

/** The who chip each way of setting a decision wears (spec §0, §4). */
const SET_BY_WHO: Record<SetBy, "me" | "client" | "agent"> = { "agent-default": "agent", revised: "client", "own-input": "me", "own-confirmed": "me", client: "client" };

// D-031: summary = decision + result in one line each; options only when 2+ were recorded.
export function Decisions({ items, ui, after, terse, terseTab, pad }: { items: Decision[]; ui: Site["ui"]["decision"]; after?: Record<string, ReactNode>; terse?: boolean; terseTab?: boolean; pad?: number }) {
  return (
    <div className={["decisions", terse && "decisions--terse", terseTab && "decisions--terse-tab"].filter(Boolean).join(" ")} style={pad === undefined ? undefined : ({ "--dec-pad": `${pad}px` } as CSSProperties)}>
      {items.map((d) => {
        const options = shownOptions(d.options);
        return (
          <Fragment key={d.title}>
            <details className="decision">
              <summary>
                <strong>{d.title}</strong>
                {d.id && <span className="tag">{d.id}</span>}
                {/* who set it (D-057 ②, M-03): only where the facts record it */}
                {d.setBy && (
                  <span className="who" data-who={SET_BY_WHO[d.setBy]}>
                    {ui.setBy[d.setBy]}
                  </span>
                )}
                <span className="gist gist--decision">
                  <b>{ui.decision}</b> <Ids t={firstSentence(d.decision)} />
                </span>
                <span className="gist">
                  <b>{ui.result}</b> <Ids t={firstSentence(d.result)} />
                </span>
              </summary>
              <dl>
                <dt>{ui.problem}</dt>
                <dd>
                  <Ids t={d.problem} />
                </dd>
                {options.length > 0 && (
                  <>
                    <dt>{ui.options}</dt>
                    <dd>
                      <ul className="options">
                        {options.map((o, i) => (
                          <li key={o} data-chosen={i === d.chosen || undefined}>
                            {o}
                            {i === d.chosen && <span className="sr-only"> ({ui.chosen})</span>}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </>
                )}
                <dt>{ui.decision}</dt>
                <dd>
                  <Ids t={d.decision} />
                </dd>
                <dt>{ui.result}</dt>
                <dd>
                  <Ids t={d.result} />
                </dd>
                {d.cost && (
                  <>
                    <dt>{ui.cost}</dt>
                    <dd>
                      <Ids t={d.cost} />
                    </dd>
                  </>
                )}
              </dl>
            </details>
            {d.id && after?.[d.id]}
          </Fragment>
        );
      })}
    </div>
  );
}

// Native disclosures, the first open (R-01), the rest closed until opened, no JS. Each step's leading circled number
// ("①") is drawn as a numbered circle on a line that runs through the steps. The intro is the caller's.
const CIRCLED = /^([\u2460-\u2473])\s*/;
export function Trace({ steps, pad, padDesk }: { steps: CaseStudy["trace"]["steps"]; pad?: number; padDesk?: number }) {
  const px = (n?: number) => (n === undefined ? undefined : `${n}px`);
  return (
    <>
      <ol className="trace" style={{ "--step-pad": px(pad), "--step-pad-desk": px(padDesk) } as CSSProperties}>
        {steps.map((s, i) => {
          const m = s.step.match(CIRCLED);
          return (
            <li key={s.step}>
              <details open={i === 0}>
                <summary>
                  <span className="trace-n">{m ? m[1].charCodeAt(0) - 0x245f : i + 1}</span>
                  <span>
                    <Ids t={m ? s.step.slice(m[0].length) : s.step} />
                  </span>
                </summary>
                <p>
                  <Ids t={s.evidence} />
                </p>
              </details>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function Metrics({ items }: { items: Metric[] }) {
  return (
    <dl className="metrics">
      {items.map((m) => (
        <div key={m.label}>
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CodeShots({ items, scrollHint }: { items: CodeShot[]; scrollHint: string }) {
  return (
    <div className="codeshots">
      {items.map((c) => (
        <figure key={c.src} className="codeshot">
          {/* the file and what it shows above the excerpt (task 25: nothing under a visual) */}
          <p className="fig-claim">
            <code>{c.path}</code> · {c.caption}
          </p>
          <p className="scroll-hint" aria-hidden="true">
            {scrollHint}
          </p>
          <div className="codeshot-scroll">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt={c.alt} loading="lazy" />
          </div>
        </figure>
      ))}
    </div>
  );
}

const OPEN_RECENT = 3; // hub: details of the latest 3 roles are open

/** One role as a row: "role · org" ..... [period]. `body` false = the row alone (summary PDF, early roles). */
function Job({ e, ui, open, body = true }: { e: Experience; ui: Site["ui"]; open: boolean; body?: boolean }) {
  const row = (
    <>
      <span className="job-title">
        {e.role} · {e.org}
      </span>
      <span className="job-leader" aria-hidden="true" />
      <span className="job-period">{e.period}</span>
    </>
  );
  if (!body) return <li><div className="job-row">{row}</div></li>;
  return (
    <li>
      <details className="job" open={open}>
        <summary className="job-row">{row}</summary>
        <div className="job-body">
          <p className="muted small">
            <Place text={e.place} />
            {e.concurrent !== undefined && (
              <>
                {" · "}
                <span className="tag">{ui.concurrent}</span> {e.concurrent}
              </>
            )}
          </p>
          {e.focus && <p className="focus small">{e.focus}</p>}
          <ul>
            {e.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}

/**
 * Hub (fold): latest 3 roles open, other recent roles collapsed, early ones in one fold.
 * Summary PDF (fold=false): every role as a compact row; recent ones with details, early ones as the row alone.
 */
export function Career({ items, ui, fold }: { items: Experience[]; ui: Site["ui"]; fold: boolean }) {
  const recent = items.filter((e) => !e.early);
  const early = items.filter((e) => e.early);
  const label = `${ui.earlyCareer.replace("{n}", String(early.length))} — ${early.map((e) => e.org).join(" · ")}`;
  const list = (es: Experience[], first: number, body = true) => (
    <ol className="career">
      {es.map((e, i) => (
        <Job key={e.org + e.period} e={e} ui={ui} open={!fold || first + i < OPEN_RECENT} body={body} />
      ))}
    </ol>
  );
  return (
    <>
      {list(recent, 0)}
      {early.length > 0 &&
        (fold ? (
          <details className="early">
            <summary>{label}</summary>
            {list(early, OPEN_RECENT)}
          </details>
        ) : (
          list(early, 0, false)
        ))}
    </>
  );
}

export function Place({ text }: { text: string }) {
  return text.split(" · ").map((name, i) => (
    <Fragment key={name}>
      {i > 0 && " · "}
      {name}
      {/* eslint-disable-next-line @next/next/no-img-element -- 16px static SVG */}
      {FLAG[name] && <img className="flag" src={`/img/flags/${FLAG[name]}.svg`} alt="" width={16} height={12} />}
    </Fragment>
  ));
}

/** The pipeline drawn small, its boxes at their places in the big drawing (DiagramView's 200-unit cells, 164x60 boxes):
 *  the nodes a practice or gate works on lit in the accent, their names as chips beside the drawing (R-10); the
 *  people's boxes by who holds them (spec §0). */
export function PipelineMap({ d, at = [] }: { d: Diagram; at?: string[] }) {
  const person = (n: DiagramNode) => n.group === "human" || n.group === "me";
  const rects = d.nodes.map((n) => (
    <rect
      key={n.id}
      x={n.col * 200 + 18}
      y={n.row * 100 + 20}
      width={164}
      height={60}
      rx={person(n) ? 30 : 10}
      data-group={n.group}
      data-idle={n.idle || undefined}
      data-lit={at.includes(n.id) || undefined}
    />
  ));
  const viewBox = `0 0 ${d.cols * 200} ${d.rows * 100}`;
  return (
    <div className="pmap">
      <svg className="pipe-map" viewBox={viewBox} aria-hidden="true">
        {rects}
      </svg>
      <ul className="pmap-names">
        {d.nodes
          .filter((n) => at.includes(n.id))
          .map((n) => (
            <li key={n.id}>{n.label}</li>
          ))}
      </ul>
    </div>
  );
}
