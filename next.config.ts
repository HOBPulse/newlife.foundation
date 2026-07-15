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
  // Baseline security headers (HSTS is already added by Vercel). CSP is
  // deliberately deferred — it needs a PayPal allowlist and report-only tuning.
  // X-Frame-Options: DENY protects THIS site from being framed (clickjacking);
  // it does not affect our own embedding of PayPal's iframes. Permissions-Policy
  // disables only features the site never uses (kept minimal so PayPal's
  // payment flows aren't affected).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
