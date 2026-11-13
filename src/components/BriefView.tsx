import type { CSSProperties } from "react";
import { Decisions, Folded, Prose, ResultList } from "@/components/blocks";
import { Hero, Sec } from "@/components/CaseView";
import { KitFooter, KitHeader } from "@/components/KitChrome";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { Visuals } from "@/components/visuals/VisualView";
import { pageOrder, projects, site, type Slug } from "@/content";
import type { Brief } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { count, neighbors } from "@/lib/template";

/* type: service (site-kind other), the hub's deal kept (palette, rethink, nav-centre, footer-dark, close-word's head
   row, rhythm space, buttons block, mark stack); the case template's parts reused (task 26).
   deal for the brief template (task 26, all six briefs):
   hero: deal.mjs --type service --has ui,photo dealt photo (a full-bleed photograph); the briefs have none (a stand-in
   would read as the client's), so dealt again with what they have (--has ui): split, the brief's drawn cover at the
   right filling its frame, the words, the facts (the period when a brief has no metrics) and two actions at the left
   (Email Jake; the career summary PDF: a brief has no PDF of its own).
   moment (moments.mjs pick --page service --count 1 --photo): photo-chapters, then picture-develops (both need
   photographs) and pinned-chapters (2-4 steps with a picture each; a brief has one to three figures), each dealt again
   with it excluded: word-highlight on the results' claim (leads.results) in #results.
   sections: #problem (the problem and the key facts, the first figure), #built (what was built, the one decision; the
   second figure), #results (the claim as the statement, the results and the note; any figure left). D-032's order is
   kept: the figures stand beside the words they belong to, nothing under a visual. */
/* where the template leaves a section past its screens (1440x900, 390x844), a brief sets its own fold points: built,
   the items shown; facts, the key facts folded at every width; rows, the timeline rows shown in #built's figure;
   resultRows, the timeline rows shown in #results' figure; factsOpen, the key facts beside what was built open on a
   phone too (a native <details open>); problemTab, the problem's paragraphs shown under 1280px (the rest open from
   1280px; task 13d); problemPhone, those shown under 640px; flowPad and flowPadPhone, the flow's step padding (px) from 1024px and under
   640px (task 13a). */
const FIT: Record<string, { built?: number; facts?: string; rows?: number; resultRows?: number; factsOpen?: boolean; problemTab?: number; problemPhone?: number; flowPad?: number; flowPadPhone?: number }> = {
  "ko:webtoon-translation": { factsOpen: true },
  "en:manufacturing-ax": { built: 2, resultRows: 2, factsOpen: true },
  // (the English words and the drawing stacked under them ran past one screen at 768x1024)
  "en:commerce-delivery-gateway": { resultRows: 3, problemTab: 1 },
  "ko:commerce-delivery-gateway": { resultRows: 3 },
  // (task 13a, M-19: the flow in #problem, the timeline in #results)
  "ko:ai-usage-policy": { problemPhone: 1, flowPad: 12, flowPadPhone: 1 },
  "en:ai-usage-policy": { resultRows: 3 },
};

const px = (n?: number) => (n === undefined ? undefined : `${n}px`);

export function BriefView({ p, lang }: { p: Brief; lang: Locale }) {
  const { ui } = site[lang];
  const t = ui.sections;
  const other: Locale = lang === "ko" ? "en" : "ko";
  const otherHref = `/${other}/work/${p.slug}/`;
  const { prev, next } = neighbors(pageOrder, p.slug as Slug);
  // the figures at "visuals" one to #problem and #built; a third, and every figure at "results", in #results (D-032:
  // the results are the claim and the timeline; task 13d)
  const pre = p.visuals.filter((v) => v.at !== "results");
  const post = p.visuals.filter((v) => v.at === "results");
  const fit = FIT[`${lang}:${p.slug}`] ?? {};
  const fig = (i: number, rows?: number) => (pre[i] ? <Visuals items={[pre[i]]} lang={lang} ui={ui} rows={rows} /> : undefined);
  const restItems = [...pre.slice(2), ...post];
  const rest = restItems.length ? <Visuals items={restItems} lang={lang} ui={ui} rows={fit.resultRows} /> : undefined;
  // the key facts beside the problem (its context), open from 1280px and folded under it (task 27); where #built has no
  // figure (one brief), they are its second column, open from 640px and folded on a phone (task 27: the words alone left
  // half the section empty at 1440)
  const facts = (cls: string, open?: boolean) => (
    <details className={cls} open={open}>
      <summary>{ui.factsMore}</summary>
      <KeyFactsBox facts={p.facts} labels={ui.keyFacts} stack={p.stack} />
    </details>
  );
  const head = (
    <div className="section-head">
      <h2 id="results-h">{t.results}</h2>
    </div>
  );
  const statement = p.leads?.results && <p className="mo-wh__text">{p.leads.results}</p>;
  return (
    <>
      <KitHeader lang={lang} base={`/${lang}/`} otherHref={otherHref} />
      <main id="top" className="case brief" style={{ "--flow-pad": px(fit.flowPad), "--flow-pad-phone": px(fit.flowPadPhone) } as CSSProperties}>
        <Hero p={p} lang={lang} />
        <Sec
          id="problem"
          title={t.problem}
          lead={p.leads?.problem}
          text={
            <>
              <Folded items={p.problem} desk={p.problem.length} tab={fit.problemTab} phone={fit.problemPhone} label={(n) => count(ui.proseMore, n)} render={(xs) => <Prose p={xs} />} />
              {pre[1] && facts(fit.facts ?? "fold wide-fold")}
            </>
          }
          figs={fig(0)}
        />
        <Sec
          id="built"
          title={t.built}
          lead={p.leads?.built}
          text={
            <>
              <Folded
                items={p.built}
                desk={fit.built ?? (p.decision ? 3 : 5)}
                phone={p.decision ? 2 : 5}
                label={(n) => count(ui.rowsMore, n)}
                render={(xs) => (
                  <ul className="case-list">
                    {xs.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              />
              {p.decision && (
                <div className="brief-decision">
                  <h3>{t.decisions}</h3>
                  <Decisions items={[p.decision]} ui={ui.decision} terse />
                </div>
              )}
            </>
          }
          figs={fig(1, fit.rows) ?? <div className="brief-facts">{facts("fold fig-fold", fit.factsOpen)}</div>}
        />
        {/* the results' claim is the statement that lights up (word-highlight); beside a figure, the heading and the
            statement head the words' column and the figure starts on the heading's line (task 13d) */}
        <section className="section" id="results" data-moment="word-highlight" aria-labelledby="results-h">
          <div className="wrap">
            {!rest && head}
            {!rest && statement}
            <div className="grid grid--top case-split">
              <div className={rest ? "span-5 case-text" : "span-8 case-text"}>
                {rest && head}
                {rest && statement}
                <ResultList items={p.results} more={ui.resultsMore} phone={2} />
                {p.note && <p className="brief-note">{p.note}</p>}
              </div>
              {rest && <div className="span-6 start-7 case-figs">{rest}</div>}
            </div>
          </div>
        </section>
      </main>
      <KitFooter
        lang={lang}
        otherHref={otherHref}
        page={{ title: ui.work, links: [prev, next].flatMap((s) => (s ? [{ href: `/${lang}/work/${s}/`, label: projects[lang][s].title }] : [])) }}
      />
    </>
  );
}
