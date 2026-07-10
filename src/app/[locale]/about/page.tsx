import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AboutBody } from "@/components/AboutBody";
import { AboutBodyView } from "@/components/AboutBodyView";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "AboutPage", "/about");
}

// Dev-only preview captions for the ?layout=a|b photo variants (owner-provided
// text). Throwaway — delete with the AboutBody switch once a variant is chosen.
const PREVIEW: Record<Locale, { caption: string; readStory: string }> = {
  uk: {
    caption: "Святослав із родиною дорогою на лікування",
    readStory: "Читати історію →",
  },
  ru: {
    caption: "Святослав с семьёй по дороге на лечение",
    readStory: "Читать историю →",
  },
  en: {
    caption: "Svyatoslav and his family on the way to treatment",
    readStory: "Read the story →",
  },
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tStories = await getTranslations("StoriesPage");

  const bodyData = {
    paragraphs: [t("p1"), t("p2"), t("p3"), t("p4"), t("p5")],
    emergencyRoomAlt: t("photos.emergencyRoom"),
    clinicAbroadAlt: t("photos.clinicAbroad"),
    // Reuse the story's existing text for this image (no invented alt).
    familyAlt: tStories("items.story-1.title"),
    caption: PREVIEW[locale].caption,
    readStory: PREVIEW[locale].readStory,
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      {/* Decorative NL seal near the intro — same mark as the header.
          aria-hidden, no animation. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/nl-seal.svg"
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        className="mb-6 h-16 w-16"
      />
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>

      {/* Photo layout: shipped default, with dev-only ?layout=a|b preview
          variants. Suspense fallback renders the default so /about stays
          static and shows it before hydration. */}
      <Suspense fallback={<AboutBodyView layout="default" {...bodyData} />}>
        <AboutBody {...bodyData} />
      </Suspense>

      {/* Closing CTA — reuses the site's contact route + label, terracotta
          button styling matching the hero donate CTA. */}
      <section className="reveal mt-12 border-t border-sage pt-8">
        <p className="max-w-xl text-lg leading-relaxed text-ink">
          {t("cta.body")}
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-brand-terracotta-deep px-6 py-3 font-medium text-paper transition-colors hover:bg-brand-terracotta-deep/90"
        >
          {t("cta.button")}
        </Link>
      </section>
    </div>
  );
}
