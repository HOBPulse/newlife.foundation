import Image from "next/image";
import { Link } from "@/i18n/navigation";

/* About-page body: prose + photos. Two dev-only comparison layouts behind
 * ?layout (see AboutBody): `w` (wide full-bleed, default) and `z` (staggered
 * zigzag). Throwaway — collapse to the chosen layout once picked. */

export type AboutLayout = "w" | "z";

export type AboutBodyData = {
  paragraphs: string[]; // p1..p5
  emergencyRoomAlt: string;
  familyAlt: string;
  caption: string;
  readStory: string;
};

const FAMILY_SRC = "/stories/svyats.jpg";
const ER_SRC = "/photos/emergency-room.jpg";
const PROSE = "text-lg leading-relaxed text-ink-soft";

function Card({
  caption,
  readStory,
  className = "",
}: {
  caption: string;
  readStory: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg bg-white p-4 shadow-lg ${className}`}>
      <p className="text-sm text-ink">{caption}</p>
      <Link
        href="/stories/story-1"
        className="mt-2 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        {readStory}
      </Link>
    </div>
  );
}

export function AboutBodyView({
  layout,
  paragraphs,
  emergencyRoomAlt,
  familyAlt,
  caption,
  readStory,
}: { layout: AboutLayout } & AboutBodyData) {
  const [p1, p2, p3, p4, p5] = paragraphs;

  if (layout === "z") {
    // STAGGERED — blocks alternate side, filling page width; single column on
    // mobile in reading order (text, then its photo).
    return (
      <div className="mt-10">
        {/* text left / family-photo right */}
        <div className="sm:grid sm:grid-cols-2 sm:items-center sm:gap-10">
          <div className={PROSE}>
            <p>{p1}</p>
            <p className="mt-6">{p2}</p>
          </div>
          <figure className="mt-6 sm:mt-0">
            <div className="relative">
              <Image
                src={FAMILY_SRC}
                alt={familyAlt}
                width={1280}
                height={960}
                priority
                sizes="(max-width: 640px) 100vw, 45vw"
                className="h-auto w-full rounded-xl"
              />
              <Card
                caption={caption}
                readStory={readStory}
                className="absolute bottom-4 left-4 hidden max-w-xs sm:block"
              />
            </div>
            <Card
              caption={caption}
              readStory={readStory}
              className="mt-3 sm:hidden"
            />
          </figure>
        </div>

        {/* ER-photo left / text right, offset down */}
        <div className="sm:mt-16 sm:grid sm:grid-cols-2 sm:items-center sm:gap-10">
          <div className={`${PROSE} sm:order-2`}>
            <p>{p3}</p>
            <p className="mt-6">{p4}</p>
            <p className="mt-6">{p5}</p>
          </div>
          <figure className="mt-6 sm:order-1 sm:mt-0">
            <Image
              src={ER_SRC}
              alt={emergencyRoomAlt}
              width={1600}
              height={655}
              sizes="(max-width: 640px) 100vw, 45vw"
              className="h-auto w-full rounded-xl"
            />
          </figure>
        </div>
      </div>
    );
  }

  // WIDE (default) — narrow reading column broken up by full-bleed photo bands.
  const fullBleed = "relative left-1/2 w-screen -translate-x-1/2";
  return (
    <>
      <div className="mx-auto max-w-2xl">
        <p className={PROSE}>{p1}</p>
        <p className={`mt-6 ${PROSE}`}>{p2}</p>
      </div>

      {/* family — full-bleed band + white card */}
      <figure className={`mt-10 ${fullBleed}`}>
        <div className="relative">
          <Image
            src={FAMILY_SRC}
            alt={familyAlt}
            width={1280}
            height={960}
            priority
            sizes="100vw"
            className="h-[52vh] w-full object-cover sm:h-[60vh]"
          />
          <Card
            caption={caption}
            readStory={readStory}
            className="absolute bottom-6 left-6 hidden max-w-sm sm:block"
          />
        </div>
        <Card
          caption={caption}
          readStory={readStory}
          className="relative mx-4 -mt-6 sm:hidden"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-2xl">
        <p className={PROSE}>{p3}</p>
        <p className={`mt-6 ${PROSE}`}>{p4}</p>
      </div>

      {/* ER — second full-bleed band (lazy) */}
      <figure className={`mt-12 ${fullBleed}`}>
        <Image
          src={ER_SRC}
          alt={emergencyRoomAlt}
          width={1600}
          height={655}
          sizes="100vw"
          className="h-[40vh] w-full object-cover sm:h-[48vh]"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-2xl">
        <p className={PROSE}>{p5}</p>
      </div>
    </>
  );
}
