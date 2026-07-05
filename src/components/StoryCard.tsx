import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STORY_PHOTOS, type StorySlug } from "@/lib/stories";

/** Story preview card. Always shows the story's main photo (photos[0]) with
 *  the duotone treatment (pine + sage), however many photos the story has;
 *  the full unfiltered photos appear only on the story page itself. */
export function StoryCard({ slug }: { slug: StorySlug }) {
  const t = useTranslations("StoriesPage");
  const mainPhoto = STORY_PHOTOS[slug][0];

  return (
    <article className="reveal overflow-hidden rounded-xl border border-sage bg-paper">
      <div className="duotone aspect-[4/3]">
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
            <span className="z-10 rounded-full bg-paper/20 px-3 py-1 text-xs text-sage">
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
