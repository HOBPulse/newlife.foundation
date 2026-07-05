import { useTranslations } from "next-intl";

// Route data [TO BE PROVIDED] by owner as country/city pairs — never invented.
// Coordinates are abstract SVG positions assigned when real data arrives;
// displayed routes must stay aggregated/anonymized per brief.
export type TransportRoute = {
  from: [number, number];
  to: [number, number];
};

function routeArc([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  // Gentle arc lifted above the straight line between endpoints
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.18 - 24;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

const GRID_COLS = 16;
const GRID_ROWS = 8;
const W = 800;
const H = 420;

export function RoutesMap({ routes = [] }: { routes?: TransportRoute[] }) {
  const t = useTranslations("HomePage.map");

  return (
    <figure className="relative overflow-hidden rounded-xl border border-sage bg-sage-soft">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={t("title")}
      >
        {/* Abstract graticule — deliberately not geography until real data arrives */}
        {Array.from({ length: GRID_COLS - 1 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={((i + 1) * W) / GRID_COLS}
            y1={0}
            x2={((i + 1) * W) / GRID_COLS}
            y2={H}
            stroke="var(--color-sage)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: GRID_ROWS - 1 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={((i + 1) * H) / GRID_ROWS}
            x2={W}
            y2={((i + 1) * H) / GRID_ROWS}
            stroke="var(--color-sage)"
            strokeWidth="1"
          />
        ))}

        {routes.map((route, i) => (
          <g key={i}>
            <path
              d={routeArc(route.from, route.to)}
              pathLength={1}
              className="draw-path"
              fill="none"
              stroke="var(--color-pine)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx={route.from[0]} cy={route.from[1]} r="4" fill="var(--color-pine)" />
            <circle cx={route.to[0]} cy={route.to[1]} r="4" fill="var(--color-apricot)" />
          </g>
        ))}
      </svg>

      {routes.length === 0 && (
        <figcaption className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-sage bg-paper px-4 py-2 text-sm text-ink-soft">
            {t("pending")}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
