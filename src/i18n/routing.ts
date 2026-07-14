import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Exactly these 3 locales per brief — no need to architect for more
  locales: ["uk", "ru", "en"],
  defaultLocale: "uk",
  // uk has no URL prefix (/about); ru and en are prefixed (/ru/about, /en/about)
  localePrefix: "as-needed",
  // "/" always serves uk — never negotiate via NEXT_LOCALE cookie or Accept-Language.
  // ru/en are reachable only via their explicit URL prefix.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
