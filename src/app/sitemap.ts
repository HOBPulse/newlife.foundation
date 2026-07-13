import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";
import { STORY_SLUGS } from "@/lib/stories";

// Every indexable route (locale-agnostic href). Localized URLs + hreflang
// alternates are derived per locale below.
const ROUTES = [
  "/",
  "/about",
  "/how-we-work",
  "/stories",
  ...STORY_SLUGS.map((slug) => `/stories/${slug}`),
  "/how-to-help",
  "/donate",
  "/contact",
  "/volunteer",
  "/partner",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((href) => {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = SITE_URL + getPathname({ locale, href });
    }
    return {
      url: SITE_URL + getPathname({ locale: routing.defaultLocale, href }),
      alternates: { languages },
    };
  });
}
