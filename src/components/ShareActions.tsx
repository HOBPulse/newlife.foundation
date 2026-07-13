"use client";

import { useState, type ReactNode } from "react";
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

/* Icon chips — lucide-style outline glyphs, currentColor, no icon library
   (matches ShareIcon) */
const CHIP_ICONS: Record<string, ReactNode> = {
  Telegram: (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
};

function LinkGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * Share the site, collapsed behind a single button: on click, a row of
 * icon chips (Telegram / WhatsApp / Facebook) pops in, with copy-link on
 * its own line below. No third-party SDKs or scripts by design.
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
          {/* Icon chips pop in with a small stagger; the intent names
              become aria-labels/tooltips */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            {intents.map(({ name, href }, i) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="share-chip inline-flex h-10 w-10 items-center justify-center rounded-full border border-pine/40 text-pine transition-colors hover:bg-sage-soft active:bg-sage-soft"
                style={{ "--chip": i } as React.CSSProperties}
              >
                {CHIP_ICONS[name]}
              </a>
            ))}
          </div>
          {/* Copy-link on its own line below the chips (owner layout) */}
          <button
            type="button"
            onClick={copyLink}
            aria-live="polite"
            className={`share-chip mt-3 inline-flex items-center gap-2 ${linkClass}`}
            style={{ "--chip": intents.length } as React.CSSProperties}
          >
            {copied ? <CheckGlyph /> : <LinkGlyph />}
            {copied ? t("copied") : t("copyLink")}
          </button>
        </div>
      </div>
    </>
  );
}
