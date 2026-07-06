"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Adds an `in-view` class once the element scrolls into view, then stops
 *  observing. Only a trigger — every animation stays in CSS (globals.css).
 *  Without JS the class never lands and the CSS fallback shows static content. */
export function RevealOnView({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in-view");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className={className}>
      {children}
    </figure>
  );
}
