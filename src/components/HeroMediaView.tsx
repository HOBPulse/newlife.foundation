import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LogoMark } from "./LogoMark";

export type HeroVariant = "mark" | "photo" | "full";

const PHOTO_SRC = "/photos/hero-transport.jpg";

/* Crop presets for the full-bleed variant: a zoom + horizontal focus so the
   ambulance and the "AMBULÀNCIA" wordmark land in the right half at 1280.
   1 = tight (van large) … 5 = full-frame (least zoom). */
const CROP: Record<number, { scale: number; originX: number }> = {
  1: { scale: 1.72, originX: 16 },
  2: { scale: 1.55, originX: 20 },
  3: { scale: 1.34, originX: 28 },
  4: { scale: 1.16, originX: 40 },
  5: { scale: 1.0, originX: 50 },
};

type Props = {
  variant: HeroVariant;
  photoAvailable: boolean;
  crop?: number;
  scrim?: boolean;
};

/** Presentational hero media: watermark (mark), a photo card (photo), or a
 *  full-bleed photo (full). No hooks beyond useTranslations, so it also works
 *  as the server Suspense fallback. */
export function HeroMediaView({
  variant,
  photoAvailable,
  crop = 2,
  scrim = true,
}: Props) {
  if (variant === "mark") {
    return (
      <div aria-hidden="true" className="hero-watermark">
        <LogoMark className="h-full w-auto" />
      </div>
    );
  }
  if (variant === "full") {
    return <HeroFull photoAvailable={photoAvailable} crop={crop} scrim={scrim} />;
  }
  return <HeroPhoto photoAvailable={photoAvailable} />;
}

const PlaceholderIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
    <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M9 34l10-9 7 6 6-5 7 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

function HeroPhoto({ photoAvailable }: { photoAvailable: boolean }) {
  const t = useTranslations("HomePage.hero");
  return (
    <figure className="hero-photo">
      <div className="hero-photo-frame">
        {photoAvailable ? (
          // LCP zone — eager (priority), no lazy-load
          <Image
            src={PHOTO_SRC}
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 24rem"
            className="object-cover"
          />
        ) : (
          <div className="hero-photo-placeholder" aria-hidden="true">
            <PlaceholderIcon />
          </div>
        )}
      </div>
    </figure>
  );
}

function HeroFull({
  photoAvailable,
  crop,
  scrim,
}: {
  photoAvailable: boolean;
  crop: number;
  scrim: boolean;
}) {
  const t = useTranslations("HomePage.hero");
  const c = CROP[crop] ?? CROP[2];
  // Crop is applied via CSS vars only at ≥768 (see globals.css) so mobile
  // shows the natural cover framing, not the desktop right-half zoom.
  const frameStyle = {
    "--hero-scale": String(c.scale),
    "--hero-origin-x": `${c.originX}%`,
  } as CSSProperties;
  return (
    <>
      <div className="hero-full" style={frameStyle}>
        {photoAvailable ? (
          // Full-bleed LCP image — eager, covers the hero
          <Image
            src={PHOTO_SRC}
            alt={t("photoAlt")}
            fill
            priority
            sizes="100vw"
            className="hero-full-img object-cover"
          />
        ) : (
          <div className="hero-photo-placeholder hero-full-placeholder" aria-hidden="true">
            <PlaceholderIcon />
          </div>
        )}
      </div>
      {scrim && <div className="hero-scrim" aria-hidden="true" />}
    </>
  );
}
