"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { uk: "UA", ru: "RU", en: "EN" };

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <nav
      aria-label={t("localeSwitcher")}
      className={`flex items-center gap-0.5 text-sm ${className}`}
    >
      {routing.locales.map((l) =>
        l === locale ? (
          <span
            key={l}
            aria-current="true"
            className="rounded px-1.5 py-0.5 font-medium text-ink"
          >
            {LABELS[l]}
          </span>
        ) : (
          <Link
            key={l}
            href={pathname}
            locale={l}
            className="rounded px-1.5 py-0.5 text-ink-soft transition-colors hover:text-pine"
          >
            {LABELS[l]}
          </Link>
        ),
      )}
    </nav>
  );
}
