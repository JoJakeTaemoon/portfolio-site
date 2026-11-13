// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { codeHtml, codeImageOut, codeImageSize, parseSnippet } from "./codeimage.ts";

test("codeHtml escapes markup", () => {
  const h = codeHtml("if (a < b && c > d) {}");
  assert.ok(h.includes("a &lt; b &amp;&amp; c &gt; d"));
  assert.ok(!h.includes("a < b"));
});
test("codeImageSize grows with lines", () => {
  assert.deepEqual(codeImageSize(10), { width: 704, height: 273 });
});
test("codeImageOut maps snippet to public png", () => {
  assert.equal(codeImageOut("snippets/ewa/claim.ts"), "public/img/ewa/code-claim.png");
});
test("markers are removed and the block flagged", () => {
  const p = parseSnippet("a\n// highlight-start\nb\nc\n// highlight-end\nd");
  assert.deepEqual(p.lines, ["a", "b", "c", "d"]);
  assert.deepEqual(p.highlight, [false, true, true, false]);
});
test("too many lines or columns is rejected", () => {
  assert.throws(() => parseSnippet("x\n".repeat(29)), /28 lines/);
  assert.throws(() => parseSnippet("x".repeat(73)), /72 columns/);
  parseSnippet("x\n".repeat(28).trimEnd());
  parseSnippet("x".repeat(72));
});
test("snippet-note lines are dropped", () => {
  assert.deepEqual(parseSnippet("// snippet-note: x\na\nb").lines, ["a", "b"]);
});
