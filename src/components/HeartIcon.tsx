type Props = { className?: string };

/**
 * Plump, rounded 💗-style heart for the header «Підтримати» button — soft
 * warm pink (--color-heart) via the text-heart utility at the call site.
 * Header only: the amber-band donate CTA has its own inline heart and is
 * intentionally not affected by this component.
 */
export function HeartIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
    </svg>
  );
}
