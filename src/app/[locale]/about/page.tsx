import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

// Family-photo card text for the ?layout=w|z comparison (owner-provided).
// Throwaway — delete with the AboutBody switch once a layout is chosen.
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
    // Reuse the story's existing text for this image (no invented alt).
    familyAlt: tStories("items.story-1.title"),
    caption: PREVIEW[locale].caption,
    readStory: PREVIEW[locale].readStory,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Decorative NL seal near the intro — aria-hidden, no animation. */}
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
      </div>

      {/* Photo layout comparison: ?layout=w (wide full-bleed, default) vs
          ?layout=z (staggered). Suspense fallback renders the default so
          /about stays static and shows it before hydration. */}
      <Suspense fallback={<AboutBodyView layout="w" {...bodyData} />}>
        <AboutBody {...bodyData} />
      </Suspense>
    </div>
  );
}
