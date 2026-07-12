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

      <div className="mt-12">
        <ContactForm />
      </div>

      {/* Contact info + foundation requisites — calmer block below the form */}
      <section className="mt-16 max-w-2xl border-t border-sage pt-10">
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
              {t("requisites.detailsLabel")}
            </p>
            <address className="mt-1 not-italic leading-relaxed text-ink-soft">
              {t("requisites.orgName")}
              <br />
              {t("requisites.edrpou")}
              <br />
              {t("requisites.addressLabel")}: {t("requisites.address")}
            </address>
          </div>
        </div>
      </section>
    </div>
  );
}
