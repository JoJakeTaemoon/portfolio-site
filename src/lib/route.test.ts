import { test } from "node:test";
import assert from "node:assert/strict";
import type { Experience } from "../content/types.ts";
import { careerRoute } from "./route.ts";

const e = (place: string, period: string): Experience => ({ role: "r", org: "o", place, period, points: [] });

test("route runs oldest to newest, one stop per country, spans from the periods", () => {
  const items = [e("Korea", "2026 – present"), e("Vietnam", "2025 – 2026"), e("Korea", "2024 – 2025"), e("Vietnam · Singapore", "2021 – 2024"), e("Vietnam", "2016 – 2021"), e("US", "2015 – 2016"), e("Korea", "2006 – 2008")];
  const r = careerRoute(items);
  assert.deepEqual(r.stops.map((s) => `${s.code} ${s.span}`), ["kr 2006 – present", "us 2015 – 2016", "vn 2016 – 2026", "sg 2021 – 2024"]);
  assert.deepEqual(r.legs.map((l) => l.join(">")), ["kr>us", "us>vn", "vn>sg", "sg>kr", "kr>vn", "vn>kr"]);
});

test("a single-year role is one year; unknown places are skipped", () => {
  assert.deepEqual(careerRoute([e("Korea", "2012"), e("Mars", "2013")]).stops, [{ code: "kr", name: "Korea", span: "2012" }]);
});
