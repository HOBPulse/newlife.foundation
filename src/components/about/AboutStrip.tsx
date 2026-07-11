import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/* About layout preview — ?about=strip (charity:water pattern).
   Label → big headline → horizontal strip of the 3 photos at content width →
   all body text continuous (no photo interruptions). Copy verbatim from
   AboutPage; label reuses the approved nav string. Default layout W stays. */

const PROSE = "text-lg leading-relaxed text-ink-soft";

export async function AboutStrip({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tStories = await getTranslations("StoriesPage");
  const tCommon = await getTranslations("Common");
  const familyAlt = tStories("items.story-1.title");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      {/* Label → big headline */}
      <p className="text-xs font-medium uppercase tracking-widest text-pine">
        {tCommon("nav.about")}
      </p>
      <h1 className="mt-3 max-w-3xl scroll-mt-20 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
        {t("title")}
      </h1>

      {/* Photo strip — equal-height row. Mobile: snap-swipe row (each photo
          stays large, text is a short scroll away). Desktop: 3-up grid. */}
      <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
        <figure className="w-[80%] shrink-0 snap-center sm:w-auto">
          <Image
            src="/photos/emergency-room.jpg"
            alt={t("photos.emergencyRoom")}
            width={1600}
            height={655}
            sizes="(min-width: 640px) 20rem, 80vw"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </figure>
        <figure className="w-[80%] shrink-0 snap-center sm:w-auto">
          <Image
            src="/photos/clinic-abroad.jpg"
            alt=""
            width={1600}
            height={1200}
            sizes="(min-width: 640px) 20rem, 80vw"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </figure>
        <figure className="relative w-[80%] shrink-0 snap-center sm:w-auto">
          <Image
            src="/stories/svyats.jpg"
            alt={familyAlt}
            width={1280}
            height={960}
            sizes="(min-width: 640px) 20rem, 80vw"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <figcaption className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 p-3 shadow-lg">
            <p className="text-xs text-ink">{t("photos.familyCaption")}</p>
            <Link
              href="/stories/story-1"
              className="mt-1 inline-block text-xs font-medium text-pine transition-colors hover:text-pine-deep"
            >
              {`${tStories("readMore")} →`}
            </Link>
          </figcaption>
        </figure>
      </div>

      {/* All body text continuous — no photo interruptions */}
      <div className="mx-auto mt-12 max-w-2xl">
        <p className={PROSE}>{t("p1")}</p>
        <p className={`mt-6 ${PROSE}`}>{t("p2")}</p>
        <p className={`mt-6 ${PROSE}`}>{t("p3")}</p>
        <p className={`mt-6 ${PROSE}`}>{t("p4")}</p>
        <p className={`mt-6 ${PROSE} font-medium text-ink`}>{t("p5")}</p>
      </div>
    </div>
  );
}
