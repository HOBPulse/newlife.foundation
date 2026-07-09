export type RailVariant = "curve" | "dots" | "off";

/** Station positions as a percentage down the rail, sitting near the
 *  homepage section boundaries (hero · process · stories · ribbon · map).
 *  The curve crosses the rail centre at these points. */
const STATIONS = [4, 24, 45, 63, 82] as const;

/* Gentle vertical S-curve in a 40×1000 box, stretched to the full section
 *  height (preserveAspectRatio="none"); it crosses the centre (x=20) at each
 *  station. pathLength="1" lets the draw-on-scroll dash work at any height. */
const RAIL_PATH =
  "M20 0 C30 60 34 160 20 240 C6 320 6 380 20 450 C34 510 34 570 20 630 C6 690 6 760 20 820 C30 880 26 950 20 1000";

/** Presentational left rail. No hooks, so it renders on the server (used as
 *  the Suspense fallback) and inside the client param wrapper alike. */
export function LeftRailView({ variant }: { variant: RailVariant }) {
  if (variant === "off") return null;

  return (
    <div aria-hidden="true" className="left-rail">
      {variant === "curve" && (
        <svg
          className="left-rail-line"
          viewBox="0 0 40 1000"
          preserveAspectRatio="none"
        >
          <path
            className="rail-path"
            d={RAIL_PATH}
            pathLength={1}
            fill="none"
            stroke="var(--color-pine)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </svg>
      )}
      {STATIONS.map((top, i) => (
        <span
          key={top}
          style={{ top: `${top}%` }}
          className={i === 0 ? "rail-station rail-station--lead" : "rail-station"}
        />
      ))}
    </div>
  );
}
