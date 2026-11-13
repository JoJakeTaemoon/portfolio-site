// Renders snippets/<slug>/<name>.ts to public/img/<slug>/code-<name>.png with local headless Chrome (2x).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { codeHtml, codeImageOut, codeImageSize, parseSnippet } from "../src/lib/codeimage.ts";

const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_BIN`);
const template = statSync("src/lib/codeimage.ts").mtimeMs;
const visible = (dir: string) => readdirSync(dir, { withFileTypes: true }).filter((e) => !e.name.startsWith("."));
const tmp = mkdtempSync(join(tmpdir(), "code-images-"));

try {
  for (const d of visible("snippets").filter((e) => e.isDirectory())) {
    for (const e of visible(join("snippets", d.name)).filter((e) => e.isFile() && e.name !== "shots.json")) {
      const src = `snippets/${d.name}/${e.name}`;
      const out = codeImageOut(src);
      if (existsSync(out) && statSync(out).mtimeMs >= Math.max(statSync(src).mtimeMs, template)) continue;
      const source = readFileSync(src, "utf8");
      const { width, height } = codeImageSize(parseSnippet(source).lines.length);
      const html = join(tmp, `${d.name}-${e.name}.html`);
      writeFileSync(html, codeHtml(source));
      mkdirSync(dirname(out), { recursive: true });
      execFileSync(CHROME, ["--headless", "--hide-scrollbars", "--force-device-scale-factor=2", `--screenshot=${out}`, `--window-size=${width},${height}`, `file://${html}`], { stdio: "ignore" });
      if (!existsSync(out)) throw new Error(`Chrome wrote nothing for ${src}`);
      console.log(`${src} -> ${out} (${width}x${height} @2x)`);
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
