import Image from "next/image";
import { Link } from "@/i18n/navigation";

/* About-page body: prose paragraphs with photos. `default` is the shipped
 * layout; `a` / `b` are dev-only preview variants behind ?layout (see
 * AboutBody). Throwaway — remove with the switch once a variant is chosen. */

export type AboutLayout = "default" | "a" | "b";

export type AboutBodyData = {
  paragraphs: string[]; // p1..p5
  emergencyRoomAlt: string;
  clinicAbroadAlt: string;
  familyAlt: string;
  caption: string;
  readStory: string;
};

const FAMILY_SRC = "/stories/svyats.jpg";
const ER_SRC = "/photos/emergency-room.jpg";
const CLINIC_SRC = "/photos/clinic-abroad.jpg";

// Center a block wider than the max-w-2xl text column (capped per use).
const BREAKOUT = "relative left-1/2 w-[92vw] -translate-x-1/2";
const PROSE = "text-lg leading-relaxed text-ink-soft";

export function AboutBodyView({
  layout,
  paragraphs,
  emergencyRoomAlt,
  clinicAbroadAlt,
  familyAlt,
  caption,
  readStory,
}: { layout: AboutLayout } & AboutBodyData) {
  const [p1, p2, p3, p4, p5] = paragraphs;

  if (layout === "a" || layout === "b") {
    const family =
      layout === "a" ? (
        <figure className={`mt-8 ${BREAKOUT} max-w-3xl`}>
          <Image
            src={FAMILY_SRC}
            alt={familyAlt}
            width={1280}
            height={960}
            sizes="(max-width: 768px) 92vw, 48rem"
            className="h-auto w-full rounded-xl"
          />
          <figcaption className="mt-2 text-center text-sm text-ink-soft">
            {caption}
          </figcaption>
        </figure>
      ) : (
        <figure className={`mt-8 ${BREAKOUT} max-w-4xl`}>
          <div className="relative">
            <Image
              src={FAMILY_SRC}
              alt={familyAlt}
              width={1280}
              height={960}
              sizes="(max-width: 768px) 92vw, 56rem"
              className="h-auto w-full rounded-xl"
            />
            {/* Desktop: white overlay card in a corner */}
            <div className="absolute bottom-4 left-4 hidden max-w-xs rounded-lg bg-white p-4 shadow-lg sm:block">
              <p className="text-sm text-ink">{caption}</p>
              <Link
                href="/stories/story-1"
                className="mt-2 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
              >
                {readStory}
              </Link>
            </div>
          </div>
          {/* Mobile: card stacks below the photo */}
          <div className="mt-3 rounded-lg bg-white p-4 shadow sm:hidden">
            <p className="text-sm text-ink">{caption}</p>
            <Link
              href="/stories/story-1"
              className="mt-2 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
            >
              {readStory}
            </Link>
          </div>
        </figure>
      );

    return (
      <>
        <p className={`mt-8 ${PROSE}`}>{p1}</p>
        <p className={`mt-6 ${PROSE}`}>{p2}</p>
        {family}
        <p className={`mt-8 ${PROSE}`}>{p3}</p>
        <p className={`mt-6 ${PROSE}`}>{p4}</p>
        {/* ER photo — full-content-width breakout, natural aspect */}
        <figure className={`mt-8 ${BREAKOUT} max-w-4xl`}>
          <Image
            src={ER_SRC}
            alt={emergencyRoomAlt}
            width={1600}
            height={655}
            sizes="(max-width: 768px) 92vw, 56rem"
            className="h-auto w-full rounded-xl"
          />
        </figure>
        <p className={`mt-8 ${PROSE}`}>{p5}</p>
      </>
    );
  }

  // default — the shipped layout (two-photo grid after the intro)
  return (
    <>
      <p className={`mt-8 ${PROSE}`}>{p1}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-sage">
          <Image
            src={ER_SRC}
            alt={emergencyRoomAlt}
            fill
            sizes="(max-width: 640px) 100vw, 336px"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-sage">
          <Image
            src={CLINIC_SRC}
            alt={clinicAbroadAlt}
            fill
            sizes="(max-width: 640px) 100vw, 336px"
            className="object-cover"
          />
        </div>
      </div>
      <div className={`mt-8 space-y-6 ${PROSE}`}>
        <p>{p2}</p>
        <p>{p3}</p>
        <p>{p4}</p>
        <p>{p5}</p>
      </div>
    </>
  );
}
