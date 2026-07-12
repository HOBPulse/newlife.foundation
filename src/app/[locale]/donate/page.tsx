import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DonateMethods } from "@/components/donate/DonateMethods";
import type { Locale } from "@/i18n/routing";
import { PAYMENT_METHODS } from "@/lib/payments";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "DonatePage", "/donate");
}

export default async function DonatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("DonatePage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      {/* Donate block — Monobank jar (primary) + PayPal (client island) */}
      <DonateMethods />

      {/* Coming-soon stubs — slim secondary block; active methods render
          above as cards, never here */}
      <section className="mt-14 max-w-xl">
        <h2 className="font-display text-xl font-medium text-ink">
          {t("methods.title")}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{t("methods.lead")}</p>
        <ul className="mt-4 divide-y divide-sage rounded-xl border border-sage">
          {PAYMENT_METHODS.filter((method) => method.status === "todo").map(
            (method) => (
              <li
                key={method.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink">
                    {t(`methods.${method.labelKey}`)}
                  </span>
                  <span className="tnum rounded-full bg-sage-soft px-2.5 py-0.5 text-xs text-ink-soft">
                    {method.currency}
                  </span>
                </div>
                <span className="rounded-full border border-sage px-3 py-1.5 text-xs text-ink-soft">
                  {t("methods.soon")}
                </span>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Active campaigns — placeholder until real data provided */}
      <section className="reveal mt-14 max-w-2xl rounded-xl border border-sage bg-sage-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("campaigns.title")}
        </h2>
        <p className="mt-3 text-ink-soft">{t("campaigns.pending")}</p>
      </section>
    </div>
  );
}
