import type { Metadata } from "next";
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

// The 4–5 step process text is [TO BE PROVIDED] by the owner — never invented.
const PROCESS_STEPS = [1, 2, 3, 4, 5];

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

      <ol className="mt-14 max-w-2xl space-y-8">
        {PROCESS_STEPS.map((n) => (
          <li key={n} className="reveal flex gap-5">
            <span className="tnum shrink-0 font-display text-3xl font-medium text-pine">
              {String(n).padStart(2, "0")}
            </span>
            <div className="border-l border-sage pl-5">
              <h2 className="font-medium text-ink">
                {t("stepLabel")} {n}: {t("stepPendingTitle")}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {t("stepPendingBody")}
              </p>
            </div>
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
