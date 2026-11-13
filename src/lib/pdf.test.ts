// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { linkedPdfs, pdfLinkHosts, pdfFile, pdfHref, pdfTargets } from "./pdf.ts";

test("pdfFile names", () => {
  assert.equal(pdfFile("ko", "portfolio"), "jake-jo-portfolio-ko.pdf");
  assert.equal(pdfFile("en", "ewa"), "jake-jo-ewa-en.pdf");
});
test("pdfHref", () => {
  assert.equal(pdfHref("ko", "how-i-work"), "/pdf/jake-jo-how-i-work-ko.pdf");
});
test("pdfTargets covers summary, process and featured per language", () => {
  const t = pdfTargets(["ewa"]);
  assert.equal(t.length, 6);
  assert.deepEqual(t.find((x) => x.url === "/en/work/ewa/"), { url: "/en/work/ewa/", file: "jake-jo-ewa-en.pdf" });
  assert.deepEqual(t.find((x) => x.url === "/ko/process/"), { url: "/ko/process/", file: "jake-jo-how-i-work-ko.pdf" });
  // D-036: the career summary PDF prints its own 3-page route, not the hub
  assert.deepEqual(t.find((x) => x.file === "jake-jo-portfolio-ko.pdf"), { url: "/ko/summary/", file: "jake-jo-portfolio-ko.pdf" });
});
test("linkedPdfs finds hrefs once", () => {
  assert.deepEqual(linkedPdfs('<a href="/pdf/a-ko.pdf">x</a><a href="/pdf/a-ko.pdf">y</a><a href="/ko/">z</a>'), ["a-ko.pdf"]);
});
test("pdfLinkHosts: http(s) hosts only, deduped; mailto/tel skipped", () => {
  const pdf = "/URI (http://127.0.0.1:49418/en/process/)\n/URI (https://a.example/x)\n/URI (https://a.example/y)\n/URI (mailto:a@b.c)\n/URI (tel:+82)";
  assert.deepEqual(pdfLinkHosts(pdf), ["127.0.0.1", "a.example"]);
  assert.deepEqual(pdfLinkHosts("no links"), []);
});
