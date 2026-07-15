"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PAYPAL, paypalOneTimeSrc } from "@/lib/payments";
import { usePaypalSdk } from "./usePaypalSdk";

// One-time donation — PayPal Hosted Button. Loads the hosted-buttons SDK under
// its own namespace and renders the pre-built button into the container.
const CONTAINER_ID = "paypal-hosted-container";

export function PaypalOneTime() {
  const t = useTranslations("DonatePage.give");
  const locale = useLocale();
  const state = usePaypalSdk(paypalOneTimeSrc(locale), PAYPAL.oneTime.namespace);
  const rendered = useRef(false);

  useEffect(() => {
    if (state !== "ready" || rendered.current) return;
    const ns = window.paypalOneTime;
    if (!ns) return;
    rendered.current = true;
    ns.HostedButtons({ hostedButtonId: PAYPAL.oneTime.hostedButtonId }).render(
      `#${CONTAINER_ID}`,
    );
  }, [state]);

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
