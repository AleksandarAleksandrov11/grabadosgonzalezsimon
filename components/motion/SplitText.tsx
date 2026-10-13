"use client";

import * as m from "motion/react-m";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Titular que se revela palabra a palabra (máscara + desplazamiento).
 * Las palabras envueltas en *asteriscos* se pintan en cursiva serif.
 * El texto completo está en el DOM desde el primer render (SEO/LCP) y la
 * animación solo usa transform/opacity.
 */
export function SplitText({
  text,
  className,
  as = "h2",
  delay = 0,
  stagger = 0.06,
  trigger = "inView",
  italicClassName = "italic font-light",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  stagger?: number;
  trigger?: "inView" | "mount";
  italicClassName?: string;
}) {
  const Comp = m[as];
  const words = text.split(" ");
  const anim = trigger === "mount" ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } };
  return (
    <Comp
      className={className}
      initial="hidden"
      {...anim}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) => {
        const italic = w.startsWith("*") && w.replace(/[.,;:!?]$/, "").endsWith("*");
        const clean = w.replace(/\*/g, "");
        const node: ReactNode = italic ? <em className={italicClassName}>{clean}</em> : clean;
        return (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
              <m.span
                className={cn("inline-block will-change-transform")}
                variants={{
                  hidden: { y: "105%", opacity: 0 },
                  show: { y: "0%", opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {node}
              </m.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Comp>
  );
}
