"use client";

import {
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const WORDS = [
  "Bodas",
  "Comuniones",
  "Bautizos",
  "Aniversarios",
  "Empresas",
  "Hostelería",
  "Trofeos",
  "Jubilaciones",
  "Regalos",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {WORDS.map((w, i) => (
        <span key={w} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "px-6 font-display text-[clamp(3rem,2rem+5vw,7.5rem)] leading-none font-light whitespace-nowrap text-transparent italic [-webkit-text-stroke:1px_rgba(250,250,247,0.55)] sm:px-10"
                : "px-6 font-display text-[clamp(3rem,2rem+5vw,7.5rem)] leading-none whitespace-nowrap text-paper sm:px-10"
            }
          >
            {w}
          </span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-champagne sm:size-7" aria-hidden="true">
            <path d="M12 2l1.8 8.2L22 12l-8.2 1.8L12 22l-1.8-8.2L2 12l8.2-1.8Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Cinta infinita de ocasiones; la velocidad reacciona al scroll. */
export function OccasionsMarquee() {
  const reduce = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * -1.6 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  return (
    <section
      aria-label="Ocasiones para las que grabamos"
      className="theme-dark relative overflow-hidden border-y border-white/10 bg-ink py-8 sm:py-12"
    >
      <p className="sr-only">Grabamos para: {WORDS.join(", ")}.</p>
      <m.div className="flex w-max" style={{ x }}>
        <Row />
        <Row />
      </m.div>
    </section>
  );
}
