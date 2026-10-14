"use client";

import { useEffect, useRef } from "react";
import { PIECES, type GlassId } from "@/lib/glass/pieces";
import { DEFAULT_DESIGN, type Design } from "@/lib/engrave/types";
import { ensureFonts } from "@/lib/engrave/fonts";
import { loadImageUrl, makeMask } from "@/lib/engrave/image";
import { renderEngraving } from "@/lib/engrave/render";

/**
 * Animación del hero: un chorro de partículas (arena) sale de una boquilla,
 * barre el cristal y, a su paso, revela un grabado esmerilado. Alterna entre
 * varios ejemplos en bucle lento. Canvas 2D ligero; se pausa fuera de pantalla.
 */

type Example = { design: Design; logo?: string };

const EXAMPLES: Example[] = [
  {
    design: {
      ...DEFAULT_DESIGN,
      line1: "A & M",
      line2: "12 · 06 · 2026",
      font: "script",
      font2: "roman",
      line2Scale: 0.26,
      size: 1.12,
    },
  },
  {
    design: { ...DEFAULT_DESIGN, mode: "image", scale: 1.04 },
    logo: "/images/logos/bodega-valdecruz.svg",
  },
  {
    design: {
      ...DEFAULT_DESIGN,
      line1: "Lucía",
      line2: "MI PRIMERA COMUNIÓN",
      font: "script",
      font2: "thin",
      line2Scale: 0.17,
      ornament: "cross",
      size: 1,
      tracking: 0,
    },
  },
  {
    design: {
      ...DEFAULT_DESIGN,
      line1: "CAMPEONES",
      line2: "2026",
      font: "roman",
      font2: "classic",
      line2Scale: 1.25,
      ornament: "laurel",
      size: 0.8,
      tracking: 0.06,
    },
  },
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hit: boolean;
};

