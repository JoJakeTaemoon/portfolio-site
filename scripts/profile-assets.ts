// The GitHub profile README's work cards (D-058): each featured card's picture on the built hub (/en/), light and dark,
// at 2x, so the profile shows the site's own thumbnails. Run after `npm run build`; writes out/profile/work-<slug>-<theme>.png.
// Headless Chrome over the DevTools protocol (Node's own WebSocket), the built site served from out/ on 127.0.0.1.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { resolveStatic } from "../src/lib/static.ts";

const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_BIN`);
const OUT = "out";
const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".webp": "image/webp", ".mp4": "video/mp4" };
// The featured slugs in the hub's order, read off the built README (its cards link /en/work/<slug>/).
const slugs = [...new Set([...readFileSync(join(OUT, "profile-readme.md"), "utf8").matchAll(/\/en\/work\/([a-z0-9-]+)\//g)].map((m) => m[1]))];
if (!slugs.length) throw new Error("no featured work in out/profile-readme.md: run npm run build first");

const server = createServer((req, res) => {
  const rel = resolveStatic(decodeURIComponent((req.url ?? "/").split("?")[0]));
  const file = rel && join(OUT, rel);
  if (!file || !existsSync(file) || !statSync(file).isFile()) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
});
await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

const profile = mkdtempSync(join(tmpdir(), "profile-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "about:blank"]);
try {
  const wsUrl = await new Promise<string>((res, rej) => {
    let buf = "";
    chrome.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
    chrome.on("exit", () => rej(new Error(`chrome exited: ${buf.slice(-400)}`)));
    setTimeout(() => rej(new Error("chrome did not start in 20 s")), 20_000);
  });
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let seq = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DevTools protocol replies are untyped JSON
  type Reply = any;
  const pending = new Map<number, { res: (v: Reply) => void; rej: (e: Error) => void }>();
  const waiters: { method: string; res: () => void }[] = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(String(e.data));
    const p = m.id && pending.get(m.id);
    if (p) {
      pending.delete(m.id);
      if (m.error) p.rej(new Error(m.error.message));
      else p.res(m.result);
      return;
    }
    for (let i = waiters.length - 1; i >= 0; i--) if (waiters[i].method === m.method) waiters.splice(i, 1)[0].res();
  };
  const call = (method: string, params: object, sessionId?: string) => new Promise<Reply>((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
  const event = (method: string) => new Promise<void>((res) => waiters.push({ method, res }));
  const { targetId } = await call("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await call("Target.attachToTarget", { targetId, flatten: true });
  const send = (method: string, params: object = {}) => call(method, params, sessionId);
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  mkdirSync(join(OUT, "profile"), { recursive: true });

  for (const theme of ["light", "dark"] as const) {
    // reduced motion: the kit shows everything at rest (no entrance, no reveal), so the shots are steady
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
    const loaded = event("Page.loadEventFired");
    await send("Page.navigate", { url: `${base}/en/` });
    await loaded;
    await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => 1)", awaitPromise: true });
    for (const slug of slugs) {
      const { result } = await send("Runtime.evaluate", {
        awaitPromise: true,
        returnByValue: true,
        expression: `(async () => {
          const el = document.querySelector('#work a.card[href$="/work/${slug}/"] .hub-thumb');
          if (!el) return null;
          el.scrollIntoView({ block: "center" });
          await Promise.all([...el.querySelectorAll("img")].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
          await new Promise((r) => setTimeout(r, 300));
          const b = el.getBoundingClientRect();
          return { x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height };
        })()`,
      });
      if (!result.value) throw new Error(`no card picture for ${slug} on /en/`);
      const { data } = await send("Page.captureScreenshot", { format: "png", clip: { ...result.value, scale: 1 }, captureBeyondViewport: true });
      const file = join(OUT, "profile", `work-${slug}-${theme}.png`);
      writeFileSync(file, Buffer.from(data, "base64"));
      console.log(`${file} ${Math.round(result.value.width * 2)}x${Math.round(result.value.height * 2)}`);
    }
  }
  ws.close();
} finally {
  chrome.kill("SIGKILL");
  server.close();
  rmSync(profile, { recursive: true, force: true });
}
