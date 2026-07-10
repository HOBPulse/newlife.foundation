import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Allow all crawlers; point to the sitemap. Never Disallow: / — the whole
// site is meant to be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
