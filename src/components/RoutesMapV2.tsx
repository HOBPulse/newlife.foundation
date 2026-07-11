import type { CSSProperties } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { RevealOnView } from "@/components/RevealOnView";
import {
  AIR_LINKS,
  COUNTRIES,
  CROSS_LINKS,
  HUBS,
  INTERNAL_LEGS,
  NETWORK_LINKS,
  ROUTE_GROUPS,
  type DestinationCity,
} from "@/data/routes";
import { STORY_PHOTOS, type StorySlug } from "@/lib/stories";
import { BASEMAP_EUROPE_PATHS, BASEMAP_EUROPE_VIEWBOX } from "@/data/basemap-europe";

/* --- v2: corridor-tree rework (?map=v2) -----------------------------------
   Same owner data as v1, new visual organization: routes sharing a direction
   bundle into corridors that branch near destinations. Line weight tapers
   with the number of routes downstream of each segment (thicker trunk,
   thinner branches) — direction reads from the taper, no arrowheads.
   v1 (RoutesMap.tsx) stays untouched until v2 is approved. */

/* --- Projection ------------------------------------------------------------
   Equirectangular, standard parallel 48°N — cropped to Europe. Kazakhstan
   intentionally runs off the right edge (quiet cue label at the crop). */

const DEG = Math.PI / 180;
const K = Math.cos(48 * DEG);
const V = 1.05; // milder stretch than v1 — the crop already opens the cluster

// Europe crop: west pad past Lisbon, east edge just past Baku, south past
// Tel Aviv, north past Stockholm. Mirrored by generate-basemap-europe.mjs.
const LNG_MIN = -9.14 - 1.5;
const LNG_MAX = 49.87 + 2.4;
const LAT_MIN = 32.09 - 1.8;
const LAT_MAX = 59.33 + 1.5;

const W = 1000;
const S = W / ((LNG_MAX - LNG_MIN) * K);
const H = Math.round((LAT_MAX - LAT_MIN) * S * V);

// The basemap is pre-projected by scripts/generate-basemap-europe.mjs with
// these exact parameters — fail the build rather than render misaligned.
if (BASEMAP_EUROPE_VIEWBOX.w !== W || BASEMAP_EUROPE_VIEWBOX.h !== H) {
  throw new Error(
    `Basemap-europe viewBox ${BASEMAP_EUROPE_VIEWBOX.w}x${BASEMAP_EUROPE_VIEWBOX.h} != map ${W}x${H} — run node scripts/generate-basemap-europe.mjs`,
  );
}

type Pt = { x: number; y: number };

const r1 = (n: number) => Math.round(n * 10) / 10;

function project(p: { lat: number; lng: number }): Pt {
  return {
    x: r1((p.lng - LNG_MIN) * K * S),
    y: r1((LAT_MAX - p.lat) * S * V),
  };
}

/* --- Line geometry ----------------------------------------------------------
   Air corridors: smooth quadratic arcs (as v1). Ground corridors: road-like
   octilinear polylines — one 45° bend per segment, strict, no wobble. */

function arcCtrl(from: Pt, to: Pt, bow: number): Pt {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let px = dy / len;
  let py = -dx / len;
  if (py > 0) {
    px = -px;
    py = -py;
  }
  return {
    x: r1((from.x + to.x) / 2 + px * bow * len),
    y: r1((from.y + to.y) / 2 + py * bow * len),
  };
}

function arcPath(from: Pt, to: Pt, bow: number): string {
  const c = arcCtrl(from, to, bow);
  return `M ${from.x} ${from.y} Q ${c.x} ${c.y} ${to.x} ${to.y}`;
}

type BendStyle = "diag" | "axis" | "straight";

/** Road-like path: 45° diagonal + axis-aligned segment (metro-map style).
 *  "diag" bends immediately after departure, "axis" bends before arrival. */
function roadPath(from: Pt, to: Pt, bend: BendStyle = "diag"): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const d = Math.min(adx, ady);
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;
  if (bend === "straight" || Math.abs(adx - ady) < 8 || d < 8) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  const p: Pt =
    bend === "diag"
      ? { x: r1(from.x + sx * d), y: r1(from.y + sy * d) }
      : adx > ady
        ? { x: r1(to.x - sx * d), y: from.y }
        : { x: from.x, y: r1(to.y - sy * d) };
  return `M ${from.x} ${from.y} L ${p.x} ${p.y} L ${to.x} ${to.y}`;
}

/** Initial travel direction of an edge — used to place hub ports. */
function startAngle(from: Pt, to: Pt, air: boolean, bow: number, bend: BendStyle): number {
  if (air) {
    const c = arcCtrl(from, to, bow);
    return Math.atan2(c.y - from.y, c.x - from.x);
  }
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;
  if (bend === "straight" || Math.abs(adx - ady) < 8 || Math.min(adx, ady) < 8) {
    return Math.atan2(dy, dx);
  }
  if (bend === "diag") return Math.atan2(sy, sx);
  return adx > ady ? Math.atan2(0, sx) : Math.atan2(sy, 0);
}

