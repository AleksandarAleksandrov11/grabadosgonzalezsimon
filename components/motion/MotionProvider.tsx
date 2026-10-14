"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Las features de Motion (incluidas las animaciones de layout) se cargan en
// un chunk aparte para no inflar el JS inicial.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
