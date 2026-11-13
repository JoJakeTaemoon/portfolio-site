import "../../globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactLinks, Mail } from "@/components/ContactLinks";
import { LangToggle } from "@/components/LangToggle";
import { MainNav } from "@/components/MainNav";
import { PrintExpand } from "@/components/PrintExpand";
import { site } from "@/content";
import { hasLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const s = site[lang];
  return {
    title: { default: `${s.name} — Portfolio`, template: `%s · ${s.name}` },
    description: s.headline,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/`])) },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { name, ui, contact } = site[lang];
  return (
    <html lang={lang}>
      <body>
        <a className="skip" href="#main">
          {ui.skip}
        </a>
        <PrintExpand />
        <header className="top">
          <Link href={`/${lang}/`} className="brand">
            {name}
          </Link>
          <MainNav
            home={`/${lang}/`}
            items={[
              { href: `/${lang}/#work`, label: ui.work, spy: ["work"] },
              { href: `/${lang}/process/`, label: ui.process, spy: ["lead"] },
              { href: `/${lang}/#career`, label: ui.about, spy: ["career"] },
            ]}
          />
          <div className="controls">
            <a className="contact-cta" href={`mailto:${contact.email}`}>
              <Mail />
              <span>{ui.contactCta}</span>
            </a>
            <LangToggle current={lang} />
          </div>
        </header>
        <main id="main" tabIndex={-1}>{children}</main>
        <footer className="foot muted small">
          <ContactLinks contact={contact} className="contact-links foot-links" />
          © {new Date().getFullYear()} {name}
        </footer>
      </body>
    </html>
  );
}
