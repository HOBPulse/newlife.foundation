import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StorySlug } from "@/lib/stories";

/* The quoted sentence is VERBATIM from this story's published text in each
   locale (messages: StoriesPage.items) — never paraphrase; swap only for
   another verbatim sentence approved by the owner. */
const QUOTE_STORY: StorySlug = "story-3";

/** Editorial pull-quote in the right margin of the stories section header.
 *  Rendered only at ≥1440px, where the heading zone leaves the room. */
export function StoryPullQuote() {
  const t = useTranslations("HomePage.pullquote");
  const tStories = useTranslations("StoriesPage");

  return (
    <figure className="absolute right-6 top-8 hidden w-80 min-[1440px]:block">
      <blockquote className="relative pl-7">
        <span
          aria-hidden="true"
          className="absolute -top-1 left-0 font-display text-4xl leading-none text-brand-terracotta"
        >
          {t("mark")}
        </span>
        <p className="font-display text-base leading-snug text-ink">
          {t("text")}
        </p>
      </blockquote>
      <figcaption className="mt-2 pl-7 text-sm">
        <Link
          href={`/stories/${QUOTE_STORY}`}
          className="text-pine transition-colors hover:text-pine-deep"
        >
          {tStories(`items.${QUOTE_STORY}.title`)} →
        </Link>
      </figcaption>
    </figure>
  );
}
