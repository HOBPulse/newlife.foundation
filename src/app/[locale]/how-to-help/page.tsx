import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { HelpPhoto, HelpPhotoView } from "@/components/HelpPhoto";
import { HelpWays, HelpWaysView } from "@/components/HelpWays";
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

      {/* Photo placement A (default): below the intro, above the cards.
          The fallback keeps the default placement in the static HTML. */}
      <Suspense
        fallback={<HelpPhotoView alt={t("photoAlt")} className="reveal mt-10" />}
      >
        <HelpPhoto variant="top" alt={t("photoAlt")} className="reveal mt-10" />
      </Suspense>

      {/* Four ways to help — donate first; volunteer/partnership forms and
          the share links expand in place (collapsed by default). Layout
          experiment behind ?help_layout=split; default (A) stays static. */}
      <Suspense fallback={<HelpWaysView layout="a" shareUrl={shareUrl} />}>
        <HelpWays shareUrl={shareUrl} />
      </Suspense>

      {/* Photo placement B (?help_photo=mid): below the cards */}
      <Suspense fallback={null}>
        <HelpPhoto variant="mid" alt={t("photoAlt")} className="reveal mt-16" />
      </Suspense>
    </div>
  );
}
