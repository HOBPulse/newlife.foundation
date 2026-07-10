import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";
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
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      {/* Decorative brand mark near the intro (identity "sign"; aria-hidden
          baked into LogoMark). Static — no animation. */}
      <Logo className="mb-6 h-16 w-16" />
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-soft">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
        <p>{t("p5")}</p>
      </div>

      {/* Closing CTA — reuses the site's contact route + label, terracotta
          button styling matching the hero donate CTA. */}
      <section className="reveal mt-12 border-t border-sage pt-8">
        <p className="max-w-xl text-lg leading-relaxed text-ink">
          {t("cta.body")}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-brand-terracotta-deep px-6 py-3 font-medium text-paper transition-colors hover:bg-brand-terracotta-deep/90"
        >
          {t("cta.button")}
        </Link>
      </section>
    </div>
  );
}
