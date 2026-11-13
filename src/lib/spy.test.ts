import assert from "node:assert/strict";
import { test } from "node:test";
import { activeId } from "./spy.ts";

const items = [
  { id: "a", top: 100 },
  { id: "b", top: 600 },
  { id: "c", top: 1200 },
];

test("scroll spy picks the last section above the line", () => {
  assert.equal(activeId(items, 50), null);
  assert.equal(activeId(items, 100), "a");
  assert.equal(activeId(items, 700), "b");
  assert.equal(activeId(items, 5000), "c");
});

test("page bottom wins, empty list is null", () => {
  assert.equal(activeId(items, 50, true), "c");
  assert.equal(activeId([], 50), null);
});

test("input order does not matter", () => {
  assert.equal(activeId([...items].reverse(), 700), "b");
});
