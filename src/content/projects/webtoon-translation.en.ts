import type { Brief } from "../types";

// Anonymized: no title, artwork, studio, affiliate, repo, font or translation-site names; no quote amount.
// Ruling (Q-035): only the 2026 storyboard translator. The 2024 PSD generator and the 2023 template repos are left out.
// Every sentence and number comes from docs/facts/webtoon-translation.md; the figure is 7.1 in docs/reviews/2026-11-11-visuals-wave2.md.
// Not claimed: production use (facts line 69), test counts (not run), "about 3x faster" (no basis), the plan-vs-actual speed-up.
// The facts say no decision card (one recorded pair only), so the judgement lives in `built`, the flow caption and `results`.
export const webtoonTranslationEn: Brief = {
  kind: "brief",
  slug: "webtoon-translation",
  title: "Webtoon storyboard translator",
  tagline: "Built a job-queue app that finds the text in speech balloons with OCR from uploaded JPG pages, translates it, and returns, per language, a PDF with the translation overlaid and a table of source and translated text.",
  year: 2026,
  domain: "Webtoon translation tooling",
  tags: ["media", "ai-agents"],
  stack: ["Next.js 14", "TypeScript", "Prisma · PostgreSQL", "JWT (jose)", "OpenAI · Gemini", "pdf-lib · exceljs", "Vitest · Playwright"],
  facts: {
    period: "Apr 2026",
    role: "Only human on the build team; designed and ran the AI agent team",
    team: "Just me (all 18 commits are mine, all AI co-authored)",
    platforms: "Web app (job queue · internal tool)",
    context: "A client's internal tool supporting storyboard translation operations for webtoons",
  },
  metrics: [
    { value: "5", label: "target languages (from KO or JA)" },
    { value: "63 blocks", label: "balloon blocks found in one sample" },
    { value: "5", label: "job states, queued to done" },
  ],
  leads: {
    results: "One sample ran from upload to PDF and XLSX on a local machine; there is no record of production use.",
  },
  problem: [
    "The translation operations team took pages that customers sent as JPG bundles, merged them into a PDF by hand, translated the balloon text with GPT and Google Translate, and overlaid it on the PDF. The only step that truly needed a person's judgment was finding the text areas inside the balloons, so I judged that step could go to a vision model.",
    "The plan also recorded a risk: the text positions OCR finds can be wrong. So the core design question was what people would use to check and fix the output when OCR got it wrong.",
  ],
  visuals: [
    {
      kind: "flow",
      at: "visuals",
      title: "One translation job, end to end",
      caption: "A person only uploads the pages and downloads the result; because OCR can be wrong, every overlaid PDF comes with a source-and-translation table.",
      steps: [
        { id: "create", label: "Create a job", sub: "Several JPG pages, any of 5 target languages, choice of OCR provider", actor: "human" },
        { id: "queue", label: "Queue", sub: "An in-app worker claims jobs with row locks (SKIP LOCKED)", actor: "system" },
        { id: "pdf", label: "Build the PDF", sub: "JPG pages into one PDF", actor: "system" },
        { id: "ocr", label: "OCR and translate", sub: "Page slices go to a vision model in parallel; 5xx is retried; 8% margin on each balloon box", actor: "external" },
        { id: "compose", label: "Compose", sub: "Overlaid PDF plus a block-by-block XLSX of source and translation; reruns overwrite", actor: "system" },
        { id: "download", label: "Download", sub: "PDF and XLSX per language; progress polled every 2 seconds", actor: "human" },
      ],
    },
    {
      kind: "timeline",
      at: "results",
      title: "From kickoff to upload-to-compose",
      caption: "By the second day of commits the work ran from upload to compose, and there is no record of production use.",
      items: [
        { date: "2026-04-22", label: "Translator kickoff", note: "Plan, spec, authentication" },
        { date: "2026-04-23", label: "Upload connected to compose", note: "Job creation and upload, PDF stage, OCR (Gemini), compose commits. One local sample: 13 slices, 63 blocks, 40–90 s" },
        { date: "2026-04-24", label: "Last work-log entry", note: "E2E, deployment and observability appear only in the log; commits stop at the compose stage" },
      ],
    },
  ],
  built: [
    "A job-queue app. After a JWT login you create a job with several JPG pages, any of 5 target languages and an OCR provider, poll its progress every 2 seconds, and download a PDF and an XLSX per language.",
    "A 5-state job pipeline: queued, build PDF, OCR and translate, compose, done. An in-app worker claims jobs with database row locks (SKIP LOCKED), so there is no separate queue server.",
    "A swappable OCR and translation adapter. GPT-4o vision and Gemini can be chosen, a page is cut into slices and called in parallel, and 5xx errors are retried. Text positions use box_2d coordinates plus an 8% margin.",
    "Because OCR can be wrong, I chose a correspondence table as the safety net instead of a correction screen. The compose stage writes the overlaid PDF together with an XLSX of block ID, source and translated text, and a rerun overwrites it. The screen for fixing positions by hand stayed out of v1, and the risk table says \"OCR position accuracy → XLSX as the safety net, correction screen in v2\".",
  ],
  results: [
    "One storyboard sample ran from upload to PDF and XLSX on a local machine. The smoke run in the work log shows 13 slices, 63 blocks and 40–90 seconds, for one sample on the developer's machine.",
    "Kickoff was on 2026-04-22, and the next day the commits covered job creation and upload, the PDF stage, OCR and compose. All 18 commits carry an AI co-author trailer.",
    "There is no record of production use.",
  ],
  note: "Only what one sample on the developer's machine showed is stated. Production use and test pass counts are not given.",
  code: [],
  gallery: [],
};
