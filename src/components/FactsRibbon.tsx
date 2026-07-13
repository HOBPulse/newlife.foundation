import { useTranslations } from "next-intl";
import {
  AIR_LINKS,
  COUNTRIES,
  CROSS_LINKS,
  NETWORK_LINKS,
  ROUTE_GROUPS,
} from "@/data/routes";
import { CountUp } from "./CountUp";

/* Both figures are derived from the map data at build time — the ribbon can
   never disagree with what the map actually draws. Routes = every rendered
   line: country trunks, their branches, cross-sector links, network links,
   and the owner-confirmed second-origin air legs (e.g. Kyiv→Thessaloniki). */
const ROUTE_COUNT =
  ROUTE_GROUPS.length +
  ROUTE_GROUPS.reduce((sum, group) => sum + (group.branches?.length ?? 0), 0) +
  CROSS_LINKS.length +
  NETWORK_LINKS.length +
  AIR_LINKS.length;
const COUNTRY_COUNT = COUNTRIES.length;

/* Owner-provided starting year (task.md, 2026-07): "працюємо з 2019". */
const SINCE_YEAR = 2019;

function Fact({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="tnum font-display text-3xl font-medium text-paper sm:text-4xl">
        <CountUp value={value} />
      </p>
      <p className="mt-1 text-xs text-sage sm:text-sm">{label}</p>
    </div>
  );
}

/** Full-width facts strip on the dark green token, placed before the map. */
export function FactsRibbon() {
  const t = useTranslations("HomePage.facts");

  return (
    <section className="bg-pine">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-4 px-4 py-10 sm:gap-8 sm:px-6">
        <Fact
          value={ROUTE_COUNT}
          label={t("routes", { count: ROUTE_COUNT })}
        />
        <Fact
          value={COUNTRY_COUNT}
          label={t("countries", { count: COUNTRY_COUNT })}
        />
        <Fact value={SINCE_YEAR} label={t("since")} />
      </div>
    </section>
  );
}
