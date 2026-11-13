// Pure — relative .ts imports only so node can run it directly.
import type { ProcessPage, Project, Site } from "../content/types.ts";
import { pdfFile } from "./pdf.ts";
import { statusLine } from "./template.ts";

const month = (asOf: string) =>
  new Date(`${asOf}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clause = (s: string) => s.match(/^[^.:]*[.:]\s*/)?.[0] ?? ""; // up to the first full stop or colon
const bare = (s: string) => s.replace(/[.:]\s*$/, "");
const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** The line under the h1 (M-09), from values the site already shows: the years (the hub's career heading), the
 *  hub's float fact, the countries of the experience in order. */
export function summaryLine(s: Site): string {
  const years = s.hub.career.match(/^\S+ years/)?.[0];
  const places = [...new Set(s.experience.flatMap((e) => e.place.split(" · ")))];
  return [years, ...s.hub.floatFact.split(", "), places.join(" / ")].filter(Boolean).join(" · ");
}

/** A shields.io static badge: words only (never a name, address or handle), its dashes and underscores doubled; with a
 *  message it has two halves, the label on the ink and the message on `color`. */
const part = (s: string) => encodeURIComponent(s.replace(/-/g, "--").replace(/_/g, "__"));
export const badge = (text: string, color: string, { message, logo, style = "for-the-badge" }: { message?: string; logo?: string; style?: string } = {}) =>
  `https://img.shields.io/badge/${part(text)}${message ? `-${part(message)}` : ""}-${color}?style=${style}${message ? "&labelColor=1c1c1a" : ""}${logo ? `&logo=${logo}&logoColor=white` : ""}`;

/** A light/dark pair from the profile repo's assets/ (GitHub picks by the reader's colour scheme). */
const picture = (name: string, ext: string, alt: string, width = "100%") =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.${ext}"><img src="assets/${name}-light.${ext}" width="${width}" alt="${attr(alt)}"></picture>`;

// The stack the featured cases list, as logo badges: the names folded to one spelling, kept only when a brand logo
// exists (simple-icons slug), most-used first. ponytail: a hand map; add a line when a case lists a new tool.
const STACK: Record<string, [string, string]> = {
  "Next.js": ["Next.js", "nextdotjs"], TypeScript: ["TypeScript", "typescript"], "Node.js · TypeScript": ["TypeScript", "typescript"],
  NestJS: ["NestJS", "nestjs"], Prisma: ["Prisma", "prisma"], PostgreSQL: ["PostgreSQL", "postgresql"], Redis: ["Redis", "redis"],
  Flutter: ["Flutter", "flutter"], "Docker Compose": ["Docker", "docker"], Caddy: ["Caddy", "caddy"], "GitHub Actions": ["GitHub Actions", "githubactions"],
  "socket.io": ["Socket.io", "socketdotio"], "Tailwind CSS": ["Tailwind CSS", "tailwindcss"],
  "puppeteer-core": ["Puppeteer", "puppeteer"], "Python 3": ["Python", "python"], "Python (stdlib)": ["Python", "python"],
  "Claude Code": ["Claude Code", "claude"], "Claude Code CLI": ["Claude Code", "claude"],
};
export function stackBadges(projects: Pick<Project, "stack">[]): string[] {
  const n = new Map<string, { slug: string; count: number }>();
  for (const p of projects) for (const t of new Set((p.stack ?? []).map((s) => STACK[s]).filter(Boolean).map(([name, slug]) => `${name}\t${slug}`))) {
    const [name, slug] = t.split("\t");
    n.set(name, { slug, count: (n.get(name)?.count ?? 0) + 1 });
  }
  return [...n].sort((a, b) => b[1].count - a[1].count).map(([name, { slug }]) => `<img src="${badge(name, "1c1c1a", { logo: slug, style: "flat-square" })}" alt="${attr(name)}">`);
}

/** The process page's pipeline as a Mermaid flowchart (GitHub draws it, in the reader's colour scheme): the agents'
 *  stages inside the band, the client and me around it, styled as the site's who chips. */
export function pipelineMermaid(p: ProcessPage): string {
  const q = (s: string) => s.replace(/"/g, "#quot;");
  const cls = (n: ProcessPage["pipeline"]["nodes"][number]) => (n.group === "me" ? (n.idle ? "rule" : "me") : n.group === "human" ? "client" : "agent");
  const node = (n: ProcessPage["pipeline"]["nodes"][number]) => `${n.id}["${q(n.sub ? `${n.label}<br/>${n.sub}` : n.label)}"]:::${cls(n)}`;
  const inBand = p.pipeline.nodes.filter((n) => cls(n) === "agent");
  return [
    "```mermaid",
    "flowchart TB",
    ...p.pipeline.nodes.filter((n) => cls(n) !== "agent" && n.row === 0).map(node),
    `subgraph band ["${q(p.mapBand)}"]`,
    "direction TB",
    ...inBand.map(node),
    "end",
    ...p.pipeline.nodes.filter((n) => cls(n) !== "agent" && n.row !== 0).map(node),
    ...p.pipeline.edges.map((e) => (e.label ? `${e.from} -->|${q(e.label)}| ${e.to}` : `${e.from} --> ${e.to}`)),
    "style band fill:transparent,stroke:#8b949e,stroke-dasharray:6 4",
    "classDef me fill:#2f5d50,stroke:#2f5d50,color:#ffffff",
    "classDef client fill:transparent,stroke:#8b949e,stroke-width:3px",
    "classDef agent fill:transparent,stroke:#8b949e,stroke-dasharray:5 3",
    "classDef rule fill:transparent,stroke:#8b949e,stroke-width:2px,stroke-dasharray:2 4",
    "```",
  ].join("\n");
}

// D-037 skeleton, made visual by D-058 (Jake 2026-11-13): banner, badges, the pipeline drawn by GitHub, the work as
// picture cards, the stack as logo badges. Every word is still the site's; no third-party stats cards, no emoji.
export function profileReadme({ en, ko, projects, siteUrl, process, sourceRepo }: { en: Site; ko: Site; projects: Project[]; siteUrl: string; process?: ProcessPage; sourceRepo?: string }): string {
  const { publicContributions: pub, privateContributions: priv, asOf } = en.github;
  const pdf = (lang: "en" | "ko") => `${siteUrl}/pdf/${pdfFile(lang, "portfolio")}`;
  const roles = [...new Set(projects.map((p) => p.facts.role))];
  const role = roles.length === 1 ? roles[0] : undefined;
  const card = (p: Project) => {
    const page = `${siteUrl}/en/work/${p.slug}/`;
    const outcome = p.tagline.replace(/^With an AI agent team, (\w)/, (_, c: string) => c.toUpperCase());
    return [
      `<td width="50%" valign="top">`,
      `<a href="${page}">${picture(`work-${p.slug}`, "png", p.title)}</a>`,
      `<p><b><a href="${page}">${attr(p.title)}</a></b><br><sub>${attr(statusLine(p))}</sub></p>`,
      `<p>${attr(outcome)}</p>`,
      role ? "" : `<p><sub>${attr(p.facts.role)}</sub></p>`,
      `<p><a href="${page}">Case study</a> · <a href="${siteUrl}/ko/work/${p.slug}/">한국어</a> · <a href="${siteUrl}/pdf/${pdfFile("en", p.slug)}">PDF</a></p>`,
      `</td>`,
    ].filter(Boolean).join("\n");
  };
  const rows = Array.from({ length: Math.ceil(projects.length / 2) }, (_, i) => `<tr>\n${projects.slice(i * 2, i * 2 + 2).map(card).join("\n")}\n</tr>`);
  const first = clause(en.now);
  const now = first && bare(first) === bare(clause(en.intro[0])) ? cap(en.now.slice(first.length)) : en.now;
  const jobs = en.experience.filter((e) => !e.early).slice(0, 4).map((e) => `- **${e.role}** · ${e.org} (${e.place}) · ${e.period}`);
  const stack = stackBadges(projects);
  return [
    `<a href="${siteUrl}/en/">${picture("banner", "svg", `${en.name}: ${en.headline}. ${summaryLine(en)}`)}</a>`,
    [
      `<p align="center">`,
      `<a href="${siteUrl}/en/"><img src="${badge("Portfolio", "2f5d50", { message: "EN" })}" alt="Portfolio (English)"></a>`,
      `<a href="${siteUrl}/ko/"><img src="${badge("Portfolio", "2f5d50", { message: "KO" })}" alt="포트폴리오 (한국어)"></a>`,
      `<a href="${pdf("en")}"><img src="${badge("Career PDF", "2f5d50", { message: "EN" })}" alt="Career summary PDF (English)"></a>`,
      `<a href="${pdf("ko")}"><img src="${badge("Career PDF", "2f5d50", { message: "KO" })}" alt="경력 요약 PDF (한국어)"></a>`,
      `<a href="mailto:${en.contact.email}"><img src="${badge("Email", "1c1c1a", { logo: "gmail" })}" alt="Email ${en.contact.email}"></a>`,
      sourceRepo ? `<a href="${sourceRepo}"><img src="${badge("Source", "2f5d50", { message: sourceRepo.split("/").pop(), logo: "github" })}" alt="Source code of the site"></a>` : "",
      `</p>`,
    ].filter(Boolean).join("\n"),
    en.intro[0],
    `> [!NOTE]\n> Most of my work lives in private client repositories: ${pub} public vs ${priv.toLocaleString("en-US")} private contributions in the past year (as of ${month(asOf)}). Client projects below are anonymized.`,
    `## Now\n\n${now}`,
    process ? `<details>\n<summary>${attr(process.pipelineTitle)}: the full pipeline</summary>\n\n${pipelineMermaid(process)}\n\n</details>` : "",
    `## Selected work\n\n${role ? `All ${projects.length}: ${role.charAt(0).toLowerCase()}${role.slice(1)}.\n\n` : ""}<table>\n${rows.join("\n")}\n</table>`,
    stack.length ? `## Stack\n\n<p>\n${stack.join("\n")}\n</p>` : "",
    sourceRepo ? `This README, the site and its PDFs are built from one typed content source: [${sourceRepo.split("/").pop()}](${sourceRepo}).` : "",
    `## Experience\n\n${jobs.join("\n")}`,
    `## How I lead\n\n${en.lead.map((l) => `- ${l}`).join("\n")}`,
    `<details>\n<summary>한국어 소개</summary>\n\n${ko.headline}\n\n${ko.intro[0]}\n\n[한국어 포트폴리오](${siteUrl}/ko/)\n\n</details>`,
    `## Contact\n\n- Email: ${en.contact.email}\n- Phone: ${en.contact.phone}`,
  ].filter(Boolean).join("\n\n") + "\n";
}
