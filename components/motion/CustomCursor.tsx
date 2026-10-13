"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor personalizado (solo escritorio con ratón): un anillo fino que sigue al
 * puntero y crece sobre enlaces, botones e imágenes. El cursor nativo se
 * mantiene (accesibilidad); el anillo es puramente decorativo.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || reduce || !el) return;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let scale = 1;
    let target = 1;
    let raf = 0;
    let visible = false;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
        cx = x;
        cy = y;
      }
      const t = e.target as HTMLElement | null;
      const hit = t?.closest("a, button, [role='button'], img, canvas, [data-cursor='grow']");
      target = hit ? (t?.closest("[data-cursor='grow'], img, canvas") ? 2.4 : 1.8) : 1;
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      scale += (target - scale) * 0.15;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden size-7 rounded-full border border-white opacity-0 mix-blend-difference transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:block"
    />
  );
}
