"use client";

import { useSyncExternalStore } from "react";

/* The foundation's phone (owner-provided, 2026-07-15), deliberately split
 * so the full number never appears as one string in SSR HTML, the RSC/i18n
 * payload, or as a single greppable token in the JS bundle. Assembled in
 * the browser after hydration: humans see it, search engines and non-JS
 * scrapers don't (a JS-executing headless scraper still can — that's the
 * accepted limit). Plain text by design — no tel: link. */
const PARTS = ["+38 ", "(0", "67) ", "63", "3-", "45-", "55"];

// Client-only value via useSyncExternalStore (avoids setState-in-effect):
// the SERVER snapshot is a blank placeholder — so the assembled number is
// absent from server-rendered HTML — and the CLIENT snapshot is the real
// number, which React swaps in right after hydration. The value never
// changes, so subscribe is a no-op.
const subscribe = () => () => {};
const getClientSnapshot = () => PARTS.join("");
const getServerSnapshot = () => " ";

export function ObfuscatedPhone({ className }: { className?: string }) {
  const phone = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  return <span className={className}>{phone}</span>;
}
