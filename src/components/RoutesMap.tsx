import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { RevealOnView } from "@/components/RevealOnView";
import {
  COUNTRIES,
  HUBS,
  NETWORK_LINKS,
  type DestinationCity,
  type Hub,
} from "@/data/routes";

/* --- Projection (equirectangular, standard parallel 48°N) --------------- */

const DEG = Math.PI / 180;
const K = Math.cos(48 * DEG);

const DEST_CITIES = COUNTRIES.flatMap((country) => country.cities);
const ALL_POINTS: Array<{ lat: number; lng: number }> = [...HUBS, ...DEST_CITIES];

const LNG_MIN = Math.min(...ALL_POINTS.map((p) => p.lng)) - 2.5;
const LNG_MAX = Math.max(...ALL_POINTS.map((p) => p.lng)) + 2.5;
const LAT_MIN = Math.min(...ALL_POINTS.map((p) => p.lat)) - 1.7;
const LAT_MAX = Math.max(...ALL_POINTS.map((p) => p.lat)) + 2.5;

const W = 1000;
const S = W / ((LNG_MAX - LNG_MIN) * K);
const H = Math.round((LAT_MAX - LAT_MIN) * S);

type Pt = { x: number; y: number };

function project(p: { lat: number; lng: number }): Pt {
  return {
    x: Math.round((p.lng - LNG_MIN) * K * S * 10) / 10,
    y: Math.round((LAT_MAX - p.lat) * S * 10) / 10,
  };
}

/* --- Routes: each destination connects to its NEAREST Ukrainian hub ----- */

function degDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const kMid = Math.cos(((a.lat + b.lat) / 2) * DEG);
  return Math.hypot((a.lng - b.lng) * kMid, a.lat - b.lat);
}

function nearestHub(city: DestinationCity): Hub {
  return HUBS.reduce((best, hub) =>
    degDistance(hub, city) < degDistance(best, city) ? hub : best,
  );
}

function arcPath(from: Pt, to: Pt, air: boolean) {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  // Air arcs lift high above the chord; ground routes stay close to it
  const lift = air ? Math.min(len * 0.22, 110) + 16 : len * 0.07 + 6;
  const mx = Math.round(((from.x + to.x) / 2) * 10) / 10;
  const my = Math.round(((from.y + to.y) / 2 - lift) * 10) / 10;
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
}

type RouteView = {
  key: string;
  d: string;
  air: boolean;
  lineDelay: number;
};

const LINE_BASE_DELAY = 0.2;
const LINE_STEP = 0.045;
const LINE_DURATION = 0.9;
/** When the one-shot entrance sequence has finished and ambient motion starts. */
const SEQUENCE_END = 3.8;

// Shortest routes first, so the network grows outward from Ukraine
const hubRoutes = DEST_CITIES.map((city) => {
  const hub = nearestHub(city);
  const from = project(hub);
  const to = project(city);
  return { city, from, to, len: Math.hypot(to.x - from.x, to.y - from.y) };
}).sort((a, b) => a.len - b.len);

const cityDotDelay = new Map<string, number>(
  hubRoutes.map((r, i) => [r.city.id, LINE_BASE_DELAY + i * LINE_STEP + LINE_DURATION * 0.85]),
);

const cityById = new Map(DEST_CITIES.map((city) => [city.id, city]));

const ROUTES: RouteView[] = [
  ...hubRoutes.map((r, i) => ({
    key: `hub-${r.city.id}`,
    d: arcPath(r.from, r.to, !!r.city.air),
    air: !!r.city.air,
    lineDelay: LINE_BASE_DELAY + i * LINE_STEP,
  })),
  ...NETWORK_LINKS.map(([fromId, toId], i) => {
    const a = cityById.get(fromId);
    const b = cityById.get(toId);
    if (!a || !b) throw new Error(`Unknown network link city: ${fromId}->${toId}`);
    return {
      key: `net-${fromId}-${toId}`,
      d: arcPath(project(a), project(b), !!(a.air || b.air)),
      air: !!(a.air || b.air),
      lineDelay: LINE_BASE_DELAY + (hubRoutes.length + i) * LINE_STEP,
    };
  }),
];

const AIR_ROUTES = ROUTES.filter((r) => r.air);
// A subtle traveling dot on every 5th ground route — kept sparse on purpose
const FLOW_ROUTES = ROUTES.filter((r) => !r.air).filter((_, i) => i % 5 === 0);

/* --- Graticule ----------------------------------------------------------- */

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

          {/* Route lines */}
          {ROUTES.map((route) =>
            route.air ? (
              <path
                key={route.key}
                d={route.d}
                className="map-air"
                style={vars(route.lineDelay)}
                fill="none"
                stroke="var(--color-pine)"
                strokeOpacity="0.5"
                strokeWidth="1.6"
                strokeDasharray="5 4"
                strokeLinecap="round"
              />
            ) : (
              <path
                key={route.key}
                d={route.d}
                pathLength={1}
                className="map-line"
                style={vars(route.lineDelay)}
                fill="none"
                stroke="var(--color-pine)"
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ),
          )}

          {/* Occasional pulse dots traveling along ground routes (both ways) */}
          {FLOW_ROUTES.map((route, i) => (
            <circle
              key={`flow-${route.key}`}
              r="2.6"
              className="map-flow"
              fill="var(--color-apricot)"
              style={vars(SEQUENCE_END + 0.7 + i * 2.3, { offsetPath: `path("${route.d}")` })}
            />
          ))}

          {/* Plane glyphs looping along air arcs */}
          {AIR_ROUTES.map((route, i) => (
            <path
              key={`plane-${route.key}`}
              d="M 7 0 L -5 3 L -2 0 L -5 -3 Z"
              className="map-plane"
              fill="var(--color-pine-deep)"
              style={vars(SEQUENCE_END + i * 1.9, {
                offsetPath: `path("${route.d}")`,
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
