import { useTranslations } from "next-intl";
import { ptSerif } from "@/lib/fonts";

/* Everything except the font stays identical between variants so the trial
   isolates the typeface. */
const BASE =
  "hero-headline max-w-4xl text-balance text-5xl leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl";

/** Hero headline. Default is the locked Fixel Display treatment; a PT Serif
 *  variant renders when `serifWeight` is set (temporary dev trial via
 *  ?font=serif&weight=400|700 — see HeroHeadline). No hooks beyond
 *  useTranslations, so it also serves as the server Suspense fallback. */
export function HeroHeadlineView({
  serifWeight,
}: {
  serifWeight?: 400 | 700;
}) {
  const t = useTranslations("HomePage.hero");
  const font = serifWeight
    ? `${ptSerif.className} ${serifWeight === 400 ? "font-normal" : "font-bold"}`
    : "font-display font-light";
  return <h1 className={`${BASE} ${font}`}>{t("title")}</h1>;
}
