"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

type ViewProps = { alt: string; className?: string };

/** Presentational photo — also the static Suspense fallback for the default
 *  (top) slot, so the photo renders before hydration. */
export function HelpPhotoView({ alt, className }: ViewProps) {
  return (
    <figure className={className}>
      <Image
        src="/photos/samu-flag.jpg"
        alt={alt}
        width={1440}
        height={1147}
        className="aspect-[16/9] w-full max-w-3xl rounded-xl object-cover"
      />
    </figure>
  );
}

/** Temporary placement experiment: default shows the photo below the intro
 *  (variant "top"); ?help_photo=mid moves it between the card grid and the
 *  forms (variant "mid"). Read client-side (Suspense) so the page stays
 *  static — same pattern as the old hero photo flag. */
export function HelpPhoto({
  variant,
  ...view
}: { variant: "top" | "mid" } & ViewProps) {
  const mid = useSearchParams().get("help_photo") === "mid";
  if ((variant === "mid") !== mid) return null;
  return <HelpPhotoView {...view} />;
}
