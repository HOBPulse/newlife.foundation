import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { ShareActions } from "@/components/ShareActions";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "HowToHelpPage", "/how-to-help");
}

export default async function HowToHelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HowToHelpPage");
  const tCommon = await getTranslations("Common");
  // Localized site home as the shared URL (uk has no prefix).
  const shareUrl = `${SITE_URL}${getPathname({ locale, href: "/" })}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <section className="reveal rounded-xl border border-sage p-6">
          <h2 className="font-display text-xl font-medium text-ink">
            {t("ways.donate.title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t("ways.donate.body")}
          </p>
          <Link
            href="/donate"
            className="mt-5 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
          >
            {t("ways.donate.cta")} →
          </Link>
        </section>

        <section className="reveal rounded-xl border border-sage p-6">
          <h2 className="font-display text-xl font-medium text-ink">
            {t("ways.share.title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t("ways.share.body")}
          </p>
          <ShareActions
            url={shareUrl}
            title={tCommon("siteName")}
            text={t("ways.share.shareText")}
          />
        </section>

        <section className="reveal rounded-xl border border-sage p-6">
          <h2 className="font-display text-xl font-medium text-ink">
            {t("ways.partner.title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {t("ways.partner.body")}
          </p>
          <Link
            href="/partner"
            className="mt-5 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
          >
            {t("ways.partner.cta")} →
          </Link>
        </section>
      </div>
    </div>
  );
}
