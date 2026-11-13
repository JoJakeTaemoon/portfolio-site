import { featured, processPage, projects, site } from "@/content";
import { siteUrl, sourceRepo } from "@/content/meta";
import { profileReadme } from "@/lib/readme";

export const dynamic = "force-static";

export function GET() {
  const md = profileReadme({ en: site.en, ko: site.ko, projects: featured.map((s) => projects.en[s]), siteUrl, process: processPage.en, sourceRepo });
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
