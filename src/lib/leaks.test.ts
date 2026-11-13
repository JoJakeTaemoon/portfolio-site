import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { findLeaks, parseTerms } from "./leaks.ts";

const terms = parseTerms("# c\n\\b(ACME|Acme)\\b\tclient\n[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,}\temail\n\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b\tip\n!whxoans@gmail.com\n");
test("parseTerms", () => { assert.equal(terms.patterns.length, 3); assert.deepEqual(terms.allowed, ["whxoans@gmail.com"]); });
test("findLeaks finds brand, foreign email, IP", () => {
  assert.deepEqual(findLeaks("ACME on 192.0.2.10, mail a@example.com", terms), ["192.0.2.10", "ACME", "a@example.com"]);
});
test("allowed contact and plain English pass", () => {
  assert.deepEqual(findLeaks("we lift limits; contact whxoans@gmail.com; Next.js 16.4.6", terms), []);
});
test("real leak-terms file parses", () => {
  const real = parseTerms(readFileSync(".claude/leak-terms.txt", "utf8"));
  assert.ok(real.patterns.length > 10); assert.ok(real.allowed.includes("whxoans@gmail.com"));
});
