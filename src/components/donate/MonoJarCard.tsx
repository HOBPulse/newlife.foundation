"use client";

import { useTranslations } from "next-intl";
import { MONO_JAR_URL } from "@/lib/payments";

// Primary donate method — the foundation's Monobank jar (UAH). A plain
// outbound link, no SDK; gold CTA per the site's accent rules. The QR (svg
// markup, build-time generated from MONO_JAR_URL in the donate page) renders
// below the button — full-size on desktop, compact on mobile.
export function MonoJarCard({ qrSvg }: { qrSvg: string }) {
  const t = useTranslations("DonatePage.mono");

  return (
    <section className="reveal rounded-2xl border border-sage bg-sage-soft p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("title")}
        </h2>
        <span className="tnum rounded-full bg-paper px-2.5 py-0.5 text-xs text-ink-soft">
          UAH
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t("help")}</p>
      <a
        href={MONO_JAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center rounded-full bg-gold px-6 py-3 font-medium text-gold-ink transition-colors hover:bg-gold/90"
      >
        {t("cta")}
      </a>

      {/* QR to the jar — compact on mobile (still scannable from another
          phone), full-size on desktop where it fills the card's column.
          White rounded tile = quiet zone + scan contrast. */}
      <div className="mt-6">
        <div
          role="img"
          aria-label={t("qrAlt")}
          className="h-28 w-28 rounded-xl border border-sage bg-white p-2 sm:h-44 sm:w-44 [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          {t("qrCaption")}
        </p>
      </div>
    </section>
  );
}
