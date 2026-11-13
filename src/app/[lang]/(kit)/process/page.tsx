import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { PipelineMap } from "@/components/blocks";
import { PrintId } from "@/components/CaseView";
import { DiagramView } from "@/components/DiagramView";
import { KitFooter, KitHeader, hubNav } from "@/components/KitChrome";
import { diagramLabels } from "@/components/visuals/VisualView";
import { isSlug, processPage, projects, site } from "@/content";
import { siteUrl } from "@/content/meta";
import type { ProcessPage, Site } from "@/content/types";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { count } from "@/lib/template";
import { pdfHref } from "@/lib/pdf";

export async function generateMetadata({ params }: PageProps<"/[lang]/process">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = processPage[lang];
  const { name } = site[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: `${name}: ${p.title}` },
    description: p.lead,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/process/`])) },
    openGraph: { type: "article", title: p.title, description: p.lead, images: [`/img/share-${lang}.jpg`] },
    twitter: { card: "summary_large_image" },
    other: { "site-kind": "other", "page-type": "service" },
  };
}

/* type: service (site-kind other), the hub's deal kept (palette, rethink, nav-centre, footer-dark, close-word's head
   row, rhythm space, buttons block, mark stack); in the kit layout since task 26.
   deal (task 26): hero deal.mjs --type service --has ui: split. The picture (task 13a, M-13; three bands since 13f):
   the people's places (the client, mine, the rule that never fired) over and under one band for the agents, as the
   page claims: the agents in the middle, people at its edges (it was the EWA worker app, which said nothing of the
   method).
   moment (moments.mjs pick --page service --count 1 --photo; four sections, so one): photo-chapters and
   picture-develops (no photographs) and pinned-chapters (no 2-4 steps with a picture each: the pipeline is one
   drawing, the practices and the gates five each) dealt again with each excluded: word-highlight on the pipeline's
   claim (its intro) in #pipeline, over the drawing.
   sections: #pipeline (the claim, the drawing, its notes folded), #practices and #gates (the kit's cards, each with
   the pipeline drawn small and the nodes it works on lit, their names beside), #harness (task 13a, M-12: how the
   setup changed over the six 2026 projects, each row linked to its case). */
export default async function Process({ params }: PageProps<"/[lang]/process">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const p = processPage[lang];
  const { ui, hub, contact } = site[lang];
  const other: Locale = lang === "ko" ? "en" : "ko";
  const otherHref = `/${other}/process/`;
  return (
    <>
      <KitHeader lang={lang} base={`/${lang}/`} otherHref={otherHref} />
      <main id="top" className="case process">
        <section className="hero hero--split" data-enter aria-labelledby="process-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <h1 id="process-h">{p.title}</h1>
                <PrintId lang={lang} path={`/${lang}/process/`} />
                <p className="hero__lead">{p.lead}</p>
                <div className="btn-row">
                  <a className="btn btn--primary" href={`mailto:${contact.email}`}>
                    {hub.email}
                  </a>
                  <a className="btn btn--secondary" href={pdfHref(lang, "how-i-work")} download>
                    {ui.downloadPagePdf}
                  </a>
                </div>
              </div>
              <div className="hero__media span-6 start-7 case-art" data-art="map">
                <PeopleMap p={p} who={ui.who} />
              </div>
            </div>
          </div>
        </section>

        {/* the pipeline's claim is the statement that lights up (word-highlight), the drawing under it */}
        <section className="section" id="pipeline" data-moment="word-highlight" aria-labelledby="pipeline-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="pipeline-h">{ui.pipeline}</h2>
              <p>{p.pipelineTitle}</p>
            </div>
            <p className="mo-wh__text">{p.pipeline.intro}</p>
            <div className="case-wide">
              <DiagramView diagram={p.pipeline} title={p.pipelineTitle} labels={{ ...diagramLabels(ui), notes: ui.visual.notes }} />
            </div>
          </div>
        </section>

        <Cards id="practices" title={ui.practices} items={p.practices} p={p} more={ui.rowsMore} lang={lang} evidence={ui.evidence} />
        <Cards id="gates" title={ui.gates} items={p.gates} p={p} more={ui.rowsMore} lang={lang} evidence={ui.evidence} />
        <Harness p={p} lang={lang} />
      </main>
      <KitFooter lang={lang} otherHref={otherHref} page={{ title: hub.menu, links: hubNav(lang, `/${lang}/`) }} />
    </>
  );
}

/** The hero's map (M-13; round-2 re-check ①): three bands, the people at the edges and the agents between them. The
 *  client and my sign-off on top, one dashed band for the agents' stages and roles, my release go-ahead and the rule
 *  that never fired under it; boxes by who holds them (spec §0), the legend's four chips over them. HTML boxes, so the
 *  map takes the frame's height at every width and its words stay at their size. */
function PeopleMap({ p, who }: { p: ProcessPage; who: Site["ui"]["who"] }) {
  const people = p.pipeline.nodes.filter((n) => n.group === "human" || n.group === "me").sort((a, b) => a.row - b.row || a.col - b.col);
  const holder = (n: (typeof people)[number]) => (n.idle ? "rule" : n.group === "me" ? "me" : "client");
  const row = (top: boolean) => (
    <ul className="pb-row">
      {people
        .filter((n) => (n.row === 0) === top)
        .map((n) => (
          <li key={n.id} className="pb-box" data-who={holder(n)}>
            {n.label}
          </li>
        ))}
    </ul>
  );
  const arrow = (
    <svg className="pb-arrow" viewBox="0 0 12 28">
      <path d="M6 1v25M1 21l5 5 5-5" />
    </svg>
  );
  const label = `${p.pipelineTitle}: ${people.map((n) => `${n.label} (${who[holder(n)]})`).join(", ")}; ${p.mapBand}`;
  return (
    <div className="case-drawing pmap-bands" role="img" aria-label={label}>
      <ul className="pmap-legend">
        {(["me", "client", "agent", "rule"] as const).map((w) => (
          <li key={w}>
            <span className="who" data-who={w}>
              {who[w]}
            </span>
          </li>
        ))}
      </ul>
      {row(true)}
      {arrow}
      <p className="pb-band">{p.mapBand}</p>
      {arrow}
      {row(false)}
    </div>
  );
}

/** The kit's cards: the title, the body, then the pipeline drawn small with the nodes this one works on lit. Three to a
 *  row, then two; on a phone the fifth card is a closed disclosure (open by CSS from 640px), so the section holds two
 *  screens there. */
function Cards({ id, title, items, p, more, lang, evidence }: { id: string; title: string; items: ProcessPage["practices"]; p: ProcessPage; more: string; lang: Locale; evidence: string }) {
  return (
    <section className="section" id={id} style={{ "--hm": 2 } as CSSProperties} aria-labelledby={`${id}-h`}>
      <div className="wrap">
        <div className="section-head">
          <h2 id={`${id}-h`}>{title}</h2>
        </div>
        <div className="grid grid--top pipe-cards">
          {items.map((x, i) => {
            const body = (
              <>
                {/* the title links to where the claim's evidence is shown (R-05; a row of its own put the cards
                    section past its screen) */}
                <h3>
                  {x.ev ? (
                    <a className="pipe-ev" href={`/${lang}/work/${x.ev.replace("#", "/#")}`}>
                      {x.title}
                      <span className="sr-only"> · {evidence}</span>
                    </a>
                  ) : (
                    x.title
                  )}
                </h3>
                <p>{x.body}</p>
                <div className="panel pipe-panel">
                  <PipelineMap d={p.pipeline} at={x.at} />
                </div>
              </>
            );
            // a card whose title links to its evidence lifts on hover as the kit's linked cards do
            const cls = `card ${x.ev ? "" : "m-nolift "}${i < 3 ? "span-4" : "span-6"}`;
            return i < 4 ? (
              <article key={x.title} className={cls}>
                {body}
              </article>
            ) : (
              <details key={x.title} className={`${cls} fold fig-fold`}>
                <summary>{count(more, items.length - 4)}</summary>
                {body}
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** M-12: how the setup changed over the six 2026 projects (one table, time order); each row's head links to its case,
 *  the page's own row (focus) marked. Only what was there is written: no "none" cells. Under 640px each row is a block
 *  and each cell says its column. */
function Harness({ p, lang }: { p: ProcessPage; lang: Locale }) {
  const { ui } = site[lang];
  const h = p.harness;
  const cell = (label: string, body: ReactNode) => (
    <td>
      <span className="cell-label" aria-hidden="true">
        {label}
      </span>
      {body}
    </td>
  );
  return (
    <section className="section" id="harness" style={{ "--hm": 2 } as CSSProperties} aria-labelledby="harness-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="harness-h">{h.title}</h2>
          {h.intro && <p>{h.intro}</p>}
        </div>
        {/* the table is the section's figure: on the figures' drafting ground */}
        <div className="harness-ground">
        <table className="harness">
          <caption className="sr-only">{h.title}</caption>
          <colgroup>
            {[22, 14, 22, 21, 21].map((w, i) => (
              <col key={i} style={{ width: `${w}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {[h.cols.project, h.cols.roles, h.cols.enforced, h.cols.gate, h.cols.changed].map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {h.rows.map((r) => {
              const c = isSlug(r.slug) ? projects[lang][r.slug] : undefined;
              return (
                <tr key={r.slug} data-focus={r.slug === h.focus || undefined}>
                  <th scope="row">
                    <span className="harness-period">{c?.facts.period}</span>
                    <a href={`/${lang}/work/${r.slug}/`}>{c?.domain}</a>
                  </th>
                  {cell(h.cols.roles, r.roles)}
                  {cell(h.cols.enforced, r.enforced)}
                  {cell(
                    h.cols.gate,
                    r.gate.map((g) => (
                      <span className="harness-gate" key={g.text}>
                        <span className="who" data-who={g.who}>
                          {ui.who[g.who]}
                        </span>{" "}
                        {g.text}
                      </span>
                    )),
                  )}
                  {cell(h.cols.changed, r.changed)}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
