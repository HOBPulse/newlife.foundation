// Payment configuration — single source for all donate-method identifiers.
//
// PayPal is the TEMPORARY primary method until Monobank (jar + acquiring) and
// LiqPay are wired later; those are declared as stubs below so adding them is a
// config change, not a rebuild of the donate UI.
//
// SAFE TO SHIP: PayPal client-id, hosted-button id and subscription plan-id are
// all PUBLIC by PayPal's design and belong in client code. NEVER put a secret
// key (PayPal secret, mono token, LiqPay private key) in this file or anywhere
// client-reachable.

// One-time and subscription use DIFFERENT client-ids AND different SDK script
// params, so they cannot share one SDK load. Each gets its own global namespace
// (data-namespace on the script tag) so window.paypal is never contended.
export const PAYPAL = {
  oneTime: {
    clientId:
      "BAAhJvM8zu3kmOW_i_FZo1ODde8gwH3iOfkUiH54naatW4TeNZx8AH9CHPLv3bLCA2N1WwV68rpr7zQRzI",
    hostedButtonId: "6HRGJXSE88KAY",
    currency: "USD",
    namespace: "paypalOneTime",
    components: "hosted-buttons",
    disableFunding: "venmo",
  },
  subscription: {
    clientId:
      "BAAtPjhqSa7EH4xwnZSnsuvDtI3qyJg4SbMNLUzoyTH-1yghJBSHlVHL9epOL9-v0ZlH0Wvb47Ng3ho8ck",
    planId: "P-1HN36555BF439815FNJJZBRY",
    namespace: "paypalSub",
    intent: "subscription",
    vault: true,
  },
} as const;

// Monobank jar — LIVE (owner-confirmed 2026-07-12, test donation passed).
// Public link to the foundation's jar; safe in client code.
export const MONO_JAR_URL = "https://send.monobank.ua/jar/9YuRbNPThB";

// Public offer / terms-of-donation & refund page. A dedicated /terms route
// (noindex, "in preparation") — deliberately separate from /privacy, since the
// public offer and the privacy policy are distinct legal documents. The real
// content is a lawyer task, pending.
export const TERMS_URL = "/terms";

const SDK_BASE = "https://www.paypal.com/sdk/js";

// Build the SDK <script> src for each mode. Kept here (not inline) so the params
// that MUST differ between the two loads live next to the config they read.
export function paypalOneTimeSrc(): string {
  const p = PAYPAL.oneTime;
  const qs = new URLSearchParams({
    "client-id": p.clientId,
    components: p.components,
    "disable-funding": p.disableFunding,
    currency: p.currency,
  });
  return `${SDK_BASE}?${qs.toString()}`;
}

export function paypalSubscriptionSrc(): string {
  const p = PAYPAL.subscription;
  const qs = new URLSearchParams({
    "client-id": p.clientId,
    vault: String(p.vault),
    intent: p.intent,
  });
  return `${SDK_BASE}?${qs.toString()}`;
}

// --- Future methods (stubs) -------------------------------------------------
// Declared, not implemented. When a URL/handler exists, flip `status` to
// "active" (and, for link methods, provide the env URL) — the donate page reads
// this list and renders active methods without further code changes.
export type PaymentMethodId =
  | "mono-jar"
  | "liqpay";

export type PaymentMethodStatus = "active" | "todo";

export interface PaymentMethod {
  id: PaymentMethodId;
  // i18n key suffix under DonatePage.methods.*
  labelKey: string;
  currency: string;
  status: PaymentMethodStatus;
  // For simple link methods, the outbound URL (env-driven). Undefined → stub.
  url?: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "mono-jar",
    labelKey: "monoJar",
    currency: "UAH",
    // Live — rendered as the primary method card on /donate (MonoJarCard),
    // not in the coming-soon list below it.
    url: MONO_JAR_URL,
    status: "active",
  },
  {
    id: "liqpay",
    labelKey: "liqpay",
    currency: "UAH",
    url: process.env.NEXT_PUBLIC_LIQPAY_URL,
    status: process.env.NEXT_PUBLIC_LIQPAY_URL ? "active" : "todo",
  },
];
