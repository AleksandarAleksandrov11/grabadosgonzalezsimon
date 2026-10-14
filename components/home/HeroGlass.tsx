"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glassware/Glass";
import { whenIdle } from "@/lib/hooks";

const SandblastCanvas = dynamic(() => import("./SandblastCanvas"), { ssr: false });

export const HERO_GLASS = "copa-balon" as const;

/**
 * Copa del hero: capas [cristal trasero] [canvas del chorro de arena]
 * [reflejos delanteros]. Los reflejos se mueven con el ratón (o el giroscopio).
 */
export function HeroGlass() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // arrancar el canvas cuando el navegador esté libre (después del LCP)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancel = () => {};
    const t = window.setTimeout(() => {
      cancel = whenIdle(() => setReady(true), 1200);
    }, 500);
    return () => {
      window.clearTimeout(t);
      cancel();
    };
  }, []);

  // parallax / tilt con el ratón y giroscopio (Android; iOS requiere permiso y no lo pedimos)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const apply = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--ry", `${(cx * 7).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-cy * 4).toFixed(2)}deg`);
      el.style.setProperty("--hx", `${(-cx * 10).toFixed(2)}px`);
      el.style.setProperty("--hy", `${(-cy * 6).toFixed(2)}px`);
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(apply);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div className="relative mx-auto w-[min(50vw,210px)] sm:w-[min(44vw,300px)] lg:w-full lg:max-w-[520px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] top-[18%] bottom-[18%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.10),transparent)] blur-2xl"
      />
      <div
        ref={ref}
        role="img"
        aria-label="Copa de cristal en la que un chorro de arena va grabando iniciales, un logotipo, un nombre y la palabra «Campeones»"
        className="css-fade-in relative aspect-[4/5] [transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] will-change-transform"
        style={{ "--d": "200ms" } as React.CSSProperties}
      >
        <Glass id={HERO_GLASS} tone="dark" layer="back" className="absolute inset-0" />
        {/* fallback estático (movimiento reducido) */}
        <div className="absolute inset-0 hidden motion-reduce:block">
          <Glass
            id={HERO_GLASS}
            tone="dark"
            engraving={{
              kind: "text",
              lines: [
                { text: "A & M", font: "script", size: 0.4 },
                { text: "12 · 06 · 2026", font: "roman", size: 0.1, tracking: 0.1 },
              ],
            }}
          />
        </div>
        {ready ? <SandblastCanvas glass={HERO_GLASS} /> : null}
        <div className="absolute inset-0 [transform:translate3d(var(--hx,0px),var(--hy,0px),0)]">
          <Glass id={HERO_GLASS} tone="dark" layer="front" className="absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
