import Image from "next/image";
import logoSrc from "../../public/logo.png";

/** The logo mark (work in progress). Single swap point:
 *  replace public/logo.png to update the mark site-wide.
 *  The asset is pre-processed: transparent background, ink-colored (#1C2B28).
 *  Decorative by default (alt="") — pair it with the site name text. */
export function Logo({ className }: { className?: string }) {
  return <Image src={logoSrc} alt="" priority className={className} />;
}
