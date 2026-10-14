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

// compartir por URL: en un módulo sin "use client" para poder usarlo también en el servidor
export { designFromQuery, designToQuery } from "./share";
