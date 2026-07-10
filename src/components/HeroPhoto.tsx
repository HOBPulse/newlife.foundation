"use client";

import { useSearchParams } from "next/navigation";
import { HeroPhotoView } from "./HeroPhotoView";

/** Locked full-bleed hero. Reads the temporary dev param &sky=1..3 (default 2)
 *  for vertical framing; everything else is fixed. Wrap in
 *  <Suspense fallback={<HeroPhotoView sky={2} …/>}> so the page stays static
 *  and the default framing renders before hydration. */
export function HeroPhoto({ photoAvailable }: { photoAvailable: boolean }) {
  const skyParam = Number(useSearchParams().get("sky"));
  const sky = skyParam >= 1 && skyParam <= 3 ? Math.round(skyParam) : 2;
  return <HeroPhotoView photoAvailable={photoAvailable} sky={sky} />;
}
