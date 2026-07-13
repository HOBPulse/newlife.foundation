"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitVolunteerRequest, type ContactFormState } from "@/lib/contact";

const initialState: ContactFormState = { status: "idle" };

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

/** Volunteer form (/volunteer) — server action → Telegram + email relay. */
export function VolunteerForm() {
  const t = useTranslations("VolunteerPage.form");
  const [state, formAction, pending] = useActionState(
    submitVolunteerRequest,
    initialState,
  );
  // «Інше» makes the message field required (the role alone says nothing).
  const [isOther, setIsOther] = useState(false);

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
        className="rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep disabled:opacity-60"
      >
        {pending ? t("sending") : t("submit")}
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
