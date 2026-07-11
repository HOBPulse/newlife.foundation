import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/* About layout preview — ?about=edge (edge-bleed zigzag, owner's idea).
   Alternating rows: the photo bleeds to the viewport edge on one side, the
   heading+paragraph sit in a readable column on the other; rows alternate
   photo-left / photo-right. Landscape ~1.28:1 crop (MSF 666×520) as in the
   zigzag variant. Copy verbatim from AboutPage; pair headings reused. Layout
   W and the other variants are untouched. */

const PROSE = "text-lg leading-relaxed text-ink-soft";
const HEADING = "font-display text-2xl font-medium tracking-tight text-ink";
const H1_CLEAR = "scroll-mt-20";
// Photo bleeds to the true viewport edge (matches the W full-bleed pattern).
const BLEED = "relative left-1/2 w-screen -translate-x-1/2";
const PHOTO = "aspect-[666/520] w-full object-cover";
// Text half: comfortable padding, capped reading width pulled toward center.
const TEXT_CELL = "flex items-center px-4 py-10 sm:px-6 md:py-14";

export async function AboutEdge({ locale }: { locale: Locale }) {
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
      {/* Intro — full-width reading column above the rows */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className={`font-display text-4xl font-medium tracking-tight text-ink ${H1_CLEAR}`}>
          {t("title")}
        </h1>
        <p className={`mt-8 ${PROSE}`}>{t("p1")}</p>
      </div>

      <div className="mt-12 space-y-8 md:mt-16 md:space-y-12">
        {/* Row 1 — photo left (bleeds left), Olesya (p3) */}
        <div className={BLEED}>
          <div className="grid items-center md:grid-cols-2">
            <figure className="md:order-1">
              <Image
                src="/photos/emergency-room.jpg"
                alt={t("photos.emergencyRoom")}
                width={666}
                height={520}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={PHOTO}
              />
            </figure>
            <div className={`${TEXT_CELL} md:order-2 md:pl-10 md:pr-6 lg:pl-16`}>
              <div className="max-w-xl">
                <h3 className={HEADING}>{t("pairHeadings.experience")}</h3>
                <p className={`mt-4 ${PROSE}`}>{t("p3")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 — photo right (bleeds right), "Кожен випадок" (p4) */}
        <div className={BLEED}>
          <div className="grid items-center md:grid-cols-2">
            <figure className="md:order-2">
              <Image
                src="/photos/clinic-abroad.jpg"
                alt=""
                width={666}
                height={520}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={PHOTO}
              />
            </figure>
            <div className={`${TEXT_CELL} md:order-1 md:pr-10 md:pl-6 lg:pr-16`}>
              <div className="max-w-xl md:ml-auto">
                <h3 className={HEADING}>{t("pairHeadings.start")}</h3>
                <p className={`mt-4 ${PROSE}`}>{t("p4")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3 — photo left (bleeds left), founding (p2) + story card */}
        <div className={BLEED}>
          <div className="grid items-center md:grid-cols-2">
            <figure className="relative md:order-1">
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
            <div className={`${TEXT_CELL} md:order-2 md:pl-10 md:pr-6 lg:pl-16`}>
              <div className="max-w-xl">
                <h3 className={HEADING}>{t("pairHeadings.team")}</h3>
                <p className={`mt-4 ${PROSE}`}>{t("p2")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing line — full-width reading column below the rows */}
      <div className="mx-auto mt-12 max-w-2xl px-4 sm:px-6 md:mt-16">
        <p className={`${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
