"use client";

import { useSearchParams } from "next/navigation";
import {
  DonateBandView,
  type DonateBandData,
  type DonateVariant,
} from "./DonateBandView";

/** Dev-only comparison: ?cta=amber shows the amber background; anything else
 *  (default) shows green. Wrap in <Suspense fallback={<DonateBandView
 *  variant="green" …/>}> so the page stays static. Throwaway. */
export function DonateBand(data: DonateBandData) {
  const variant: DonateVariant =
    useSearchParams().get("cta") === "amber" ? "amber" : "green";
  return <DonateBandView variant={variant} {...data} />;
}
