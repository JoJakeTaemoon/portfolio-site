// The kit pages' header and footer (task 24 built them for the hub; task 25 shares them with the case pages).
// `base` prefixes the hub's section anchors: "" on the hub itself, "/ko/" elsewhere.
import { site } from "@/content";
import type { Locale } from "@/lib/i18n";
import { pdfHref } from "@/lib/pdf";

type Link = { href: string; label: string };

const Arrow = () => (
  <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
    <path className="m-arrow__stem" d="M1 6h8" />
    <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
  </svg>
);

export const hubNav = (lang: Locale, base: string): Link[] => {
  const { ui } = site[lang];
  return [
    { href: `${base}#work`, label: ui.work },
    { href: `${base}#lead`, label: ui.process },
    { href: `${base}#career`, label: ui.about },
  ];
};

export function KitHeader({ lang, base, otherHref }: { lang: Locale; base: string; otherHref: string }) {
  const s = site[lang];
  const { hub, ui } = s;
  const other: Locale = lang === "ko" ? "en" : "ko";
  return (
    <header className="nav nav--centre">
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          {ui.skip}
        </a>
        <a className="nav__logo" href="#top">
          <span className="mark" data-mark="stack" aria-hidden="true" />
          {s.name}
        </a>
        <nav className="nav__links" aria-label={hub.menu}>
          {hubNav(lang, base).map((n) => (
            <div className="nav__item" key={n.href}>
              <a className="nav__link" href={n.href}>
                {n.label}
              </a>
            </div>
          ))}
        </nav>
        <div className="nav__actions">
          <a className="nav__link" href={otherHref} hrefLang={other} lang={other}>
            {hub.otherLang}
          </a>
          <a className="btn btn--primary" href={`mailto:${s.contact.email}`}>
            {hub.email}
          </a>
        </div>
        <button className="nav__toggle" type="button" aria-expanded="false" aria-label={hub.menu}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

/** footer.closing: the close (contact set large, Email Jake) and the directory. `page` is the first link column. */
export function KitFooter({ lang, otherHref, page }: { lang: Locale; otherHref: string; page: { title: string; links: Link[] } }) {
  const s = site[lang];
  const { hub, ui, contact } = s;
  const other: Locale = lang === "ko" ? "en" : "ko";
  const mail = `mailto:${contact.email}`;
  return (
    <footer className="footer closing footer--dark ground-inverse" id="contact" aria-labelledby="close-h">
      <div className="wrap">
        <div className="closing__cta close--word">
          <div className="section-head--split">
            <h2 id="close-h">{hub.close}</h2>
            <a className="btn btn--primary" href={mail}>
              {hub.email}
              <Arrow />
            </a>
          </div>
          {/* the contact set large: the page's goal is a mail or a call (PRODUCT.md, Success) */}
          <p className="hub-contact">
            <a href={mail}>{contact.email}</a>
            <br />
            <a href={`tel:${contact.tel}`}>{contact.phone}</a>
          </p>
        </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-6 stack-4">
              <a className="nav__logo footer__mark" href="#top">
                <span className="mark" data-mark="stack" aria-hidden="true" />
                {s.name}
              </a>
              <p className="footer__lede">{s.headline}</p>
            </div>
            <div className="span-3 footer__col">
              <h3>{page.title}</h3>
              <ul>
                {page.links.map((n) => (
                  <li key={n.href}>
                    <a href={n.href}>{n.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="span-3 footer__col">
              <h3>{hub.footDocs}</h3>
              <ul>
                <li>
                  <a href={pdfHref(lang, "portfolio")} download>
                    {hub.pdf}
                  </a>
                </li>
                <li>
                  <a href={`/${lang}/process/`}>{ui.process}</a>
                </li>
                <li>
                  <a href={otherHref} hrefLang={other} lang={other}>
                    {hub.otherLang}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__legal">
            <span>
              © {new Date().getFullYear()} {s.name}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
