import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

/* Pair-2 imagery for the About pairs: an overlapping three-photo collage
   (charity:water-style, site tokens, no decorative dots). charite-night is
   the base at the standard pair aspect; handover + ua-plates-er sit as
   smaller cards overlapping its corners with a slight tilt. Shared by the
   zigzag and edge variants — change once here.

   Cards overflow only vertically and stay inside the base's horizontal
   bounds, so the collage is safe to bleed to the viewport edge (edge
   variant) without pushing horizontal scroll. */

export async function AboutCollage({
  locale,
  bleed = false,
}: {
  locale: Locale;
  /** edge variant: base bleeds to the viewport edge (no rounding). */
  bleed?: boolean;
}) {
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage.photos");

  return (
    <div className="relative">
      {/* Base — same aspect as single pair photos so the series reads as one */}
      <Image
        src="/photos/charite-night.jpg"
        alt={t("chariteNight")}
        width={666}
        height={520}
        sizes="(min-width: 768px) 34rem, 100vw"
        className={`aspect-[666/520] w-full object-cover object-[center_60%] ${
          bleed ? "" : "rounded-xl shadow-md"
        }`}
      />
      {/* Card — team handover, bottom-left, slight left tilt */}
      <Image
        src="/photos/handover.jpg"
        alt={t("handover")}
        width={600}
        height={450}
        sizes="(min-width: 768px) 16rem, 45vw"
        className="absolute bottom-[-7%] left-[5%] w-[46%] rotate-[-1.5deg] rounded-lg object-cover shadow-lg"
      />
      {/* Card — UA-plated ambulance, top-right, slight right tilt */}
      <Image
        src="/photos/ua-plates-er.jpg"
        alt={t("uaPlatesEr")}
        width={600}
        height={450}
        sizes="(min-width: 768px) 15rem, 44vw"
        className="absolute right-[5%] top-[-7%] w-[44%] rotate-[1.5deg] rounded-lg object-cover shadow-lg"
      />
    </div>
  );
}
