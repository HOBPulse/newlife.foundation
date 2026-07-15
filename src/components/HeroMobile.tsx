import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Mobile hero (<768px) — owner-picked option 4: the headline lives in the
 *  photo's calm sky, the ambulance rides the bottom edge uncropped; one
 *  frame, one story. Gold letterpress CTA (family direction B, 2026-07-15;
 *  replaced gel btn13 — see DECISIONS.md); the secondary keeps the shared
 *  dot-flood treatment (.hero-cta-secondary) with a slide-in arrow.
 *  Desktop renders the original hero section. */
export function HeroMobile({ photoAvailable }: { photoAvailable: boolean }) {
  const t = useTranslations("HomePage.hero");
  return (
    <section className="relative h-[calc(100svh-3.5rem)] w-full overflow-hidden bg-sage-soft md:hidden">
      {photoAvailable && (
        <Image
          src="/photos/hero-transport.jpg"
          alt={t("photoAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="hero-m-scrim absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 px-4 pt-9">
        <h1 className="max-w-sm text-balance font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-paper">
          {t("title")
            .split(". ")
            .map((sentence, i, arr) => (
              <span key={i}>
                {i < arr.length - 1 ? `${sentence}.` : sentence}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </h1>
        <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-paper/90">
          {t("lead")}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/donate#give"
            className="btn-press tap-target inline-flex items-center rounded-full px-7 py-3 text-base font-semibold text-gold-ink"
          >
            {t("ctaDonate")}
          </Link>
          <Link
            href="/contact"
            className="hero-cta-secondary btn-outline-press tap-target rounded-full border border-paper/80 px-5 py-3 text-sm font-medium text-paper"
          >
            {t("ctaHelp")}
          </Link>
        </div>
      </div>
    </section>
  );
}
