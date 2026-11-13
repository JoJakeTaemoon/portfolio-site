// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveStatic } from "./static.ts";

test("resolveStatic", () => {
  assert.equal(resolveStatic("/ko/"), "ko/index.html");
  assert.equal(resolveStatic("/_next/a.js"), "_next/a.js");
  assert.equal(resolveStatic("/x.css"), "x.css");
  assert.equal(resolveStatic("/"), "index.html");
  assert.equal(resolveStatic("/../etc/passwd"), null);
});
