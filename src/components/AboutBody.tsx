"use client";

import { useSearchParams } from "next/navigation";
import {
  AboutBodyView,
  type AboutBodyData,
  type AboutLayout,
} from "./AboutBodyView";

/** Dev-only preview switch: ?layout=a | ?layout=b picks an About photo layout
 *  variant; anything else renders the shipped default. Wrap in
 *  <Suspense fallback={<AboutBodyView layout="default" …/>}> so the page stays
 *  static and the default renders before hydration. Throwaway. */
export function AboutBody(data: AboutBodyData) {
  const param = useSearchParams().get("layout");
  const layout: AboutLayout = param === "a" ? "a" : param === "b" ? "b" : "default";
  return <AboutBodyView layout={layout} {...data} />;
}
