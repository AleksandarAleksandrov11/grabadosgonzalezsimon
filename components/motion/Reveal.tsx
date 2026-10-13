"use client";

import type { Variants } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "fade" | "clip" | "clip-up" | "scale" | "blur" | "left" | "right";

const variants: Record<RevealVariant, Variants> = {
  up: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  clip: { hidden: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)" } },
  "clip-up": {
    hidden: { clipPath: "inset(100% 0 0 0)", y: 30 },
    show: { clipPath: "inset(0% 0 0 0)", y: 0 },
  },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(10px)" }, show: { opacity: 1, filter: "blur(0px)" } },
  left: { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 }, show: { opacity: 1, x: 0 } },
};

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "figure" | "article" | "p";
  amount?: number;
};

/** Aparición al entrar en pantalla. Respeta prefers-reduced-motion (MotionConfig). */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.9,
  className,
  as = "div",
  amount = 0.25,
}: RevealProps) {
  const Comp = m[as];
  if (variant === "clip" || variant === "clip-up") {
    // El clip-path a 100 % deja el elemento sin área visible: observamos un
    // contenedor sin estilos y el hijo hereda el estado de la animación.
    return (
      <Comp
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{ hidden: {}, show: {} }}
      >
        <m.div variants={variants[variant]} transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </m.div>
      </Comp>
    );
  }
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Contenedor que escalona la aparición de sus <StaggerItem>. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "section";
  amount?: number;
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  as?: "div" | "li" | "article";
}) {
  const Comp = m[as];
  return (
    <Comp
      className={cn(className)}
      variants={variants[variant]}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
