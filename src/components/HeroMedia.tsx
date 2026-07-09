"use client";

import { useSearchParams } from "next/navigation";
import { HeroMediaView } from "./HeroMediaView";

/** Reads ?hero=photo|mark (default mark) and renders the matching hero media.
 *  Wrap in <Suspense fallback={<HeroMediaView variant="mark" …/>}> so the page
 *  stays static and the default watermark shows before hydration. */
export function HeroMedia({ photoAvailable }: { photoAvailable: boolean }) {
  const variant = useSearchParams().get("hero") === "photo" ? "photo" : "mark";
  return <HeroMediaView variant={variant} photoAvailable={photoAvailable} />;
}
