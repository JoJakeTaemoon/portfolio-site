// Run: npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { swapLang } from "./i18n.ts";

test("swapLang keeps the rest of the path", () => {
  assert.equal(swapLang("/ko/work/ewa/", "en"), "/en/work/ewa/");
  assert.equal(swapLang("/en/", "ko"), "/ko/");
  assert.equal(swapLang("/en", "ko"), "/ko/");
  assert.equal(swapLang("/work/ewa/", "ko"), "/ko/work/ewa/");
});
