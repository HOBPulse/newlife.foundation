"use client";

import { useSearchParams } from "next/navigation";
import {
  AboutBodyView,
  type AboutBodyData,
  type AboutLayout,
} from "./AboutBodyView";

/** Dev-only comparison switch: ?layout=z renders the staggered layout;
 *  anything else (default) renders the wide full-bleed layout. Wrap in
 *  <Suspense fallback={<AboutBodyView layout="w" …/>}> so the page stays
 *  static and the default renders before hydration. Throwaway. */
export function AboutBody(data: AboutBodyData) {
  const layout: AboutLayout = useSearchParams().get("layout") === "z" ? "z" : "w";
  return <AboutBodyView layout={layout} {...data} />;
}
