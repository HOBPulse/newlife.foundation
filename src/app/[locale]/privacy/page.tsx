import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "PrivacyPage", "/privacy");
}

const SECTIONS = [
  "who",
  "data",
  "cookies",
  "use",
  "storage",
  "rights",
  "changes",
] as const;

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PrivacyPage");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="font-display text-2xl font-medium text-ink">
              {t(`sections.${section}.title`)}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft">
              {t.rich(`sections.${section}.body`, {
                email: (chunks) => (
                  <a
                    href="mailto:support@newlife.foundation"
                    className="text-pine underline hover:text-pine-deep"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
