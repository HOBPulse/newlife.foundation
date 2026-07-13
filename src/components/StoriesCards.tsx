"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { StoryCard } from "./StoryCard";
import { STORY_SLUGS } from "@/lib/stories";

/** Stories cards block (homepage preview + /stories page). Mobile (<640px):
 *  horizontal swipe carousel — CSS scroll-snap track with next-card peek and
 *  position dots, so the three stories take ~one screen instead of three.
 *  ≥640px: the shipped card grid, unchanged. Both layouts are mounted and
 *  CSS-switched; the carousel copies opt out of the shared-element morph
 *  (`morph={false}`) so ViewTransition names stay unique — the grid copy
 *  keeps them. */
export function StoriesCards({
  gridClassName,
  carouselClassName,
  stagger = false,
}: {
  /** Classes for the ≥sm grid wrapper (margins + page-specific visibility). */
  gridClassName: string;
  /** Classes for the mobile carousel wrapper (margins). */
  carouselClassName: string;
  /** Staggered scroll-reveal on the grid (homepage). */
  stagger?: boolean;
}) {
  return (
    <>
      <div className={`sm:hidden ${carouselClassName}`}>
        <StoriesCarousel />
      </div>
      <div
        className={`hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 ${gridClassName}`}
      >
        {STORY_SLUGS.map((slug, i) => (
          <StoryCard key={slug} slug={slug} index={stagger ? i : 0} />
        ))}
      </div>
    </>
  );
}

function StoriesCarousel() {
  const t = useTranslations("StoriesPage");
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    setActive(Math.round((el.scrollLeft / max) * (STORY_SLUGS.length - 1)));
  };

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({
      left: (max / (STORY_SLUGS.length - 1)) * i,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="stories-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1"
      >
        {STORY_SLUGS.map((slug) => (
          <div key={slug} className="w-[84%] shrink-0 snap-center">
            <StoryCard slug={slug} morph={false} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2.5">
        {STORY_SLUGS.map((slug, i) => (
          <button
            key={slug}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={t(`items.${slug}.title`)}
            aria-current={active === i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              active === i ? "bg-pine" : "bg-sage"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
