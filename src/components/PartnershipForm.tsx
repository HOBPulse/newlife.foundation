"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitWeb3Form } from "@/lib/web3forms";

const inputClass =
  "w-full rounded-lg border border-sage bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/60";

/** Partnership form (/partner) — posts to Web3Forms, no page reload. */
export function PartnershipForm() {
  const t = useTranslations("PartnerPage.form");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p
        role="status"
        className="max-w-xl rounded-lg border border-pine bg-sage-soft px-4 py-3 text-ink"
      >
        {t("success")}
      </p>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const delivered = await submitWeb3Form(event.currentTarget);
    if (delivered) {
      setSent(true);
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {/* Routing metadata for the support@ mailbox */}
      <input type="hidden" name="subject" value="Партнерство — сайт" />
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot — hidden from people, tempting to bots */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label htmlFor="p-org" className="mb-1.5 block text-sm font-medium">
          {t("org")} <span aria-hidden="true">*</span>
        </label>
        <input
          id="p-org"
          name="organization"
          type="text"
          required
          autoComplete="organization"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="p-email" className="mb-1.5 block text-sm font-medium">
          {t("email")} <span aria-hidden="true">*</span>
        </label>
        <input
          id="p-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="p-message" className="mb-1.5 block text-sm font-medium">
          {t("message")} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="p-message"
          name="message"
          rows={5}
          required
          className={inputClass}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-apricot-soft px-4 py-3 text-sm text-ink">
          {t.rich("error", {
            email: (chunks) => (
              <a
                href="mailto:support@newlife.foundation"
                className="underline hover:text-pine-deep"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      <p className="text-xs leading-relaxed text-ink-soft">
        {t.rich("consent", {
          privacy: (chunks) => (
            <Link href="/privacy" className="underline hover:text-pine-deep">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </form>
  );
}
