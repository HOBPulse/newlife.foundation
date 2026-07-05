import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StorySlug } from "@/lib/stories";

/** Story preview card. The photo slot uses the duotone treatment (pine + sage);
 *  the full unfiltered photo appears only on the story page itself.
 *  Real photos [TO BE PROVIDED] — drop an <Image fill> inside .duotone. */
export function StoryCard({ slug }: { slug: StorySlug }) {
  const t = useTranslations("StoriesPage");

  return (
    <article className="reveal overflow-hidden rounded-xl border border-sage bg-paper">
      <div className="duotone aspect-[4/3]">
        <div className="flex h-full items-center justify-center">
          <span className="z-10 rounded-full bg-paper/20 px-3 py-1 text-xs text-sage">
            {t("photoPending")}
          </span>
        </div>
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
