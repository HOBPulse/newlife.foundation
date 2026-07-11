import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/* About layout preview — ?about=zigzag (MSF / Direct Relief pattern, soft).
   Alternating text/photo pairs at content width, generous whitespace, site
   tokens (cream/pine/gold, PT Serif headings). Copy is verbatim from
   AboutPage — only the block ORDER is arranged into the owner's meaning-pairs
   (task 2026-07-11); wording is untouched. Default layout W is unchanged. */

const PROSE = "text-lg leading-relaxed text-ink-soft";
// Photo frame shared by every pair — equal aspect keeps the zigzag calm.
const FRAME = "aspect-[4/3] w-full rounded-xl object-cover";

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
          right. Mobile: photo above text (figure first in DOM). */}
      <div className="mt-16 grid items-center gap-8 md:mt-24 md:grid-cols-2 md:gap-12">
        <figure className="md:order-2">
          <Image
            src="/photos/emergency-room.jpg"
            alt={t("photos.emergencyRoom")}
            width={1600}
            height={655}
            sizes="(min-width: 768px) 34rem, 100vw"
            className={FRAME}
          />
        </figure>
        <p className={`${PROSE} md:order-1`}>{t("p3")}</p>
      </div>

      {/* Pair 2 — "Кожен випадок" (p4) + clinic abroad. Mirrored: photo left,
          text right on desktop; photo above text on mobile. */}
      <div className="mt-16 grid items-center gap-8 md:mt-24 md:grid-cols-2 md:gap-12">
        <figure className="md:order-1">
          <Image
            src="/photos/clinic-abroad.jpg"
            alt=""
            width={1600}
            height={1200}
            sizes="(min-width: 768px) 34rem, 100vw"
            className={FRAME}
          />
        </figure>
        <p className={`${PROSE} md:order-2`}>{t("p4")}</p>
      </div>

      {/* Pair 3 — founding 2019/2011 (p2) + family photo with the story
          overlay card. Desktop: text left, photo right. */}
      <div className="mt-16 grid items-center gap-8 md:mt-24 md:grid-cols-2 md:gap-12">
        <figure className="relative md:order-2">
          <Image
            src="/stories/svyats.jpg"
            alt={familyAlt}
            width={1280}
            height={960}
            sizes="(min-width: 768px) 34rem, 100vw"
            className={FRAME}
          />
          {storyCard}
        </figure>
        <p className={`${PROSE} md:order-1`}>{t("p2")}</p>
      </div>

      {/* Closing line (p5) */}
      <div className="mx-auto mt-16 max-w-2xl md:mt-24">
        <p className={`${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
