"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Temporary dev switch: ?font=serif re-skins all headings in PT Serif via
 *  the html[data-font-trial] rules in globals.css. &weight=400|700 keeps the
 *  earlier hero-only override. Renders nothing; without the param it leaves
 *  the document untouched. Wrap in <Suspense fallback={null}> so statically
 *  rendered pages stay static. */
export function FontTrial() {
  const params = useSearchParams();
  const serif = params.get("font") === "serif";
  const weightParam = params.get("weight");
  const heroWeight =
    weightParam === "400" || weightParam === "700" ? weightParam : undefined;

  useEffect(() => {
    const root = document.documentElement;
    if (serif) {
      root.dataset.fontTrial = "serif";
    } else {
      delete root.dataset.fontTrial;
    }
    if (serif && heroWeight) {
      root.dataset.heroSerifWeight = heroWeight;
    } else {
      delete root.dataset.heroSerifWeight;
    }
  }, [serif, heroWeight]);

  return null;
}
