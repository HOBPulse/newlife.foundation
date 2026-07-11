import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { AboutLayoutSwitch } from "@/components/AboutLayoutSwitch";
import { AboutZigzag } from "@/components/about/AboutZigzag";
import { AboutStrip } from "@/components/about/AboutStrip";
import { AboutEdge } from "@/components/about/AboutEdge";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "AboutPage", "/about");
}

const PROSE = "text-lg leading-relaxed text-ink-soft";
// Center a full-bleed band wider than the max-w-2xl reading column.
const FULL_BLEED = "relative left-1/2 w-screen -translate-x-1/2";

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const tStories = await getTranslations("StoriesPage");
  // Family-photo card reuses the story's own title (alt) + "read story" label.
  const familyAlt = tStories("items.story-1.title");
  const caption = t("photos.familyCaption");
  const readStory = `${tStories("readMore")} →`;

  const card = (
    <>
      <p className="text-sm text-ink">{caption}</p>
      <Link
        href="/stories/story-1"
        className="mt-2 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        {readStory}
      </Link>
    </>
  );

  // Shipped layout W — the default. Preview variants (?about=zigzag|strip)
  // are compared behind a flag; W renders for everyone else and as the
  // Suspense fallback so the page stays prerendered.
  const layoutW = (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink scroll-mt-20">
          {t("title")}
        </h1>
        <p className={`mt-8 ${PROSE}`}>{t("p1")}</p>
        <p className={`mt-6 ${PROSE}`}>{t("p2")}</p>
      </div>

      {/* Family photo — full-bleed band + white card (LCP: priority). */}
      <figure className={`mt-10 ${FULL_BLEED}`}>
        <div className="relative">
          <Image
            src="/stories/svyats.jpg"
            alt={familyAlt}
            width={1280}
            height={960}
            priority
            sizes="100vw"
            className="h-[52vh] w-full object-cover sm:h-[60vh]"
          />
          <div className="absolute bottom-6 left-6 hidden max-w-sm rounded-lg bg-white p-4 shadow-lg sm:block">
            {card}
          </div>
        </div>
        <div className="relative mx-4 -mt-6 rounded-lg bg-white p-4 shadow-lg sm:hidden">
          {card}
        </div>
      </figure>

      <div className="mx-auto mt-10 max-w-2xl">
        <p className={PROSE}>{t("p3")}</p>
        <p className={`mt-6 ${PROSE}`}>{t("p4")}</p>
      </div>

      {/* Emergency-room photo — second full-bleed band (lazy). */}
      <figure className={`mt-12 ${FULL_BLEED}`}>
        <Image
          src="/photos/emergency-room.jpg"
          alt={t("photos.emergencyRoom")}
          width={1600}
          height={655}
          sizes="100vw"
          className="h-[40vh] w-full object-cover sm:h-[48vh]"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-2xl">
        <p className={PROSE}>{t("p5")}</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={layoutW}>
      <AboutLayoutSwitch
        w={layoutW}
        zigzag={<AboutZigzag locale={locale} />}
        zigzagTight={<AboutZigzag locale={locale} tight />}
        strip={<AboutStrip locale={locale} />}
        edge={<AboutEdge locale={locale} />}
      />
    </Suspense>
  );
}
