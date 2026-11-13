/* eslint-disable @next/next/no-img-element -- static export, pre-sized files */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { KitFooter, KitHeader } from "@/components/KitChrome";
import { RouteMap } from "@/components/RouteMap";
import { COVER_ART } from "@/components/CoverArt";
import { RoleLanes } from "@/components/visuals/RolesView";
import { archiveOrder, featured, projects, site } from "@/content";
import { siteUrl } from "@/content/meta";
import type { Experience } from "@/content/types";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { pdfHref } from "@/lib/pdf";
import { FLAG } from "@/lib/route";
import { statusLine } from "@/lib/template";
import { pngSize, srcSet } from "@/lib/thumbs";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { hub } = site[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: hub.title },
    description: hub.description,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/`])) },
    openGraph: { type: "website", title: hub.title, description: hub.description, images: [`/img/share-${lang}.jpg`] },
    twitter: { card: "summary_large_image" },
    other: { "site-kind": "other", "page-type": "service" },
  };
}

// The place as its flag (alt: the country's name), after the role and the company.
const Flags = ({ place }: { place: string }) =>
  place
    .split(" · ")
    .filter((name) => FLAG[name])
    .map((name) => <img key={name} className="hub-flag" src={`/img/flags/${FLAG[name]}.svg`} alt={name} title={name} width={16} height={12} loading="lazy" />);

const Job = ({ e }: { e: Experience }) => (
  <li>
    <span className="rows__name">
      {e.role} · {e.org} <Flags place={e.place} />
    </span>
    <span className="rows__value">{e.period}</span>
  </li>
);

/* type: service (site-kind other): Jake is hired as an AI-native engineering lead; the main action is Email Jake.
   deal: hero split (deal.mjs --type service --has photo,ui), palette brand (the site's own ledger green on paper:
   start.mjs brand --page service), type rethink, nav nav-centre, footer footer-dark, close close-photo, dealt again
   to close-word's head row without the name (no photograph left: the only one, a 240px portrait, sits in the
   hero's float card), rhythm space, buttons block, mark stack.
   moments: word-highlight on the statement in #lead (moments.mjs pick --page service; seven sections, so one:
   the second dealt, picture-develops, has no large photograph to carry). */
export default async function Hub({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const s = site[lang];
  const { hub, ui, contact } = s;
  const other: Locale = lang === "ko" ? "en" : "ko";
  const mail = `mailto:${contact.email}`;
  const href = (slug: string) => `/${lang}/work/${slug}/`;
  const ewa = projects[lang].ewa;
  const team = ewa.visuals.find((v) => v.kind === "roles");
  const recent = s.experience.filter((e) => !e.early);
  const early = s.experience.filter((e) => e.early);
  const [statementA, statementB] = (s.leads?.lead ?? "").split(hub.rolesStrong);
  const more = archiveOrder.filter((slug) => !featured.includes(slug)).map((slug) => projects[lang][slug]);
  const nav = [
    { id: "work", label: ui.work },
    { id: "lead", label: ui.process },
    { id: "career", label: ui.about },
  ];

  return (
    <>
      <KitHeader lang={lang} base="" otherHref={`/${other}/`} />

      <main id="top">
        <section className="hero hero--split" data-enter aria-labelledby="hero-h">
          <div className="wrap">
            <div className="hero-text grid hero__grid">
              <div className="hero__text span-5">
                <h1 id="hero-h">{s.headline}</h1>
                <p className="hero__lead">{hub.lead}</p>
                <div className="btn-row">
                  <a className="btn btn--primary" href={mail}>
                    {hub.email}
                  </a>
                  <a className="btn btn--secondary" href={pdfHref(lang, "portfolio")} download>
                    {hub.pdf}
                  </a>
                </div>
              </div>
              <div className="hero__media span-6 start-7 hub-shot">
                {/* the EWA worker app (task 25: the EWA visuals lead with the worker app), a phone rising from the foot */}
                <img
                  className="hub-phone"
                  src={ewa.cover?.src}
                  {...(ewa.cover && pngSize(ewa.cover.src))}
                  alt={ewa.cover?.alt}
                  fetchPriority="high"
                  data-source="client"
                  data-subject="the EWA worker app home screen, masked, mock data"
                />
                <div className="ly-float hub-card">
                  {/* the portrait at a size a face reads at (Jake 2026-11-13: the 32px avatar was too small for a resume) */}
                  <img className="hub-portrait" src="/img/portrait.jpg" alt="" width={480} height={600} data-source="client" data-subject="Jake's portrait" />
                  <div className="ly-float__row">
                    <span className="hub-who">{s.name}</span>
                  </div>
                  <div className="ly-float__title">
                    {/* a hyphenated word stays on one line ("co-founder" broke at its hyphen; task 13d) */}
                    {hub.floatFact.split(/(\S+-\S+)/).map((t, i) => (i % 2 ? <span key={i} className="nowrap">{t}</span> : t))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="work" style={{ "--hm": 2 } as CSSProperties} aria-labelledby="work-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="work-h">{hub.work}</h2>
            </div>
            <div className="grid hub-cards">
              {featured.map((slug) => (
                <WorkCard key={slug} slug={slug} lang={lang} href={href(slug)} />
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="lead" data-moment="word-highlight" style={{ "--hm": 2 } as CSSProperties} aria-labelledby="lead-h">
          <div className="wrap">
            <div className="grid grid--top">
              <div className="span-5 hub-say">
                <div className="section-head">
                  <h2 id="lead-h">{hub.roles}</h2>
                  <p>{hub.rolesLine}</p>
                </div>
                <p className="mo-wh__text">
                  {statementA}
                  <strong>{hub.rolesStrong}</strong>
                  {statementB}
                </p>
                {/* how I lead, the same lines as the summary PDF and the README (M-09, D-029), folded */}
                <details className="fold hub-howlead">
                  <summary>{ui.lead}</summary>
                  <ul className="checks">
                    {s.lead.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </details>
                <a className="link" href={`/${lang}/process/`}>
                  {ui.processCta}
                </a>
              </div>
              <div className="frame span-6 start-7 hub-roles">
                {team?.kind === "roles" && <RoleLanes v={team} Heading="h3" />}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="career" style={{ "--hm": 2 } as CSSProperties} aria-labelledby="career-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="career-h">{hub.career}</h2>
              <p>{hub.careerLine}</p>
            </div>
            <div className="grid grid--top">
              <div className="span-5">
                <ol className="rows hub-jobs">
                  {recent.map((e) => (
                    <Job key={e.org + e.period} e={e} />
                  ))}
                  <li>
                    <span className="rows__name">{ui.earlyCareer.replace("{n}", String(early.length))}</span>
                    <p className="muted">{early.map((e) => e.org).join(" · ")}</p>
                    <span className="rows__value">{`${early.at(-1)?.period.slice(0, 4)} – ${early[0]?.period.slice(-4)}`}</span>
                  </li>
                </ol>
              </div>
              <div className="frame span-6 start-7 hub-route">
                <RouteMap items={s.experience} label={ui.route} />
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="more" aria-labelledby="more-h">
          <div className="wrap">
            <div className="section-head">
              <h2 id="more-h">{hub.more}</h2>
            </div>
            <div className="grid grid--top">
              <ul className="rows span-5 hub-more">
                {more.map((p) => {
                  const Art = COVER_ART[p.slug];
                  return (
                  <li key={p.slug}>
                    {/* the cover beside its row on a phone, where the wall beside the list is hidden */}
                    {Art && (
                      <span className="hub-more__art" aria-hidden="true">
                        <Art />
                      </span>
                    )}
                    <a className="rows__name" href={href(p.slug)}>
                      {p.title}
                    </a>
                    <p className="muted">
                      {p.domain} · {p.year}
                    </p>
                  </li>
                  );
                })}
              </ul>
              {/* the six projects' own drawn covers (CoverArt), one tile each, in the list's order */}
              <div className="frame span-6 start-7 hub-mosaic" aria-hidden="true">
                {more.map((p) => {
                  const Art = COVER_ART[p.slug];
                  return Art ? <Art key={p.slug} /> : null;
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <KitFooter lang={lang} otherHref={`/${other}/`} page={{ title: hub.footPage, links: nav.map((n) => ({ href: `#${n.id}`, label: n.label })) }} />
    </>
  );
}

