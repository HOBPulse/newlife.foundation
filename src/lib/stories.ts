// 3 real stories per brief; texts/photos [TO BE PROVIDED] by owner.
// Slugs stay stable — story content lives in messages under StoriesPage.items.
export const STORY_SLUGS = ["story-1", "story-2", "story-3"] as const;

export type StorySlug = (typeof STORY_SLUGS)[number];

export function isStorySlug(value: string): value is StorySlug {
  return (STORY_SLUGS as readonly string[]).includes(value);
}
