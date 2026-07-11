import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/* About layout preview — ?about=zigzag (MSF "media beside text" pattern).
   Reference: doctorswithoutborders.org/who-we-are. Landscape photos (~1.28:1,
   MSF's 666×520) beside a small PT-Serif heading + the approved paragraph,
   photo ~57% of the row, pairs in a tight vertical ladder with the text
   vertically centered. Copy is verbatim from AboutPage; only the block ORDER
   is arranged into the owner's meaning-pairs and the pair headings are new
   (task 2026-07-11). Default layout W is unchanged. */

const PROSE = "text-lg leading-relaxed text-ink-soft";
const HEADING = "font-display text-2xl font-medium tracking-tight text-ink";
// Landscape frame — MSF 666×520 proportion, not 4:3.
const FRAME = "aspect-[666/520] w-full rounded-xl object-cover";
// Photo column wider than text (~57% / ~43%); mirror by swapping the template.
const ROW = "mt-12 grid items-center gap-8 md:mt-14 md:gap-12";
const TEXT_LEFT = `${ROW} md:grid-cols-[1fr_1.35fr]`;
const PHOTO_LEFT = `${ROW} md:grid-cols-[1.35fr_1fr]`;

export async function AboutZigzag({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tStories = await getTranslations("StoriesPage");
  const familyAlt = tStories("items.story-1.title");

  const storyCard = (
    <figcaption className="absolute inset-x-4 bottom-4 rounded-lg bg-white/95 p-4 shadow-lg sm:inset-x-auto sm:left-4 sm:max-w-xs">
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
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      {/* Intro — the thesis, at reading width */}
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className={`mt-8 ${PROSE}`}>{t("p1")}</p>
      </div>

      {/* Pair 1 — Olesya (p3) + emergency room. Desktop: text left, photo
          right. Mobile: photo above heading+text (figure first in DOM). */}
      <div className={TEXT_LEFT}>
        <figure className="md:order-2">
          <Image
            src="/photos/emergency-room.jpg"
            alt={t("photos.emergencyRoom")}
            width={666}
            height={520}
            sizes="(min-width: 768px) 32rem, 100vw"
            className={FRAME}
          />
        </figure>
        <div className="md:order-1">
          <h3 className={HEADING}>{t("pairHeadings.experience")}</h3>
          <p className={`mt-4 ${PROSE}`}>{t("p3")}</p>
        </div>
      </div>

      {/* Pair 2 — "Кожен випадок" (p4) + clinic abroad. Mirrored: photo left,
          text right on desktop; photo above heading+text on mobile. */}
      <div className={PHOTO_LEFT}>
        <figure className="md:order-1">
          <Image
            src="/photos/clinic-abroad.jpg"
            alt=""
            width={666}
            height={520}
            sizes="(min-width: 768px) 32rem, 100vw"
            className={FRAME}
          />
        </figure>
        <div className="md:order-2">
          <h3 className={HEADING}>{t("pairHeadings.start")}</h3>
          <p className={`mt-4 ${PROSE}`}>{t("p4")}</p>
        </div>
      </div>

      {/* Pair 3 — founding 2019/2011 (p2) + family photo with the story
          overlay card. Desktop: text left, photo right. */}
      <div className={TEXT_LEFT}>
        <figure className="relative md:order-2">
          <Image
            src="/stories/svyats.jpg"
            alt={familyAlt}
            width={666}
            height={520}
            sizes="(min-width: 768px) 32rem, 100vw"
            className={FRAME}
          />
          {storyCard}
        </figure>
        <div className="md:order-1">
          <h3 className={HEADING}>{t("pairHeadings.team")}</h3>
          <p className={`mt-4 ${PROSE}`}>{t("p2")}</p>
        </div>
      </div>

      {/* Closing line (p5) */}
      <div className="mx-auto mt-12 max-w-2xl md:mt-16">
        <p className={`${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
