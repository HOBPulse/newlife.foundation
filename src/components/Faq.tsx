import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/** Quiet editorial FAQ — native <details>/<summary>, no JS. Copy lives in
 *  messages (FAQ.title + FAQ.items.1..5.{q,a}); item 5's answer is followed by
 *  the gold donate CTA (reuses the hero's label + /donate route). */
const SLOTS = ["1", "2", "3", "4", "5"] as const;

export function Faq() {
  const t = useTranslations("FAQ");
  const tHero = useTranslations("HomePage.hero");

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
        {t("title")}
      </h2>
      <div className="mt-8 border-t border-sage">
        {SLOTS.map((n) => (
          <details key={n} className="faq-item border-b border-sage">
            <summary className="faq-summary flex cursor-pointer items-center gap-4 py-4">
              <span className="tnum font-display text-sm font-medium text-pine">
                {n.padStart(2, "0")}
              </span>
              <span className="flex-1 font-medium text-ink">
                {t(`items.${n}.q`)}
              </span>
              <span aria-hidden="true" className="faq-mark text-ink-soft" />
            </summary>
            <div className="pb-5 pl-9">
              <p className="leading-relaxed text-ink-soft">{t(`items.${n}.a`)}</p>
              {n === "5" && (
                <Link
                  href="/donate"
                  className="btn-press tap-target mt-4 inline-block rounded-full px-6 py-3 font-medium text-gold-ink"
                >
                  {tHero("ctaDonate")}
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
