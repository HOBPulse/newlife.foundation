"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  submitPartnerRequest,
  type ContactFormState,
} from "@/lib/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-sage bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/60";

export function PartnerForm() {
  const t = useTranslations("PartnerPage.form");
  const [state, formAction, pending] = useActionState(
    submitPartnerRequest,
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
        <label htmlFor="organization" className="mb-1.5 block text-sm font-medium">
          {t("organization")}
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          required
          autoComplete="organization"
          className={inputClass}
        />
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
        className="rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
