/** Signature element: a short segment of the route line that draws itself
 *  as each section enters the view, ending in a waypoint node. */
export function RouteConnector() {
  return (
    <svg
      viewBox="0 0 24 72"
      width="24"
      height="72"
      aria-hidden="true"
      className="mx-auto block"
    >
      <path
        d="M12 0 V58"
        pathLength={1}
        className="draw-path"
        fill="none"
        stroke="var(--color-pine)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="64" r="5" fill="none" stroke="var(--color-pine)" strokeWidth="2" />
    </svg>
  );
}
