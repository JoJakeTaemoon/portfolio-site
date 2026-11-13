// Prints the built static site (out/) to out/pdf/*.pdf with local headless Chrome.
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:https";
import { tmpdir } from "node:os";
import type { AddressInfo } from "node:net";
import { extname, join } from "node:path";
import { siteUrl } from "../src/content/meta.ts";
import { resolveStatic } from "../src/lib/static.ts";

const run = promisify(execFile); // async: the static server lives in this process
const CHROME = process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_BIN`);
const OUT = "out";
const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".mp4": "video/mp4", ".ico": "image/x-icon", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff": "font/woff", ".txt": "text/plain", ".map": "application/json" };

const targets: { url: string; file: string }[] = JSON.parse(readFileSync(join(OUT, "pdf-targets.json"), "utf8"));
// vercel.app is HSTS-preloaded, so Chrome only loads it over https: serve a throwaway self-signed cert
// (Chrome gets --ignore-certificate-errors: safe only because the printed pages load no external https resources) and the printed link annotations become https://<public host>/...
const tmp = mkdtempSync(join(tmpdir(), "pdf-cert-"));
try {
  execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1", "-subj", "/CN=localhost", "-keyout", join(tmp, "k.pem"), "-out", join(tmp, "c.pem")], { stdio: ["ignore", "ignore", "pipe"] });
} catch (e) {
  rmSync(tmp, { recursive: true, force: true });
  const err = e as Error & { stderr?: Buffer };
  throw new Error(`openssl not found or failed — needed for the temporary HTTPS certificate: ${err.stderr?.toString().trim() || err.message}`);
}
const server = createServer({ key: readFileSync(join(tmp, "k.pem")), cert: readFileSync(join(tmp, "c.pem")) }, (req, res) => {
  try {
    const rel = resolveStatic(decodeURIComponent((req.url ?? "/").split("?")[0]));
    const file = rel && join(OUT, rel);
    if (!file || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404).end();
      return;
    }
    const body = readFileSync(file); // read first: headers must not go out before a possible throw
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    // malformed % escape or unreadable file; a NUL byte makes existsSync false, so that is a 404 above
    if (!res.headersSent) res.writeHead(400).end();
  }
});
await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const port = (server.address() as AddressInfo).port;
// Print under the public host (mapped to the local server) so link annotations carry it. PDF bytes stay untouched.
const host = new URL(siteUrl).host;
const base = `https://${host}`;

mkdirSync(join(OUT, "pdf"), { recursive: true });
let failed = false;
try {
  for (const t of targets) {
    const out = join(OUT, "pdf", t.file);
    try {
      await run(CHROME, ["--headless", "--ignore-certificate-errors", `--host-resolver-rules=MAP ${host} 127.0.0.1:${port}`, "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=10000", `--print-to-pdf=${out}`, base + t.url], { timeout: 60_000, killSignal: "SIGKILL" });
    } catch (e) {
      console.error(`chrome failed: ${t.url}`, (e as Error).message);
      failed = true;
      continue;
    }
    const size = existsSync(out) ? statSync(out).size : 0;
    console.log(`${size >= 10240 ? "ok " : "BAD"} ${t.file} ${(size / 1024).toFixed(0)}KB`);
    if (size < 10240) failed = true;
  }
} finally {
  server.close();
  rmSync(tmp, { recursive: true, force: true });
}
if (failed) process.exit(1);
