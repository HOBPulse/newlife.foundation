"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Cross-fades the shared page background between the base paper token and
 *  the warm tint (--color-surface-tint) as marked sections take over the
 *  viewport. Sections opt in via data-morph="base" | "tint"; sections that
 *  own a solid background (the dark donate band, the facts ribbon) carry no
 *  attribute and keep whatever state is current. Pure progressive
 *  enhancement: without JS the page simply stays on the base background. */
export function BackgroundMorph({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const sections = root.querySelectorAll<HTMLElement>("[data-morph]");
    if (sections.length === 0) return;
    // A section is dominant while it crosses the vertical middle of the
    // viewport — rootMargin shrinks the observed box down to that line.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          root.classList.toggle(
            "bg-tinted",
            entry.target.getAttribute("data-morph") === "tint",
          );
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-morph">
      {children}
    </div>
  );
}
