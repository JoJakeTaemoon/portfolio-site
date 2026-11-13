/* eslint-disable @next/next/no-img-element -- static export, pre-sized files */
import type { CSSProperties, ReactNode } from "react";
import { CodeShots, Decisions, Folded, Prose, ResultList, Trace } from "@/components/blocks";
import { COVER_ART } from "@/components/CoverArt";
import { FilmToggle } from "@/components/FilmToggle";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { KitFooter, KitHeader } from "@/components/KitChrome";
import { Visuals } from "@/components/visuals/VisualView";
import { pageOrder, processPage, projects, site, type Slug } from "@/content";
import { siteUrl } from "@/content/meta";
import type { CaseStudy, Paragraphs, Project, SectionId, Shot } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { pdfHref } from "@/lib/pdf";
import { caseSections, count, firstSentence, neighbors, sectionOf } from "@/lib/template";
import { pngSize, srcSet } from "@/lib/thumbs";

/* type: service (site-kind other), the hub's deal kept: palette, type rethink, nav nav-centre, footer footer-dark,
   close-word's head row, rhythm space, buttons block, mark stack (task 24).
   deal for the case template (task 25, all six cases):
   hero: split. deal.mjs --type service --has ui,photo dealt film, whose use (a real film, or a strong photograph
   with a calm dark foot) fits one case of six; dealt again with the material the cases have (--has ui: masked
   screens, no photographs): split, the case's own subject at the right (its masked screen, its clip, or its drawn
   cover), the words, the 4-5 facts and the two actions at the left; the clip plays on a click only.
   moments (moments.mjs pick --page service --count 2 --photo): photo-chapters and picture-develops first, dealt
   again with both excluded (four of the six cases have no photograph to carry them): pinned-chapters on the
   screens (#gallery, two to four screens) and word-highlight on the retrospective's statement (#retro). A case
   with fewer than two screens keeps the one moment. */

// Paragraphs shown before a section's fold: a budget in Korean characters (an English character counts 0.65: it is
// about half as wide, and English runs longer per fact), at least one paragraph. The rest stays in the HTML, open in print.
const BUDGET = 320;
const shownOf = (p: Paragraphs, lang: Locale, budget = BUDGET) => {
  let used = 0;
  let n = 0;
  for (const t of p) {
    used += lang === "ko" ? t.length : t.length * 0.65;
    if (n > 0 && used > budget) break;
    n++;
  }
  return n;
};

/* Task 25b: where the template's budgets leave a section between one screen and two (at 1440x900 or 390x844), the case
   sets its own fold points here. Everything stays in the HTML and opens in print.
   budget: the words shown (Korean characters); phone: fewer under 640px, where the figures stack under the words (the
   ones between stand open from 640px by CSS). results, resultsPhone, rows, code, codePhone: the results, the timeline
   rows and the code excerpts shown (code excerpts: 1 under 640px by default). figsPhone: the section's figures shown
   under 640px (1 by default). fold: the further figures under the words fold at every width. terse: the decisions'
   rows without the result line (it stays inside each row). pad: the trace rows' padding under 640px (30px by default).
   hero.foot: the space under the hero's picture under 640px (72px by default).
   Task 27, under 1280px (a tablet; a fold of its own, open from 1280px): tab, the words shown; codeTab, the code
   excerpts shown (more than the desktop's: open from 640 to 1279px); figsTab, the section's figures shown; restTab, the
   further figures under the words folded; rowsTab, the timeline rows shown; terseTab, the decisions' rows without the
   result line. Task 13a: padDesk, the trace rows' padding from 640px when they are eight or more (18px by default);
   decisions.pad, the decision rows' padding under 640px (8px by default). Task 13f: stackTab, the section's words (the
   drawing in #architecture) over its figures (the code) at 1024-1279px, so a drawing six columns set at 6-10px gets
   the container's width (labels 13.5px); only where the section still holds two screens at 1024x768. */
