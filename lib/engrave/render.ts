"use client";

import { engraveClip, PIECES, type GlassId } from "@/lib/glass/pieces";
import type { GlassTone } from "@/components/glassware/Glass";
import { fontString } from "./fonts";
import { drawLaurel, drawShield, drawTopOrnament, ornamentOnTop } from "./ornaments";
import type { Design } from "./types";

/**
 * Motor de grabado en canvas.
 *   diseño plano → curvatura cilíndrica → esmerilado (grano + opacidad) → recorte a la zona
 * El resultado es un canvas del tamaño de la zona grabable que se superpone
 * a la ilustración (con los reflejos del cristal POR ENCIMA).
 */

export type EngraveInput = {
  glass: GlassId;
  design: Design;
  /** máscara blanca de la imagen (modo imagen) */
  mask?: HTMLCanvasElement | null;
  tone: GlassTone;
  /** píxeles por unidad del viewBox (resolución) */
  scale: number;
  /** reutilizar este canvas de salida */
  target?: HTMLCanvasElement;
  /** factor 0–1 de «revelado» por máscara (lo usa el hero) */
  grain?: number;
};

const LIGHT_FILL = "#9e9e97";

let noiseTile: HTMLCanvasElement | null = null;
function noise() {
  if (noiseTile) return noiseTile;
  const c = document.createElement("canvas");
  c.width = c.height = 96;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(96, 96);
  // ruido con algo de agrupación (granos de arena de 1–2 px)
  for (let i = 0; i < img.data.length; i += 4) {
    const r = Math.random();
    const v = r < 0.55 ? 0 : r < 0.85 ? 90 : 200;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = 0;
    img.data[i + 3] = v;
  }
  ctx.putImageData(img, 0, 0);
  noiseTile = c;
  return c;
}

function makeCanvas(w: number, h: number, reuse?: HTMLCanvasElement) {
  const c = reuse ?? document.createElement("canvas");
  if (c.width !== w) c.width = w;
  if (c.height !== h) c.height = h;
  return c;
}

const scratch: Record<string, HTMLCanvasElement> = {};
function scratchCanvas(key: string, w: number, h: number) {
  const c = makeCanvas(w, h, scratch[key]);
  scratch[key] = c;
  const ctx = c.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, w, h);
  return c;
}

/* ----------------------------- texto ----------------------------------- */

const supportsLetterSpacing =
  typeof CanvasRenderingContext2D !== "undefined" && "letterSpacing" in CanvasRenderingContext2D.prototype;

function measure(ctx: CanvasRenderingContext2D, text: string, trackPx: number) {
  if (supportsLetterSpacing) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${trackPx}px`;
    return ctx.measureText(text).width;
  }
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + trackPx;
  return w - trackPx;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  trackPx: number,
  align: CanvasTextAlign,
) {
  if (supportsLetterSpacing) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${trackPx}px`;
    ctx.textAlign = align;
    // letterSpacing añade espacio tras el último carácter: compensar al centrar
    const dx = align === "center" ? trackPx / 2 : align === "right" ? trackPx : 0;
    ctx.fillText(text, x + dx, y);
    return;
  }
  const w = measure(ctx, text, trackPx);
  let cx = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  ctx.textAlign = "left";
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + trackPx;
  }
}

/** Texto en arco: curve > 0 arco hacia arriba (arcoíris); curve < 0 sonrisa. */
function drawArcLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  trackPx: number,
  curve: number,
  maxW: number,
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((s, w) => s + w, 0) + trackPx * (chars.length - 1);
  const R = Math.max(maxW * 0.45, total / (Math.abs(curve) * 2.6));
  const dir = curve > 0 ? 1 : -1;
  let a = -total / 2 / R;
  ctx.textAlign = "center";
  if (supportsLetterSpacing)
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  for (let i = 0; i < chars.length; i++) {
    const w = widths[i];
    const mid = a + w / 2 / R;
    const x = cx + R * Math.sin(mid);
    const y = cy + dir * (R - R * Math.cos(mid));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(dir * mid);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    a += (w + trackPx) / R;
  }
}

