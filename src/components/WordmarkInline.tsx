/** Inline "NL Foundation" wordmark lockup — NL medium pine, Foundation
 *  regular muted. The site header uses it; it is also exported as the asset
 *  public/brand/nl-foundation.svg for covers, OG and docs. */
export function WordmarkInline({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display ${className}`}>
      <span className="font-medium text-pine">NL</span>{" "}
      <span className="font-normal text-ink-soft">Foundation</span>
    </span>
  );
}
