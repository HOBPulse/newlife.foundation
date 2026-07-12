"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitWeb3Form } from "@/lib/web3forms";

const ROLE_KEYS = [
  "driver",
  "paramedic",
  "developer",
  "marketer",
  "smm",
  "other",
] as const;

const inputClass =
  "w-full rounded-lg border border-sage bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/60";

/** Volunteer form (/volunteer) — posts to Web3Forms, no page reload. */
export function VolunteerForm() {
  const t = useTranslations("VolunteerPage.form");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [sent, setSent] = useState(false);
  // «Інше» makes the message field required (the role alone says nothing).
  const [isOther, setIsOther] = useState(false);

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
      <input type="hidden" name="subject" value="Волонтер — сайт" />
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
        <label htmlFor="v-name" className="mb-1.5 block text-sm font-medium">
          {t("name")} <span aria-hidden="true">*</span>
        </label>
        <input
          id="v-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="v-contact" className="mb-1.5 block text-sm font-medium">
          {t("contact")} <span aria-hidden="true">*</span>
        </label>
        <input id="v-contact" name="contact" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="v-role" className="mb-1.5 block text-sm font-medium">
          {t("role")} <span aria-hidden="true">*</span>
        </label>
        <select
          id="v-role"
          name="role"
          required
          defaultValue=""
          onChange={(e) =>
            setIsOther(e.target.value === t("roles.other"))
          }
          className={inputClass}
        >
          <option value="" disabled>
            {t("rolePlaceholder")}
          </option>
          {ROLE_KEYS.map((key) => (
            <option key={key} value={t(`roles.${key}`)}>
              {t(`roles.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="v-message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
          {isOther && <span aria-hidden="true"> *</span>}
        </label>
        <textarea
          id="v-message"
          name="message"
          rows={5}
          required={isOther}
          aria-required={isOther}
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
