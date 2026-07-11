// Generates src/data/basemap-europe.ts — the Europe-cropped basemap for the
// homepage routes map, from Natural Earth 110m admin_0 countries (public domain).
//
// Usage:
//   curl -sL -o /tmp/ne110.geojson \
//     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
//   node scripts/generate-basemap-europe.mjs /tmp/ne110.geojson
//
// The projection below MIRRORS src/components/RoutesMapV2.tsx (equirectangular,
// standard parallel 48°N, vertical stretch 1.05, Europe crop: Kazakhstan runs
// off the right edge by design). RoutesMapV2 throws at build time if the
// generated viewBox no longer matches its own — regenerate after changing
// either side.

import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/generate-basemap-europe.mjs <ne_110m_admin_0_countries.geojson>");
  process.exit(1);
}

// Europe crop: west pad past Lisbon, east edge just past Baku (Almaty is
// intentionally off-canvas), south pad past Tel Aviv, north past Stockholm.
const LNG_MIN = -9.14 - 1.5;
const LNG_MAX = 49.87 + 2.4;
const LAT_MIN = 32.09 - 1.8;
const LAT_MAX = 59.33 + 1.5;

const DEG = Math.PI / 180;
const K = Math.cos(48 * DEG);
const V = 1.05; // milder stretch than v1 — the crop already opens the cluster
const W = 1000;
const S = W / ((LNG_MAX - LNG_MIN) * K);
const H = Math.round((LAT_MAX - LAT_MIN) * S * V);

const project = ([lng, lat]) => [
  (lng - LNG_MIN) * K * S,
  (LAT_MAX - lat) * S * V,
];

/* Sutherland–Hodgman: clip a lng/lat ring to the projection bbox */
function clipHalf(pts, inside, intersect) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const prev = pts[(i + pts.length - 1) % pts.length];
    const curIn = inside(cur);
    if (curIn !== inside(prev)) out.push(intersect(prev, cur));
    if (curIn) out.push(cur);
  }
  return out;
}

const atLng = (a) => (p, q) => {
  const t = (a - p[0]) / (q[0] - p[0]);
  return [a, p[1] + t * (q[1] - p[1])];
};
const atLat = (a) => (p, q) => {
  const t = (a - p[1]) / (q[1] - p[1]);
  return [p[0] + t * (q[0] - p[0]), a];
};

function clipRing(ring) {
  let pts = ring;
  pts = clipHalf(pts, (p) => p[0] >= LNG_MIN, atLng(LNG_MIN));
  if (!pts.length) return [];
  pts = clipHalf(pts, (p) => p[0] <= LNG_MAX, atLng(LNG_MAX));
  if (!pts.length) return [];
  pts = clipHalf(pts, (p) => p[1] >= LAT_MIN, atLat(LAT_MIN));
  if (!pts.length) return [];
  pts = clipHalf(pts, (p) => p[1] <= LAT_MAX, atLat(LAT_MAX));
  return pts;
}

/* Douglas–Peucker for an OPEN polyline (endpoints must differ) */
function dpOpen(pts, eps) {
  if (pts.length <= 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let maxDist = -1;
    let maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const dist = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (dist > maxDist) {
        maxDist = dist;
        maxI = i;
      }
    }
    if (maxDist > eps) {
      keep[maxI] = 1;
      stack.push([a, maxI], [maxI, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/* DP for a CLOSED ring: naive DP anchored at start==end degenerates (the
   baseline has zero length, every distance is 0 and the ring collapses).
   Split at the vertex farthest from the start and simplify the two halves. */
function simplifyRing(pts, eps) {
  let p = pts;
  if (p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1]) {
    p = p.slice(0, -1);
  }
  if (p.length <= 4) return p;
  let far = 1;
  let best = -1;
  for (let i = 1; i < p.length; i++) {
    const d = (p[i][0] - p[0][0]) ** 2 + (p[i][1] - p[0][1]) ** 2;
    if (d > best) {
      best = d;
      far = i;
    }
  }
  const first = dpOpen(p.slice(0, far + 1), eps);
  const second = dpOpen([...p.slice(far), p[0]], eps);
  return [...first.slice(0, -1), ...second.slice(0, -1)];
}

function ringArea(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

// The v2 crop roughly doubles the scale, so the same projected epsilon keeps
// twice the geographic detail — wanted: v2 borders carry more visual weight.
const EPSILON = 1.2;
const MIN_AREA = 20;

const geo = JSON.parse(readFileSync(src, "utf8"));
const paths = [];
let points = 0;

for (const feature of geo.features) {
  const geom = feature.geometry;
  const polys =
    geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
  const featureParts = [];
  for (const poly of polys) {
    for (const ring of poly) {
      const clipped = clipRing(ring);
      if (clipped.length < 3) continue;
      const projected = simplifyRing(clipped.map(project), EPSILON);
      if (projected.length < 3 || ringArea(projected) < MIN_AREA) continue;
      points += projected.length;
      featureParts.push(
        `M${projected.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join("L")}Z`,
      );
    }
  }
  if (featureParts.length) paths.push(featureParts.join(""));
}

const out = `// GENERATED by scripts/generate-basemap-europe.mjs — do not edit by hand.
// Source: Natural Earth 110m admin_0 countries (public domain), clipped to the
// v2 Europe crop, simplified (Douglas–Peucker ε=${EPSILON}) and projected with
// the same parameters as src/components/RoutesMapV2.tsx.

/** ViewBox the paths were generated for — RoutesMapV2 checks this at build time. */
export const BASEMAP_EUROPE_VIEWBOX = { w: ${W}, h: ${H} } as const;

export const BASEMAP_EUROPE_PATHS: string[] = [
${paths.map((d) => `  "${d}",`).join("\n")}
];
`;

writeFileSync(new URL("../src/data/basemap-europe.ts", import.meta.url), out);
console.log(`countries: ${paths.length}, points: ${points}, viewBox: ${W}x${H}, bytes: ${out.length}`);
