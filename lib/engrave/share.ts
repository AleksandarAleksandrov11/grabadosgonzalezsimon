import type { GlassId } from "@/lib/glass/pieces";
import { DEFAULT_DESIGN, FONT_OPTIONS, type Design } from "./types";

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