export default function SandblastCanvas({
  glass,
  onExample,
}: {
  glass: GlassId;
  onExample?: (i: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onExample);
  useEffect(() => {
    cb.current = onExample;
  });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const zone = PIECES[glass].zone;
    let k = 1; // px por unidad del viewBox
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let disposed = false;

    // estado de la secuencia
    let ex = 0;
    let engr: HTMLCanvasElement | null = null;
    let bbox = { x: 0, y: 0, w: 1, h: 1 };
    const reveal = document.createElement("canvas");
    const comp = document.createElement("canvas");
    let phase: "prep" | "sweep" | "hold" | "fade" = "prep";
    let t0 = 0;
    let sweepDur = 2600;
    let path: [number, number][] = [];
    let lastStamp: [number, number] | null = null;
    const parts: Particle[] = [];
    const masks = new Map<number, HTMLCanvasElement>();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      k = W / 400;
    };

    const prepare = async (i: number) => {
      phase = "prep";
      const e = EXAMPLES[i];
      await ensureFonts([e.design.font, e.design.font2]);
      let mask: HTMLCanvasElement | null = null;
      if (e.logo) {
        mask = masks.get(i) ?? null;
        if (!mask) {
          const src = await loadImageUrl(e.logo, "logo-ejemplo");
          mask = makeMask(src, src.defaultThreshold, false);
          masks.set(i, mask);
        }
      }
      if (disposed) return;
      engr = renderEngraving({ glass, design: e.design, mask, tone: "dark", scale: k });
      // caja del contenido para el barrido
      const ectx = engr.getContext("2d", { willReadFrequently: true })!;
      const data = ectx.getImageData(0, 0, engr.width, engr.height).data;
      let minX = engr.width;
      let minY = engr.height;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < engr.height; y += 2) {
        for (let x = 0; x < engr.width; x += 2) {
          if (data[(y * engr.width + x) * 4 + 3] > 20) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      bbox =
        maxX > minX
          ? { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
          : { x: 0, y: 0, w: engr.width, h: engr.height };
      reveal.width = comp.width = engr.width;
      reveal.height = comp.height = engr.height;
      reveal.getContext("2d")!.clearRect(0, 0, reveal.width, reveal.height);
      // trayectoria en zigzag por filas
      const rowH = Math.max(bbox.h / 4.2, 10 * k);
      const rows = Math.max(2, Math.ceil(bbox.h / rowH) + 1);
      path = [];
      for (let r = 0; r < rows; r++) {
        const y = bbox.y + (r / (rows - 1)) * bbox.h;
        const xs =
          r % 2 === 0 ? [bbox.x - 6 * k, bbox.x + bbox.w + 6 * k] : [bbox.x + bbox.w + 6 * k, bbox.x - 6 * k];
        path.push([xs[0], y], [xs[1], y]);
      }
      sweepDur = 2100 + rows * 260;
      lastStamp = null;
      cb.current?.(i);
      phase = "sweep";
      t0 = performance.now();
    };

    const pointAt = (u: number): [number, number] => {
      // longitud total del recorrido
      let total = 0;
      const seg: number[] = [];
      for (let i = 1; i < path.length; i++) {
        const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
        seg.push(d);
        total += d;
      }
      let target = u * total;
      for (let i = 0; i < seg.length; i++) {
        if (target <= seg[i]) {
          const t = seg[i] ? target / seg[i] : 0;
          return [
            path[i][0] + (path[i + 1][0] - path[i][0]) * t,
            path[i][1] + (path[i + 1][1] - path[i][1]) * t,
          ];
        }
        target -= seg[i];
      }
      return path[path.length - 1];
    };

    const stamp = (x: number, y: number) => {
      const rctx = reveal.getContext("2d")!;
      const rad = Math.max(bbox.h / 3.4, 12 * k);
      const draw = (px: number, py: number) => {
        const g = rctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0, "rgba(0,0,0,0.9)");
        g.addColorStop(0.55, "rgba(0,0,0,0.5)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        rctx.fillStyle = g;
        rctx.fillRect(px - rad, py - rad, rad * 2, rad * 2);
      };
      if (lastStamp) {
        const d = Math.hypot(x - lastStamp[0], y - lastStamp[1]);
        const n = Math.ceil(d / (rad / 3));
        for (let i = 1; i <= n; i++)
          draw(lastStamp[0] + ((x - lastStamp[0]) * i) / n, lastStamp[1] + ((y - lastStamp[1]) * i) / n);
      } else draw(x, y);
      lastStamp = [x, y];
    };

    const nozzle = () => ({ x: W * 0.98, y: H * 0.02 });

    const emit = (tx: number, ty: number, n: number) => {
      const nz = nozzle();
      for (let i = 0; i < n; i++) {
        const spread = (Math.random() - 0.5) * 0.16;
        const dx = tx - nz.x;
        const dy = ty - nz.y;
        const len = Math.hypot(dx, dy);
        const speed = len / (0.18 + Math.random() * 0.1); // px/s, llega en ~0.2 s
        const ang = Math.atan2(dy, dx) + spread;
        parts.push({
          x: nz.x + (Math.random() - 0.5) * 3 * k,
          y: nz.y + (Math.random() - 0.5) * 3 * k,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 0,
          max: len / speed,
          size: (0.5 + Math.random() * 1.1) * k * 0.9,
          hit: false,
        });
      }
    };

    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, W, H);
      if (!engr || phase === "prep") return;
      const zx = zone.x * k;
      const zy = zone.y * k;
      const el = now - t0;
      let target: [number, number] | null = null;

      if (phase === "sweep") {
        const u = Math.min(1, el / sweepDur);
        const eased = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        target = pointAt(eased);
        stamp(target[0], target[1]);
        if (u >= 1) {
          phase = "hold";
          t0 = now;
        }
      } else if (phase === "hold" && el > 2600) {
        phase = "fade";
        t0 = now;
      } else if (phase === "fade" && el > 900) {
        ex = (ex + 1) % EXAMPLES.length;
        engr = null;
        void prepare(ex);
        return;
      }

      // grabado revelado
      const cctx = comp.getContext("2d")!;
      cctx.globalCompositeOperation = "source-over";
      cctx.clearRect(0, 0, comp.width, comp.height);
      cctx.drawImage(engr, 0, 0);
      if (phase === "sweep") {
        cctx.globalCompositeOperation = "destination-in";
        cctx.drawImage(reveal, 0, 0);
      }
      ctx.globalAlpha = phase === "fade" ? Math.max(0, 1 - el / 900) : 1;
      ctx.drawImage(comp, zx, zy);
      ctx.globalAlpha = 1;

      // chorro + partículas
      if (target) {
        const tx = zx + target[0];
        const ty = zy + target[1];
        emit(tx, ty, 9);
        const nz = nozzle();
        // haz
        const g = ctx.createLinearGradient(nz.x, nz.y, tx, ty);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(255,255,255,0.10)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 7 * k;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(nz.x, nz.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // brillo en el punto de impacto
        const rg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 22 * k);
        rg.addColorStop(0, "rgba(255,255,255,0.55)");
        rg.addColorStop(0.3, "rgba(255,255,255,0.14)");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(tx - 22 * k, ty - 22 * k, 44 * k, 44 * k);
      }
      ctx.fillStyle = "#fff";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (!p.hit && p.life >= p.max) {
          // rebote: la arena sale despedida al chocar con el cristal
          p.hit = true;
          p.life = 0;
          p.max = 0.25 + Math.random() * 0.5;
          const a = Math.random() * Math.PI * 2;
          const s = (40 + Math.random() * 140) * k;
          p.vx = Math.cos(a) * s - 30 * k;
          p.vy = Math.sin(a) * s;
        }
        if (p.hit) {
          p.vy += 260 * k * dt;
          p.vx *= 0.96;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = p.hit ? Math.max(0, 1 - p.life / p.max) * 0.8 : 0.35 + 0.4 * (p.life / p.max);
        if (alpha <= 0.01 || (p.hit && p.life > p.max)) {
          parts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (parts.length > 700) parts.splice(0, parts.length - 700);
    };

    const start = () => {
      if (running || disposed) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    void prepare(0).then(() => visible && start());

    const ro = new ResizeObserver(() => {
      resize();
      if (engr) {
        // re-renderizar el ejemplo actual a la nueva resolución
        void prepare(ex);
      }
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && document.visibilityState === "visible") start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.visibilityState === "visible" && visible ? start() : stop());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [glass]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full mix-blend-screen" />;
}
