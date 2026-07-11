"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

/** Temporary comparison switch while map v2 awaits approval: ?map=v2 shows
 *  the corridor-tree rework, anything else the shipped v1. Both are rendered
 *  on the server and passed in — wrap in <Suspense fallback={v1}> so the
 *  page stays static and v1 renders before hydration.
 *  ?map=v2&quiet=40 previews a denser quiet layer (owner comparison). */
export function RoutesMapSwitch({ v1, v2 }: { v1: ReactNode; v2: ReactNode }) {
  const params = useSearchParams();
  if (params.get("map") !== "v2") return <>{v1}</>;
  return <div className={params.get("quiet") === "40" ? "map-quiet-40" : undefined}>{v2}</div>;
}
