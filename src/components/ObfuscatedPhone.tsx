"use client";

import { useEffect, useState } from "react";

/* The foundation's phone (owner-provided, 2026-07-15), deliberately split
 * so the full number never appears as one string in SSR HTML, the RSC/i18n
 * payload, or as a single greppable token in the JS bundle. Assembled in
 * the browser after mount: humans see it, search engines and non-JS
 * scrapers don't (a JS-executing headless scraper still can — that's the
 * accepted limit). Plain text by design — no tel: link. */
const PARTS = ["+38 ", "(0", "67) ", "63", "3-", "45-", "55"];

export function ObfuscatedPhone({ className }: { className?: string }) {
  const [phone, setPhone] = useState(" ");
  useEffect(() => {
    setPhone(PARTS.join(""));
  }, []);
  return <span className={className}>{phone}</span>;
}
