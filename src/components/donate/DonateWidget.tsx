"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PaypalOneTime } from "./PaypalOneTime";
import { PaypalSubscription } from "./PaypalSubscription";

type Mode = "oneTime" | "monthly";

// The "2-in-1" PayPal card: a segmented «Разово / Щомісяця» toggle that mounts
// the matching PayPal button. Only the active tab's SDK loads (see usePaypalSdk).
// Anchor, width and the shared note/terms live in DonateMethods.
export function DonateWidget() {
  const t = useTranslations("DonatePage.give");
  const [mode, setMode] = useState<Mode>("oneTime");

  const tabs: { id: Mode; label: string }[] = [
    { id: "oneTime", label: t("tabs.oneTime") },
    { id: "monthly", label: t("tabs.monthly") },
  ];

  return (
    <section className="reveal rounded-2xl border border-sage bg-sage-soft p-6 sm:p-8">
      <h2 className="font-display text-2xl font-medium text-ink">{t("title")}</h2>

      {/* Segmented control */}
      <div
        role="tablist"
        aria-label={t("title")}
        className="mt-6 grid grid-cols-2 gap-1 rounded-full border border-sage bg-paper p-1"
      >
        {tabs.map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`donate-tab-${tab.id}`}
              aria-selected={active}
              aria-controls="donate-panel"
              onClick={() => setMode(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gold text-gold-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="donate-panel"
        role="tabpanel"
        aria-labelledby={`donate-tab-${mode}`}
        className="mt-6"
      >
        <p className="mb-5 text-sm leading-relaxed text-ink-soft">
          {mode === "oneTime" ? t("oneTimeHelp") : t("monthlyHelp")}
        </p>
        {/* Mount only the active tab so its SDK loads on demand */}
        {mode === "oneTime" ? <PaypalOneTime /> : <PaypalSubscription />}
      </div>
    </section>
  );
}
