import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Per brief: no dependency on host-side image optimization (site migrates to a VPS later)
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
