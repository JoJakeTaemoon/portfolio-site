import { projects, slugs } from "@/content";
import { pdfTargets } from "@/lib/pdf";

export const dynamic = "force-static";

// Every case page links its own PDF, so every case gets one (briefs have no PDF link).
export function GET() {
  return Response.json(pdfTargets(slugs.filter((s) => projects.ko[s].kind === "case")));
}
