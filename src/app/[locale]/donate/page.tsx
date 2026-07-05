import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "DonatePage", "/donate");
}

// v1 per brief: simple external links, no embedded widgets/SDKs.
// Real URLs [TO BE PROVIDED] via env.
const METHODS = [
  { key: "mono", currency: "UAH", url: process.env.NEXT_PUBLIC_MONO_JAR_URL },
  { key: "liqpay", currency: "UAH", url: process.env.NEXT_PUBLIC_LIQPAY_URL },
  {
    key: "paypal",
    currency: "EUR / USD",
    url: process.env.NEXT_PUBLIC_PAYPAL_URL,
  },
] as const;

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

      {/* Active campaigns — placeholder until real data provided */}
      <section className="reveal mt-14 rounded-xl border border-sage bg-sage-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("campaigns.title")}
        </h2>
        <p className="mt-3 text-ink-soft">{t("campaigns.pending")}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("methods.title")}
        </h2>
        <ul className="mt-6 max-w-2xl divide-y divide-sage rounded-xl border border-sage">
          {METHODS.map((method) => (
            <li
              key={method.key}
              className="flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-ink">
                  {t(`methods.${method.key}`)}
                </span>
                <span className="tnum rounded-full bg-sage-soft px-2.5 py-0.5 text-xs text-ink-soft">
                  {method.currency}
                </span>
              </div>
              {method.url ? (
                <a
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-pine px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-pine-deep"
                >
                  {t("methods.open")}
                </a>
              ) : (
                <span className="rounded-full border border-sage px-4 py-2 text-sm text-ink-soft">
                  {t("methods.linkPending")}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
