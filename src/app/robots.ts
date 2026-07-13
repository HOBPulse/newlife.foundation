import type { MetadataRoute } from "next";
import { SEO_NOINDEX, SITE_URL } from "@/lib/seo";

// Crawler policy is driven by the single SEO_NOINDEX switch (src/lib/seo.ts).
// While noindex: block all crawlers and omit the sitemap reference. When
// indexing is re-enabled: allow all + point to the sitemap (which always
// builds — see DECISIONS.md "HOW TO RE-ENABLE INDEXING").
export default function robots(): MetadataRoute.Robots {
  if (SEO_NOINDEX) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