/** Dibuja el diseño plano (blanco sobre transparente) en un canvas W×H. */
export function drawFlatDesign(
  ctx: CanvasRenderingContext2D,
  d: Design,
  W: number,
  H: number,
  mask?: HTMLCanvasElement | null,
) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.translate(W / 2 + d.x * W, H / 2 + d.y * H);
  ctx.rotate((d.rotation * Math.PI) / 180);
  ctx.scale(d.scale, d.scale);

  if (d.mode === "image") {
    if (mask) {
      const s = Math.min((W * 0.86) / mask.width, (H * 0.86) / mask.height);
      const w = mask.width * s;
      const h = mask.height * s;
      ctx.drawImage(mask, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
    return;
  }

  const l1 = d.line1.trim();
  const l2 = d.line2.trim();
  const base = H * 0.3 * d.size;
  let f1 = base;
  let f2 = base * d.line2Scale;
  const track1 = f1 * d.tracking;
  const maxW = W * 0.9;
  ctx.textBaseline = "middle";
  // auto-ajuste al ancho de la zona
  ctx.font = fontString(d.font, f1);
  if (l1 && d.curve === 0) {
    const w1 = measure(ctx, l1, track1);
    if (w1 > maxW) f1 *= maxW / w1;
  }
  ctx.font = fontString(d.font2, f2);
  if (l2) {
    const w2 = measure(ctx, l2, f2 * d.tracking);
    if (w2 > maxW) f2 *= maxW / w2;
  }
  const top = ornamentOnTop(d.ornament);
  const ornSize = top ? Math.min(base * 0.7, H * 0.26) : 0;
  const gap = base * 0.12;
  const h1 = l1 ? f1 * (d.font === "script" || d.font === "pinyon" ? 1.05 : 0.95) : 0;
  const h2 = l2 ? f2 * 1.05 : 0;
  const blockH = (top ? ornSize + gap : 0) + h1 + (l1 && l2 ? gap : 0) + h2;
  let y = -blockH / 2;
  const ax = d.align === "left" ? -maxW / 2 : d.align === "right" ? maxW / 2 : 0;
  const align: CanvasTextAlign = d.align === "left" ? "left" : d.align === "right" ? "right" : "center";

  if (top) {
    drawTopOrnament(
      ctx,
      d.ornament,
      ax + (align === "left" ? ornSize / 2 : align === "right" ? -ornSize / 2 : 0),
      y + ornSize / 2,
      ornSize,
    );
    y += ornSize + gap;
  }
  if (l1) {
    ctx.font = fontString(d.font, f1);
    if (d.curve !== 0) drawArcLine(ctx, l1, 0, y + h1 / 2, f1 * d.tracking, d.curve, maxW);
    else drawLine(ctx, l1, ax, y + h1 / 2, f1 * d.tracking, align);
    y += h1 + (l2 ? gap : 0);
  }
  if (l2) {
    ctx.font = fontString(d.font2, f2);
    drawLine(ctx, l2, ax, y + h2 / 2, f2 * d.tracking, align);
  }
  if (d.ornament === "laurel") drawLaurel(ctx, 0, 0, Math.min(maxW, W * 0.7), blockH);
  if (d.ornament === "shield") {
    const sw = Math.min(W * 0.92, Math.max(blockH * 0.95, base * 2.4));
    drawShield(ctx, 0, blockH * 0.06, sw, Math.min(H * 0.98, sw * 1.18));
  }
  ctx.restore();
}

/** Compresión horizontal progresiva hacia los bordes (proyección cilíndrica). */
function warpCylinder(src: HTMLCanvasElement, curvature: number, out: HTMLCanvasElement) {
  const W = src.width;
  const H = src.height;
  const ctx = out.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  if (curvature <= 0.01) {
    ctx.drawImage(src, 0, 0);
    return;
  }
  const tmax = curvature * (Math.PI / 2) * 0.92;
  const sinMax = Math.sin(tmax);
  const step = W > 700 ? 2 : 1;
  for (let xo = 0; xo < W; xo += step) {
    const u = ((xo + step / 2) / W) * 2 - 1;
    const th = Math.asin(u * sinMax);
    const xs = ((th / tmax + 1) / 2) * W;
    // ancho de la franja origen (derivada) para evitar huecos
    const dsrc = (step * (sinMax / Math.sqrt(Math.max(1e-4, 1 - (u * sinMax) ** 2)))) / tmax;
    ctx.drawImage(src, Math.max(0, xs - dsrc / 2), 0, Math.max(0.5, dsrc), H, xo, 0, step, H);
  }
  // atenuación hacia los bordes (se ve más «de canto»)
  ctx.globalCompositeOperation = "destination-out";
  const g = ctx.createLinearGradient(0, 0, W, 0);
  for (let i = 0; i <= 10; i++) {
    const u = (i / 10) * 2 - 1;
    const th = Math.asin(u * sinMax);
    const fade = 1 - (0.45 + 0.55 * Math.cos(th));
    g.addColorStop(i / 10, `rgba(0,0,0,${fade.toFixed(3)})`);
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";
}

/** Convierte la máscara en esmerilado: opacidad, grano de arena y color según tono. */
function frost(ctx: CanvasRenderingContext2D, W: number, H: number, tone: GlassTone, grain = 1) {
  // grano: elimina alfa de forma aleatoria (arena)
  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = 0.42 * grain;
  const pat = ctx.createPattern(noise(), "repeat");
  if (pat) {
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.globalAlpha = 1;
  // color
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = tone === "dark" ? "rgba(255,255,255,0.86)" : LIGHT_FILL;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";
}

const clipCache = new Map<GlassId, Path2D>();
function clipPath(glass: GlassId) {
  let p = clipCache.get(glass);
  if (!p) {
    p = new Path2D(engraveClip(glass));
    clipCache.set(glass, p);
  }
  return p;
}

/** Tamaño en px del canvas de la zona para una escala dada. */
export function zoneSize(glass: GlassId, scale: number) {
  const z = PIECES[glass].zone;
  return { w: Math.max(1, Math.round(z.w * scale)), h: Math.max(1, Math.round(z.h * scale)), zone: z };
}

/** Render completo del grabado sobre la zona de la pieza. */
export function renderEngraving({ glass, design, mask, tone, scale, target, grain = 1 }: EngraveInput) {
  const { w: W, h: H, zone } = zoneSize(glass, scale);
  const flat = scratchCanvas("flat", W, H);
  drawFlatDesign(flat.getContext("2d")!, design, W, H, mask);
  const out = makeCanvas(W, H, target);
  warpCylinder(flat, PIECES[glass].curvature, out);
  const ctx = out.getContext("2d")!;
  frost(ctx, W, H, tone, grain);
  // recorte a la zona grabable real de la pieza
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.scale(scale, scale);
  ctx.translate(-zone.x, -zone.y);
  ctx.fill(clipPath(glass));
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  return out;
}

/* --------------------------- exportación -------------------------------- */

export type PreviewBackground = "negro" | "blanco" | "madera" | "mantel";

export const BACKGROUNDS: { id: PreviewBackground; label: string; tone: GlassTone; css: string }[] = [
  {
    id: "negro",
    label: "Negro",
    tone: "dark",
    css: "radial-gradient(80% 60% at 50% 35%, #1d1d1c 0%, #0a0a0a 70%)",
  },
  {
    id: "blanco",
    label: "Blanco",
    tone: "light",
    css: "radial-gradient(80% 60% at 50% 35%, #ffffff 0%, #ecebe6 100%)",
  },
  {
    id: "madera",
    label: "Madera clara",
    tone: "light",
    css: "repeating-linear-gradient(90deg, rgba(120,84,40,0.05) 0 2px, transparent 2px 9px), linear-gradient(180deg, #ece0cc 0%, #e2d1b4 58%, #cdb48e 58.2%, #c4a982 100%)",
  },
  {
    id: "mantel",
    label: "Mantel",
    tone: "light",
    css: "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 4px), linear-gradient(180deg, #f6f4ef 0%, #efece5 100%)",
  },
];

function paintBackground(ctx: CanvasRenderingContext2D, bg: PreviewBackground, W: number, H: number) {
  if (bg === "negro") {
    const g = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.8);
    g.addColorStop(0, "#1d1d1c");
    g.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return;
  }
  if (bg === "blanco") {
    const g = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.9);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(1, "#ecebe6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    return;
  }
  if (bg === "madera") {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#ece0cc");
    g.addColorStop(0.58, "#e2d1b4");
    g.addColorStop(0.582, "#cdb48e");
    g.addColorStop(1, "#c4a982");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(120,84,40,0.05)";
    for (let x = 0; x < W; x += 9) ctx.fillRect(x, H * 0.582, 2, H);
    return;
  }
  ctx.fillStyle = "#f3f1ec";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(0,0,0,0.025)";
  for (let x = 0; x < W; x += 4) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
}

function svgToImage(svg: SVGSVGElement, w: number, h: number) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/**
 * Compone una imagen final (fondo + cristal + grabado + reflejos) a partir de
 * los SVG de la vista previa en el DOM y el canvas del grabado.
 */
export async function composePreview({
  backSvg,
  frontSvg,
  engraving,
  glass,
  background,
  width = 800,
  watermark = true,
}: {
  backSvg: SVGSVGElement;
  frontSvg: SVGSVGElement;
  engraving: HTMLCanvasElement | null;
  glass: GlassId;
  background: PreviewBackground;
  width?: number;
  watermark?: boolean;
}) {
  const W = width;
  const H = Math.round(width * 1.25);
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  paintBackground(ctx, background, W, H);
  const k = W / 400;
  const [back, front] = await Promise.all([svgToImage(backSvg, W, H), svgToImage(frontSvg, W, H)]);
  ctx.drawImage(back, 0, 0, W, H);
  if (engraving) {
    const z = PIECES[glass].zone;
    const tone = BACKGROUNDS.find((b) => b.id === background)!.tone;
    ctx.globalCompositeOperation = tone === "dark" ? "screen" : "multiply";
    ctx.drawImage(engraving, z.x * k, z.y * k, z.w * k, z.h * k);
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.drawImage(front, 0, 0, W, H);
  if (watermark) {
    const dark = background === "negro";
    ctx.font = `600 ${Math.round(W * 0.018)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillStyle = dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
    if ("letterSpacing" in ctx)
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${W * 0.003}px`;
    ctx.fillText("VISTA PREVIA · GRABADOS GONZÁLEZ SIMÓN", W / 2, H - W * 0.035);
  }
  return c;
}

/** Miniatura comprimida (WebP/JPEG ≤ ~60 KB) para el carrito y «Mis diseños». */
export function thumbnail(src: HTMLCanvasElement, maxW = 320, budget = 60_000) {
  const s = Math.min(1, maxW / src.width);
  const c = document.createElement("canvas");
  c.width = Math.round(src.width * s);
  c.height = Math.round(src.height * s);
  c.getContext("2d")!.drawImage(src, 0, 0, c.width, c.height);
  for (const q of [0.78, 0.66, 0.55, 0.45]) {
    const webp = c.toDataURL("image/webp", q);
    const url = webp.startsWith("data:image/webp") ? webp : c.toDataURL("image/jpeg", q);
    if (url.length * 0.75 <= budget) return url;
  }
  return c.toDataURL("image/jpeg", 0.4);
}
