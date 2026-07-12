import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = await pageMetadata(locale, "TermsPage", "/terms");
  // Placeholder page — keep it out of the index and drop hreflang/canonical
  // until the real public-offer + refund document exists (also absent from the
  // sitemap). Public offer ≠ privacy policy — this is a separate document.
  return { ...meta, alternates: undefined, robots: { index: false, follow: false } };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TermsPage");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-6 leading-relaxed text-ink-soft">{t("body")}</p>
    </div>
  );
}
