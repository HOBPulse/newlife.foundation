"use client";

import { useSearchParams } from "next/navigation";
import { HeroHeadlineView } from "./HeroHeadlineView";

/** Hero headline with the temporary dev font trial: ?font=serif renders it in
 *  PT Serif, &weight=400|700 (default 700) picks the weight. Without the param
 *  the locked Fixel Display headline renders untouched. Wrap in
 *  <Suspense fallback={<HeroHeadlineView />}> so the page stays static and the
 *  default headline renders before hydration. */
export function HeroHeadline() {
  const params = useSearchParams();
  const serif = params.get("font") === "serif";
  const weight = params.get("weight") === "400" ? 400 : 700;
  return <HeroHeadlineView serifWeight={serif ? weight : undefined} />;
}
