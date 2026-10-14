"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useUI } from "@/lib/store/ui";

/**
 * Animación de «vuelo» del producto al icono del carrito. Al terminar se
 * abre el carrito lateral.
 */
export function FlyToCart() {
  const { flyFrom, flyToCart, setCartOpen } = useUI();
  const target = flyFrom ? { x: flyFrom.tx, y: flyFrom.ty } : null;

  return (
    <AnimatePresence>
      {flyFrom && target ? (
        <m.div
          key={`${flyFrom.x}-${flyFrom.y}`}
          aria-hidden="true"
          className="pointer-events-none fixed z-[95] overflow-hidden rounded-[var(--radius-lg)] bg-ink shadow-2xl"
          style={{ left: 0, top: 0, width: flyFrom.w, height: flyFrom.h }}
          initial={{ x: flyFrom.x, y: flyFrom.y, scale: 1, opacity: 1 }}
          animate={{
            x: [flyFrom.x, flyFrom.x + (target.x - flyFrom.x) * 0.4, target.x - flyFrom.w / 2],
            y: [flyFrom.y, flyFrom.y - 80, target.y - flyFrom.h / 2],
            scale: [1, 0.55, 0.06],
            opacity: [1, 1, 0.2],
            rotate: [0, -6, 0],
          }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], times: [0, 0.45, 1] }}
          onAnimationComplete={() => {
            flyToCart(null);
            setCartOpen(true);
          }}
        >
          {flyFrom.image ? (
            <div
              className="size-full p-[8%] [&_svg]:size-full"
              dangerouslySetInnerHTML={{ __html: flyFrom.image }}
            />
          ) : null}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
