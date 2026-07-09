import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { RevealOnView } from "@/components/RevealOnView";
import {
  COUNTRIES,
  CROSS_LINKS,
  HUBS,
  NETWORK_LINKS,
  ROUTE_GROUPS,
  type DestinationCity,
} from "@/data/routes";
import { BASEMAP_PATHS, BASEMAP_VIEWBOX } from "@/data/basemap";

/* --- Projection ----------------------------------------------------------
   Equirectangular (standard parallel 48°N) with a slight vertical stretch:
   this is a schematic map, and the extra height opens up the dense European
   cluster (per owner: visual balance beats geographic literalism). */

const DEG = Math.PI / 180;
const K = Math.cos(48 * DEG);
const V = 1.2; // vertical exaggeration

const DEST_CITIES = COUNTRIES.flatMap((country) => country.cities);
const ALL_POINTS: Array<{ lat: number; lng: number }> = [...HUBS, ...DEST_CITIES];

const LNG_MIN = Math.min(...ALL_POINTS.map((p) => p.lng)) - 1.5;
const LNG_MAX = Math.max(...ALL_POINTS.map((p) => p.lng)) + 1.5;
const LAT_MIN = Math.min(...ALL_POINTS.map((p) => p.lat)) - 1.8;
const LAT_MAX = Math.max(...ALL_POINTS.map((p) => p.lat)) + 1.5;

const W = 1000;
const S = W / ((LNG_MAX - LNG_MIN) * K);
const H = Math.round((LAT_MAX - LAT_MIN) * S * V);

// The basemap is pre-projected by scripts/generate-basemap.mjs with these
// exact parameters — fail the build rather than render a misaligned backdrop.
if (BASEMAP_VIEWBOX.w !== W || BASEMAP_VIEWBOX.h !== H) {
  throw new Error(
    `Basemap viewBox ${BASEMAP_VIEWBOX.w}x${BASEMAP_VIEWBOX.h} != map ${W}x${H} — run node scripts/generate-basemap.mjs`,
  );
}

type Pt = { x: number; y: number };

function project(p: { lat: number; lng: number }): Pt {
  return {
    x: Math.round((p.lng - LNG_MIN) * K * S * 10) / 10,
    y: Math.round((LAT_MAX - p.lat) * S * V * 10) / 10,
  };
}

/* Unified line language: every route is a smooth quadratic arc. `bow` is the
   signed curvature as a fraction of chord length — positive bows north
   (great-circle feel), negative south; per-route values fan hub departures. */
