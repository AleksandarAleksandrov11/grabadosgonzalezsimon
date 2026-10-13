"use client";

/**
 * Procesado de imágenes para el grabado (100 % en el navegador, nada se sube):
 *  - carga y validación (PNG, JPG, SVG, WEBP · máx. 10 MB)
 *  - eliminación de fondo: respeta la transparencia; si no la hay, elimina el
 *    fondo claro o uniforme por distancia de color al fondo detectado en el borde
 *  - máscara blanca (una sola tinta) recortada al contenido, cacheada.
 */

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
export const MAX_BYTES = 10 * 1024 * 1024;
const MAX_SIDE = 1024;

export type SourceImage = {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  hasAlpha: boolean;
  /** color de fondo detectado en el borde (si no hay transparencia) */
  bg: [number, number, number];
  defaultThreshold: number;
};

const sources = new Map<string, SourceImage>();
const masks = new Map<string, HTMLCanvasElement>();

export function getSource(id: string | null | undefined) {
  return id ? (sources.get(id) ?? null) : null;
}

export class ImageError extends Error {}

export function validateFile(file: File) {
  const type = file.type || (file.name.toLowerCase().endsWith(".svg") ? "image/svg+xml" : "");
  if (!ACCEPTED_TYPES.includes(type)) {
    throw new ImageError("Ese formato no lo podemos leer. Sube un PNG, JPG, SVG o WEBP.");
  }
  if (file.size > MAX_BYTES) {
    throw new ImageError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo son 10 MB.`);
  }
  return type;
}

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageError("No hemos podido abrir la imagen. ¿Está dañada?"));
    img.src = src;
  });
}

function svgSize(text: string): [number, number] | null {
  const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
  if (vb) return [parseFloat(vb[1]), parseFloat(vb[2])];
  const w = /\swidth\s*=\s*["']([\d.]+)/i.exec(text);
  const h = /\sheight\s*=\s*["']([\d.]+)/i.exec(text);
  return w && h ? [parseFloat(w[1]), parseFloat(h[1])] : null;
}

async function toSource(
  img: HTMLImageElement,
  name: string,
  id: string,
  size?: [number, number] | null,
): Promise<SourceImage> {
  const nw = size?.[0] ?? img.naturalWidth;
  const nh = size?.[1] ?? img.naturalHeight;
  if (!nw || !nh) throw new ImageError("La imagen no tiene dimensiones válidas.");
  // los SVG son vectoriales: se rasterizan al tamaño máximo; los bitmaps nunca se amplían
  const s = size ? MAX_SIDE / Math.max(nw, nh) : Math.min(1, MAX_SIDE / Math.max(nw, nh));
  const w = Math.max(1, Math.round(nw * s));
  const h = Math.max(1, Math.round(nh * s));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  // ¿transparencia significativa?
  let transparent = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] < 200) transparent++;
  const hasAlpha = transparent / (data.length / 16) > 0.02;
  // color de fondo: mediana aproximada del borde
  const border: number[][] = [];
  const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
  for (let x = 0; x < w; x += step) {
    for (const y of [0, h - 1]) {
      const k = (y * w + x) * 4;
      border.push([data[k], data[k + 1], data[k + 2]]);
    }
  }
  for (let y = 0; y < h; y += step) {
    for (const x of [0, w - 1]) {
      const k = (y * w + x) * 4;
      border.push([data[k], data[k + 1], data[k + 2]]);
    }
  }
  const med = (i: number) =>
    border.map((c) => c[i]).sort((a, b) => a - b)[Math.floor(border.length / 2)] ?? 255;
  const bg: [number, number, number] = [med(0), med(1), med(2)];
  const src: SourceImage = { id, name, canvas, hasAlpha, bg, defaultThreshold: hasAlpha ? 245 : 200 };
  sources.set(id, src);
  return src;
}

export async function loadImageFile(file: File): Promise<SourceImage> {
  const type = validateFile(file);
  const id = `u${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  if (type === "image/svg+xml") {
    const text = await file.text();
    const blob = new Blob([text], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadImg(url);
      return await toSource(img, file.name, id, svgSize(text));
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    return await toSource(img, file.name, id);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Carga una imagen pública (logos de ejemplo) por URL. */
export async function loadImageUrl(url: string, name: string, id = `url:${url}`): Promise<SourceImage> {
  const cached = sources.get(id);
  if (cached) return cached;
  const res = await fetch(url);
  const text = url.endsWith(".svg") ? await res.text() : null;
  if (text) {
    const blobUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    try {
      return await toSource(await loadImg(blobUrl), name, id, svgSize(text));
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  }
  const blobUrl = URL.createObjectURL(await res.blob());
  try {
    return await toSource(await loadImg(blobUrl), name, id);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

/** Restaura una imagen guardada (máscara PNG de «Mis diseños»). */
export async function loadImageDataUrl(dataUrl: string, name: string, id: string) {
  const cached = sources.get(id);
  if (cached) return cached;
  const src = await toSource(await loadImg(dataUrl), name, id);
  return src;
}

/**
 * Máscara blanca (alpha = tinta) recortada al contenido.
 * threshold 0–255: más alto = incluye más píxeles como tinta.
 */
export function makeMask(src: SourceImage, threshold: number, invert: boolean): HTMLCanvasElement {
  const key = `${src.id}|${threshold}|${invert}`;
  const hit = masks.get(key);
  if (hit) return hit;
  const { width: w, height: h } = src.canvas;
  const sctx = src.canvas.getContext("2d", { willReadFrequently: true })!;
  const data = sctx.getImageData(0, 0, w, h).data;
  const out = new ImageData(w, h);
  const o = out.data;
  const [br, bgc, bb] = src.bg;
  const tol = Math.max(4, 255 - threshold);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const k = (y * w + x) * 4;
      const a = data[k + 3] / 255;
      const r = data[k];
      const g = data[k + 1];
      const b = data[k + 2];
      let ink: number;
      if (src.hasAlpha) {
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        // con transparencia: lo opaco es tinta salvo blancos por encima del umbral
        const t = (threshold - lum) / 18 + 0.5;
        ink = (invert ? 1 - clamp01(t) : clamp01(t)) * a;
      } else {
        const d = Math.sqrt((r - br) ** 2 + (g - bgc) ** 2 + (b - bb) ** 2) / 1.2;
        const t = (d - tol) / 16 + 0.5;
        ink = invert ? 1 - clamp01(t) : clamp01(t);
      }
      const v = Math.round(ink * 255);
      o[k] = 255;
      o[k + 1] = 255;
      o[k + 2] = 255;
      o[k + 3] = v;
      if (v > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const full = document.createElement("canvas");
  full.width = w;
  full.height = h;
  full.getContext("2d")!.putImageData(out, 0, 0);
  let result = full;
  if (maxX > minX && maxY > minY) {
    const pad = 2;
    const cw = maxX - minX + 1 + pad * 2;
    const ch = maxY - minY + 1 + pad * 2;
    result = document.createElement("canvas");
    result.width = cw;
    result.height = ch;
    result.getContext("2d")!.drawImage(full, minX - pad, minY - pad, cw, ch, 0, 0, cw, ch);
  }
  masks.set(key, result);
  if (masks.size > 40) masks.delete(masks.keys().next().value!);
  return result;
}

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** PNG reducido de la máscara (para guardar en «Mis diseños»). */
export function maskToDataUrl(mask: HTMLCanvasElement, max = 384) {
  const s = Math.min(1, max / Math.max(mask.width, mask.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(mask.width * s));
  c.height = Math.max(1, Math.round(mask.height * s));
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(mask, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
}
