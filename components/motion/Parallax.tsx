"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Desplaza el contenido verticalmente con el scroll (±offset px). */
export function Parallax({
  children,
  offset = 60,
  className,
  innerClassName,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div style={{ y }} className={cn("will-change-transform", innerClassName)}>
        {children}
      </m.div>
    </div>
  );
}
