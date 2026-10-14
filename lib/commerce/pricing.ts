import { site } from "@/data/site";
import { round2 } from "@/lib/utils";
import type { CartLine, VolumeTier } from "./types";

/** Tramos estándar para productos de empresa y eventos. */
export const STANDARD_TIERS: VolumeTier[] = [
  { min: 1, max: 11, discount: 0 },
  { min: 12, max: 23, discount: 0.1 },
  { min: 24, max: 49, discount: 0.15 },
  { min: 50, max: null, discount: 0.15, quote: true },
];

export function tierFor(tiers: VolumeTier[] | undefined, qty: number) {
  if (!tiers?.length) return null;
  return tiers.find((t) => qty >= t.min && (t.max === null || qty <= t.max)) ?? null;
}

/** Precio unitario aplicando el tramo de volumen correspondiente. */
export function unitPriceFor(base: number, tiers: VolumeTier[] | undefined, qty: number) {
  const t = tierFor(tiers, qty);
  return round2(base * (1 - (t?.discount ?? 0)));
}

export function lineTotal(line: Pick<CartLine, "unitPrice" | "volumePricing" | "quantity">) {
  return round2(unitPriceFor(line.unitPrice, line.volumePricing, line.quantity) * line.quantity);
}

export type ShippingMethod = "estandar" | "urgente" | "recogida";

export const SHIPPING_METHODS: { id: ShippingMethod; label: string; detail: string }[] = [
  { id: "estandar", label: "Envío estándar", detail: "48 a 72 h tras la producción" },
  { id: "urgente", label: "Envío urgente", detail: "24 h tras la producción" },
  { id: "recogida", label: "Recogida en taller (Madrid)", detail: "Gratis · te avisamos cuando esté lista" },
];

export function shippingCost(subtotalAfterDiscount: number, method: ShippingMethod = "estandar") {
  if (method === "recogida") return 0;
  const base = subtotalAfterDiscount >= site.shop.freeShippingThreshold ? 0 : site.shop.shippingStandard;
  return round2(base + (method === "urgente" ? site.shop.shippingExpressExtra : 0));
}