type Fit = { foot?: number; figsPhone?: number; pad?: number; budget?: number; phone?: number; results?: number; resultsPhone?: number; rows?: number; code?: number; codePhone?: number; fold?: boolean; terse?: boolean; tab?: number; codeTab?: number; figsTab?: number; restTab?: boolean; rowsTab?: number; terseTab?: boolean; padDesk?: number; stackTab?: boolean };
const FIT: Record<string, Partial<Record<SectionId | "hero", Fit>>> = {
  "ko:ewa": { hero: { foot: 92 }, architecture: { stackTab: true }, role: { tab: 360 }, quality: { tab: 360 } }, // tab (task 13 verify): the round-2 leads ran #role and #quality just past one tablet screen
  "en:ewa": { results: { results: 2, rows: 4 }, architecture: { stackTab: true }, quality: { budget: 600 }, role: { fold: true }, decisions: { terse: true }, trace: { pad: 27 } }, // terse (task 13a): the who chips took a line each
  "ko:reputation-market": { results: { rows: 4, resultsPhone: 2, rowsTab: 3 }, role: { fold: true }, architecture: { codeTab: 1 } },
  "en:reputation-market": { hero: { foot: 66 }, results: { results: 2, resultsPhone: 1, rows: 3, rowsTab: 2 }, role: { budget: 840, figsPhone: 0, tab: 360 }, architecture: { codeTab: 1 }, decisions: { terse: true }, quality: { tab: 500 } },
  "ko:grid-constraint-analysis": { hero: { foot: 52 }, results: { rows: 3 }, architecture: { code: 1, codeTab: 2, stackTab: true }, quality: { fold: true, budget: 420 }, trace: { figsPhone: 0, figsTab: 0 } },
  "en:grid-constraint-analysis": { hero: { foot: 36 }, results: { results: 2, rows: 2 }, architecture: { code: 1, stackTab: true }, decisions: { terse: true, terseTab: true }, quality: { phone: 320, tab: 320, restTab: true }, trace: { figsPhone: 0, figsTab: 0 } },
  "ko:field-service-ops": { results: { rows: 4 }, architecture: { codeTab: 1 }, quality: { phone: 400, tab: 960 }, trace: { pad: 18 } },
  "en:field-service-ops": { hero: { foot: 64 }, results: { results: 2, rows: 3, rowsTab: 2 }, architecture: { codeTab: 1 }, decisions: { terse: true }, quality: { tab: 960 } },
  "ko:construction-pmis": { role: { budget: 830 }, architecture: { code: 1, codeTab: 2 }, quality: { tab: 900 }, retro: { figsPhone: 0 } },
  "en:construction-pmis": { results: { results: 2, rows: 4 }, role: { tab: 1000 }, architecture: { code: 1, codeTab: 2 }, decisions: { terse: true, terseTab: true, pad: 4 }, quality: { budget: 700 }, trace: { padDesk: 16 }, retro: { figsPhone: 0, figsTab: 0 } },
  "ko:screenplay-translation": { results: { results: 2 }, problem: { budget: 650, tab: 1000 }, role: { restTab: true }, quality: { tab: 560 }, trace: { pad: 12 } },
  "en:screenplay-translation": { results: { results: 1 }, role: { restTab: true }, decisions: { terse: true } },
  // a brief's hero (task 27): its foot on a phone as the cases' (the gap to #problem is like the others)
  "ko:ai-usage-policy": { hero: { foot: 72 } },
};

function Story({ p, lang, more, budget = BUDGET, phone, tab }: { p: Paragraphs; lang: Locale; more: string; budget?: number; phone?: number; tab?: number }) {
  const n = shownOf(p, lang, budget);
  const t = tab === undefined ? n : shownOf(p, lang, tab);
  return <Folded items={p} desk={n} tab={t} phone={phone === undefined ? n : shownOf(p, lang, phone)} label={(k) => count(more, k)} render={(xs) => <Prose p={xs} />} />;
}

/** One section: the h2, its lead and the words at the left, the figures at the right from the h2's line (6/6 split
 *  from 1024, the hub's split line); stacked below. A section with only figures puts them under its head. */
