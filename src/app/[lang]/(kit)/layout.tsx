/* eslint-disable @next/next/no-css-tags, @next/next/no-page-custom-font -- the kit is loaded as plain files in this one root layout, as the skill asks for an existing stack */
import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { KitScripts } from "@/components/KitScripts";
import { hasLocale, locales } from "@/lib/i18n";

// The kit's root layout (task 24 for the hub, task 25 adds the project pages): the pages are built with the
// design-taste-frontend kit (public/assets, copied unchanged), so they share no CSS with /process/ and /summary/
// in (site). A link between the two root layouts is a full page load, so neither one's styles leak into the other.
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#121312" },
  ],
};

const KIT = ["/assets/system.js", "/assets/motion/motion.js", "/assets/layout/layout.js"];
const MOMENT = ["/assets/moments/moments.js", "/assets/moments/lib.js", "/assets/moments/word-highlight/moment.js", "/assets/moments/pinned-chapters/moment.js"];
// start.mjs brand --page service --bg #fbfaf7 --ink #1c1c1a --accent #2f5d50 --surface #ffffff --muted #6b6a65 --type rethink --radius soft,
// kept as printed; the dark block is the site's night palette (DESIGN.md) on the same tokens.
const PALETTE = `:root {
  --p-bg: #fbfaf7; --p-surface: #ffffff; --p-ink: #1c1c1a; --p-muted: #6b6a65;
  --p-accent: #2f5d50; --p-accent-ink: #fbfaf7; --p-action: #2f5d50; --p-action-ink: #fbfaf7;
  --p-inv-bg: #1c1c1a; --p-inv-surface: #292927; --p-inv-ink: #fbfaf7; --p-inv-muted: #9e9d9b;
  --p-inv-accent: #fbfaf7; --p-inv-accent-ink: #1c1c1a; --p-inv-action: #fbfaf7; --p-inv-action-ink: #1c1c1a;
  --font-display: "Rethink Sans", system-ui, sans-serif;
  --font-text: "Rethink Sans", system-ui, sans-serif;
  --display-weight: 400;
  --display-tracking: -0.025em;
  --display-tracking-xl: -0.035em;
}
@media (prefers-color-scheme: dark) {
  :root {
    --p-bg: #121312; --p-surface: #1a1b1a; --p-ink: #ebeae5; --p-muted: #9b9a94;
    --p-accent: #84c7ac; --p-accent-ink: #121312; --p-action: #84c7ac; --p-action-ink: #121312;
    --p-inv-bg: #0b0c0b; --p-inv-surface: #1a1b1a; --p-inv-ink: #ebeae5; --p-inv-muted: #9b9a94;
    --p-inv-accent: #84c7ac; --p-inv-accent-ink: #121312; --p-inv-action: #84c7ac; --p-inv-action-ink: #121312;
  }
}`;

export default async function HubLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    // data-type / data-radius / data-buttons: the deal (see the comment at the top of the hub page); the kit's
    // head scripts add classes to <html> before React hydrates, hence suppressHydrationWarning.
    <html lang={lang} data-type="service" data-radius="soft" data-buttons="block" data-motion="" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400..700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/system.css" />
        <link rel="stylesheet" href="/assets/ui/cards.css" />
        <link rel="stylesheet" href="/assets/motion/motion.css" />
        <link rel="stylesheet" href="/assets/layout/layout.css" />
        <style dangerouslySetInnerHTML={{ __html: PALETTE }} />
        <link rel="stylesheet" href="/hub.css" />
        <link rel="stylesheet" href="/case.css" />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)" }} />
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)" }} />
        {[...MOMENT, ...KIT].map((href) => (
          <link key={href} rel="modulepreload" href={href} />
        ))}
      </head>
      <body>
        {children}
        <KitScripts src={KIT} />
      </body>
    </html>
  );
}
