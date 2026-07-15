"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TERMS_URL } from "@/lib/payments";
import { DonateWidget } from "./DonateWidget";
import { MonoJarCard } from "./MonoJarCard";

// The donate block: two cards side by side on desktop — Monobank jar PRIMARY
// (left), PayPal widget secondary (right). On mobile they collapse to one
// column with mono first (DOM order). The shared note + terms link span both
// columns below.
export function DonateMethods({ monoQrSvg }: { monoQrSvg: string }) {
  const t = useTranslations("DonatePage.give");

  return (
    <div
      id="give"
      className="mt-10 grid max-w-5xl scroll-mt-24 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-stretch"
    >
      <MonoJarCard qrSvg={monoQrSvg} />
      <DonateWidget />
      <div className="lg:col-span-2">
        <p className="text-xs leading-relaxed text-ink-soft">{t("note")}</p>
        <Link
          href={TERMS_URL}
          className="mt-2 inline-block text-xs text-ink-soft underline underline-offset-2 transition-colors hover:text-pine"
        >
          {t("terms")}
        </Link>
      </div>
    </div>
  );
}
