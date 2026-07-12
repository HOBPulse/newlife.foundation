import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = await pageMetadata(locale, "TermsPage", "/terms");
  // Working draft, pending legal review — keep it out of the index and drop
  // hreflang/canonical (also absent from the sitemap) until it's finalised.
  return { ...meta, alternates: undefined, robots: { index: false, follow: false } };
}

const SECTIONS = ["1", "2", "3", "4", "5", "6", "7"] as const;

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("TermsPage");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>

      {/* Working-draft notice — pending legal review */}
      <p className="mt-6 rounded-lg border border-sage bg-sage-soft/60 px-4 py-3 text-sm text-ink-soft">
        {t("draftNote")}
      </p>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((n, i) => (
          <section key={n}>
            <h2 className="font-display text-2xl font-medium text-ink">
              {i + 1}. {t(`sections.${n}.title`)}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {t.rich(`sections.${n}.body`, {
                privacy: (chunks) => (
                  <Link
                    href="/privacy"
                    className="text-pine underline hover:text-pine-deep"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
