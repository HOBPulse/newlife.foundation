import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AboutCollage } from "@/components/about/AboutCollage";

/* About layout preview — ?about=mix. One page, two techniques:
   pair 1 (vertical Lesya) sits calmly in the content column beside the text
   (tall, near-native 9/16, does NOT bleed); pairs 2 (collage) and 3 (family)
   bleed to the viewport edge on alternating sides, full row height, text in
   the content column opposite. Reuses the same pairs/photos/headings as the
   other variants. Copy verbatim from AboutPage. Other variants untouched. */

const PROSE = "text-lg leading-relaxed text-ink-soft";
const HEADING = "font-display text-2xl font-medium tracking-tight text-ink";
const H1_CLEAR = "scroll-mt-20";
// Bleed rows (pairs 2 & 3) reach the true viewport edge.
const BLEED = "relative left-1/2 w-screen -translate-x-1/2";
const PHOTO = "aspect-[666/520] w-full object-cover";
// Pair 1: tall vertical portrait, capped, in-column (matches enlarged zigzag).
const PAIR1_IMG = "h-[24rem] w-auto rounded-xl object-cover shadow-sm md:h-[38rem]";
const TEXT_CELL = "flex items-center px-4 py-10 sm:px-6 md:py-14";

export async function AboutMix({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tStories = await getTranslations("StoriesPage");
  const familyAlt = tStories("items.story-1.title");

  const storyCard = (
    <figcaption className="absolute inset-x-4 bottom-4 rounded-lg bg-white/95 p-4 shadow-lg sm:inset-x-auto sm:left-6 sm:max-w-xs">
      <p className="text-sm text-ink">{t("photos.familyCaption")}</p>
      <Link
        href="/stories/story-1"
        className="mt-2 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        {`${tStories("readMore")} →`}
      </Link>
    </figcaption>
  );

  return (
    <div className="w-full py-16">
      {/* Intro — full-width reading column */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className={`font-display text-4xl font-medium tracking-tight text-ink ${H1_CLEAR}`}>
          {t("title")}
        </h1>
        <p className={`mt-8 ${PROSE}`}>{t("p1")}</p>
      </div>

      {/* Pair 1 — vertical Lesya, calm in-column placement (no bleed): tall
          portrait beside the text in a centered band. Mobile: portrait on
          top (capped), text below. */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-8 md:mt-16 md:flex-row md:items-center md:justify-center md:gap-12">
          <figure className="mx-auto shrink-0 md:order-2 md:mx-0">
            <Image
              src="/photos/lesya-depot.jpg"
              alt={t("photos.lesyaDepot")}
              width={893}
              height={1600}
              sizes="(min-width: 768px) 18rem, 60vw"
              className={PAIR1_IMG}
            />
          </figure>
          <div className="md:order-1 md:max-w-lg">
            <h3 className={HEADING}>{t("pairHeadings.experience")}</h3>
            <p className={`mt-4 ${PROSE}`}>{t("p3")}</p>
          </div>
        </div>
      </div>

      {/* Pairs 2 & 3 — bleeding rows, alternating sides */}
      <div className="mt-12 space-y-8 md:mt-16 md:space-y-12">
        {/* Pair 2 — collage bleeds LEFT, text right */}
        <div className={BLEED}>
          <div className="grid items-center md:grid-cols-2">
            <figure className="md:order-1">
              <AboutCollage locale={locale} bleed />
            </figure>
            <div className={`${TEXT_CELL} md:order-2 md:pl-10 md:pr-6 lg:pl-16`}>
              <div className="max-w-xl">
                <h3 className={HEADING}>{t("pairHeadings.start")}</h3>
                <p className={`mt-4 ${PROSE}`}>{t("p4")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pair 3 — family bleeds RIGHT, text left; keeps the story card */}
        <div className={BLEED}>
          <div className="grid items-center md:grid-cols-2">
            <figure className="relative md:order-2">
              <Image
                src="/stories/svyats.jpg"
                alt={familyAlt}
                width={666}
                height={520}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={PHOTO}
              />
              {storyCard}
            </figure>
            <div className={`${TEXT_CELL} md:order-1 md:pr-10 md:pl-6 lg:pr-16`}>
              <div className="max-w-xl md:ml-auto">
                <h3 className={HEADING}>{t("pairHeadings.team")}</h3>
                <p className={`mt-4 ${PROSE}`}>{t("p2")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing — full-width reading column */}
      <div className="mx-auto mt-12 max-w-2xl px-4 sm:px-6 md:mt-16">
        <p className={`${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
