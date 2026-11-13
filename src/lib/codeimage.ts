// Code excerpt -> HTML for the headless-Chrome screenshot (scripts/code-images.ts). Spec: docs/reviews/2026-11-10-visuals-ewa.md section 10.
export const MAX_LINES = 28;
export const MAX_COLS = 72;

export function parseSnippet(source: string): { lines: string[]; highlight: boolean[] } {
  const lines: string[] = [];
  const highlight: boolean[] = [];
  let on = false;
  for (const raw of source.replace(/\s+$/, "").split("\n")) {
    const t = raw.trim();
    if (t.startsWith("// snippet-note:")) continue;
    if (t === "// highlight-start") on = true;
    else if (t === "// highlight-end") on = false;
    else {
      lines.push(raw);
      highlight.push(on);
    }
  }
  if (lines.length > MAX_LINES) throw new Error(`snippet has ${lines.length} lines, max ${MAX_LINES} lines`);
  const i = lines.findIndex((l) => l.length > MAX_COLS);
  if (i >= 0) throw new Error(`snippet line ${i + 1} has ${lines[i].length} chars, max ${MAX_COLS} columns`);
  return { lines, highlight };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const isComment = (l: string) => /^\s*(\/\/|\/\*|\*)/.test(l);

export function codeHtml(source: string): string {
  const { lines, highlight } = parseSnippet(source);
  const rows = lines
    .map((l, i) => `<div class="l${highlight[i] ? " h" : ""}${isComment(l) ? " c" : ""}">${esc(l) || " "}</div>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#fff}
body{width:704px;box-sizing:border-box;padding:24px 0;color:#24292f;font:15px/1.5 "JetBrains Mono","D2Coding","SF Mono",Menlo,monospace;font-variant-ligatures:none}
.l{white-space:pre;height:22.5px;padding:0 24px 0 21px;border-left:3px solid transparent}
.c{color:#636c76}
.h{background:#fff8c5;border-left-color:#24292f}
</style></head><body>${rows}</body></html>`;
}

export function codeImageSize(lineCount: number): { width: number; height: number } {
  return { width: 704, height: 48 + Math.ceil(22.5 * lineCount) };
}

export function codeImageOut(snippetPath: string): string {
  const m = /^snippets\/([^/]+)\/(.+)\.[^./]+$/.exec(snippetPath);
  if (!m) throw new Error(`not a snippet path: ${snippetPath}`);
  return `public/img/${m[1]}/code-${m[2]}.png`;
}
