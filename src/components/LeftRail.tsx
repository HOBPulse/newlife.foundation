"use client";

import { useSearchParams } from "next/navigation";
import { LeftRailView, type RailVariant } from "./LeftRailView";

/** Reads ?rail=curve|dots|off (default curve) and renders the matching rail.
 *  Wrap in <Suspense fallback={<LeftRailView variant="curve" />}> so the page
 *  stays static and the default rail shows before hydration. */
export function LeftRail() {
  const param = useSearchParams().get("rail");
  const variant: RailVariant =
    param === "dots" || param === "off" ? param : "curve";
  return <LeftRailView variant={variant} />;
}
