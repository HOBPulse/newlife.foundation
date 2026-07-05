import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "AboutPage", "/about");
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("intro")}
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <section className="reveal">
          <h2 className="font-display text-2xl font-medium text-ink">
            {t("mission.title")}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            {t("mission.body")}
          </p>
        </section>
        <section className="reveal">
          <h2 className="font-display text-2xl font-medium text-ink">
            {t("work.title")}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{t("work.body")}</p>
        </section>
      </div>

      {/* Transparency — flexible placeholder structure per brief;
          registration disclosure pending owner's decision */}
      <section className="reveal mt-14 rounded-xl border border-sage bg-sage-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("transparency.title")}
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
          {t("transparency.body")}
        </p>
        <p className="mt-4 inline-block rounded-full border border-sage bg-paper px-3 py-1 text-sm text-ink-soft">
          {t("transparency.pending")}
        </p>
      </section>
    </div>
  );
}
