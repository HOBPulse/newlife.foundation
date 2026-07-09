import { LogoMark } from "./LogoMark";

/** The logo mark. Inline SVG driven by the brand design tokens
 *  (--color-brand-*), so it follows any future palette change.
 *  Decorative by default — pair it with the site name text. */
export function Logo({ className }: { className?: string }) {
  return <LogoMark className={className} />;
}
