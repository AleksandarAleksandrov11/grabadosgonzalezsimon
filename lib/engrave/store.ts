"use client";

import { create } from "zustand";
import type { Attribute } from "@/lib/commerce/types";
import type { GlassId } from "@/lib/glass/pieces";
import type { PreviewBackground } from "./render";
import { templateById, type TemplateId } from "./templates";
import { DEFAULT_DESIGN, FONT_OPTIONS, type Design } from "./types";

/**
 * Estado del personalizador (no persistente). Lo comparten el estudio
 * (/personaliza) y la versión embebida en la ficha de producto.
 */
type CustomizerState = {
  glass: GlassId;
  productHandle: string | null;
  design: Design;
  past: Design[];
  future: Design[];
  background: PreviewBackground;
  showGuides: boolean;
  /** se incrementa cuando cambia la imagen subida (fuerza el re-render del canvas) */
  imageVersion: number;
  /** ¿el usuario ha tocado el diseño? (para decidir si añadir con diseño) */
  touched: boolean;
  init: (opts: {
    glass: GlassId;
    productHandle?: string | null;
    design?: Partial<Design>;
    background?: PreviewBackground;
  }) => void;
  /** guarda el estado actual en el historial (llamar al empezar un gesto) */
  checkpoint: () => void;
  set: (patch: Partial<Design>, opts?: { history?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  setGlass: (g: GlassId, productHandle?: string | null) => void;
  setBackground: (b: PreviewBackground) => void;
  toggleGuides: () => void;
  applyTemplate: (id: TemplateId) => void;
  resetPosition: () => void;
  bumpImage: () => void;
};

const MAX_HISTORY = 30;
const same = (a: Design, b: Design) => JSON.stringify(a) === JSON.stringify(b);

export const useCustomizer = create<CustomizerState>((set, get) => ({
  glass: "copa-vino",
  productHandle: null,
  design: DEFAULT_DESIGN,
  past: [],
  future: [],
  background: "negro",
  showGuides: true,
  imageVersion: 0,
  touched: false,
  init: ({ glass, productHandle = null, design, background }) =>
    set({
      glass,
      productHandle,
      design: { ...DEFAULT_DESIGN, ...design },
      past: [],
      future: [],
      touched: Boolean(design && Object.keys(design).length),
      ...(background ? { background } : {}),
    }),
  checkpoint: () => {
    const { design, past } = get();
    if (past.length && same(past[past.length - 1], design)) return;
    set({ past: [...past, design].slice(-MAX_HISTORY), future: [] });
  },
  set: (patch, opts) => {
    const { design, past } = get();
    const next = { ...design, ...patch };
    if (same(next, design)) return;
    if (opts?.history !== false) {
      set({ design: next, past: [...past, design].slice(-MAX_HISTORY), future: [], touched: true });
    } else set({ design: next, touched: true });
  },
  undo: () => {
    const { past, design, future } = get();
    if (!past.length) return;
    const prev = past[past.length - 1];
    set({ design: prev, past: past.slice(0, -1), future: [design, ...future].slice(0, MAX_HISTORY) });
  },
  redo: () => {
    const { past, design, future } = get();
    if (!future.length) return;
    set({ design: future[0], future: future.slice(1), past: [...past, design].slice(-MAX_HISTORY) });
  },
  setGlass: (glass, productHandle) =>
    set({ glass, ...(productHandle !== undefined ? { productHandle } : {}) }),
  setBackground: (background) => set({ background }),
  toggleGuides: () => set({ showGuides: !get().showGuides }),
  applyTemplate: (id) => {
    const t = templateById(id);
    if (!t) return;
    get().set({ ...t.preset, x: 0, y: 0, scale: 1, rotation: 0 });
  },
  resetPosition: () => get().set({ x: 0, y: 0, scale: 1, rotation: 0 }),
  bumpImage: () => set({ imageVersion: get().imageVersion + 1 }),
}));

const fontLabel = (f: Design["font"]) => FONT_OPTIONS.find((o) => o.id === f)?.label ?? f;

/** Atributos de línea (line item properties de Shopify) a partir del diseño. */
export function designAttributes(d: Design, glassLabel?: string): Attribute[] {
  const attrs: Attribute[] = [];
  if (d.mode === "text") {
    attrs.push({
      key: "Diseño",
      value: d.ornament !== "none" ? `Texto con ornamento (${d.ornament})` : "Texto",
    });
    attrs.push({ key: "Texto", value: [d.line1.trim(), d.line2.trim()].filter(Boolean).join(" / ") || "—" });
    attrs.push({
      key: "Tipografía",
      value:
        d.line2.trim() && d.font2 !== d.font
          ? `${fontLabel(d.font)} + ${fontLabel(d.font2)}`
          : fontLabel(d.font),
    });
    if (d.curve !== 0) attrs.push({ key: "Curvatura", value: `${Math.round(d.curve * 100)} %` });
  } else {
    attrs.push({ key: "Diseño", value: "Logotipo / imagen" });
    attrs.push({ key: "Logo", value: d.imageName ?? "imagen" });
    if (d.invert) attrs.push({ key: "Invertido", value: "Sí" });
  }
  attrs.push({ key: "Posición", value: `x ${Math.round(d.x * 100)} %, y ${Math.round(d.y * 100)} %` });
  attrs.push({ key: "Escala", value: `${Math.round(d.scale * 100)} %` });
  if (d.rotation) attrs.push({ key: "Rotación", value: `${Math.round(d.rotation)}°` });
  attrs.push({ key: "Cara", value: d.face === "front" ? "Delantera" : "Trasera" });
  if (glassLabel) attrs.push({ key: "Pieza", value: glassLabel });
  // privado: configuración completa para poder reeditar (como _properties en Shopify)
  attrs.push({ key: "_design", value: JSON.stringify({ ...d, imageId: null }) });
  return attrs;
}

/* ---------------------- captura de la vista previa ----------------------- */

type CaptureFn = (opts?: { width?: number; watermark?: boolean }) => Promise<HTMLCanvasElement | null>;
let captureFn: CaptureFn | null = null;

/** El escenario del personalizador registra aquí su función de captura. */
export function registerCapture(fn: CaptureFn | null) {
  captureFn = fn;
}

export function captureDesign(opts?: { width?: number; watermark?: boolean }) {
  return captureFn ? captureFn(opts) : Promise.resolve(null);
}

/* ---------------------- compartir por URL ----------------------------- */

const SHARE_KEYS: (keyof Design)[] = [
  "line1",
  "line2",
  "font",
  "font2",
  "line2Scale",
  "size",
  "tracking",
  "align",
  "curve",
  "ornament",
  "x",
  "y",
  "scale",
  "rotation",
  "face",
];

export function designToQuery(d: Design, glass: GlassId) {
  const p = new URLSearchParams();
  p.set("pieza", glass);
  for (const k of SHARE_KEYS) {
    const v = d[k];
    if (v !== DEFAULT_DESIGN[k]) p.set(k, String(v));
  }
  return p.toString();
}

export function designFromQuery(sp: URLSearchParams): Partial<Design> {
  const out: Partial<Design> = {};
  // alias cortos usados desde la home
  if (sp.get("texto")) out.line1 = sp.get("texto")!.slice(0, 40);
  if (sp.get("fuente")) out.font = sp.get("fuente") as Design["font"];
  for (const k of SHARE_KEYS) {
    const raw = sp.get(k);
    if (raw === null) continue;
    const def = DEFAULT_DESIGN[k];
    if (typeof def === "number") {
      const n = Number(raw);
      if (Number.isFinite(n)) (out as Record<string, unknown>)[k] = n;
    } else (out as Record<string, unknown>)[k] = raw.slice(0, 60);
  }
  if (out.font && !FONT_OPTIONS.some((f) => f.id === out.font)) delete out.font;
  if (out.font2 && !FONT_OPTIONS.some((f) => f.id === out.font2)) delete out.font2;
  if (sp.get("texto") && !sp.get("line2")) out.line2 = "";
  if (sp.get("texto") && !sp.get("font2") && out.font) out.font2 = out.font;
  return out;
}
