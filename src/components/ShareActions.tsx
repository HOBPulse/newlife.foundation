"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  /** Absolute URL of the localized site home. */
  url: string;
  text: string;
};

const linkClass =
  "text-sm font-medium text-pine transition-colors hover:text-pine-deep";

// Legacy path for browsers without the async Clipboard API
// (or insecure contexts where it is unavailable).
function fallbackCopy(value: string, onDone: () => void) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (document.execCommand("copy")) onDone();
  } finally {
    document.body.removeChild(textarea);
  }
}

// Inline share-nodes icon — currentColor, no icon library.
function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      <circle cx="18" cy="5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="19" r="2.6" />
      <path d="M8.4 10.7 15.6 6.3M8.4 13.3l7.2 4.4" />
    </svg>
  );
}

/**
 * Share the site, collapsed behind a single button: on click, reveal plain
 * share-intent links (Telegram / WhatsApp / Facebook) + copy-to-clipboard.
 * No third-party SDKs or scripts by design.
 */
export function ShareActions({ url, text }: Props) {
  const t = useTranslations("HowToHelpPage.cards.share");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
  ];

  function copyLink() {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(done)
        .catch(() => fallbackCopy(url, done));
    } else {
      fallbackCopy(url, done);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="share-options"
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine px-5 py-2.5 text-sm font-medium text-pine transition-colors hover:bg-sage-soft"
      >
        {t("cta")}
        <ShareIcon />
      </button>
      <div id="share-options" data-open={open} className="disclosure-panel">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
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
              onClick={copyLink}
              className={linkClass}
              aria-live="polite"
            >
              {copied ? t("copied") : t("copyLink")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
