// Pure helpers — relative .ts imports only so node can run them directly.
import { locales } from "./i18n.ts";
import type { Locale } from "./i18n.ts";

export const pdfFile = (lang: Locale, key: string): string => `jake-jo-${key}-${lang}.pdf`;
export const pdfHref = (lang: Locale, key: string): string => `/pdf/${pdfFile(lang, key)}`;

export function pdfTargets(featured: readonly string[]): { url: string; file: string }[] {
  return locales.flatMap((lang) => [
    { url: `/${lang}/summary/`, file: pdfFile(lang, "portfolio") }, // D-036: dedicated 3-page layout
    { url: `/${lang}/process/`, file: pdfFile(lang, "how-i-work") },
    ...featured.map((slug) => ({ url: `/${lang}/work/${slug}/`, file: pdfFile(lang, slug) })),
  ]);
}

/** File names of every `href="/pdf/….pdf"` in the HTML, once each. */
export const linkedPdfs = (html: string): string[] => [
  ...new Set([...html.matchAll(/href="\/pdf\/([^"/]+\.pdf)"/g)].map((m) => m[1])),
];

/** Hostnames of every http(s) `/URI (…)` link annotation in latin1-decoded PDF bytes, once each (mailto:/tel: skipped). */
export const pdfLinkHosts = (text: string): string[] => [
  ...new Set([...text.matchAll(/\/URI\s*\(https?:\/\/([^/:)?#]+)/gi)].map((m) => m[1].toLowerCase())),
];
