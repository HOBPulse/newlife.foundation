import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Canonical + hreflang alternates for a page (per brief: every page links
 * all three locales plus x-default). Relative paths resolve against
 * metadataBase set in the locale layout. Call from each page's generateMetadata.
 */
export function pageAlternates(
  href: string,
  locale: Locale,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = getPathname({ locale: l, href });
  }
  languages["x-default"] = getPathname({
    locale: routing.defaultLocale,
    href,
  });

  return {
    canonical: getPathname({ locale, href }),
    languages,
  };
}

// Default social preview images (1200×630), one per locale.
// Regenerate with: node scripts/generate-og-images.mjs
const OG_IMAGES: Record<Locale, string> = {
  uk: "/og/og-uk.png",
  ru: "/og/og-ru.png",
  en: "/og/og-en.png",
};

/**
 * Open Graph tags shared by all pages. Relative url/image resolve against
 * metadataBase set in the locale layout. All pages use the locale's default
 * preview image — patient photos deliberately never become link previews.
 */
export function openGraph(
  title: string,
  description: string,
  href: string,
  locale: Locale,
): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: "New Life Foundation",
    title,
    description,
    url: getPathname({ locale, href }),
    images: [{ url: OG_IMAGES[locale], width: 1200, height: 630 }],
  };
}

/**
 * Standard page metadata: title + description from the namespace's
 * metaTitle/metaDescription keys, plus hreflang alternates and OG tags.
 */
export async function pageMetadata(
  locale: Locale,
  namespace: string,
  href: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates(href, locale),
    openGraph: openGraph(t("metaTitle"), t("metaDescription"), href, locale),
  };
}
