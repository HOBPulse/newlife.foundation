// 3 real stories per brief; texts/photos [TO BE PROVIDED] by owner.
// Slugs stay stable — story content lives in messages under StoriesPage.items.
export const STORY_SLUGS = ["story-1", "story-2", "story-3"] as const;

export type StorySlug = (typeof STORY_SLUGS)[number];

export function isStorySlug(value: string): value is StorySlug {
  return (STORY_SLUGS as readonly string[]).includes(value);
}

// Photos per story, 1–3 each, in display order: photos[0] is the main photo
// (used duotoned on the preview card and full-size on the story page; any
// further photos appear only on the story page, unfiltered).
// Paths point into /public/stories/ — files [TO BE PROVIDED] by owner.
export const STORY_PHOTOS: Record<StorySlug, string[]> = {
  "story-1": [],
  "story-2": [],
  "story-3": [],
};
