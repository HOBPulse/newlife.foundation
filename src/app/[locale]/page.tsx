import { existsSync } from "node:fs";
import { join } from "node:path";
import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FactsRibbon } from "@/components/FactsRibbon";
import { Faq } from "@/components/Faq";
import { HeroPhoto } from "@/components/HeroPhoto";
import { HeroPhotoView } from "@/components/HeroPhotoView";
import { RoutesMapV2 } from "@/components/RoutesMapV2";
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

// Organization structured data (schema.org NGO). Owner-provided values only —
// no contact/registration fields (see task + CLAUDE.md: never invent).
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "New Life Foundation",
  legalName: "Благодійний фонд «НОВЕ ЖИТТЯ!»",
  url: "https://newlife.foundation",
  logo: "https://newlife.foundation/brand/logo.png",
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  // Step titles come from the How We Work page so the teaser never drifts.
  const tSteps = await getTranslations("HowWeWorkPage.steps");
  // Locked full-bleed hero photo. Build-time existence check — a neutral
  // placeholder renders if the file is missing (rebuild after adding it).
  const heroPhotoAvailable = existsSync(
    join(process.cwd(), "public", "photos", "hero-transport.jpg"),
  );

  return (
    <div className="home-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />
      {/* Hero — typographic thesis; no photography by design.
          Static band: base paper (transparent over .home-shell) */}
      <section className="hero-section relative isolate mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        {/* Headline — PT Serif at 400 (see the heading rules in globals.css,
            which set the family + weight on .hero-headline) */}
        {/* Two-sentence headline: break after the first sentence so each
            "Ми шукаємо…" clause starts its own line (still wraps responsively). */}
        <h1 className="hero-headline max-w-4xl text-balance font-display text-5xl font-light leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
          {t("hero.title")
            .split(". ")
            .map((sentence, i, arr) => (
              <span key={i}>
                {i < arr.length - 1 ? `${sentence}.` : sentence}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </h1>
        <p className="hero-subline mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          {t("hero.lead")}
        </p>
        {/* Locked full-bleed hero photo: covers the hero with the text
            overlaid on the left (desktop); a block on top with text below
            (mobile). Scrim + framing fixed in globals.css; &sky=1..3 (default
            2) is a temporary dev control for vertical position. */}
        <Suspense
          fallback={
            <HeroPhotoView sky={2} photoAvailable={heroPhotoAvailable} />
          }
        >
          <HeroPhoto photoAvailable={heroPhotoAvailable} />
        </Suspense>
        <div className="hero-ctas mt-10 flex flex-wrap gap-3">
          <Link
            href="/donate"
            className="rounded-full bg-gold px-6 py-3 font-medium text-gold-ink transition-colors hover:bg-gold/90"
          >
            {t("hero.ctaDonate")}
          </Link>
          <Link
            href="/contact"
            className="hero-cta-secondary rounded-full border border-pine px-6 py-3 font-medium text-pine transition-colors hover:bg-sage-soft"
          >
            {t("hero.ctaHelp")}
          </Link>
        </div>
      </section>

      {/* Process preview — numbered because the content is a real sequence.
          Static band: --surface-tint, full width */}
      <section className="bg-surface-tint">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <p className="reveal text-xs font-medium uppercase tracking-widest text-pine">
            {t("process.eyebrow")}
          </p>
          <h2 className="reveal mt-2 font-display text-3xl font-medium tracking-tight text-ink">
            {t("process.title")}
          </h2>
          <p className="reveal mt-3 max-w-xl text-ink-soft">
            {t("process.lead")}
          </p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((n, i) => (
              <li
                key={n}
                className="reveal-card rounded-xl border border-sage p-5"
                style={{ "--rc": i } as CSSProperties}
              >
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
        </div>
      </section>

      {/* Stories preview — static band: base paper (transparent) */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="reveal text-xs font-medium uppercase tracking-widest text-pine">
          {t("stories.eyebrow")}
        </p>
        <h2 className="reveal mt-2 font-display text-3xl font-medium tracking-tight text-ink">
          {t("stories.title")}
        </h2>
        <p className="reveal mt-3 max-w-xl text-ink-soft">{t("stories.lead")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORY_SLUGS.map((slug, i) => (
            <StoryCard key={slug} slug={slug} index={i} />
          ))}
        </div>
        <Link
          href="/stories"
          className="mt-8 inline-block font-medium text-pine transition-colors hover:text-pine-deep"
        >
          {t("stories.all")} →
        </Link>
      </section>

      {/* Facts ribbon — figures derived from the map data at build time */}
      <FactsRibbon />

      {/* Geography — the route line becomes real journeys.
          Static band: --surface-tint, full width */}
      <section className="bg-surface-tint">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <p className="reveal text-xs font-medium uppercase tracking-widest text-pine">
            {t("map.eyebrow")}
          </p>
          <h2 className="reveal mt-2 font-display text-3xl font-medium tracking-tight text-ink">
            {t("map.title")}
          </h2>
          <p className="reveal mt-3 max-w-xl text-lg text-ink-soft">
            {t("map.lead")}
          </p>
          <div className="mt-10">
            <RoutesMapV2 />
          </div>
        </div>
      </section>

      {/* FAQ skeleton — behind showFaq (default off): ships nothing yet */}
      <Faq />

      {/* Donate band — amber. Gold CTA (donate = gold, like the header),
          with a dark pine border so the gold reads against the warm bg. */}
      <section className="bg-[#9a5b12]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
          <h2 className="font-display text-3xl font-medium tracking-tight text-paper">
            {t("donate.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/80">
            {t("donate.lead")}
          </p>
          <Link
            href="/donate"
            className="donate-cta mt-8 inline-flex items-center gap-2 rounded-full border-2 border-pine-deep bg-gold px-8 py-3 font-medium text-gold-ink"
          >
            <svg
              className="donate-heart h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {t("donate.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
