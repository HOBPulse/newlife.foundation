import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageAlternates } from "@/lib/seo";
import { isStorySlug, STORY_SLUGS } from "@/lib/stories";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return STORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isStorySlug(slug)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "StoriesPage" });
  return {
    title: t(`items.${slug}.title`),
    description: t(`items.${slug}.excerpt`),
    alternates: pageAlternates(`/stories/${slug}`, locale),
  };
}

export default async function StoryPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isStorySlug(slug)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("StoriesPage");

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/stories"
        className="text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        ← {t("backToStories")}
      </Link>
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink">
        {t(`items.${slug}.title`)}
      </h1>

      {/* Full-size, unfiltered photo slot — real photo [TO BE PROVIDED];
          no duotone here by design (treatment is for previews only) */}
      <div className="mt-10 flex aspect-[3/2] items-center justify-center rounded-xl bg-sage">
        <span className="rounded-full bg-paper px-4 py-2 text-sm text-ink-soft">
          {t("photoPending")}
        </span>
      </div>

      <p className="mt-10 leading-relaxed text-ink-soft">{t("storyPending")}</p>
    </article>
  );
}