/* --- Corridor tree ----------------------------------------------------------
   Hand-authored visual bundling of the SAME hub→city relations as v1's
   ROUTE_GROUPS (validated below — no invented links, every city exactly
   once). Junctions are real destination cities; chains follow geography
   (e.g. Lublin sits on the Kyiv–Warsaw trunk). `bow` tunes air arcs,
   `bend` tunes road polylines. */

type TreeNode = {
  city: string;
  bow?: number;
  bend?: BendStyle;
  children?: TreeNode[];
};

type Corridor = { id: string; hub: string; root: TreeNode };

const CORRIDORS: Corridor[] = [
  // Kyiv — northern band bundled into one tapering trunk via Lublin/Warsaw
  {
    id: "north-band",
    hub: "kyiv",
    root: {
      city: "lublin",
      children: [
        {
          city: "warsaw",
          children: [
            { city: "gdansk" },
            {
              city: "berlin",
              bend: "axis",
              children: [
                { city: "hamburg" },
                { city: "amsterdam", bend: "axis", children: [{ city: "utrecht" }] },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "baltic",
    hub: "kyiv",
    root: { city: "vilnius", children: [{ city: "kaunas", children: [{ city: "klaipeda" }] }] },
  },
  { id: "stockholm", hub: "kyiv", root: { city: "stockholm", bow: 0.18 } },
  { id: "london", hub: "kyiv", root: { city: "london", bow: 0.26 } },
  // Lviv — the dense western fan
  {
    id: "poland",
    hub: "lviv",
    root: {
      city: "przemysl",
      children: [
        { city: "krakow", children: [{ city: "bielsko-biala" }, { city: "wroclaw" }] },
      ],
    },
  },
  {
    id: "rhine",
    hub: "lviv",
    root: {
      city: "frankfurt",
      bend: "axis",
      children: [
        { city: "marburg" },
        {
          city: "cologne",
          children: [{ city: "bonn" }, { city: "essen" }, { city: "dusseldorf" }],
        },
      ],
    },
  },
  {
    id: "central",
    hub: "lviv",
    root: {
      city: "olomouc",
      children: [
        { city: "prague" },
        { city: "brno", children: [{ city: "vienna" }, { city: "bratislava" }] },
      ],
    },
  },
  { id: "danube", hub: "lviv", root: { city: "budapest", children: [{ city: "ljubljana" }] } },
  { id: "alpine", hub: "lviv", root: { city: "zurich", bend: "axis", children: [{ city: "bern" }] } },
  {
    id: "mediterranean",
    hub: "lviv",
    root: {
      city: "rome",
      bow: 0.2,
      children: [
        { city: "milan" },
        { city: "palermo", bow: 0.12 },
        {
          city: "barcelona",
          bow: 0.14,
          children: [
            { city: "madrid", bow: 0.1 },
            { city: "malaga", bow: 0.12 },
            { city: "lisbon", bow: 0.12, children: [{ city: "porto", bow: 0.1 }] },
          ],
        },
      ],
    },
  },
  {
    id: "paris",
    hub: "lviv",
    root: {
      city: "paris",
      bow: 0.22,
      children: [{ city: "lyon" }, { city: "toulouse", bow: 0.14 }],
    },
  },
  // Odesa — the southern corridor
  {
    id: "anatolia",
    hub: "odesa",
    root: {
      city: "istanbul",
      bow: 0.12,
      children: [
        { city: "bursa", bow: 0.1 },
        { city: "antalya", bow: 0.12, children: [{ city: "alanya", bow: 0.1 }] },
      ],
    },
  },
  // axis-first: the arrival comes in diagonally from the NE, keeping the
  // Thessaloniki story heart (above the dot) clear of the line
  { id: "thessaloniki", hub: "odesa", root: { city: "thessaloniki", bend: "axis" } },
  { id: "tel-aviv", hub: "odesa", root: { city: "tel-aviv", bow: 0.12 } },
  // Dnipro — Caucasus chain and the Baltic
  {
    id: "caucasus",
    hub: "dnipro",
    root: { city: "tbilisi", bow: 0.14, children: [{ city: "baku", bow: 0.1 }] },
  },
  { id: "riga", hub: "dnipro", root: { city: "riga", bow: 0.18 } },
  // Kharkiv — Central Asia, off the right edge by design
  { id: "kazakhstan", hub: "kharkiv", root: { city: "almaty", bow: 0.16 } },
];

/* --- Data plumbing + invariants --------------------------------------------- */

const DEST_CITIES = COUNTRIES.flatMap((country) => country.cities);
const cityById = new Map<string, DestinationCity>(DEST_CITIES.map((c) => [c.id, c]));
const hubById = new Map(HUBS.map((h) => [h.id, h]));

// The corridor tree must carry EXACTLY the hub→city relations of ROUTE_GROUPS:
// same hubs, same cities under each hub, every city exactly once overall.
{
  const expected = new Map<string, Set<string>>();
  for (const g of ROUTE_GROUPS) {
    const set = expected.get(g.hub) ?? new Set<string>();
    for (const id of [g.entry, ...(g.branches ?? [])]) set.add(id);
    expected.set(g.hub, set);
  }
  const seenAll = new Set<string>();
  const seenByHub = new Map<string, Set<string>>();
  const walk = (hub: string, node: TreeNode) => {
    if (!cityById.has(node.city)) throw new Error(`v2: unknown city ${node.city}`);
    if (seenAll.has(node.city)) throw new Error(`v2: city routed twice: ${node.city}`);
    seenAll.add(node.city);
    const set = seenByHub.get(hub) ?? new Set<string>();
    set.add(node.city);
    seenByHub.set(hub, set);
    for (const child of node.children ?? []) walk(hub, child);
  };
  for (const corridor of CORRIDORS) {
    if (!hubById.has(corridor.hub)) throw new Error(`v2: unknown hub ${corridor.hub}`);
    walk(corridor.hub, corridor.root);
  }
  for (const [hub, cities] of expected) {
    const seen = seenByHub.get(hub) ?? new Set<string>();
    for (const id of cities) {
      if (!seen.has(id)) throw new Error(`v2: ${hub} is missing city ${id}`);
    }
    if (seen.size !== cities.size) throw new Error(`v2: ${hub} has extra cities`);
  }
  for (const link of CROSS_LINKS) {
    if (!hubById.has(link.hub) || !cityById.has(link.to))
      throw new Error(`v2: bad cross link ${link.hub}->${link.to}`);
  }
  for (const leg of INTERNAL_LEGS) {
    if (!hubById.has(leg.from) || !hubById.has(leg.to))
      throw new Error(`v2: internal leg endpoints must be hubs: ${leg.from}->${leg.to}`);
  }
  for (const link of AIR_LINKS) {
    if (!hubById.has(link.hub) || !cityById.has(link.to))
      throw new Error(`v2: bad air link ${link.hub}->${link.to}`);
  }
}

/* --- Edge/plane/dot views ---------------------------------------------------- */

const DEFAULT_BOW = 0.14;
const PORT_R = 7.5; // corridors leave from the hub ring, not its center
const MIN_PORT_SEP = 0.26; // ≥ ~15° between departures at one hub

/** Weight tapers with the number of routes downstream of a segment. */
const widthFor = (n: number) => r1(0.9 + 0.4 * n);

const subtreeCount = (node: TreeNode): number =>
  1 + (node.children ?? []).reduce((sum, child) => sum + subtreeCount(child), 0);

type EdgeView = {
  key: string;
  d: string;
  width: number;
  air: boolean;
  delay: number;
  dur: number;
  /** Stroke opacity override for the quiet layer (default 0.32). */
  opacity?: number;
};

const edgeAir = (node: TreeNode) => !!cityById.get(node.city)!.air;

/* Internal legs bend hand-tuned so approaches stay clear of hub labels:
   both Dnipro legs would otherwise depart along the same horizontal. */
const LEG_BENDS: Record<string, BendStyle> = {
  "odesa-kyiv": "diag", // nearly vertical — renders as a straight leg
  "dnipro-kyiv": "diag",
  "dnipro-lviv": "axis",
};

/* Ground point-to-point bends: Dnipro's western fan needs two straights —
   a diag would double the Kyiv leg, an axis would double the Lviv leg. */
const QUIET_BENDS: Record<string, BendStyle> = {
  "dnipro-warsaw": "straight",
  "dnipro-prague": "straight",
};

/* Hub ports: gather every departure (corridor trunks + cross links + internal
   legs), space them at least MIN_PORT_SEP apart around the ring, then start
   each line on the perimeter at its angle. */
type Departure = { angle: number };
const portAngles = new Map<string, number>(); // `${hub}:${key}` -> angle

{
  const byHub = new Map<string, Array<{ key: string; dep: Departure }>>();
  const add = (hub: string, key: string, angle: number) => {
    const list = byHub.get(hub) ?? [];
    list.push({ key, dep: { angle } });
    byHub.set(hub, list);
  };
  for (const corridor of CORRIDORS) {
    const hub = project(hubById.get(corridor.hub)!);
    const to = project(cityById.get(corridor.root.city)!);
    const air = edgeAir(corridor.root);
    add(
      corridor.hub,
      corridor.id,
      startAngle(hub, to, air, corridor.root.bow ?? DEFAULT_BOW, corridor.root.bend ?? "diag"),
    );
  }
  CROSS_LINKS.forEach((link) => {
    const hub = project(hubById.get(link.hub)!);
    const city = cityById.get(link.to)!;
    const to = project(city);
    add(
      link.hub,
      `cross-${link.to}`,
      city.air
        ? startAngle(hub, to, true, link.bow, "straight")
        : startAngle(hub, to, false, 0, QUIET_BENDS[`${link.hub}-${link.to}`] ?? "diag"),
    );
  });
  for (const leg of INTERNAL_LEGS) {
    const a = project(hubById.get(leg.from)!);
    const b = project(hubById.get(leg.to)!);
    const bend = LEG_BENDS[`${leg.from}-${leg.to}`] ?? "diag";
    add(leg.from, `leg-${leg.to}`, startAngle(a, b, false, 0, bend));
    // A diag-first path arrives axis-aligned (and vice versa) — the arrival
    // port needs the reversed path's departure direction
    add(leg.to, `leg-in-${leg.from}`, startAngle(b, a, false, 0, bend === "diag" ? "axis" : "diag"));
  }
  for (const link of AIR_LINKS) {
    const hub = project(hubById.get(link.hub)!);
    const to = project(cityById.get(link.to)!);
    add(link.hub, `air-${link.to}`, startAngle(hub, to, true, link.bow, "straight"));
  }
  for (const [hub, list] of byHub) {
    list.sort((a, b) => a.dep.angle - b.dep.angle);
    for (let i = 1; i < list.length; i++) {
      if (list[i].dep.angle - list[i - 1].dep.angle < MIN_PORT_SEP) {
        list[i].dep.angle = list[i - 1].dep.angle + MIN_PORT_SEP;
      }
    }
    for (const { key, dep } of list) portAngles.set(`${hub}:${key}`, dep.angle);
  }
}

function portPoint(hubId: string, key: string): Pt {
  const hub = project(hubById.get(hubId)!);
  const angle = portAngles.get(`${hubId}:${key}`)!;
  return { x: r1(hub.x + PORT_R * Math.cos(angle)), y: r1(hub.y + PORT_R * Math.sin(angle)) };
}

const edgeDur = (from: Pt, to: Pt) =>
  Math.min(0.9, Math.max(0.32, Math.hypot(to.x - from.x, to.y - from.y) / 260));

const CORRIDOR_EDGES: EdgeView[] = [];
const cityDotDelay = new Map<string, number>();
type PlaneView = { key: string; d: string; delay: number };
const PLANES: PlaneView[] = [];

// Shortest trunks first — the network grows outward from Ukraine
const corridorsOrdered = [...CORRIDORS]
  .map((corridor) => {
    const from = portPoint(corridor.hub, corridor.id);
    const to = project(cityById.get(corridor.root.city)!);
    return { corridor, from, len: Math.hypot(to.x - from.x, to.y - from.y) };
  })
  .sort((a, b) => a.len - b.len);

corridorsOrdered.forEach(({ corridor, from }, rank) => {
  const walk = (node: TreeNode, start: Pt, delay: number) => {
    const to = project(cityById.get(node.city)!);
    const air = edgeAir(node);
    const dur = edgeDur(start, to);
    CORRIDOR_EDGES.push({
      key: `edge-${node.city}`,
      d: air
        ? arcPath(start, to, node.bow ?? DEFAULT_BOW)
        : roadPath(start, to, node.bend ?? "diag"),
      width: widthFor(subtreeCount(node)),
      air,
      delay,
      dur,
    });
    cityDotDelay.set(node.city, delay + dur * 0.9);
    for (const child of node.children ?? []) walk(child, to, delay + dur);
  };
  walk(corridor.root, from, 0.3 + rank * 0.14);

  // One plane per air corridor, flying the trunk chain (greedy: at each
  // junction continue along the air child carrying the most routes).
  if (edgeAir(corridor.root)) {
    let d = `M ${from.x} ${from.y}`;
    let prev = from;
    let node: TreeNode | undefined = corridor.root;
    while (node) {
      const to = project(cityById.get(node.city)!);
      const c = arcCtrl(prev, to, node.bow ?? DEFAULT_BOW);
      d += ` Q ${c.x} ${c.y} ${to.x} ${to.y}`;
      prev = to;
      node = (node.children ?? [])
        .filter(edgeAir)
        .sort((a, b) => subtreeCount(b) - subtreeCount(a))[0];
    }
    PLANES.push({ key: `plane-${corridor.id}`, d, delay: 0 });
  }
});

/** When the one-shot entrance sequence has finished and ambient motion starts. */
const SEQUENCE_END = 4.4;

/* Internal Ukrainian hub-to-hub legs (owner-confirmed data) — the quietest
   layer of all: thin roads under everything, no destination dots. */
const INTERNAL_EDGES: EdgeView[] = INTERNAL_LEGS.map((leg, i) => {
  const from = portPoint(leg.from, `leg-${leg.to}`);
  const to = portPoint(leg.to, `leg-in-${leg.from}`);
  return {
    key: `leg-${leg.from}-${leg.to}`,
    d: roadPath(from, to, LEG_BENDS[`${leg.from}-${leg.to}`] ?? "diag"),
    width: 1,
    air: false,
    delay: 1.1 + i * 0.15,
    dur: 0.5,
  };
});

/* Rare point-to-point routes outside the tree (cross-sector + network links
   from the data) — thin, visually quieter than the corridors. Styled by
   transport type, consistent with the tree's language: air targets get an
   arc + plane, ground targets a road-like polyline. */
const QUIET_LINES: EdgeView[] = [
  ...CROSS_LINKS.map((link, i) => {
    const from = portPoint(link.hub, `cross-${link.to}`);
    const city = cityById.get(link.to)!;
    const to = project(city);
    const air = !!city.air;
    // Kharkiv's two point-to-point lines (Berlin, Istanbul) carry
    // thin-corridor weight — they are that hub's only western connections
    // and it read as bare otherwise (owner decision, task 2026-07-11).
    const emphasized = link.hub === "kharkiv";
    return {
      key: `cross-${link.hub}-${link.to}`,
      d: air
        ? arcPath(from, to, link.bow)
        : roadPath(from, to, QUIET_BENDS[`${link.hub}-${link.to}`] ?? "diag"),
      width: emphasized ? 1.3 : 1,
      air,
      delay: 3 + i * 0.12,
      dur: 0.7,
      opacity: emphasized ? 0.6 : undefined,
    };
  }),
  ...NETWORK_LINKS.map(([fromId, toId], i) => {
    const a = cityById.get(fromId);
    const b = cityById.get(toId);
    if (!a || !b) throw new Error(`v2: unknown network link city: ${fromId}->${toId}`);
    const air = !!(a.air || b.air);
    return {
      key: `net-${fromId}-${toId}`,
      d: air
        ? arcPath(project(a), project(b), DEFAULT_BOW)
        : roadPath(project(a), project(b), "diag"),
      width: 1,
      air,
      delay: 3 + (CROSS_LINKS.length + i) * 0.12,
      dur: 0.7,
    };
  }),
];

/* Owner-confirmed second-origin air legs (Kyiv → Thessaloniki): real routes,
   so they carry thin-corridor weight — brighter than the quiet layer. */
const AIR_EXTRA: EdgeView[] = AIR_LINKS.map((link, i) => {
  const from = portPoint(link.hub, `air-${link.to}`);
  const to = project(cityById.get(link.to)!);
  return {
    key: `air-${link.hub}-${link.to}`,
    d: arcPath(from, to, link.bow),
    width: 1.3,
    air: true,
    delay: 3 + (CROSS_LINKS.length + NETWORK_LINKS.length + i) * 0.12,
    dur: 0.7,
    opacity: 0.6,
  };
});

// Air point-to-point lines fly a plane too (same convention as corridors);
// they queue up after the corridor planes.
for (const line of [...QUIET_LINES.filter((l) => l.air), ...AIR_EXTRA]) {
  PLANES.push({ key: `plane-${line.key}`, d: line.d, delay: 0 });
}
PLANES.forEach((plane, i) => {
  plane.delay = SEQUENCE_END + i * 1.7;
});

/* --- Kazakhstan cue: where the Almaty trunk crosses the right crop edge ---- */

const KAZ_EXIT_Y = (() => {
  const from = portPoint("kharkiv", "kazakhstan");
  const to = project(cityById.get("almaty")!);
  const c = arcCtrl(from, to, 0.16);
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const mt = 1 - t;
    const x = mt * mt * from.x + 2 * mt * t * c.x + t * t * to.x;
    if (x >= W - 2) {
      return r1(mt * mt * from.y + 2 * mt * t * c.y + t * t * to.y);
    }
  }
  return r1(to.y);
})();

/* --- Labels ------------------------------------------------------------------
   Country-only labels (city labels only for the 5 hubs). Data offsets were
   tuned for the v1 frame; scale them to the v2 frame and override the few
   that need repositioning. Kazakhstan gets the crop cue instead. */

const LABEL_TWEAKS: Partial<
  Record<string, { dx?: number; dy?: number; anchor?: "start" | "middle" | "end" }>
> = {
  azerbaijan: { dx: -12, dy: 30, anchor: "end" },
  georgia: { dx: 0, dy: 26 },
  israel: { dx: -16, dy: -14, anchor: "end" },
  // Between Hamburg, Berlin and the Rhine cluster — the scaled v1 offset
  // drifts into France; Czechia moves above the Lviv–Frankfurt trunk
  germany: { dx: 28, dy: -30 },
  czechia: { dx: -26, dy: -46 },
};

const HUB_LABELS: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  kyiv: { dx: 13, dy: 5, anchor: "start" },
  kharkiv: { dx: 5, dy: -15, anchor: "start" },
  dnipro: { dx: 13, dy: 16, anchor: "start" },
  lviv: { dx: 12, dy: 6, anchor: "start" },
  odesa: { dx: -13, dy: -7, anchor: "end" },
};

/* --- Story markers -----------------------------------------------------------
   Up to three, one per published story city, only when that city exists in
   the routes data. story-1 (Sviatoslav) names Barcelona; story-3 (Lenya) →
   Thessaloniki, owner-confirmed (task, 2026-07-11); story-2 stays unmarked
   (no confirmed city). Rendered as HTML overlays on the svg: the hover card
   and its badge share one <a>, so hover moves seamlessly between them. */

const STORY_MARKERS: Array<{ slug: StorySlug; city: string }> = [
  { slug: "story-1", city: "barcelona" },
  { slug: "story-3", city: "thessaloniki" },
];

for (const marker of STORY_MARKERS) {
  if (!cityById.has(marker.city)) throw new Error(`v2: story marker city ${marker.city} not in data`);
}

const HEART_D =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/* --- Graticule ---------------------------------------------------------------- */

const MERIDIANS: number[] = [];
for (let lng = Math.ceil(LNG_MIN / 10) * 10; lng < LNG_MAX; lng += 10) MERIDIANS.push(lng);
const PARALLELS: number[] = [];
for (let lat = Math.ceil(LAT_MIN / 5) * 5; lat < LAT_MAX; lat += 5) PARALLELS.push(lat);

function vars(seconds: number, extra?: CSSProperties): CSSProperties {
  return { "--d": `${seconds.toFixed(2)}s`, ...extra } as CSSProperties;
}

const COUNTRY_LABEL_DELAY = new Map<string, number>(
  COUNTRIES.map((country) => [
    country.id,
    Math.max(...country.cities.map((c) => cityDotDelay.get(c.id) ?? 0)) + 0.15,
  ]),
);

/* --- Component ----------------------------------------------------------------- */

export function RoutesMapV2() {
  const t = useTranslations("HomePage.map");
  const tStories = useTranslations("StoriesPage");
  const locale = useLocale() as Locale;
  const localePrefix = locale === "uk" ? "" : `/${locale}`;

  const kazakhstan = COUNTRIES.find((c) => c.id === "kazakhstan")!;
  const countriesSorted = [...COUNTRIES].sort((a, b) =>
    a.name[locale].localeCompare(b.name[locale], locale),
  );

  return (
    <RevealOnView className="routes-map routes-map--v2">
      <div className="routes-map-v2-frame overflow-x-auto rounded-xl border">
        {/* ltr inner wrapper: anchors the HTML story overlays to the svg box
            (the frame itself is rtl only for the east-first scroll start) */}
        <div className="routes-map-v2-inner relative min-w-[44rem]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="routes-svg block h-auto w-full"
          role="img"
          aria-label={t("title")}
        >
          {/* Basemap — Natural Earth outlines, warm cream land on cream water,
              borders a step darker than v1 */}
          <g>
            {BASEMAP_EUROPE_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="var(--map2-land)"
                fillRule="evenodd"
                stroke="var(--color-pine)"
                strokeOpacity="0.38"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Graticule — quiet texture, no geography claims */}
          {MERIDIANS.map((lng) => {
            const x = project({ lat: LAT_MAX, lng }).x;
            return (
              <line
                key={`m${lng}`}
                x1={x}
                y1={0}
                x2={x}
                y2={H}
                stroke="var(--color-pine)"
                strokeOpacity="0.07"
                strokeWidth="1"
              />
            );
          })}
          {PARALLELS.map((lat) => {
            const y = project({ lat, lng: LNG_MIN }).y;
            return (
              <line
                key={`p${lat}`}
                x1={0}
                y1={y}
                x2={W}
                y2={y}
                stroke="var(--color-pine)"
                strokeOpacity="0.07"
                strokeWidth="1"
              />
            );
          })}

          {/* Internal Ukrainian legs — owner-confirmed, background layer:
              both ends are hubs, so no destination dots */}
          {INTERNAL_EDGES.map((edge) => (
            <path
              key={edge.key}
              d={edge.d}
              pathLength={1}
              className="map-line"
              style={vars(edge.delay, { "--dur": `${edge.dur.toFixed(2)}s` } as CSSProperties)}
              fill="none"
              stroke="var(--color-pine)"
              strokeOpacity="0.22"
              strokeWidth={edge.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Rare point-to-point routes — quieter than the corridor tree */}
          {[...QUIET_LINES, ...AIR_EXTRA].map((line) => (
            <path
              key={line.key}
              d={line.d}
              pathLength={1}
              className="map-line"
              style={vars(line.delay, { "--dur": `${line.dur.toFixed(2)}s` } as CSSProperties)}
              fill="none"
              stroke="var(--color-pine)"
              strokeOpacity={line.opacity ?? 0.32}
              strokeWidth={line.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Corridor tree — weight tapers outward; air = arcs, ground = roads */}
          {CORRIDOR_EDGES.map((edge) => (
            <path
              key={edge.key}
              d={edge.d}
              pathLength={1}
              className="map-line"
              style={vars(edge.delay, { "--dur": `${edge.dur.toFixed(2)}s` } as CSSProperties)}
              fill="none"
              stroke="var(--color-pine)"
              strokeOpacity="0.82"
              strokeWidth={edge.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Plane glyphs — one per air corridor, flying the trunk chain */}
          {PLANES.map((plane) => (
            <path
              key={plane.key}
              d="M 6 0 L 4.7 -0.9 L 1.3 -0.9 L -1.3 -4.3 L -3 -4.3 L -1.7 -0.9 L -3.8 -0.9 L -4.7 -2.1 L -5.5 -2.1 L -5.1 0 L -5.5 2.1 L -4.7 2.1 L -3.8 0.9 L -1.7 0.9 L -3 4.3 L -1.3 4.3 L 1.3 0.9 L 4.7 0.9 Z"
              className="map-plane"
              fill="var(--color-pine-deep)"
              style={vars(plane.delay, {
                offsetPath: `path("${plane.d}")`,
                offsetRotate: "auto",
              })}
            />
          ))}

          {/* Destination dots at branch ends (and junctions) — gold tokens */}
          {DEST_CITIES.map((city) => {
            const pt = project(city);
            if (pt.x > W - 4) return null; // Almaty is off the crop by design
            return (
              <circle
                key={city.id}
                cx={pt.x}
                cy={pt.y}
                r="3.1"
                className="map-dot"
                fill="var(--color-gold)"
                stroke="var(--color-paper)"
                strokeWidth="0.9"
                style={vars(cityDotDelay.get(city.id) ?? 0)}
              >
                <title>{city.name[locale]}</title>
              </circle>
            );
          })}

          {/* Country labels only — city labels are reserved for the hubs */}
          {COUNTRIES.map((country) => {
            if (country.id === "kazakhstan") return null; // crop cue instead
            const pts = country.cities.map(project);
            const tweak = LABEL_TWEAKS[country.id];
            const [dx0, dy0] = country.labelOffset ?? [0, 0];
            const dx = tweak?.dx ?? r1(dx0 * 1.35);
            const dy = tweak?.dy ?? r1(dy0 * 1.25);
            const x = Math.round(pts.reduce((s, p) => s + p.x, 0) / pts.length + dx);
            const y = Math.round(pts.reduce((s, p) => s + p.y, 0) / pts.length + dy);
            return (
              <text
                key={`label-${country.id}`}
                x={x}
                y={y}
                textAnchor={tweak?.anchor ?? country.labelAnchor ?? "middle"}
                className="map-label"
                fontSize="12.5"
                fill="var(--color-ink-soft)"
                style={vars(COUNTRY_LABEL_DELAY.get(country.id) ?? 0)}
              >
                {country.name[locale]}
              </text>
            );
          })}

          {/* Kazakhstan runs off the crop — quiet cue at the edge */}
          <text
            x={W - 10}
            y={KAZ_EXIT_Y - 8}
            textAnchor="end"
            className="map-label"
            fontSize="12.5"
            fill="var(--color-ink-soft)"
            style={vars((cityDotDelay.get("almaty") ?? 0) + 0.15)}
          >
            {`${kazakhstan.name[locale]} →`}
          </text>

          {/* Ukrainian hubs — dot + ring; corridors depart from the ring */}
          {HUBS.map((hub, i) => {
            const pt = project(hub);
            const label = HUB_LABELS[hub.id];
            return (
              <g key={hub.id}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={PORT_R}
                  className="map-hub-dot"
                  fill="none"
                  stroke="var(--color-pine)"
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                  style={vars(0.1 + i * 0.06)}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={PORT_R}
                  className="map-pulse"
                  fill="none"
                  stroke="var(--color-pine)"
                  strokeWidth="1.3"
                  style={vars(SEQUENCE_END + i * 0.7)}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.4"
                  className="map-hub-dot"
                  fill="var(--color-pine)"
                  stroke="var(--color-paper)"
                  strokeWidth="1"
                  style={vars(0.05 + i * 0.06)}
                >
                  <title>{hub.name[locale]}</title>
                </circle>
                <text
                  x={pt.x + label.dx}
                  y={pt.y + label.dy}
                  textAnchor={label.anchor}
                  className="map-label"
                  fontSize="13"
                  fontWeight="500"
                  fill="var(--color-ink)"
                  style={vars(0.3 + i * 0.06)}
                >
                  {hub.name[locale]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Story markers — HTML overlays anchored to city coordinates in %,
            so they track the map at any scale and scroll position. Hovering
            the badge opens the card; the card is inside the same link, so it
            never blocks clicking through to the story. Touch devices get no
            card (hover: hover) — a tap navigates directly. Card content is
            strictly the published story assets: photo, title, excerpt. */}
        {STORY_MARKERS.map((marker) => {
          const pt = project(cityById.get(marker.city)!);
          const title = tStories(`items.${marker.slug}.title`);
          const teaser = tStories(`items.${marker.slug}.excerpt`);
          return (
            <a
              key={marker.slug}
              href={`${localePrefix}/stories/${marker.slug}`}
              className="map-story-spot"
              style={vars((cityDotDelay.get(marker.city) ?? 0) + 0.3, {
                left: `${r1((pt.x / W) * 100)}%`,
                top: `${r1((pt.y / H) * 100)}%`,
              })}
              aria-label={`${title} — ${tStories("readMore")}`}
            >
              <svg
                className="map-story-badge"
                width="36"
                height="40"
                viewBox="-18 -26 36 40"
                aria-hidden="true"
              >
                <circle r="7" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
                <path d={HEART_D} fill="var(--color-gold)" transform="translate(-6 -19.6) scale(0.5)" />
              </svg>
              <span className="map-story-card overflow-hidden rounded-lg border border-sage bg-paper shadow-lg">
                <Image
                  src={STORY_PHOTOS[marker.slug][0]}
                  alt=""
                  width={230}
                  height={124}
                  className="h-[7.75rem] w-full object-cover"
                />
                <span className="block px-3 py-2.5">
                  <span className="block text-sm font-medium text-ink">{title}</span>
                  {/* no `block` here — line-clamp needs its -webkit-box display */}
                  <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
                    {teaser}
                  </span>
                  <span className="mt-1.5 block text-xs font-medium text-pine">
                    {tStories("readMore")} →
                  </span>
                </span>
              </span>
            </a>
          );
        })}
        </div>
      </div>

      {/* Legend — small and quiet: thickness scale, air vs ground, hub */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
            <line x1="1" y1="3" x2="45" y2="3" stroke="var(--color-pine)" strokeOpacity="0.82" strokeWidth="3.7" strokeLinecap="round" />
            <line x1="1" y1="8.5" x2="45" y2="8.5" stroke="var(--color-pine)" strokeOpacity="0.82" strokeWidth="2.1" strokeLinecap="round" />
            <line x1="1" y1="12.5" x2="45" y2="12.5" stroke="var(--color-pine)" strokeOpacity="0.82" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          {t("legendThickness")}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
            <path d="M 1 12 Q 23 -2 45 12" fill="none" stroke="var(--color-pine)" strokeOpacity="0.82" strokeWidth="1.6" strokeLinecap="round" />
            <path
              d="M 6 0 L 4.7 -0.9 L 1.3 -0.9 L -1.3 -4.3 L -3 -4.3 L -1.7 -0.9 L -3.8 -0.9 L -4.7 -2.1 L -5.5 -2.1 L -5.1 0 L -5.5 2.1 L -4.7 2.1 L -3.8 0.9 L -1.7 0.9 L -3 4.3 L -1.3 4.3 L 1.3 0.9 L 4.7 0.9 Z"
              fill="var(--color-pine-deep)"
              transform="translate(23 5.2) scale(0.8)"
            />
          </svg>
          {t("legendAir")}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="46" height="14" viewBox="0 0 46 14" aria-hidden="true">
            <path d="M 1 12 L 12 2 L 45 2" fill="none" stroke="var(--color-pine)" strokeOpacity="0.82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("legendGround")}
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="6.6" fill="none" stroke="var(--color-pine)" strokeOpacity="0.55" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="3.6" fill="var(--color-pine)" stroke="var(--color-paper)" strokeWidth="1" />
          </svg>
          {t("legendHub")}
        </span>
      </div>

      {/* Text alternative — every destination from the routes data, as text */}
      <details className="mt-3 text-sm text-ink-soft">
        <summary className="cursor-pointer font-medium text-pine transition-colors hover:text-pine-deep">
          {t("list")}
        </summary>
        <ul className="mt-3 gap-8 sm:columns-2 lg:columns-3">
          {countriesSorted.map((country) => (
            <li key={country.id} className="mb-2 break-inside-avoid">
              <span className="font-medium text-ink">{country.name[locale]}</span>
              {" — "}
              {country.cities.map((city) => city.name[locale]).join(", ")}
            </li>
          ))}
        </ul>
      </details>

      <figcaption className="mt-4 max-w-2xl text-sm text-ink-soft/80">
        {t("caption")}
      </figcaption>
    </RevealOnView>
  );
}
