"use client";

import type { EngraveFont } from "@/components/glassware/Glass";
import { FONT_CSS } from "./types";

const VAR: Record<EngraveFont, string> = {
  classic: "--font-cormorant",
  roman: "--font-cinzel",
  script: "--font-great-vibes",
  pinyon: "--font-pinyon",
  thin: "--font-josefin",
  gothic: "--font-unifraktur",
};

const FALLBACK: Record<EngraveFont, string> = {
  classic: "Georgia, serif",
  roman: "Georgia, serif",
  script: "cursive",
  pinyon: "cursive",
  thin: "sans-serif",
  gothic: "serif",
};

const familyCache = new Map<EngraveFont, string>();

/** Lista de familias real (next/font genera nombres con hash) para usar en ctx.font. */
export function fontFamily(font: EngraveFont) {
  let fam = familyCache.get(font);
  if (!fam) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(VAR[font]).trim();
    fam = v ? `${v}, ${FALLBACK[font]}` : FALLBACK[font];
    familyCache.set(font, fam);
  }
  return fam;
}

export function fontString(font: EngraveFont, sizePx: number) {
  return `${FONT_CSS[font].weight} ${Math.max(1, Math.round(sizePx * 10) / 10)}px ${fontFamily(font)}`;
}

const loaded = new Set<EngraveFont>();
/**
 * Garantiza que la fuente está descargada antes de pintar en canvas.
 * Se carga SOLO la primera familia: la «Fallback» que genera next/font usa
 * local() y en sistemas sin esa fuente (p. ej. Android) haría fallar load().
 */
export async function ensureFont(font: EngraveFont) {
  if (loaded.has(font)) return;
  const primary = fontFamily(font).split(",")[0].trim();
  const spec = `${FONT_CSS[font].weight} 40px ${primary}`;
  try {
    await document.fonts.load(spec, "AaÁáÑñ&0123");
    loaded.add(font);
  } catch {
    try {
      await document.fonts.ready;
      if (document.fonts.check(spec)) loaded.add(font);
    } catch {
      /* el navegador usará la fuente de reserva */
    }
  }
}

export async function ensureFonts(fonts: EngraveFont[]) {
  await Promise.all([...new Set(fonts)].map(ensureFont));
}
