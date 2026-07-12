"use client";

import { useTranslations } from "next-intl";
import { MONO_JAR_URL } from "@/lib/payments";

// Primary donate method — the foundation's Monobank jar (UAH). A plain
// outbound link, no SDK; gold CTA per the site's accent rules.
export function MonoJarCard() {
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
    </section>
  );
}
