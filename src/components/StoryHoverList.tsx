import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { STORY_PHOTOS, STORY_SLUGS } from "@/lib/stories";

/** Editorial story index with a hover/focus photo reveal, shown ONLY on
 *  hover-capable ≥1024px screens (styling in globals.css: .story-hover).
 *  Pure CSS: hovering or keyboard-focusing a row fades in THAT story's photo
 *  in a fixed reserved slot — no JS, no layout shift. Touch and smaller
 *  screens hide this and keep the card grid. */
export function StoryHoverList() {
  const t = useTranslations("StoriesPage");

  return (
    <div className="story-hover mt-14">
      <ul className="story-hover-list">
        {STORY_SLUGS.map((slug, i) => (
          <li key={slug} className="story-hover-row">
            <Link href={`/stories/${slug}`} className="story-hover-link">
              <span className="story-hover-index tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="story-hover-title">
                {t(`items.${slug}.title`)}
              </span>
            </Link>
            <span className="story-hover-photo" aria-hidden="true">
              <Image
                src={STORY_PHOTOS[slug][0]}
                alt=""
                fill
                sizes="352px"
                loading="lazy"
                className="object-cover"
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
