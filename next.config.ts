import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Hide the dev-only "N" indicator badge (bottom-corner medallion)
  devIndicators: false,
  images: {
    // Per brief: no dependency on host-side image optimization (site migrates to a VPS later)
    unoptimized: true,
  },
  experimental: {
    // Enables React's <ViewTransition> for page-to-page morphs (story flow).
    // Progressive enhancement: browsers without the View Transitions API just
    // navigate instantly. App Router already ships the required React canary.
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);
