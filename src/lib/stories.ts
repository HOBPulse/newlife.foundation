// 3 real stories per brief.
// Slugs stay stable — story content lives in messages under StoriesPage.items.
export const STORY_SLUGS = ["story-1", "story-2", "story-3"] as const;

export type StorySlug = (typeof STORY_SLUGS)[number];

export function isStorySlug(value: string): value is StorySlug {
  return (STORY_SLUGS as readonly string[]).includes(value);
}

// Photos per story, in display order: photos[0] is the main photo
// (shown on the preview card and full-size on the story page; any
// further photos appear only on the story page).
// Paths point into /public/stories/.
export const STORY_PHOTOS: Record<StorySlug, string[]> = {
  "story-1": [
    "/stories/sviatoslav-1.jpg",
    "/stories/sviatoslav-2.jpg",
    "/stories/sviatoslav-3.jpg",
    "/stories/sviatoslav-4.jpg",
  ],
  "story-2": [
    "/stories/mykyta-1.jpg",
    "/stories/mykyta-2.jpg",
    "/stories/mykyta-3.jpg",
    "/stories/mykyta-4.jpg",
  ],
  "story-3": ["/stories/lyonichka-1.jpg", "/stories/lyonichka-2.jpg"],
};
