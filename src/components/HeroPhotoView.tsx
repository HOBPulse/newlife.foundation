import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/* Vertical framing (temporary dev &sky=1..3): object-position Y. Higher sky =
   more sky at the top (object-position nearer the image top), lower sky = the
   van fills more. Applied ≥768 (see globals.css). */
const SKY: Record<number, string> = {
  1: "62%",
  2: "32%",
  3: "6%",
};

/** Presentational full-bleed hero photo + scrim. No hooks beyond
 *  useTranslations, so it also serves as the server Suspense fallback. */
export function HeroPhotoView({
  photoAvailable,
  sky = 2,
}: {
  photoAvailable: boolean;
  sky?: number;
}) {
  const t = useTranslations("HomePage.hero");
  const frameStyle = { "--sky-y": SKY[sky] ?? SKY[2] } as CSSProperties;
  return (
    <>
      <div className="hero-full" style={frameStyle}>
        {photoAvailable ? (
          <Image
            src="/photos/hero-transport.jpg"
            alt={t("photoAlt")}
            fill
            priority
            sizes="100vw"
            className="hero-full-img object-cover"
          />
        ) : (
          <div className="hero-full-placeholder" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
              <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
              <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path d="M9 34l10-9 7 6 6-5 7 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="hero-scrim" aria-hidden="true" />
    </>
  );
}
