import { round2 } from "@/lib/utils";
import { lineTotal } from "./pricing";
import type { CartLine } from "./types";

/**
 * Códigos de descuento. En Shopify serían «Discount codes» del panel
 * (ver SHOPIFY_MIGRATION.md).
 */
export const DISCOUNT_CODES = {
  BIENVENIDA10: { code: "BIENVENIDA10", label: "−10 % en todo el pedido", percent: 0.1, tag: null },
  BODA15: { code: "BODA15", label: "−15 % en productos para bodas", percent: 0.15, tag: "boda" },
} as const;

export type DiscountCode = keyof typeof DISCOUNT_CODES;

export function validateDiscount(
  raw: string,
  lines: CartLine[],
): { ok: true; code: DiscountCode } | { ok: false; error: string } {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, error: "Introduce un código." };
  if (!(code in DISCOUNT_CODES)) return { ok: false, error: "Este código no es válido." };
  const d = DISCOUNT_CODES[code as DiscountCode];
  if (d.tag && !lines.some((l) => l.tags.includes(d.tag!))) {
    return {
      ok: false,
      error: "BODA15 solo se aplica a productos para bodas y no hay ninguno en tu carrito.",
    };
  }
  return { ok: true, code: code as DiscountCode };
}

export function discountAmount(code: DiscountCode | null, lines: CartLine[]) {
  if (!code) return 0;
  const d = DISCOUNT_CODES[code];
  const base = lines.filter((l) => !d.tag || l.tags.includes(d.tag)).reduce((s, l) => s + lineTotal(l), 0);
  return round2(base * d.percent);
}
