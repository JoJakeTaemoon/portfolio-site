import type { Locale } from "@/lib/i18n";
import { harnessProblems, pairProblems, processProblems, projectProblems } from "@/lib/validate";
import type { ProcessPage, Project, Site } from "./types";
import { siteKo } from "./site.ko";
import { siteEn } from "./site.en";
import { processKo } from "./process.ko";
import { processEn } from "./process.en";
import { ewaKo } from "./projects/ewa.ko";
import { ewaEn } from "./projects/ewa.en";
import { commerceDeliveryGatewayKo } from "./projects/commerce-delivery-gateway.ko";
import { commerceDeliveryGatewayEn } from "./projects/commerce-delivery-gateway.en";
import { fieldServiceOpsKo } from "./projects/field-service-ops.ko";
import { fieldServiceOpsEn } from "./projects/field-service-ops.en";
import { reputationMarketKo } from "./projects/reputation-market.ko";
import { reputationMarketEn } from "./projects/reputation-market.en";
import { constructionPmisKo } from "./projects/construction-pmis.ko";
import { constructionPmisEn } from "./projects/construction-pmis.en";
import { screenplayTranslationKo } from "./projects/screenplay-translation.ko";
import { screenplayTranslationEn } from "./projects/screenplay-translation.en";
import { gridConstraintAnalysisKo } from "./projects/grid-constraint-analysis.ko";
import { gridConstraintAnalysisEn } from "./projects/grid-constraint-analysis.en";
import { manufacturingAxKo } from "./projects/manufacturing-ax.ko";
import { manufacturingAxEn } from "./projects/manufacturing-ax.en";
import { recsysDataPrepKo } from "./projects/recsys-data-prep.ko";
import { recsysDataPrepEn } from "./projects/recsys-data-prep.en";
import { academyPortfolioKo } from "./projects/academy-portfolio.ko";
import { academyPortfolioEn } from "./projects/academy-portfolio.en";
import { aiUsagePolicyKo } from "./projects/ai-usage-policy.ko";
import { aiUsagePolicyEn } from "./projects/ai-usage-policy.en";
import { webtoonTranslationKo } from "./projects/webtoon-translation.ko";
import { webtoonTranslationEn } from "./projects/webtoon-translation.en";

// Adding a project: add its slug here, then both <slug>.ko.ts and <slug>.en.ts —
// the Record type fails the build if either language is missing.
export const slugs = ["ewa", "commerce-delivery-gateway", "field-service-ops", "reputation-market", "construction-pmis", "screenplay-translation", "grid-constraint-analysis", "manufacturing-ax", "webtoon-translation", "ai-usage-policy", "recsys-data-prep", "academy-portfolio"] as const;
export type Slug = (typeof slugs)[number];

/** Hub's featured cards, in display order. */
export const featured: readonly Slug[] = ["ewa", "field-service-ops", "reputation-market", "construction-pmis", "screenplay-translation", "grid-constraint-analysis"]; // D-040, D-048

export const site: Record<Locale, Site> = { ko: siteKo, en: siteEn };
export const processPage: Record<Locale, ProcessPage> = { ko: processKo, en: processEn };
export const projects: Record<Locale, Record<Slug, Project>> = {
  ko: { ewa: ewaKo, "commerce-delivery-gateway": commerceDeliveryGatewayKo, "field-service-ops": fieldServiceOpsKo, "reputation-market": reputationMarketKo, "construction-pmis": constructionPmisKo, "screenplay-translation": screenplayTranslationKo, "grid-constraint-analysis": gridConstraintAnalysisKo, "manufacturing-ax": manufacturingAxKo, "webtoon-translation": webtoonTranslationKo, "ai-usage-policy": aiUsagePolicyKo, "recsys-data-prep": recsysDataPrepKo, "academy-portfolio": academyPortfolioKo },
  en: { ewa: ewaEn, "commerce-delivery-gateway": commerceDeliveryGatewayEn, "field-service-ops": fieldServiceOpsEn, "reputation-market": reputationMarketEn, "construction-pmis": constructionPmisEn, "screenplay-translation": screenplayTranslationEn, "grid-constraint-analysis": gridConstraintAnalysisEn, "manufacturing-ax": manufacturingAxEn, "webtoon-translation": webtoonTranslationEn, "ai-usage-policy": aiUsagePolicyEn, "recsys-data-prep": recsysDataPrepEn, "academy-portfolio": academyPortfolioEn },
};

export const isSlug = (s: string): s is Slug => (slugs as readonly string[]).includes(s);

const byYear = (a: Slug, b: Slug) => projects.ko[b].year - projects.ko[a].year; // stable: same year keeps `slugs` order
/** Archive rows, newest first. */
export const archiveOrder: readonly Slug[] = [...slugs].sort(byYear);
/** Previous / next links on project pages (R-04): featured first, then the rest of the archive. */
export const pageOrder: readonly Slug[] = [...featured, ...archiveOrder.filter((s) => !featured.includes(s))];

// Fails the build (module load) on any content problem the types can't catch.
function assertContent() {
  const problems = slugs.flatMap((s) => {
    const ko = projects.ko[s];
    const en = projects.en[s];
    return [...projectProblems(ko).map((m) => `${m} (ko)`), ...projectProblems(en).map((m) => `${m} (en)`), ...pairProblems(ko, en)];
  });
  problems.push(...processProblems(processKo, "ko"), ...processProblems(processEn, "en"));
  problems.push(...harnessProblems(processKo, processEn, slugs.filter((s) => projects.ko[s].kind === "case")));
  if (problems.length) throw new Error(`Content problems:\n- ${problems.join("\n- ")}`);
}
assertContent();
