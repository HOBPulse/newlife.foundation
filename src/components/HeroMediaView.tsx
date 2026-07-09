import Image from "next/image";
import { useTranslations } from "next-intl";
import { LogoMark } from "./LogoMark";

export type HeroVariant = "mark" | "photo";

/** Presentational hero media: the watermark (default "mark") or a photo card
 *  ("photo"). No hooks beyond useTranslations, so it works as the server
 *  Suspense fallback and inside the client param wrapper alike. */
export function HeroMediaView({
  variant,
  photoAvailable,
}: {
  variant: HeroVariant;
  photoAvailable: boolean;
}) {
  if (variant === "mark") {
    return (
      <div aria-hidden="true" className="hero-watermark">
        <LogoMark className="h-full w-auto" />
      </div>
    );
  }
  return <HeroPhoto photoAvailable={photoAvailable} />;
}

function HeroPhoto({ photoAvailable }: { photoAvailable: boolean }) {
  const t = useTranslations("HomePage.hero");
  return (
    <figure className="hero-photo">
      <div className="hero-photo-frame">
        {photoAvailable ? (
          // LCP zone — eager (priority), no lazy-load
          <Image
            src="/photos/hero-transport.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 24rem"
            className="object-cover"
          />
        ) : (
          <div className="hero-photo-placeholder" aria-hidden="true">
            {/* neutral placeholder so the layout is reviewable before the
                owner drops in public/photos/hero-transport.jpg */}
            <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
              <rect
                x="6"
                y="10"
                width="36"
                height="28"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="17" cy="20" r="3.5" stroke="currentColor" strokeWidth="2" />
              <path
                d="M9 34l10-9 7 6 6-5 7 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <figcaption className="hero-photo-caption">{t("photoCaption")}</figcaption>
    </figure>
  );
}
