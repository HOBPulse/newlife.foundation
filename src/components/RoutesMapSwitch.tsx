"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

/** Temporary comparison switch while map v2 awaits approval: ?map=v2 shows
 *  the corridor-tree rework, anything else the shipped v1. Both are rendered
 *  on the server and passed in — wrap in <Suspense fallback={v1}> so the
 *  page stays static and v1 renders before hydration. */
export function RoutesMapSwitch({ v1, v2 }: { v1: ReactNode; v2: ReactNode }) {
  const isV2 = useSearchParams().get("map") === "v2";
  return <>{isV2 ? v2 : v1}</>;
}
