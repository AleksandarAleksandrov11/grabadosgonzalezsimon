"use client";

import { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glassware/Glass";
import { ensureFonts } from "@/lib/engrave/fonts";
import { getSource, makeMask } from "@/lib/engrave/image";
import { renderEngraving } from "@/lib/engrave/render";
import type { Design } from "@/lib/engrave/types";
import { PIECES, type GlassId } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

/** Vista previa no interactiva del mismo diseño sobre otra pieza. */
export function MiniStage({
  glass,
  design,
  className,
  tone = "dark",
}: {
  glass: GlassId;
  design: Design;
  className?: string;
  tone?: "dark" | "light";
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [w, setW] = useState(0);
  const zone = PIECES[glass].zone;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!w || !canvas.current || !zone.w) return;
    let cancelled = false;
    (async () => {
      await ensureFonts([design.font, design.font2]);
      if (cancelled || !canvas.current) return;
      let mask: HTMLCanvasElement | null = null;
      if (design.mode === "image") {
        const src = getSource(design.imageId);
        if (src) mask = makeMask(src, design.threshold, design.invert);
      }
      renderEngraving({
        glass,
        design,
        mask,
        tone,
        scale: (w / 400) * Math.min(window.devicePixelRatio || 1, 2),
        target: canvas.current,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [w, design, glass, tone, zone.w]);

  const pct = (v: number, base: number) => `${(v / base) * 100}%`;
  return (
    <div ref={wrap} className={cn("relative aspect-[4/5]", className)}>
      <Glass id={glass} tone={tone} layer="back" className="absolute inset-0" />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={cn("absolute", tone === "dark" ? "mix-blend-screen" : "mix-blend-multiply")}
        style={{
          left: pct(zone.x, 400),
          top: pct(zone.y, 500),
          width: pct(zone.w, 400),
          height: pct(zone.h, 500),
          ...(design.face === "back" ? { transform: "scaleX(-1) scale(0.94)", opacity: 0.55 } : {}),
        }}
      />
      <Glass id={glass} tone={tone} layer="front" className="absolute inset-0" />
    </div>
  );
}
