"use client";

import { useSearchParams } from "next/navigation";
import { HeroMediaView, type HeroVariant } from "./HeroMediaView";

/** Reads ?hero=mark|photo|full (default mark), plus the full-variant dev
 *  params &crop=1..5 (default 2) and &scrim=0|1 (default 1). Wrap in
 *  <Suspense fallback={<HeroMediaView variant="mark" …/>}> so the page stays
 *  static and the default watermark shows before hydration. */
export function HeroMedia({ photoAvailable }: { photoAvailable: boolean }) {
  const params = useSearchParams();
  const hero = params.get("hero");
  const variant: HeroVariant =
    hero === "photo" || hero === "full" ? hero : "mark";
  const cropParam = Number(params.get("crop"));
  const crop = cropParam >= 1 && cropParam <= 5 ? Math.round(cropParam) : 2;
  const scrim = params.get("scrim") !== "0";
  const skyParam = Number(params.get("sky"));
  const sky = skyParam >= 1 && skyParam <= 3 ? Math.round(skyParam) : 2;
  return (
    <HeroMediaView
      variant={variant}
      photoAvailable={photoAvailable}
      crop={crop}
      scrim={scrim}
      sky={sky}
    />
  );
}
