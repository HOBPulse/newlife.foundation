"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

type Props = {
  /** Absolute URL of the localized site home. */
  url: string;
  title: string;
  text: string;
};

const linkClass =
  "text-sm font-medium text-pine transition-colors hover:text-pine-deep";

// Feature detection is static per session — nothing to subscribe to.
function subscribeNoop(): () => void {
  return () => {};
}

/**
 * Share the site via the Web Share API where available (mostly mobile);
 * otherwise plain share-intent links + copy-to-clipboard. No third-party
 * SDKs or scripts by design.
 */
export function ShareActions({ url, title, text }: Props) {
  const t = useTranslations("HowToHelpPage.ways.share");
  const [copied, setCopied] = useState(false);

  // navigator.share is feature-detected after hydration (server snapshot is
  // false); SSR renders the intent-link fallback so sharing works without JS.
  const canShare = useSyncExternalStore(
    subscribeNoop,
    () => "share" in navigator,
    () => false,
  );

  if (canShare) {
    return (
      <button
        type="button"
        onClick={() => {
          navigator.share({ title, text, url }).catch(() => {
            // User dismissed the share sheet — nothing to do.
          });
        }}
        className={`mt-5 inline-block ${linkClass}`}
      >
        {t("cta")} →
      </button>
    );
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const intents = [
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "X",
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      {intents.map(({ name, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {name}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard
            .writeText(url)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              // Clipboard unavailable (e.g. insecure context) — keep quiet.
            });
        }}
        className={linkClass}
        aria-live="polite"
      >
        {copied ? t("copied") : t("copyLink")}
      </button>
    </div>
  );
}
