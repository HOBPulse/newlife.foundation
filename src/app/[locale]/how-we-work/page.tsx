import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "HowWeWorkPage", "/how-we-work");
}

const PROCESS_STEPS = [1, 2, 3, 4] as const;

/* Single-photo steps (step 3 renders its own two-photo accent inline).
   Owner mapping: 01 консультація, 02 пошук, 04 супровід. */
const STEP_PHOTOS: Record<
  1 | 2 | 4,
  { src: string; altKey: "photos.ambuPark" | "photos.lesyaBack" | "photos.clinicAbroad"; width: number; height: number }
> = {
  1: { src: "/photos/ambu-park.jpg", altKey: "photos.ambuPark", width: 1440, height: 1080 },
  2: { src: "/photos/lesya-back.jpg", altKey: "photos.lesyaBack", width: 1440, height: 1080 },
  4: { src: "/photos/clinic-abroad.jpg", altKey: "photos.clinicAbroad", width: 1600, height: 1200 },
};

export default async function HowWeWorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HowWeWorkPage");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl font-medium tracking-tight text-ink">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        {t("lead")}
      </p>

      {/* One photo block per step (copy untouched). Desktop: text left, photo
          right in a fixed column; step 03 (transport — the core) carries a
          slightly larger two-photo overlap accent. Mobile: photo stacks under
          its step text. Quieter than the About page: same tokens, no bleed. */}
      <ol className="mt-14 max-w-4xl space-y-10 md:space-y-12">
        {PROCESS_STEPS.map((n) => (
          <li
            key={n}
            className={`reveal grid items-center gap-6 ${
              n === 3
                ? "md:grid-cols-[minmax(0,1fr)_23rem]"
                : "md:grid-cols-[minmax(0,1fr)_20rem]"
            }`}
          >
            <div className="flex gap-5">
              <span className="tnum shrink-0 font-display text-3xl font-medium text-pine">
                {String(n).padStart(2, "0")}
              </span>
              <div className="border-l border-sage pl-5">
                <h2 className="font-medium text-ink">
                  {t(`steps.${n}.title`)}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {t(`steps.${n}.body`)}
                </p>
              </div>
            </div>

            {n === 3 ? (
              /* Transport duo — overlap style like the About collage: night
                 convoy as the base, the UA-plated ambulance as a tilted card
                 overhanging into the figure's bottom padding. */
              <figure className="relative pb-6">
                <Image
                  src="/photos/convoy-night.jpg"
                  alt={t("photos.convoyNight")}
                  width={960}
                  height={1048}
                  sizes="(min-width: 768px) 23rem, 100vw"
                  className="aspect-[4/3] w-full rounded-xl object-cover object-[center_60%]"
                />
                <Image
                  src="/photos/ua-plates-er.jpg"
                  alt={t("photos.uaPlatesEr")}
                  width={600}
                  height={450}
                  sizes="(min-width: 768px) 12rem, 50vw"
                  className="absolute bottom-0 left-[4%] w-[52%] rotate-[-1.5deg] rounded-lg object-cover shadow-lg"
                />
              </figure>
            ) : (
              <figure>
                <Image
                  src={STEP_PHOTOS[n].src}
                  alt={t(STEP_PHOTOS[n].altKey)}
                  width={STEP_PHOTOS[n].width}
                  height={STEP_PHOTOS[n].height}
                  sizes="(min-width: 768px) 20rem, 100vw"
                  className="aspect-[3/2] w-full rounded-xl object-cover"
                />
              </figure>
            )}
          </li>
        ))}
      </ol>

      <section className="reveal mt-16 rounded-xl bg-sage-soft p-6 sm:p-8">
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("cta.title")}
        </h2>
        <p className="mt-2 max-w-xl text-ink-soft">{t("cta.body")}</p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-full bg-pine px-6 py-3 font-medium text-white transition-colors hover:bg-pine-deep"
        >
          {t("cta.button")}
        </Link>
      </section>
    </div>
  );
}
