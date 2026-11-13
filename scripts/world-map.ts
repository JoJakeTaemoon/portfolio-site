// Builds public/img/world-land.svg: a land silhouette in the route map's projection (src/lib/route.ts).
// Input: world-atlas land-110m.json (ISC, derived from Natural Earth public domain), path given as the first argument.
// Usage: node --experimental-strip-types scripts/world-map.ts /path/to/land-110m.json
import { readFileSync, writeFileSync } from "node:fs";
import { MAP } from "../src/lib/route.ts";

type Topo = { arcs: number[][][]; transform: { scale: [number, number]; translate: [number, number] }; objects: { land: { geometries: { type: string; arcs: number[][] | number[][][] }[] } } };
const topo = JSON.parse(readFileSync(process.argv[2], "utf8")) as Topo;
const { scale, translate } = topo.transform;

// Decode quantized, delta-encoded arcs to [lon, lat].
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => [(x += dx) * scale[0] + translate[0], (y += dy) * scale[1] + translate[1]]);
});
const ringOf = (ids: number[]) =>
  ids.flatMap((id, n) => {
    const pts = id < 0 ? [...arcs[~id]].reverse() : arcs[id];
    return n ? pts.slice(1) : pts;
  });

const rings: number[][][] = [];
for (const g of topo.objects.land.geometries) {
  const polys = (g.type === "Polygon" ? [g.arcs] : g.arcs) as number[][][];
  for (const poly of polys) for (const ring of poly) rings.push(ringOf(ring));
}

// Project with continuous longitudes inside each ring (no seams), keep rings that touch the widest view, drop sub-pixel steps.
const view = { x0: -40, x1: 1000, y0: -40, y1: 400 };
const paths: string[] = [];
for (const ring of rings) {
  let prev = ring[0][0] < MAP.lon0 - 90 ? ring[0][0] + 360 : ring[0][0];
  const pts = ring.map(([lon, lat], i) => {
    let l = lon + (prev - lon > 180 ? 360 : lon - prev > 180 ? -360 : 0);
    if (i === 0) l = prev;
    prev = l;
    return [Math.round((l - MAP.lon0) * MAP.k), Math.round((MAP.latTop - lat) * MAP.k)];
  });
  if (!pts.some(([x, y]) => x > view.x0 && x < view.x1 && y > view.y0 && y < view.y1)) continue;
  const kept = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  if (kept.length < 4) continue;
  paths.push("M" + kept.map((p) => p.join(",")).join("L") + "Z");
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg"><!-- Land: world-atlas land-110m (ISC, Mike Bostock), from Natural Earth (public domain). Projection: src/lib/route.ts MAP. --><path id="land" d="${paths.join("")}"/></svg>\n`;
writeFileSync("public/img/world-land.svg", svg);
console.log(`world-land.svg: ${paths.length} rings, ${(svg.length / 1024).toFixed(1)} KB`);
