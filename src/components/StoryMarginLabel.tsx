/** Right-margin chronology label for a story section, shown only at ≥1024px
 *  (styling in globals.css: .story-margin-label). Renders nothing unless the
 *  section supplies an optional `label` — the field ships empty for every
 *  story and is never populated with invented dates. Real chronology labels
 *  are added per section in messages once the owner provides them. */
export function StoryMarginLabel({ label }: { label?: string }) {
  if (!label) return null;
  return <span className="story-margin-label">{label}</span>;
}
