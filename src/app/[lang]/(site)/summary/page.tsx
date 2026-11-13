import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Career, Metrics, Prose } from "@/components/blocks";
import { archiveOrder, featured, projects, site } from "@/content";
import { siteUrl } from "@/content/meta";
import { hasLocale } from "@/lib/i18n";
import { statusLine } from "@/lib/template";

// D-036: the career summary PDF (scripts/pdf.ts prints this route). Three pages: who + lead + featured /
// experience / all projects. URLs are printed as text; no screen-only wording. Not linked, not indexed.
export const metadata: Metadata = { robots: { index: false } };

const bare = (url: string) => url.replace(/^https?:\/\//, "");

export default async function Summary({ params }: PageProps<"/[lang]/summary">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const s = site[lang];
  const c = s.ui.archiveCols;
  const url = (path = "") => `${siteUrl}/${lang}/${path}`;

  return (
    <div className="cv">
      <section className="cv-page">
        {/* eslint-disable-next-line @next/next/no-img-element -- printed page, pre-sized file */}
        <img className="cv-photo" src="/img/profile.jpg" alt={s.name} width={96} height={96} />
        <p className="cv-name">{s.name}</p>
        <h1>{s.headline}</h1>
        <Prose p={s.intro} />
        <p className="cv-contact" id="contact">
          <a href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
          <a href={`tel:${s.contact.tel}`}>{s.contact.phone}</a>
          <a href={url()}>{bare(url())}</a>
        </p>
        <Metrics items={s.metrics} />
        <h2>{s.ui.lead}</h2>
        <ul className="checks">
          {s.lead.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <h2>{s.ui.featured}</h2>
        <ol className="cv-featured">
          {featured.map((slug) => {
            const p = projects[lang][slug];
            return (
              <li key={slug}>
                <div className="cv-fh">
                  <strong>{p.title}</strong> <span className="muted">{p.facts.period}</span>
                </div>
                <p>
                  {p.tagline} <a href={url(`work/${slug}/`)}>{bare(url(`work/${slug}/`))}</a>
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="cv-page">
        <h2>{s.ui.about}</h2>
        <Career items={s.experience} ui={s.ui} fold={false} />
      </section>

      <section className="cv-page">
        <h2>{s.ui.archive}</h2>
        <table className="archive">
          <thead>
            <tr>
              {[c.project, c.status, c.domain].map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {archiveOrder.map((slug) => {
              const p = projects[lang][slug];
              return (
                <tr key={slug}>
                  <th scope="row">{p.title}</th>
                  <td>{statusLine(p)}</td>
                  <td>{p.domain}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
