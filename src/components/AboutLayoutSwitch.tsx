"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

/** Temporary About-page layout preview switch: ?about= selects a preview
 *  variant (zigzag, zigzag-tight, strip, edge); anything else keeps the
 *  shipped layout W. All are rendered on the server and passed in — wrap in
 *  <Suspense fallback={w}> so the page prerenders W before hydration. */
export function AboutLayoutSwitch({
  w,
  zigzag,
  zigzagTight,
  strip,
  edge,
}: {
  w: ReactNode;
  zigzag: ReactNode;
  zigzagTight: ReactNode;
  strip: ReactNode;
  edge: ReactNode;
}) {
  const variant = useSearchParams().get("about");
  if (variant === "zigzag") return <>{zigzag}</>;
  if (variant === "zigzag-tight") return <>{zigzagTight}</>;
  if (variant === "strip") return <>{strip}</>;
  if (variant === "edge") return <>{edge}</>;
  return <>{w}</>;
}
