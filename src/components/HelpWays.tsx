"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ShareActions } from "./ShareActions";

type Layout = "a" | "twocol" | "strip";

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
          className="inline-block rounded-full bg-gold px-6 py-3 font-medium text-gold-ink transition-colors hover:bg-gold/90"
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
          className="inline-block rounded-full border border-pine px-5 py-2.5 text-sm font-medium text-pine transition-colors hover:bg-sage-soft"
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

/** The four ways to help.
 *  A (default): donate full-width on top, 3 cards in a row.
 *  twocol: donate large left, 3 stacked in a narrower right column.
 *  strip: donate banner, then the 3 secondary actions as a lighter,
 *  editorial hairline strip (how-we-work idiom) instead of boxes. */
export function HelpWaysView({
  layout,
  shareUrl,
}: {
  layout: Layout;
  shareUrl: string;
}) {
  if (layout === "twocol") {
    return (
      <div className="reveal mt-12 grid items-start gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DonateCard wide={false} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <LinkCard nsKey="volunteer" href="/volunteer" />
          <LinkCard nsKey="partnership" href="/partner" />
          <ShareCard shareUrl={shareUrl} />
        </div>
      </div>
    );
  }

  if (layout === "strip") {
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

  return (
    <div className="reveal mt-12 space-y-5">
      <DonateCard wide />
      <div className="grid gap-5 md:grid-cols-3">
        <LinkCard nsKey="volunteer" href="/volunteer" />
        <LinkCard nsKey="partnership" href="/partner" />
        <ShareCard shareUrl={shareUrl} />
      </div>
    </div>
  );
}

/** Temporary layout experiment: reads ?help_layout client-side (Suspense)
 *  so the page stays static. */
export function HelpWays({ shareUrl }: { shareUrl: string }) {
  const param = useSearchParams().get("help_layout");
  const layout: Layout =
    param === "twocol" || param === "strip" ? param : "a";
  return <HelpWaysView layout={layout} shareUrl={shareUrl} />;
}
