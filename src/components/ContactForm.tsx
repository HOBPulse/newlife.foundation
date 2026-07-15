"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  submitContactRequest,
  type ContactFormState,
} from "@/lib/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-sage bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/60";

export function ContactForm() {
  const t = useTranslations("ContactPage.form");
  const [state, formAction, pending] = useActionState(
    submitContactRequest,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-pine bg-sage-soft px-4 py-3 text-ink"
      >
        {t("success")}
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <p className="text-sm text-ink-soft">{t("requiredNote")}</p>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          {t("name")}
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
          {t("phone")}
        </label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
      </div>

      <div>
        <label htmlFor="telegram" className="mb-1.5 block text-sm font-medium">
          {t("telegram")}{" "}
          <span className="font-normal text-ink-soft">{t("optional")}</span>
        </label>
        <input
          id="telegram"
          name="telegram"
          type="text"
          placeholder={t("telegramPlaceholder")}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
          {t("location")}
        </label>
        <input id="location" name="location" type="text" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea id="message" name="message" rows={5} required className={inputClass} />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 accent-pine"
        />
        <span>
          {t.rich("consent", {
            privacy: (chunks) => (
              <Link href="/privacy" className="text-pine underline hover:text-pine-deep">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-apricot-soft px-4 py-3 text-sm text-ink">
          {t(state.error === "validation" ? "errorValidation" : "errorDelivery")}
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
    </form>
  );
}
