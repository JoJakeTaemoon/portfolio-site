import assert from "node:assert/strict";
import { test } from "node:test";
import { srcSet } from "./thumbs.ts";

test("srcSet lists only variants narrower than the original, then the original", () => {
  assert.equal(srcSet("/img/ewa/shot-3.png"), "/img/ewa/shot-3-128.png 128w, /img/ewa/shot-3-160.png 160w, /img/ewa/shot-3.png 390w");
  assert.match(srcSet("/img/ewa/shot-1.png")!, /shot-1-640\.png 640w, \/img\/ewa\/shot-1\.png 1600w$/);
  assert.equal(srcSet("/img/missing.png"), undefined);
  assert.equal(srcSet("/img/profile.jpg"), undefined);
});
