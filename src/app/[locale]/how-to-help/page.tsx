import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { PartnershipForm } from "@/components/PartnershipForm";
import { ShareActions } from "@/components/ShareActions";
import { VolunteerForm } from "@/components/VolunteerForm";
import type { Locale } from "@/i18n/routing";
import { pageMetadata, SITE_URL } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "HowToHelpPage", "/how-to-help");
}

const cardClass =
  "reveal flex flex-col rounded-xl border border-sage p-6 sm:p-7";

export default async function HowToHelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HowToHelpPage");
  // Localized site home as the shared URL (uk has no prefix).
  const shareUrl = `${SITE_URL}${getPathname({ locale, href: "/" })}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      {/* Four ways to help. Volunteer/partnership cards anchor-scroll to
          their forms below — the forms stay in the DOM, so everything works
          without JS and stays keyboard-reachable. */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <section className={cardClass}>
          <h2 className="font-display text-xl font-medium text-ink">
            {t("cards.donate.title")}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {t("cards.donate.body")}
          </p>
          <div className="mt-5">
            <Link
              href="/donate"
              className="inline-block rounded-full bg-gold px-6 py-3 font-medium text-gold-ink transition-colors hover:bg-gold/90"
            >
              {t("cards.donate.cta")}
            </Link>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-display text-xl font-medium text-ink">
            {t("cards.volunteer.title")}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {t("cards.volunteer.body")}
          </p>
          <div className="mt-5">
            <a
              href="#volunteer"
              className="inline-block rounded-full border border-pine px-6 py-3 font-medium text-pine transition-colors hover:bg-sage-soft"
            >
              {t("cards.volunteer.cta")}
            </a>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-display text-xl font-medium text-ink">
            {t("cards.partnership.title")}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {t("cards.partnership.body")}
          </p>
          <div className="mt-5">
            <a
              href="#partnership"
              className="inline-block rounded-full border border-pine px-6 py-3 font-medium text-pine transition-colors hover:bg-sage-soft"
            >
              {t("cards.partnership.cta")}
            </a>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-display text-xl font-medium text-ink">
            {t("cards.share.title")}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {t("cards.share.body")}
          </p>
          <ShareActions url={shareUrl} text={t("cards.share.shareText")} />
        </section>
      </div>

      {/* scroll-mt clears the sticky header when anchor-jumping */}
      <section id="volunteer" className="reveal mt-20 scroll-mt-24">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("cards.volunteer.title")}
        </h2>
        <div className="mt-6">
          <VolunteerForm />
        </div>
      </section>

      <section id="partnership" className="reveal mt-16 scroll-mt-24">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("cards.partnership.title")}
        </h2>
        <div className="mt-6">
          <PartnershipForm />
        </div>
      </section>
    </div>
  );
}
