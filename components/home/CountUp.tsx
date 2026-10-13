"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function CountUp({
  to,
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}