export function Sec({ id, title, lead, text, figs, moment, wide, stackTab }: { id: SectionId; title: string; lead?: string; text?: ReactNode; figs?: ReactNode; moment?: string; wide?: boolean; stackTab?: boolean }) {
  const head = (
    <div className="section-head">
      <h2 id={`${id}-h`}>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
  return (
    <section className="section" id={id} aria-labelledby={`${id}-h`} data-moment={moment}>
      <div className="wrap">
        {text && figs ? (
          <div className={`grid grid--top case-split${stackTab ? " stack-tab" : ""}`}>
            <div className={`${wide ? "span-6" : "span-5"} case-text`}>
              {head}
              {text}
            </div>
            <div className="span-6 start-7 case-figs">{figs}</div>
          </div>
        ) : (
          <>
            {head}
            <div className={text ? "case-text case-solo" : "case-wide"}>{text ?? figs}</div>
          </>
        )}
      </div>
    </section>
  );
}

/** Printed under the title on page 1 of a page's PDF (D-057 ⑦, task 13d): whose document it is, the role, and where
 *  it lives (the role words the headline uses, task 13a). */
export const PrintId = ({ lang, path }: { lang: Locale; path: string }) => (
  <p className="print-only print-id">
    {site[lang].name} · {site[lang].roleShort} · {siteUrl}
    {path}
  </p>
);

/** The split hero (cases and briefs). A brief has no PDF of its own: its second action is the career summary, and with
 *  no metrics its one hard fact is the period. */
export function Hero({ p, lang }: { p: Project; lang: Locale }) {
  const { ui, hub, contact } = site[lang];
  const facts = p.metrics.length ? p.metrics : [{ label: ui.keyFacts.period, value: p.facts.period }];
  const pdf = p.kind === "case" ? { href: pdfHref(lang, p.slug), label: ui.downloadPagePdf } : { href: pdfHref(lang, "portfolio"), label: hub.pdf };
  const Art = COVER_ART[p.slug];
  const art = p.video ? "film" : (p.cover?.frame ?? "drawing");
  const foot = FIT[`${lang}:${p.slug}`]?.hero?.foot;
  return (
    <section className="hero hero--split" data-enter aria-labelledby="case-h" style={foot === undefined ? undefined : ({ "--hero-foot": `${foot}px` } as CSSProperties)}>
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <h1 id="case-h">{p.title}</h1>
            <PrintId lang={lang} path={`/${lang}/work/${p.slug}/`} />
            <p className="hero__lead">{p.tagline}</p>
            <dl className="case-facts">
              {facts.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="btn-row">
              <a className="btn btn--primary" href={`mailto:${contact.email}`}>
                {hub.email}
              </a>
              <a className="btn btn--secondary" href={pdf.href} download>
                {pdf.label}
              </a>
            </div>
          </div>
          {/* the case's own subject: its clip, its masked screen or its drawn cover (CoverArt) */}
          <div className="hero__media span-6 start-7 case-art" data-art={art}>
            {p.video && (
              <video id="case-film" className="case-phone" src={p.video.src} poster={p.video.poster} muted loop playsInline preload="none" controls aria-label={p.video.caption} />
            )}
            {p.cover && (
              <img
                className={p.cover.frame === "phone" ? "case-phone" : "case-screen"}
                src={p.cover.src}
                srcSet={srcSet(p.cover.src)}
                sizes={p.cover.frame === "phone" ? "300px" : "(min-width: 1024px) 1010px, 160vw"}
                {...pngSize(p.cover.src)}
                alt={p.cover.alt}
                fetchPriority="high"
                data-source="client"
                data-subject={`${p.slug} screen, masked`}
              />
            )}
            {!p.cover && Art && (
              <div className="case-drawing" aria-hidden="true">
                <Art />
              </div>
            )}
            {p.video && <FilmToggle video="case-film" playLabel={ui.clipPlay} pauseLabel={ui.clipPause} note={firstSentence(p.video.caption)} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The case's screens (less the hero's): two to four as the pinned chapters (a title, its lines, the screen), one as a framed shot. */
function Screens({ shots, title, lead }: { shots: Shot[]; title: string; lead?: string }) {
  const img = (s: Shot) => (
    <img src={s.src} srcSet={srcSet(s.src)} sizes={s.frame === "phone" ? "300px" : "(min-width: 1024px) 640px, 100vw"} {...pngSize(s.src)} alt={s.caption} loading="lazy" data-frame={s.frame} data-source="client" data-subject="a masked screen of the case" />
  );
  // one screen (task 25b): its caption is the words at the left, the screen at the right, so the section holds one screen
  if (shots.length === 1 || shots.length > 4)
    return (
      <Sec
        id="gallery"
        title={title}
        lead={lead}
        text={shots.map((s) => (
          <p key={s.src}>{s.caption}</p>
        ))}
        figs={shots.map((s) => (
          <figure key={s.src} className="case-shot">
            {img(s)}
          </figure>
        ))}
      />
    );
  // a screen's caption is its title (the first sentence) and its lines (the rest), word for word
  return (
    <section className="section" id="gallery" style={{ "--h": 2 } as CSSProperties} data-moment="pinned-chapters" aria-labelledby="gallery-h">
      <div className="wrap mo-pc__grid">
        <div className="mo-pc__text">
          <div className="section-head">
            <h2 id="gallery-h">{title}</h2>
            {lead && <p>{lead}</p>}
          </div>
          <ol className="mo-pc__steps">
            {shots.map((s) => {
              const head = firstSentence(s.caption);
              return (
                <li className="mo-pc__step" key={s.src}>
                  <h3>{head.replace(/\.$/, "")}</h3>
                  <p>{s.caption.slice(head.length).trim()}</p>
                  <figure className="mo-pc__visual mo-pc__visual--lit">{img(s)}</figure>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mo-pc__visuals frame" />
      </div>
    </section>
  );
}

export function CaseView({ p, lang }: { p: CaseStudy; lang: Locale }) {
  const { ui } = site[lang];
  const t = ui.sections;
  const other: Locale = lang === "ko" ? "en" : "ko";
  const otherHref = `/${other}/work/${p.slug}/`;
  const fit = (id: SectionId): Fit => FIT[`${lang}:${p.slug}`]?.[id] ?? {};
  // a section's first figure stays on a phone, the rest fold there (Visuals phoneFold)
  const vis = (pick: (v: CaseStudy["visuals"][number]) => boolean, phoneFold = 1, rows?: number, foldAll?: boolean, tabFold?: number, rowsTab?: number) => {
    const items = p.visuals.filter(pick);
    return items.length ? <Visuals items={items} lang={lang} ui={ui} phoneFold={phoneFold} rows={rows} foldAll={foldAll} tabFold={tabFold} rowsTab={rowsTab} /> : undefined;
  };
  const figs = (id: SectionId) => vis((v) => !v.after && sectionOf(v) === id, fit(id).figsPhone ?? 1, fit(id).rows, undefined, fit(id).figsTab, fit(id).rowsTab);
  // a section's first figure stands at the right; its further figures under the words at the left (folded on a phone)
  const first = (id: SectionId) => vis((v) => !v.after && sectionOf(v) === id && p.visuals.filter((w) => !w.after && sectionOf(w) === id)[0] === v, fit(id).figsPhone ?? 1, undefined, undefined, fit(id).figsTab);
  const rest = (id: SectionId) => vis((v) => !v.after && sectionOf(v) === id && p.visuals.filter((w) => !w.after && sectionOf(w) === id)[0] !== v, 0, undefined, fit(id).fold, fit(id).restTab ? 0 : undefined);
  const words = (id: SectionId, body: ReactNode) => (
    <>
      {body}
      {rest(id)}
    </>
  );
  // a section with no figure beside its words shows twice the words (they have the whole column)
  const story = (id: SectionId, para: Paragraphs, budget = first(id) ? BUDGET : 2 * BUDGET) => (
    <Story p={para} lang={lang} more={ui.proseMore} budget={fit(id).budget ?? budget} phone={fit(id).phone} tab={fit(id).tab} />
  );
  const shots = p.gallery.filter((g) => g.src !== p.cover?.src); // the hero shows the cover
  const after = vis((v) => !!v.after);
  const { prev, next } = neighbors(pageOrder, p.slug as Slug);

  const sections: Partial<Record<SectionId, ReactNode>> = {
    // the key facts (period, role, team, platforms, context) under the results: open from 1280px, folded under it (task 27)
    results: p.results.length > 0 && (
      <Sec
        id="results"
        title={t.results}
        lead={p.leads?.results}
        text={
          <>
            <ResultList items={p.results} more={ui.resultsMore} shown={fit("results").results} phone={fit("results").resultsPhone} />
            <details className="fold wide-fold">
              <summary>{ui.factsMore}</summary>
              <KeyFactsBox facts={p.facts} labels={ui.keyFacts} />
            </details>
          </>
        }
        figs={figs("results")}
      />
    ),
    gallery: shots.length > 0 && <Screens shots={shots} title={t.gallery} lead={p.leads?.gallery} />,
    problem: <Sec id="problem" title={t.problem} lead={p.leads?.problem} text={words("problem", story("problem", p.problem))} figs={first("problem")} />,
    role: <Sec id="role" title={t.role} lead={p.leads?.role} text={words("role", story("role", p.myRole))} figs={first("role")} />,
    // the system drawing at the left, the code excerpts beside it (task 25: out of the decisions, so each section
    // holds its two screens)
    architecture: figs("architecture") && (
      <Sec
        id="architecture"
        title={t.architecture}
        lead={p.leads?.architecture}
        wide
        stackTab={fit("architecture").stackTab}
        text={figs("architecture")}
        figs={
          p.code.length > 0 && (
            <div className="case-code">
              <Folded
                items={p.code}
                desk={fit("architecture").code ?? p.code.length}
                tab={fit("architecture").codeTab}
                phone={fit("architecture").codePhone ?? 1}
                label={(n) => count(ui.codeMore, n)}
                render={(xs) => <CodeShots items={xs} scrollHint={ui.visual.scrollHint} />}
              />
            </div>
          )
        }
      />
    ),
    decisions: p.decisions.length > 0 && (
      <Sec
        id="decisions"
        title={t.decisions}
        lead={p.leads?.decisions}
        text={<Decisions items={p.decisions} ui={ui.decision} terse={fit("decisions").terse} terseTab={fit("decisions").terseTab} pad={fit("decisions").pad} />}
        figs={
          (after || figs("decisions")) && (
            <>
              {figs("decisions")}
              {after}
            </>
          )
        }
      />
    ),
    quality: <Sec id="quality" title={t.quality} lead={p.leads?.quality} text={words("quality", story("quality", p.quality, 2 * BUDGET))} figs={first("quality")} />,
    trace: (
      <Sec
        id="trace"
        title={t.trace}
        lead={p.leads?.trace}
        text={
          <>
            <p>{p.trace.intro}</p>
            {figs("trace")}
          </>
        }
        figs={<Trace steps={p.trace.steps} pad={fit("trace").pad} padDesk={fit("trace").padDesk} />}
      />
    ),
    // the retrospective's claim is the statement that lights up (word-highlight); the process pointer closes the page
    retro: (
      <section className="section" id="retro" data-moment="word-highlight" aria-labelledby="retro-h">
        <div className="wrap">
          <div className="section-head">
            <h2 id="retro-h">{t.retro}</h2>
          </div>
          {p.leads?.retro && <p className="mo-wh__text">{p.leads.retro}</p>}
          <div className="grid grid--top case-split">
            <div className="span-5 case-text">
              {story("retro", p.retro, BUDGET)}
            </div>
            <div className="span-6 start-7 case-figs">
              {figs("retro")}
              <div className="case-process">
                <h3>{t.process}</h3>
                <p>{p.slug === "ewa" ? processPage[lang].lead : ui.processOther}</p>
                <a className="link" href={`/${lang}/process/`}>
                  {ui.processCta}
                </a>
                <span className="print-only print-url">{`${siteUrl}/${lang}/process/`}</span>
              </div>
              {/* the next project inside the page, not only in the footer (R-08); screen only */}
              {next && (
                <a className="link case-next" href={`/${lang}/work/${next}/`}>
                  {`${ui.nextProject}: ${projects[lang][next].title}`}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <>
      <KitHeader lang={lang} base={`/${lang}/`} otherHref={otherHref} />
      <main id="top" className="case">
        <Hero p={p} lang={lang} />
        {caseSections.map((id) => sections[id] || null)}
      </main>
      <KitFooter
        lang={lang}
        otherHref={otherHref}
        page={{
          title: ui.work,
          links: [prev, next].flatMap((s) => (s ? [{ href: `/${lang}/work/${s}/`, label: projects[lang][s].title }] : [])),
        }}
      />
    </>
  );
}
