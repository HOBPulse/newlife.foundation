"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

/** Temporary About-page layout preview switch: ?about=zigzag and
 *  ?about=strip select preview variants; anything else keeps the shipped
 *  layout W. All three are rendered on the server and passed in — wrap in
 *  <Suspense fallback={w}> so the page prerenders W before hydration. */
export function AboutLayoutSwitch({
  w,
  zigzag,
  strip,
}: {
  w: ReactNode;
  zigzag: ReactNode;
  strip: ReactNode;
}) {
  const variant = useSearchParams().get("about");
  if (variant === "zigzag") return <>{zigzag}</>;
  if (variant === "strip") return <>{strip}</>;
  return <>{w}</>;
}
