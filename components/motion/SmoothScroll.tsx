"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void;
  on: (ev: "scroll", cb: () => void) => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

/**
 * Smooth scroll con Lenis, solo en dispositivos con ratón y sin
 * prefers-reduced-motion. Se carga con import dinámico tras el primer pintado.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduce || touch) return;
    let lenis: LenisLike | undefined;
    let raf = 0;
    let cancelled = false;
    const onLock = (e: Event) => {
      const locked = (e as CustomEvent<boolean>).detail;
      if (locked) lenis?.stop();
      else lenis?.start();
    };
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true }) as unknown as LenisLike;
      window.__lenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      // sincronizar ScrollTrigger si está cargado
      lenis.on("scroll", () => {
        const st = (window as unknown as { ScrollTrigger?: { update: () => void } }).ScrollTrigger;
        st?.update();
      });
    });
    window.addEventListener("ggs:scroll-lock", onLock);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("ggs:scroll-lock", onLock);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // al cambiar de ruta, arriba del todo sin animación
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