function arcPath(from: Pt, to: Pt, bow: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let px = dy / len;
  let py = -dx / len;
  if (py > 0) {
    px = -px;
    py = -py;
  }
  const mx = Math.round(((from.x + to.x) / 2 + px * bow * len) * 10) / 10;
  const my = Math.round(((from.y + to.y) / 2 + py * bow * len) * 10) / 10;
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

/* --- Route views from ROUTE_GROUPS / CROSS_LINKS / NETWORK_LINKS ---------- */

const cityById = new Map<string, DestinationCity>(DEST_CITIES.map((c) => [c.id, c]));
const hubById = new Map(HUBS.map((h) => [h.id, h]));

// Every destination city must be routed exactly once (entry or branch)
{
  const routed = ROUTE_GROUPS.flatMap((g) => [g.entry, ...(g.branches ?? [])]);
  const routedSet = new Set(routed);
  if (routed.length !== routedSet.size) throw new Error("Duplicate city in ROUTE_GROUPS");
  for (const city of DEST_CITIES) {
    if (!routedSet.has(city.id)) throw new Error(`Unrouted city: ${city.id}`);
  }
  for (const id of routed) {
    if (!cityById.has(id)) throw new Error(`Unknown city in ROUTE_GROUPS: ${id}`);
  }
  for (const g of [...ROUTE_GROUPS, ...CROSS_LINKS.map((c) => ({ hub: c.hub }))]) {
    if (!hubById.has(g.hub)) throw new Error(`Unknown hub: ${g.hub}`);
  }
  for (const link of CROSS_LINKS) {
    if (!cityById.has(link.to)) throw new Error(`Unknown city in CROSS_LINKS: ${link.to}`);
  }
}

const LINE_BASE_DELAY = 0.2;
const LINE_STEP = 0.08;
const LINE_DURATION = 0.9;
const BRANCH_DURATION = 0.45;
const DEFAULT_BOW = 0.14;
const BRANCH_BOW = 0.1;
/** When the one-shot entrance sequence has finished and ambient motion starts. */
const SEQUENCE_END = 3.8;

type LineView = {
  key: string;
  d: string;
  air: boolean;
  delay: number;
  thick: boolean;
};

// Shortest main lines first, so the network grows outward from Ukraine
const mainsUnordered = ROUTE_GROUPS.map((group) => {
  const hub = hubById.get(group.hub)!;
  const entry = cityById.get(group.entry)!;
  const from = project(hub);
  const to = project(entry);
  return { group, entry, from, to, len: Math.hypot(to.x - from.x, to.y - from.y) };
}).sort((a, b) => a.len - b.len);

const MAINS: LineView[] = [];
const BRANCHES: LineView[] = [];
const cityDotDelay = new Map<string, number>();

mainsUnordered.forEach((main, rank) => {
  const delay = LINE_BASE_DELAY + rank * LINE_STEP;
  MAINS.push({
    key: `main-${main.entry.id}`,
    d: arcPath(main.from, main.to, main.group.bow ?? DEFAULT_BOW),
    air: !!main.entry.air,
    delay,
    thick: !!main.group.thick,
  });
  cityDotDelay.set(main.entry.id, delay + LINE_DURATION * 0.85);

  (main.group.branches ?? []).forEach((branchId, j) => {
    const branchCity = cityById.get(branchId)!;
    const branchDelay = delay + LINE_DURATION + j * 0.15;
    BRANCHES.push({
      key: `branch-${branchId}`,
      d: arcPath(main.to, project(branchCity), BRANCH_BOW),
      air: false,
      delay: branchDelay,
      thick: false,
    });
    cityDotDelay.set(branchId, branchDelay + BRANCH_DURATION * 0.9);
  });
});

const CROSSES: LineView[] = CROSS_LINKS.map((link, i) => {
  const city = cityById.get(link.to)!;
  return {
    key: `cross-${link.hub}-${link.to}`,
    d: arcPath(project(hubById.get(link.hub)!), project(city), link.bow),
    air: !!city.air,
    delay: LINE_BASE_DELAY + (mainsUnordered.length + i) * LINE_STEP,
    thick: false,
  };
});

const NETWORK: LineView[] = NETWORK_LINKS.map(([fromId, toId], i) => {
  const a = cityById.get(fromId);
  const b = cityById.get(toId);
  if (!a || !b) throw new Error(`Unknown network link city: ${fromId}->${toId}`);
  return {
    key: `net-${fromId}-${toId}`,
    d: arcPath(project(a), project(b), DEFAULT_BOW),
    air: !!(a.air || b.air),
    delay: LINE_BASE_DELAY + (mainsUnordered.length + CROSS_LINKS.length + i) * LINE_STEP,
    thick: false,
  };
});

const ALL_LINES = [...BRANCHES, ...MAINS, ...CROSSES, ...NETWORK];
/** Planes fly every route that reaches an air-marked city. */
const AIR_LINES = [...MAINS, ...CROSSES, ...NETWORK].filter((l) => l.air);

/* --- Graticule ------------------------------------------------------------ */

const MERIDIANS: number[] = [];
for (let lng = Math.ceil(LNG_MIN / 10) * 10; lng < LNG_MAX; lng += 10) MERIDIANS.push(lng);
const PARALLELS: number[] = [];
for (let lat = Math.ceil(LAT_MIN / 5) * 5; lat < LAT_MAX; lat += 5) PARALLELS.push(lat);

function vars(seconds: number, extra?: CSSProperties): CSSProperties {
  return { "--d": `${seconds.toFixed(2)}s`, ...extra } as CSSProperties;
}

/* --- Component ------------------------------------------------------------ */

export function RoutesMap() {
  const t = useTranslations("HomePage.map");
  const locale = useLocale() as Locale;

  return (
    <RevealOnView className="routes-map">
      <div className="overflow-x-auto rounded-xl border border-sage bg-sage-soft">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="routes-svg block h-auto w-full min-w-[44rem]"
          role="img"
          aria-label={t("title")}
        >
          {/* Basemap — simplified Natural Earth country outlines, static */}
          <g>
            {BASEMAP_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="var(--color-sage)"
                fillOpacity="0.55"
                fillRule="evenodd"
                stroke="var(--color-pine)"
                strokeOpacity="0.3"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Graticule — quiet texture, no geography claims */}
          {MERIDIANS.map((lng) => {
            const x = project({ lat: LAT_MAX, lng }).x;
            return (
              <line key={`m${lng}`} x1={x} y1={0} x2={x} y2={H} stroke="var(--color-sage)" strokeWidth="1" />
            );
          })}
          {PARALLELS.map((lat) => {
            const y = project({ lat, lng: LNG_MIN }).y;
            return (
              <line key={`p${lat}`} x1={0} y1={y} x2={W} y2={y} stroke="var(--color-sage)" strokeWidth="1" />
            );
          })}

          {/* Route lines — one visual language; static once drawn in */}
          {ALL_LINES.map((line) => (
            <path
              key={line.key}
              d={line.d}
              pathLength={1}
              className="map-line"
              style={vars(
                line.delay,
                line.key.startsWith("branch-")
                  ? ({ "--dur": `${BRANCH_DURATION}s` } as CSSProperties)
                  : undefined,
              )}
              fill="none"
              stroke="var(--color-pine)"
              strokeOpacity={line.key.startsWith("branch-") ? 0.55 : 0.85}
              strokeWidth={line.key.startsWith("branch-") ? 1.1 : line.thick ? 2.6 : 1.8}
              strokeLinecap="round"
            />
          ))}

          {/* Plane glyphs — the only traveling elements. Top-down airliner
              silhouette pointing +x; offset-rotate keeps it on heading. */}
          {AIR_LINES.map((line, i) => (
            <path
              key={`plane-${line.key}`}
              d="M 6 0 L 4.7 -0.9 L 1.3 -0.9 L -1.3 -4.3 L -3 -4.3 L -1.7 -0.9 L -3.8 -0.9 L -4.7 -2.1 L -5.5 -2.1 L -5.1 0 L -5.5 2.1 L -4.7 2.1 L -3.8 0.9 L -1.7 0.9 L -3 4.3 L -1.3 4.3 L 1.3 0.9 L 4.7 0.9 Z"
              className="map-plane"
              fill="var(--color-pine-deep)"
              style={vars(SEQUENCE_END + i * 1.4, {
                offsetPath: `path("${line.d}")`,
                offsetRotate: "auto",
              })}
            />
          ))}

          {/* Destination cities — small dots, city name on hover/tap */}
          {COUNTRIES.map((country) =>
            country.cities.map((city) => {
              const pt = project(city);
              return (
                <circle
                  key={city.id}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.2"
                  className="map-dot"
                  fill="var(--color-apricot)"
                  stroke="var(--color-paper)"
                  strokeWidth="0.8"
                  style={vars(cityDotDelay.get(city.id) ?? 0)}
                >
                  <title>{city.name[locale]}</title>
                </circle>
              );
            }),
          )}

          {/* Country labels only — always painted above the lines */}
          {COUNTRIES.map((country) => {
            const pts = country.cities.map(project);
            const [dx, dy] = country.labelOffset ?? [0, 0];
            const x = Math.round(pts.reduce((s, p) => s + p.x, 0) / pts.length + dx);
            const y = Math.round(pts.reduce((s, p) => s + p.y, 0) / pts.length + dy);
            const delay =
              Math.max(...country.cities.map((c) => cityDotDelay.get(c.id) ?? 0)) + 0.15;
            return (
              <text
                key={`label-${country.id}`}
                x={x}
                y={y}
                textAnchor={country.labelAnchor ?? "middle"}
                className="map-label"
                fontSize="12.5"
                fill="var(--color-ink-soft)"
                style={vars(delay)}
              >
                {country.name[locale]}
              </text>
            );
          })}

          {/* Ukrainian hubs — larger dots, radar pulse, labelled; never dimmed */}
          {HUBS.map((hub, i) => {
            const pt = project(hub);
            return (
              <g key={hub.id}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  className="map-pulse"
                  fill="none"
                  stroke="var(--color-pine)"
                  strokeWidth="1.5"
                  style={vars(SEQUENCE_END + i * 0.55)}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.8"
                  className="map-hub-dot"
                  fill="var(--color-pine)"
                  stroke="var(--color-paper)"
                  strokeWidth="1"
                  style={vars(0.05 + i * 0.06)}
                >
                  <title>{hub.name[locale]}</title>
                </circle>
                <text
                  x={pt.x + hub.label.dx}
                  y={pt.y + hub.label.dy}
                  textAnchor={hub.label.anchor}
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
      </div>
      <figcaption className="mt-4 max-w-2xl text-sm text-ink-soft/80">
        {t("caption")}
      </figcaption>
    </RevealOnView>
  );
}
