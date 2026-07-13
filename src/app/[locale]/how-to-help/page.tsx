import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
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

      {/* Ways to help — donate first; volunteer/partnership link to their
          form pages. Default layout (strip) stays static via the Suspense
          fallback; ?help_layout=twocol switches to the photo/right-column
          variant client-side. */}
      <Suspense fallback={<HelpWaysView layout="strip" shareUrl={shareUrl} />}>
        <HelpWays shareUrl={shareUrl} />
      </Suspense>
    </div>
  );
}
