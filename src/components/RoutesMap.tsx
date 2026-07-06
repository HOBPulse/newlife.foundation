import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { RevealOnView } from "@/components/RevealOnView";
import {
  COUNTRIES,
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
const LAT_MIN = Math.min(...ALL_POINTS.map((p) => p.lat)) - 1.2;
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

function arcPath(from: Pt, to: Pt, kind: "air" | "ground" | "branch") {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const lift =
    kind === "air"
      ? Math.min(len * 0.22, 110) + 16
      : kind === "ground"
        ? len * 0.07 + 6
        : len * 0.1 + 3;
  const mx = Math.round(((from.x + to.x) / 2) * 10) / 10;
  const my = Math.round(((from.y + to.y) / 2 - lift) * 10) / 10;
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

/* --- Route tree from ROUTE_GROUPS ---------------------------------------- */

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
  for (const g of ROUTE_GROUPS) {
    if (!hubById.has(g.hub)) throw new Error(`Unknown hub in ROUTE_GROUPS: ${g.hub}`);
  }
}

const LINE_BASE_DELAY = 0.2;
const LINE_STEP = 0.09;
const LINE_DURATION = 0.9;
const BRANCH_DURATION = 0.45;
/** When the one-shot entrance sequence has finished and ambient motion starts. */
const SEQUENCE_END = 3.8;

type LineView = {
  key: string;
  d: string;
  air: boolean;
  delay: number;
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
  const air = !!main.entry.air;
  const delay = LINE_BASE_DELAY + rank * LINE_STEP;
  MAINS.push({
    key: `main-${main.entry.id}`,
    d: arcPath(main.from, main.to, air ? "air" : "ground"),
    air,
    delay,
  });
  cityDotDelay.set(main.entry.id, delay + LINE_DURATION * 0.85);

  (main.group.branches ?? []).forEach((branchId, j) => {
    const branchCity = cityById.get(branchId)!;
    const branchDelay = delay + LINE_DURATION + j * 0.15;
    BRANCHES.push({
      key: `branch-${branchId}`,
      d: arcPath(main.to, project(branchCity), "branch"),
      air: false,
      delay: branchDelay,
    });
    cityDotDelay.set(branchId, branchDelay + BRANCH_DURATION * 0.9);
  });
});

const NETWORK: LineView[] = NETWORK_LINKS.map(([fromId, toId], i) => {
  const a = cityById.get(fromId);
  const b = cityById.get(toId);
  if (!a || !b) throw new Error(`Unknown network link city: ${fromId}->${toId}`);
  const air = !!(a.air || b.air);
  return {
    key: `net-${fromId}-${toId}`,
    d: arcPath(project(a), project(b), air ? "air" : "ground"),
    air,
    delay: LINE_BASE_DELAY + (mainsUnordered.length + i) * LINE_STEP,
  };
});

const AIR_LINES = [...MAINS, ...NETWORK].filter((l) => l.air);
/** Ground main lines get the periodic light sweep (branches stay quiet). */
const SWEEP_LINES = [...MAINS, ...NETWORK].filter((l) => !l.air);

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
          className="block h-auto w-full min-w-[44rem]"
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
                strokeOpacity="0.12"
                strokeWidth="0.7"
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

          {/* Branch lines — thin in-country connections from the entry city */}
          {BRANCHES.map((line) => (
            <path
              key={line.key}
              d={line.d}
              pathLength={1}
              className="map-line"
              style={vars(line.delay, { "--dur": `${BRANCH_DURATION}s` } as CSSProperties)}
              fill="none"
              stroke="var(--color-pine)"
              strokeOpacity="0.55"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          ))}

          {/* Main route lines */}
          {[...MAINS, ...NETWORK].map((line) =>
            line.air ? (
              <path
                key={line.key}
                d={line.d}
                className="map-air"
                style={vars(line.delay)}
                fill="none"
                stroke="var(--color-pine)"
                strokeOpacity="0.5"
                strokeWidth="1.6"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
            ) : (
              <path
                key={line.key}
                d={line.d}
                pathLength={1}
                className="map-line"
                style={vars(line.delay)}
                fill="none"
                stroke="var(--color-pine)"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ),
          )}

          {/* Light sweep — a glint runs along each ground line, staggered */}
          {SWEEP_LINES.map((line, i) => (
            <path
              key={`sweep-${line.key}`}
              d={line.d}
              pathLength={1}
              className="map-sweep"
              style={vars(SEQUENCE_END + 0.4 + i * 0.7)}
              fill="none"
              stroke="var(--color-paper)"
              strokeOpacity="0.9"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          ))}

          {/* Plane glyphs looping along air arcs */}
          {AIR_LINES.map((line, i) => (
            <path
              key={`plane-${line.key}`}
              d="M 7 0 L -5 3 L -2 0 L -5 -3 Z"
              className="map-plane"
              fill="var(--color-pine-deep)"
              style={vars(SEQUENCE_END + i * 2.2, {
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

          {/* Country labels only — no city captions, no clutter */}
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

          {/* Ukrainian hubs — larger dots, radar pulse, labelled */}
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
