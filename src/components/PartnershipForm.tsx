"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitPartnerRequest, type ContactFormState } from "@/lib/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-sage bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/60";

/** Partnership form (/partner) — server action → Telegram + email relay. */
export function PartnershipForm() {
  const t = useTranslations("PartnerPage.form");
  const [state, formAction, pending] = useActionState(
    submitPartnerRequest,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="max-w-xl rounded-lg border border-pine bg-sage-soft px-4 py-3 text-ink"
      >
        {t("success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {/* Honeypot — hidden from humans; a filled "company" is dropped
          server-side (see readFields). Off-screen + aria-hidden + untabbable. */}
      <div
        className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="p-company">Company</label>
        <input id="p-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="p-org" className="mb-1.5 block text-sm font-medium">
          {t("org")} <span aria-hidden="true">*</span>
        </label>
        <input
          id="p-org"
          name="organization"
          type="text"
          required
          maxLength={200}
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
          maxLength={200}
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
          maxLength={5000}
          className={inputClass}
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-apricot-soft px-4 py-3 text-sm text-ink">
          {state.error === "validation"
            ? t("errorValidation")
            : t.rich("errorDelivery", {
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
        disabled={pending}
        aria-disabled={pending}
        data-loading={pending || undefined}
        className="btn-press btn-press--pine btn-submit tap-target inline-flex items-center rounded-full px-6 py-3 font-medium text-white"
      >
        <span className="btn-submit-label">{t("submit")}</span>
        {pending && (
          <span className="sr-only" role="status">
            {t("sending")}
          </span>
        )}
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
