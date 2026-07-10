import { Link } from "@/i18n/navigation";

/* Donate band. Background is compared behind a dev flag (?cta): green (default)
 * vs amber. The gold button is identical in both. Throwaway comparison — drop
 * the variant switch once a background is chosen. */

export type DonateVariant = "green" | "amber";

export type DonateBandData = {
  title: string;
  lead: string;
  cta: string;
};

// green = brand ligature dark green (#1F4A3D), distinct in lightness from the
// footer pine (#2e6e64). amber/ochre is a comparison value.
const BG: Record<DonateVariant, string> = {
  green: "bg-[#1f4a3d]",
  amber: "bg-[#9a5b12]",
};

export function DonateBandView({
  variant,
  title,
  lead,
  cta,
}: { variant: DonateVariant } & DonateBandData) {
  return (
    <section className={BG[variant]}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight text-paper">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-paper/80">{lead}</p>
        <Link
          href="/donate"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 font-medium text-gold-ink transition-colors hover:bg-gold/90"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
