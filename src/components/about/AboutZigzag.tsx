import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AboutCollage } from "@/components/about/AboutCollage";

/* The About page (MSF "media beside text" pattern, tight ladder).
   Reference: doctorswithoutborders.org/who-we-are. Owner-approved as the
   /about layout (2026-07-11). Landscape photos (~1.28:1, MSF's 666×520)
   beside a small PT-Serif heading + the approved paragraph; the three pairs
   sit as one close vertical ladder with the text vertically centered.
   Pair 1 is the vertical Lesya portrait (per-pair exception). Copy is
   verbatim from AboutPage; the block ORDER follows the owner's meaning-pairs
   and the pair headings live in AboutPage.pairHeadings. */

const PROSE = "text-lg leading-relaxed text-ink-soft";
const HEADING = "font-display text-2xl font-medium tracking-tight text-ink";
// H1 clears the sticky 57px header when scrolled/anchored to the top.
const H1_CLEAR = "scroll-mt-20";
// Landscape frame — MSF 666×520 proportion (pairs 2 & 3).
const FRAME = "aspect-[666/520] w-full rounded-xl object-cover";
// Pair 1 (lesya-depot) is a tall portrait — per-pair exception: render her
// vertically at (near-)native ratio, capped height, full figure, no dead space.
// Taller than before so she fills the row rather than floating.
const PAIR1_IMG =
  "h-[24rem] w-auto rounded-xl object-cover shadow-sm md:h-[38rem]";
// Photo column ~59% of the row (mirror by swapping the template) — landscape
// photos read large; the wider max-w-6xl frame keeps the text column ≥50ch.
const COLS = { text: "md:grid-cols-[1fr_1.45fr]", photo: "md:grid-cols-[1.45fr_1fr]" };

export async function AboutZigzag({ locale }: { locale: Locale }) {
  setRequestLocale(locale);

  // Tight vertical rhythm so the three pairs read as one close ladder.
  const gapY = "mt-6 md:mt-7";
  // Tight gutter so each pair reads as one unit, not two far-apart things.
  const landGap = "gap-5 md:gap-6";
  const landscape = `${gapY} grid items-center ${landGap}`;
  const textLeft = `${landscape} ${COLS.text}`;
  const photoLeft = `${landscape} ${COLS.photo}`;
  // Pair 1 uses flex (not the fr-grid) so the vertical photo keeps its
  // intrinsic width. Constrained to a narrower centered band and centered so
  // Lesya sits close to the text as one unit rather than floating apart.
  const pair1 = `${gapY} mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-center md:gap-12`;
  const closeMt = "mt-7 md:mt-8";

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
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      {/* Intro — the thesis, at reading width */}
      <div className="mx-auto max-w-2xl">
        <h1 className={`font-display text-4xl font-medium tracking-tight text-ink ${H1_CLEAR}`}>
          {t("title")}
        </h1>
        <p className={`mt-8 ${PROSE}`}>{t("p1")}</p>
      </div>

      {/* Pair 1 — Olesya (p3) + lesya-depot (vertical portrait). Desktop:
          text left, portrait right, full row height. Mobile: portrait on top
          (figure first in DOM), text below. */}
      <div className={pair1}>
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

      {/* Pair 2 — "Кожен випадок" (p4) + Germany collage. Mirrored: collage
          left, text right on desktop; collage above heading+text on mobile. */}
      <div className={photoLeft}>
        <figure className="md:order-1">
          <AboutCollage locale={locale} />
        </figure>
        <div className="md:order-2">
          <h3 className={HEADING}>{t("pairHeadings.start")}</h3>
          <p className={`mt-4 ${PROSE}`}>{t("p4")}</p>
        </div>
      </div>

      {/* Pair 3 — founding 2019/2011 (p2) + family photo with the story
          overlay card. Desktop: text left, photo right. */}
      <div className={textLeft}>
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
      <div className={`mx-auto ${closeMt} max-w-2xl`}>
        <p className={`${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
