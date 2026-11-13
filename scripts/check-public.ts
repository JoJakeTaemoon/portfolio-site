// Pre-deploy scan of everything published: out/ (html/txt/md/json, not _next; the profile drawings' svg), out/pdf text, snippets/.
// Patterns: .claude/leak-terms.txt. Also verifies every linked /pdf/*.pdf exists. Exit 1 on any problem.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { findLeaks, parseTerms } from "../src/lib/leaks.ts";
import { siteUrl } from "../src/content/meta.ts";
import { linkedPdfs, pdfLinkHosts } from "../src/lib/pdf.ts";

const PDFTOTEXT = process.env.PDFTOTEXT ?? "/opt/homebrew/bin/pdftotext";
const walk = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        return e.isDirectory() ? (p === "out/_next" ? [] : walk(p)) : [p];
      })
    : [];

const terms = parseTerms(readFileSync(".claude/leak-terms.txt", "utf8"));

// --dir <path>: the public edition before it is pushed (scripts/public-export.sh): every text file under it, .git aside
const dirAt = process.argv.indexOf("--dir");
if (dirAt > 0) {
  const root = process.argv[dirAt + 1];
  const files = walk(root).filter((f) => !f.includes("/.git/") && /\.(tsx?|mjs|js|json|md|css|sh|svg|html|txt|ya?ml)$|\/\.gitignore$/.test(f));
  let hits = 0;
  for (const f of files) for (const w of findLeaks(readFileSync(f, "utf8"), terms)) { console.log(`${f}: ${w}`); hits++; }
  console.log(`check:public --dir scanned ${files.length} files: ${hits} hit(s)`);
  process.exit(hits ? 1 : 0);
}

const outFiles = walk("out");
const pdfs = outFiles.filter((f) => f.startsWith("out/pdf/") && f.endsWith(".pdf"));
if (pdfs.length && !existsSync(PDFTOTEXT)) throw new Error(`pdftotext not found at ${PDFTOTEXT}; set PDFTOTEXT`);

const texts: [string, string][] = [
  ...outFiles.filter((f) => /\.(html|txt|md|json)$/.test(f) || /^out\/profile\/.*\.svg$/.test(f)).map((f): [string, string] => [f, readFileSync(f, "utf8")]),
  ...pdfs.map((f): [string, string] => [f, execFileSync(PDFTOTEXT, [f, "-"], { encoding: "utf8", maxBuffer: 1 << 28 })]),
  ...walk("snippets").map((f): [string, string] => [f, readFileSync(f, "utf8")]),
];

let problems = 0;
for (const [f, t] of texts) for (const w of findLeaks(t, terms)) { console.log(`${f}: ${w}`); problems++; }

const siteHost = new URL(siteUrl).hostname;
for (const f of pdfs) {
  for (const h of pdfLinkHosts(readFileSync(f).toString("latin1"))) {
    if (h !== siteHost) { console.log(`${f}: PDF link to foreign host ${h}`); problems++; }
  }
}

for (const f of outFiles.filter((f) => f.endsWith(".html"))) {
  for (const name of linkedPdfs(readFileSync(f, "utf8"))) {
    if (!existsSync(join("out/pdf", name))) { console.log(`${f}: missing linked PDF ${name}`); problems++; }
  }
}

console.log(`check:public scanned ${texts.length} files (${pdfs.length} PDFs): ${problems} hit(s)`);
process.exit(problems ? 1 : 0);
