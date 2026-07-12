import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "ContactPage", "/contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactPage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      {/* Two-column: form left (~60%), requisites right sidebar (~40%) on
          lg+; single column below lg with requisites FIRST, form below. */}
      <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start">
        {/* Form — left on desktop, second on mobile */}
        <div className="order-2 lg:order-1 lg:w-3/5">
          <ContactForm />
        </div>

        {/* Requisites — right sidebar panel on desktop, first on mobile */}
        <section className="order-1 rounded-xl border border-sage bg-sage-soft/40 p-6 lg:order-2 lg:w-2/5">
          <h2 className="font-display text-2xl font-medium text-ink">
            {t("requisites.title")}
          </h2>
          <div className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-medium text-ink">
                {t("requisites.emailLabel")}
              </p>
              <a
                href="mailto:support@newlife.foundation"
                className="mt-1 inline-block text-pine underline hover:text-pine-deep"
              >
                support@newlife.foundation
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {t("requisites.phoneLabel")}
              </p>
              <a
                href="tel:+380676384555"
                className="mt-1 inline-block text-pine underline hover:text-pine-deep"
              >
                {t("requisites.phone")}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {t("requisites.detailsLabel")}
              </p>
              <address className="mt-1 not-italic leading-relaxed text-ink-soft">
                {t("requisites.orgName")}
                <br />
                {t("requisites.edrpou")}
                <br />
                {/* Label + value locale-invariant (like the email above) */}
                <span className="tnum">
                  IBAN: UA17 322001 00000 2620 8355 6618 38
                </span>
                <br />
                {t("requisites.addressLabel")}: {t("requisites.address")}
              </address>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
