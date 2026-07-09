import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STORY_PHOTOS, type StorySlug } from "@/lib/stories";

/** Story preview card. Shows the story's main photo (photos[0]) in full
 *  color; any further photos appear only on the story page itself.
 *  `index` drives the staggered scroll reveal on the homepage grid. */
export function StoryCard({ slug, index = 0 }: { slug: StorySlug; index?: number }) {
  const t = useTranslations("StoriesPage");
  const mainPhoto = STORY_PHOTOS[slug][0];

  return (
    <article
      className="reveal-card overflow-hidden rounded-xl border border-sage bg-paper"
      style={{ "--rc": index } as CSSProperties}
    >
      <div className="relative aspect-[4/3] bg-sage">
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={t(`items.${slug}.title`)}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="rounded-full bg-paper px-3 py-1 text-xs text-ink-soft">
              {t("photoPending")}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-medium text-ink">
          {t(`items.${slug}.title`)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t(`items.${slug}.excerpt`)}
        </p>
        <Link
          href={`/stories/${slug}`}
          className="mt-4 inline-block text-sm font-medium text-pine transition-colors hover:text-pine-deep"
        >
          {t("readMore")} →
        </Link>
      </div>
    </article>
  );
}
