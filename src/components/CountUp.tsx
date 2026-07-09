"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from 0 up to `value` (ease-out) the first time it scrolls into
 *  view. Server-renders the final value, so no-JS and pre-hydration show the
 *  real number; the animation only runs client-side when motion is allowed.
 *  The last frame lands on exactly `value`. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDisplay(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let start: number | null = null;
        const tick = (now: number) => {
          start ??= now;
          const p = Math.min((now - start) / 900, 1);
          setDisplay(Math.round((1 - (1 - p) ** 3) * value));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
