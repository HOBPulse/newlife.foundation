import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RoutesMap } from "@/components/RoutesMap";
import { StoryCard } from "@/components/StoryCard";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { STORY_SLUGS } from "@/lib/stories";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "HomePage", "/");
}

const PROCESS_STEPS = [1, 2, 3, 4] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  // Step titles come from the How We Work page so the teaser never drifts.
  const tSteps = await getTranslations("HowWeWorkPage.steps");

  return (
    <>
      {/* Hero — typographic thesis; no photography by design */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
        <h1 className="max-w-3xl font-display text-4xl font-light leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          {t("hero.lead")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/donate"
            className="rounded-full bg-apricot px-6 py-3 font-medium text-ink transition-colors hover:bg-apricot/85"
          >
            {t("hero.ctaDonate")}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-pine px-6 py-3 font-medium text-pine transition-colors hover:bg-sage-soft"
          >
            {t("hero.ctaHelp")}
          </Link>
        </div>
      </section>

      {/* Process preview — numbered because the content is a real sequence */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-pine">
          {t("process.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
          {t("process.title")}
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">{t("process.lead")}</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((n) => (
            <li key={n} className="reveal rounded-xl border border-sage p-5">
              <span className="tnum font-display text-2xl font-medium text-pine">
                {String(n).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm font-medium text-ink">
                {tSteps(`${n}.title`)}
              </p>
            </li>
          ))}
        </ol>
        <Link
          href="/how-we-work"
          className="mt-8 inline-block font-medium text-pine transition-colors hover:text-pine-deep"
        >
          {t("process.more")} →
        </Link>
      </section>

      {/* Stories preview */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-pine">
          {t("stories.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
          {t("stories.title")}
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">{t("stories.lead")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORY_SLUGS.map((slug) => (
            <StoryCard key={slug} slug={slug} />
          ))}
        </div>
        <Link
          href="/stories"
          className="mt-8 inline-block font-medium text-pine transition-colors hover:text-pine-deep"
        >
          {t("stories.all")} →
        </Link>
      </section>

      {/* Geography — the route line becomes real journeys */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-widest text-pine">
          {t("map.eyebrow")}
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
          {t("map.title")}
        </h2>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">{t("map.lead")}</p>
        <div className="mt-10">
          <RoutesMap />
        </div>
      </section>

      {/* Donate band */}
      <section className="bg-pine">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
          <h2 className="font-display text-3xl font-medium tracking-tight text-white">
            {t("donate.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sage">{t("donate.lead")}</p>
          <Link
            href="/donate"
            className="mt-8 inline-block rounded-full bg-apricot px-8 py-3 font-medium text-ink transition-colors hover:bg-apricot/85"
          >
            {t("donate.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
