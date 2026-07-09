import { useTranslations } from "next-intl";

/** Quiet editorial FAQ skeleton — native <details>/<summary>, no JS.
 *  Behind the showFaq flag (default off): renders nothing to the DOM until
 *  the flag is on and real Q/A copy replaces the "TODO" placeholders in
 *  messages (FAQ.title + FAQ.items.1..5.{q,a}). */
const SHOW_FAQ = false;

const SLOTS = ["1", "2", "3", "4", "5"] as const;

export function Faq() {
  const t = useTranslations("FAQ");
  if (!SHOW_FAQ) return null;

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
            <p className="pb-5 pl-9 leading-relaxed text-ink-soft">
              {t(`items.${n}.a`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
