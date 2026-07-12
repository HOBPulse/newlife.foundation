"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PartnershipForm } from "./PartnershipForm";
import { ShareActions } from "./ShareActions";
import { VolunteerForm } from "./VolunteerForm";

type Layout = "a" | "split";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 5 4.5L15 8" />
    </svg>
  );
}

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

/** Card whose CTA expands its form in place (collapsed by default). */
function AccordionCard({
  id,
  nsKey,
  children,
}: {
  id: string;
  nsKey: "volunteer" | "partnership";
  children: ReactNode;
}) {
  const t = useTranslations("HowToHelpPage.cards");
  const [open, setOpen] = useState(false);
  return (
    <section id={id} className="rounded-xl border border-sage p-5 sm:p-6">
      <h2 className="font-display text-lg font-medium text-ink">
        {t(`${nsKey}.title`)}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t(`${nsKey}.body`)}
      </p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-pine px-5 py-2.5 text-sm font-medium text-pine transition-colors hover:bg-sage-soft"
      >
        {t(`${nsKey}.cta`)}
        <Chevron open={open} />
      </button>
      <div id={`${id}-panel`} data-open={open} className="disclosure-panel">
        <div>
          <div className="pt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ShareCard({ shareUrl }: { shareUrl: string }) {
  const t = useTranslations("HowToHelpPage.cards.share");
  return (
    <section className="rounded-xl border border-sage p-5 sm:p-6">
      <h2 className="font-display text-lg font-medium text-ink">
        {t("title")}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        {t("body")}
      </p>
      <ShareActions url={shareUrl} text={t("shareText")} />
    </section>
  );
}

/** The four ways to help. Layout A: donate full-width on top, the other
 *  three in a row. Layout "split" (?help_layout=split): donate large on the
 *  left, the other three stacked in a narrower right column. */
export function HelpWaysView({
  layout,
  shareUrl,
}: {
  layout: Layout;
  shareUrl: string;
}) {
  const volunteer = (
    <AccordionCard id="volunteer" nsKey="volunteer">
      <VolunteerForm />
    </AccordionCard>
  );
  const partnership = (
    <AccordionCard id="partnership" nsKey="partnership">
      <PartnershipForm />
    </AccordionCard>
  );
  const share = <ShareCard shareUrl={shareUrl} />;

  if (layout === "split") {
    return (
      <div className="reveal mt-12 grid items-start gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DonateCard wide={false} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          {volunteer}
          {partnership}
          {share}
        </div>
      </div>
    );
  }

  return (
    <div className="reveal mt-12 space-y-5">
      <DonateCard wide />
      <div className="grid items-start gap-5 md:grid-cols-3">
        {volunteer}
        {partnership}
        {share}
      </div>
    </div>
  );
}

/** Temporary layout experiment: reads ?help_layout client-side (Suspense)
 *  so the page stays static — same pattern as the photo flag. */
export function HelpWays({ shareUrl }: { shareUrl: string }) {
  const layout: Layout =
    useSearchParams().get("help_layout") === "split" ? "split" : "a";
  return <HelpWaysView layout={layout} shareUrl={shareUrl} />;
}
