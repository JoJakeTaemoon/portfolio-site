import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BriefView } from "@/components/BriefView";
import { CaseView } from "@/components/CaseView";
import { isSlug, projects, site, slugs } from "@/content";
import { siteUrl } from "@/content/meta";
import { hasLocale, locales } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => slugs.map((slug) => ({ slug }));

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isSlug(slug)) return {};
  const p = projects[lang][slug];
  const { name } = site[lang];
  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: `${name}: ${p.title}` },
    description: p.tagline,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}/work/${slug}/`])) },
    openGraph: { type: "article", title: p.title, description: p.tagline, images: [p.cover?.src ?? `/img/share-${lang}.jpg`] },
    twitter: { card: "summary_large_image" },
    other: { "site-kind": "other", "page-type": "service" },
  };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isSlug(slug)) notFound();
  const p = projects[lang][slug];
  if (p.kind === "brief") return <BriefView p={p} lang={lang} />;
  return <CaseView p={p} lang={lang} />;
}
