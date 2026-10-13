"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glassware/Glass";
import { PIECES } from "@/lib/glass/pieces";
import { ensureFonts } from "@/lib/engrave/fonts";
import { getSource, makeMask } from "@/lib/engrave/image";
import { BACKGROUNDS, composePreview, renderEngraving } from "@/lib/engrave/render";
import { registerCapture, useCustomizer } from "@/lib/engrave/store";
import { clamp, cn } from "@/lib/utils";

/**
 * Escenario del personalizador: [cristal trasero] [grabado en canvas] [reflejos].
 * Se arrastra para mover, se pellizca para escalar/rotar y responde al teclado.
 */
export function Stage({ className, compact = false, label = "Vista previa del grabado" }: { className?: string; compact?: boolean; label?: string }) {
  const { glass, design, background, showGuides, imageVersion } = useCustomizer();
  const set = useCustomizer((s) => s.set);
  const checkpoint = useCustomizer((s) => s.checkpoint);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState("");
  const [rendering, setRendering] = useState(false);
  const bg = BACKGROUNDS.find((b) => b.id === background)!;
  const tone = bg.tone;
  const zone = PIECES[glass].zone;

  // tamaño del contenedor
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // render del grabado (agrupado por frame)
  const job = useRef(0);
  useEffect(() => {
    if (!width || !canvas.current || !zone.w) return;
    const id = ++job.current;
    const raf = requestAnimationFrame(async () => {
      setRendering(true);
      await ensureFonts([design.font, design.font2]);
      if (id !== job.current || !canvas.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const scale = (width / 400) * dpr;
      let mask: HTMLCanvasElement | null = null;
      if (design.mode === "image") {
        const src = getSource(design.imageId);
        if (src) mask = makeMask(src, design.threshold, design.invert);
      }
      renderEngraving({ glass, design, mask, tone, scale, target: canvas.current });
      setRendering(false);
    });
    return () => cancelAnimationFrame(raf);
  }, [design, glass, tone, width, imageVersion, zone.w]);

  // captura para carrito / descarga / guardar
  const capture = useCallback(
    async (opts?: { width?: number; watermark?: boolean }) => {
      const back = backRef.current?.querySelector("svg");
      const front = frontRef.current?.querySelector("svg");
      if (!back || !front) return null;
      return composePreview({
        backSvg: back,
        frontSvg: front,
        engraving: canvas.current,
        glass,
        background,
        width: opts?.width ?? 800,
        watermark: opts?.watermark ?? true,
        mirrored: design.face === "back",
      });
    },
    [glass, background, design.face],
  );
  useEffect(() => {
    registerCapture(capture);
    return () => registerCapture(null);
  }, [capture]);

  /* ----------------------------- gestos ------------------------------ */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ x: number; y: number; scale: number; rotation: number; dist: number; angle: number } | null>(null);

  const zonePx = () => {
    const r = wrap.current!.getBoundingClientRect();
    return { w: (zone.w / 400) * r.width, h: (zone.h / 500) * r.height };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!zone.w) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) checkpoint();
    const pts = [...pointers.current.values()];
    const d = useCustomizer.getState().design;
    gesture.current = {
      x: d.x,
      y: d.y,
      scale: d.scale,
      rotation: d.rotation,
      dist: pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
      angle: pts.length > 1 ? Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) : 0,
    };
    (gesture.current as unknown as { start: { x: number; y: number } }).start = { x: e.clientX, y: e.clientY };
  };

  const moveRaf = useRef(0);
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current as typeof gesture.current & { start: { x: number; y: number } };
    cancelAnimationFrame(moveRaf.current);
    moveRaf.current = requestAnimationFrame(() => {
      const pts = [...pointers.current.values()];
      const face = useCustomizer.getState().design.face === "back" ? -1 : 1;
      if (pts.length >= 2 && g.dist) {
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
        set(
          {
            scale: clamp(g.scale * (dist / g.dist), 0.2, 2.5),
            rotation: Math.round(g.rotation + ((angle - g.angle) * 180) / Math.PI),
          },
          { history: false },
        );
      } else {
        const { w, h } = zonePx();
        set(
          {
            x: clamp(g.x + (face * (e.clientX - g.start.x)) / w, -0.6, 0.6),
            y: clamp(g.y + (e.clientY - g.start.y) / h, -0.6, 0.6),
          },
          { history: false },
        );
      }
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setStatus("Diseño movido");
    } else onPointerDown(e);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const d = useCustomizer.getState().design;
    const map: Record<string, () => void> = {
      ArrowLeft: () => set({ x: clamp(d.x - step, -0.6, 0.6) }),
      ArrowRight: () => set({ x: clamp(d.x + step, -0.6, 0.6) }),
      ArrowUp: () => set({ y: clamp(d.y - step, -0.6, 0.6) }),
      ArrowDown: () => set({ y: clamp(d.y + step, -0.6, 0.6) }),
      "+": () => set({ scale: clamp(d.scale + 0.05, 0.2, 2.5) }),
      "=": () => set({ scale: clamp(d.scale + 0.05, 0.2, 2.5) }),
      "-": () => set({ scale: clamp(d.scale - 0.05, 0.2, 2.5) }),
      r: () => set({ rotation: d.rotation + 5 }),
      R: () => set({ rotation: d.rotation - 5 }),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
      const nd = useCustomizer.getState().design;
      setStatus(`Posición ${Math.round(nd.x * 100)}, ${Math.round(nd.y * 100)} · escala ${Math.round(nd.scale * 100)} %`);
    }
  };

  const pct = (v: number, base: number) => `${(v / base) * 100}%`;
  const back = design.face === "back";

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrap}
        tabIndex={0}
        role="application"
        aria-roledescription="lienzo de personalización"
        aria-label={`${label}. Arrastra para mover el diseño, pellizca para escalar. Con teclado: flechas para mover, + y − para escalar, R para rotar.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className={cn(
          "relative aspect-[4/5] w-full touch-none overflow-hidden rounded-[var(--radius-lg)] select-none focus-visible:outline-2 focus-visible:outline-offset-4",
          zone.w ? "cursor-grab active:cursor-grabbing" : "",
          tone === "dark" ? "theme-dark" : "theme-light",
        )}
        style={{ background: bg.css }}
        data-cursor="grow"
      >
        <div ref={backRef} className="absolute inset-[4%]">
          <Glass id={glass} tone={tone} layer="back" className="size-full" />
        </div>
        <div className="absolute inset-[4%]">
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={cn("absolute transition-opacity duration-300", tone === "dark" ? "mix-blend-screen" : "mix-blend-multiply")}
            style={{
              left: pct(zone.x, 400),
              top: pct(zone.y, 500),
              width: pct(zone.w, 400),
              height: pct(zone.h, 500),
              transform: back ? "scaleX(-1) scale(0.94)" : undefined,
              opacity: back ? 0.55 : 1,
              filter: back ? "blur(0.4px)" : undefined,
            }}
          />
          {showGuides && zone.w ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute border border-dashed border-champagne/80"
              style={{ left: pct(zone.x, 400), top: pct(zone.y, 500), width: pct(zone.w, 400), height: pct(zone.h, 500) }}
            >
              <span className="absolute -top-6 left-0 rounded-sm bg-champagne/90 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-[0.06em] text-ink uppercase">
                Zona grabable
              </span>
            </div>
          ) : null}
        </div>
        <div ref={frontRef} className="pointer-events-none absolute inset-[4%]">
          <Glass id={glass} tone={tone} layer="front" className="size-full" />
        </div>
        {back ? (
          <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.6875rem] font-semibold text-paper backdrop-blur">
            Cara trasera (vista a través del cristal)
          </span>
        ) : null}
        {rendering && !compact ? <span className="sr-only">Actualizando vista previa…</span> : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