function WorkCard({ slug, lang, href }: { slug: (typeof featured)[number]; lang: Locale; href: string }) {
  const p = projects[lang][slug];
  const Art = COVER_ART[slug];
  return (
    <a className="card card--open span-4" href={href}>
      {/* a phone screen rises from the foot, a desktop screen sits in the corner cut by the edges, a drawing is centred */}
      <div className="frame frame--photo hub-thumb m-zoom">
        <div className="stage">
          {p.cover ? (
            <img
              className={p.cover.frame === "phone" ? "at-rise" : "at-corner to-edge"}
              src={p.cover.src}
              srcSet={srcSet(p.cover.src)}
              {...pngSize(p.cover.src)}
              sizes={p.cover.frame === "phone" ? "200px" : "(min-width: 1024px) 640px, 1040px"}
              alt={p.cover.alt}
              loading="lazy"
              data-source="client"
              data-subject={`${slug} screen, masked`}
            />
          ) : (
            Art && (
              <div className="at-center hub-art" aria-hidden="true">
                <Art />
              </div>
            )
          )}
        </div>
      </div>
      <p className="card__title">{p.title}</p>
      {/* period · status (M-11): the summary PDF's table reads the same line */}
      <p className="muted">{statusLine(p)}</p>
    </a>
  );
}
