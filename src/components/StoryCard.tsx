/// <reference types="react/canary" />
import { ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STORY_PHOTOS, type StorySlug } from "@/lib/stories";

/** Story preview card. Shows the story's main photo (photos[0]) in full
 *  color; any further photos appear only on the story page itself.
 *  `index` drives the staggered scroll reveal on the homepage grid.
 *  `morph={false}` opts out of the shared-element ViewTransition — needed
 *  when a second copy of the card is mounted (duplicate names error). */
export function StoryCard({
  slug,
  index = 0,
  morph = true,
}: {
  slug: StorySlug;
  index?: number;
  morph?: boolean;
}) {
  const t = useTranslations("StoriesPage");
  const mainPhoto = STORY_PHOTOS[slug][0];
  const photo = mainPhoto && (
    <Image
      src={mainPhoto}
      alt={t(`items.${slug}.title`)}
      fill
      sizes="(max-width: 640px) 100vw, 33vw"
      className="object-cover"
    />
  );
  const title = (
    <h3 className="font-display text-lg font-medium text-ink">
      {t(`items.${slug}.title`)}
    </h3>
  );

  return (
    <article
      className="reveal-card overflow-hidden rounded-xl border border-sage bg-paper"
      style={{ "--rc": index } as CSSProperties}
    >
      <div className="relative aspect-[4/3] bg-sage">
        {mainPhoto ? (
          // Shared-element morph: matches the story page's hero photo
          morph ? (
            <ViewTransition name={`story-photo-${slug}`}>{photo}</ViewTransition>
          ) : (
            photo
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="rounded-full bg-paper px-3 py-1 text-xs text-ink-soft">
              {t("photoPending")}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        {morph ? (
          <ViewTransition name={`story-title-${slug}`}>{title}</ViewTransition>
        ) : (
          title
        )}
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
