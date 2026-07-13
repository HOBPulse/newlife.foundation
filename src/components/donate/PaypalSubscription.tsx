"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PAYPAL, paypalSubscriptionSrc } from "@/lib/payments";
import { usePaypalSdk } from "./usePaypalSdk";

// Monthly donation — PayPal Smart Button (vault + subscription intent). Loads
// the subscription SDK under its own namespace and renders the buttons.
const CONTAINER_ID = "paypal-subscription-container";

export function PaypalSubscription() {
  const t = useTranslations("DonatePage.give");
  const state = usePaypalSdk(paypalSubscriptionSrc(), PAYPAL.subscription.namespace);
  const rendered = useRef(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (state !== "ready" || rendered.current) return;
    const ns = window.paypalSub;
    if (!ns) return;
    rendered.current = true;
    ns.Buttons({
      style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe" },
      createSubscription: (_data, actions) =>
        actions.subscription.create({ plan_id: PAYPAL.subscription.planId }),
      onApprove: () => setApproved(true),
      onError: (err) => {
        // Surface load/checkout failures in the console; the UI keeps the
        // button visible so the donor can retry.
        console.error("PayPal subscription error", err);
      },
    }).render(`#${CONTAINER_ID}`);
  }, [state]);

  if (approved) {
    return (
      <p className="py-6 text-center text-sm font-medium text-pine">
        {t("subscribed")}
      </p>
    );
  }

  return (
    <div>
      <div id={CONTAINER_ID} />
      {state === "loading" && (
        <p className="py-4 text-center text-sm text-ink-soft">{t("loading")}</p>
      )}
      {state === "error" && (
        <p className="py-4 text-center text-sm text-ink-soft">{t("error")}</p>
      )}
    </div>
  );
}
