"use client";

import { useEffect, useState } from "react";

// Minimal typings for the two PayPal SDK surfaces we use. Each SDK is exposed
// under its own window namespace (never window.paypal) so the two loads don't
// collide — see PAYPAL.*.namespace in @/lib/payments.
interface HostedButtonsNamespace {
  HostedButtons(options: { hostedButtonId: string }): {
    render(container: string | HTMLElement): Promise<void>;
  };
}

interface SubscriptionActions {
  subscription: { create(options: { plan_id: string }): Promise<string> };
}

export interface ButtonsNamespace {
  Buttons(options: {
    style?: Record<string, string>;
    createSubscription?(
      data: unknown,
      actions: SubscriptionActions,
    ): Promise<string>;
    onApprove?(data: { subscriptionID?: string | null }): void;
    onError?(err: unknown): void;
    onCancel?(data: unknown): void;
  }): { render(container: string | HTMLElement): Promise<void> };
}

declare global {
  interface Window {
    paypalOneTime?: HostedButtonsNamespace;
    paypalSub?: ButtonsNamespace;
  }
}

export type SdkState = "loading" | "ready" | "error";

// One promise per namespace, at module scope: each distinct SDK script injects
// at most once for the page's lifetime — survives tab flips, remounts and React
// StrictMode's double-invoke in dev.
const cache = new Map<string, Promise<void>>();

function loadScript(src: string, namespace: string): Promise<void> {
  const cached = cache.get(namespace);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    // data-namespace is read by the PayPal SDK to expose itself under
    // window[namespace] instead of the shared window.paypal.
    script.dataset.namespace = namespace;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      // Drop the failed promise so a later mount can retry the load.
      cache.delete(namespace);
      reject(new Error(`PayPal SDK failed to load (${namespace})`));
    });
    document.body.appendChild(script);
  });

  cache.set(namespace, promise);
  return promise;
}

// Lazily loads the given SDK when the component using it mounts (i.e. when its
// donate tab is first activated), and reports load state.
export function usePaypalSdk(src: string, namespace: string): SdkState {
  const [state, setState] = useState<SdkState>("loading");

  useEffect(() => {
    let active = true;
    loadScript(src, namespace)
      .then(() => {
        if (active) setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [src, namespace]);

  return state;
}
