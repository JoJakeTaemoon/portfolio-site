// Renders masked, cropped, downscaled copies of local seed screenshots to public/img/<slug>/<out> with headless Chrome.
// Spec: snippets/<slug>/shots.json. Each shot's `src` is relative to the dir in env var `env` (never committed).
// crop/rects are [x,y,w,h] in the unit of the spec image times `u`; masks are opaque fills (not blur).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { variantWidths } from "../src/lib/thumbs.ts";

type Shot = { env: string; src: string; out: string; crop: number[]; u?: number; scale: number; rects: number[][]; filter?: string }; // filter: CSS filter on the source, e.g. to shift a brand colour away
const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILL = "#d9d6cf";
const thumbsOnly = process.argv.includes("--thumbs"); // only the resized copies, from public/ (no source folders needed)
const tmp = mkdtempSync(join(tmpdir(), "mask-shots-"));
try {
  for (const slug of thumbsOnly ? [] : readdirSync("snippets")) {
    const spec = `snippets/${slug}/shots.json`;
    if (!existsSync(spec)) continue;
    for (const s of JSON.parse(readFileSync(spec, "utf8")) as Shot[]) {
      const base = process.env[s.env];
      if (!base) { console.log(`skip ${slug}/${s.out}: set ${s.env}`); continue; }
      const u = s.u ?? 1, k = (n: number) => Math.round(n * u);
      const [cx, cy, cw, ch] = s.crop.map(k);
      const w = Math.round(cw * s.scale), h = Math.round(ch * s.scale);
      const rects = s.rects.map(([x, y, rw, rh]) => `<i style="left:${k(x)}px;top:${k(y)}px;width:${k(rw)}px;height:${k(rh)}px"></i>`).join("");
      const html = join(tmp, `${slug}-${s.out}.html`);
      writeFileSync(html, `<style>body{margin:0;overflow:hidden}#f{width:${w}px;height:${h}px;overflow:hidden;position:relative}#c{position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(${s.scale}) translate(${-cx}px,${-cy}px)}img{display:block}i{position:absolute;background:${FILL}}</style><div id=f><div id=c><img src="file://${join(base, s.src)}"${s.filter ? ` style="filter:${s.filter}"` : ""}>${rects}</div></div>`);
      const out = `public/img/${slug}/${s.out}`;
      mkdirSync(`public/img/${slug}`, { recursive: true });
      execFileSync(CHROME, ["--headless", "--hide-scrollbars", "--force-device-scale-factor=1", `--screenshot=${out}`, `--window-size=${w},${h}`, `file://${html}`], { stdio: "ignore" });
      console.log(`${slug}/${s.out} ${w}x${h}`);
    }
  }
  variants();
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// Resized copies of the already-masked public images (never of the sources): shot-N-<w>.png for cards, gallery and archive.
// Drawn on a canvas in headless Chrome and read back with --dump-dom. Skipped when up to date.
function variants() {
  const png = (file: string) => { const b = readFileSync(file); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };
  const resize = (src: string, out: string, w: number, h: number, type: "png" | "jpeg") => {
    const html = join(tmp, "resize.html");
    writeFileSync(html, `<body><script>const i=new Image();i.onload=()=>{const c=document.createElement("canvas");c.width=${w};c.height=${h};const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(i,0,0,${w},${h});document.body.textContent=c.toDataURL("image/${type}",0.85)};i.src=${JSON.stringify("file://" + join(process.cwd(), src))}</script></body>`);
    const dom = execFileSync(CHROME, ["--headless", "--allow-file-access-from-files", "--virtual-time-budget=3000", "--dump-dom", `file://${html}`], { encoding: "utf8", maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "ignore"] });
    const m = dom.match(/base64,([A-Za-z0-9+/=]+)/);
    if (!m) throw new Error(`resize failed: ${out}`);
    writeFileSync(out, Buffer.from(m[1], "base64"));
    console.log(`${out} ${w}x${h}`);
  };
  const stale = (src: string, out: string) => !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;
  for (const slug of readdirSync("public/img")) {
    const dir = `public/img/${slug}`;
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).filter((n) => /^shot-\d+\.png$/.test(n))) {
      const { w, h } = png(`${dir}/${f}`);
      for (const vw of variantWidths(w)) {
        const out = `${dir}/${f.replace(".png", `-${vw}.png`)}`;
        if (stale(`${dir}/${f}`, out)) resize(`${dir}/${f}`, out, vw, Math.round((h * vw) / w), "png");
      }
    }
  }
}
