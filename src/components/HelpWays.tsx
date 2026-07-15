"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShareActions } from "./ShareActions";

type Layout = "twocol" | "strip";

/** Priority action — the only filled card, with the gold CTA. */
function DonateCard({ wide }: { wide: boolean }) {
  const t = useTranslations("HowToHelpPage.cards.donate");
  return (
    <section
      className={`rounded-xl bg-sage-soft p-6 sm:p-7 ${
        wide ? "sm:flex sm:items-center sm:justify-between sm:gap-8" : ""
      }`}
    >
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          {t("body")}
        </p>
      </div>
      <div className={wide ? "mt-5 sm:mt-0 sm:shrink-0" : "mt-6"}>
        <Link
          href="/donate"
          className="btn-press tap-target inline-block rounded-full px-6 py-3 font-medium text-gold-ink"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}

/** Secondary card whose CTA links to its dedicated form page. */
function LinkCard({
  nsKey,
  href,
}: {
  nsKey: "volunteer" | "partnership";
  href: "/volunteer" | "/partner";
}) {
  const t = useTranslations("HowToHelpPage.cards");
  return (
    <section className="flex h-full flex-col rounded-xl border border-sage p-5 sm:p-6">
      <h2 className="font-display text-lg font-medium text-ink">
        {t(`${nsKey}.title`)}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t(`${nsKey}.body`)}
      </p>
      <div className="mt-auto pt-4">
        <Link
          href={href}
          className="btn-outline-press tap-target inline-block rounded-full border border-pine px-5 py-2.5 text-sm font-medium text-pine transition-colors hover:bg-sage-soft"
        >
          {t(`${nsKey}.cta`)}
        </Link>
      </div>
    </section>
  );
}

function ShareCard({ shareUrl }: { shareUrl: string }) {
  const t = useTranslations("HowToHelpPage.cards.share");
  return (
    <section className="flex h-full flex-col rounded-xl border border-sage p-5 sm:p-6">
      <h2 className="font-display text-lg font-medium text-ink">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t("body")}
      </p>
      <div className="mt-auto">
        <ShareActions url={shareUrl} text={t("shareText")} />
      </div>
    </section>
  );
}

/** Strip item — the editorial variant: no box, a hairline like the
 *  how-we-work steps, text-link CTA. */
function StripItem({
  nsKey,
  href,
}: {
  nsKey: "volunteer" | "partnership";
  href: "/volunteer" | "/partner";
}) {
  const t = useTranslations("HowToHelpPage.cards");
  return (
    <div className="border-l border-sage pl-5">
      <h2 className="font-display text-lg font-medium text-ink">
        {t(`${nsKey}.title`)}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t(`${nsKey}.body`)}
      </p>
      <Link
        href={href}
        className="mt-4 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        {t(`${nsKey}.cta`)} →
      </Link>
    </div>
  );
}

function StripShare({ shareUrl }: { shareUrl: string }) {
  const t = useTranslations("HowToHelpPage.cards.share");
  return (
    <div className="border-l border-sage pl-5">
      <h2 className="font-display text-lg font-medium text-ink">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t("body")}
      </p>
      <ShareActions url={shareUrl} text={t("shareText")} />
    </div>
  );
}

/** The ways to help.
 *  strip (default): donate banner, then the 3 secondary actions as a lighter,
 *  editorial hairline strip (how-we-work idiom) instead of boxes.
 *  twocol: donate large top-left with the team photo filling the space below
 *  it, and the 3 cards stacked in a narrower right column. */
export function HelpWaysView({
  layout,
  shareUrl,
}: {
  layout: Layout;
  shareUrl: string;
}) {
  const t = useTranslations("HowToHelpPage");

  if (layout === "twocol") {
    return (
      <div className="reveal mt-12 grid items-start gap-5 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <DonateCard wide={false} />
          <figure>
            <Image
              src="/photos/samu-flag.jpg"
              alt={t("photoAlt")}
              width={1050}
              height={700}
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="aspect-[3/2] w-full rounded-xl object-cover"
            />
          </figure>
        </div>
        <div className="space-y-5 lg:col-span-2">
          <LinkCard nsKey="volunteer" href="/volunteer" />
          <LinkCard nsKey="partnership" href="/partner" />
          <ShareCard shareUrl={shareUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="reveal mt-12">
      <DonateCard wide />
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <StripItem nsKey="volunteer" href="/volunteer" />
        <StripItem nsKey="partnership" href="/partner" />
        <StripShare shareUrl={shareUrl} />
      </div>
    </div>
  );
}

/** Temporary layout experiment: reads ?help_layout client-side (Suspense)
 *  so the page stays static. Default is strip. */
export function HelpWays({ shareUrl }: { shareUrl: string }) {
  const layout: Layout =
    useSearchParams().get("help_layout") === "twocol" ? "twocol" : "strip";
  return <HelpWaysView layout={layout} shareUrl={shareUrl} />;
}
