import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { openGraph, pageAlternates } from "@/lib/seo";
import { isStorySlug, STORY_PHOTOS, STORY_SLUGS } from "@/lib/stories";

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
  const href = `/stories/${slug}`;
  return {
    title: t(`items.${slug}.title`),
    description: t(`items.${slug}.excerpt`),
    alternates: pageAlternates(href, locale),
    openGraph: openGraph(
      t(`items.${slug}.title`),
      t(`items.${slug}.excerpt`),
      href,
      locale,
    ),
  };
}

export default async function StoryPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isStorySlug(slug)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("StoriesPage");
  const photos = STORY_PHOTOS[slug];
  const [mainPhoto, ...morePhotos] = photos;
  const title = t(`items.${slug}.title`);
  // Empty array until the owner provides the story's text (see messages/*.json).
  const sections = t.raw(`items.${slug}.sections`) as {
    heading: string;
    body: string;
  }[];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/stories"
        className="text-sm font-medium text-pine transition-colors hover:text-pine-deep"
      >
        ← {t("backToStories")}
      </Link>
      <h1 className="mt-6 font-display text-4xl font-medium tracking-tight text-ink">
        {title}
      </h1>

      {/* Main photo full-size; any further photos in a simple grid below. */}
      {mainPhoto ? (
        <>
          <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-xl bg-sage">
            <Image
              src={mainPhoto}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {morePhotos.length > 0 && (
            <div
              className={`mt-3 grid gap-3 ${
                morePhotos.length > 2
                  ? "grid-cols-2 sm:grid-cols-3"
                  : morePhotos.length > 1
                    ? "grid-cols-2"
                    : ""
              }`}
            >
              {morePhotos.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[3/2] overflow-hidden rounded-xl bg-sage"
                >
                  <Image
                    src={src}
                    alt={`${title} — ${i + 2}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 flex aspect-[3/2] items-center justify-center rounded-xl bg-sage">
          <span className="rounded-full bg-paper px-4 py-2 text-sm text-ink-soft">
            {t("photoPending")}
          </span>
        </div>
      )}

      {sections.length > 0 ? (
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-medium tracking-tight text-ink">
                {section.heading}
              </h2>
              {/* Bodies may hold several paragraphs, separated by \n\n. */}
              {section.body.split("\n\n").map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-10 leading-relaxed text-ink-soft">
          {t("storyPending")}
        </p>
      )}
    </article>
  );
}
