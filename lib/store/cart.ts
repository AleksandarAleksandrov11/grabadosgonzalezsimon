"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { discountAmount, type DiscountCode } from "@/lib/commerce/discounts";
import { lineTotal, shippingCost, type ShippingMethod } from "@/lib/commerce/pricing";
import type { Attribute, CartLine } from "@/lib/commerce/types";
import { round2 } from "@/lib/utils";
import { storage, STORAGE_PREFIX } from "./storage";

export type NewLine = Omit<CartLine, "id" | "addedAt" | "quantity">;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** Clave de línea única por variante + diseño (los attributes distinguen diseños). */
export function lineKey(merchandiseId: string, attributes: Attribute[]) {
  const sig = attributes
    .filter((a) => a.key !== "_preview")
    .map((a) => `${a.key}=${a.value}`)
    .join("|");
  return `${merchandiseId}::${hash(sig)}`;
}

type CartState = {
  lines: CartLine[];
  discountCode: DiscountCode | null;
  note: string;
  add: (line: NewLine, quantity?: number) => string;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => { line: CartLine; index: number } | null;
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
  setDiscount: (code: DiscountCode | null) => void;
  setNote: (note: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      discountCode: null,
      note: "",
      add: (line, quantity = 1) => {
        const id = lineKey(line.merchandiseId, line.attributes);
        const lines = get().lines;
        const existing = lines.find((l) => l.id === id);
        const min = line.minQuantity ?? 1;
        if (existing) {
          set({
            lines: lines.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity, preview: line.preview ?? l.preview } : l)),
          });
        } else {
          set({ lines: [...lines, { ...line, id, quantity: Math.max(min, quantity), addedAt: Date.now() }] });
        }
        return id;
      },
      setQuantity: (id, quantity) =>
        set({
          lines: get().lines.map((l) => (l.id === id ? { ...l, quantity: Math.max(l.minQuantity ?? 1, Math.min(9999, quantity)) } : l)),
        }),
      remove: (id) => {
        const lines = get().lines;
        const index = lines.findIndex((l) => l.id === id);
        if (index < 0) return null;
        const line = lines[index];
        const next = lines.filter((l) => l.id !== id);
        set({ lines: next, discountCode: next.length ? get().discountCode : null });
        return { line, index };
      },
      restore: (line, index) => {
        const lines = [...get().lines];
        lines.splice(Math.min(index, lines.length), 0, line);
        set({ lines });
      },
      clear: () => set({ lines: [], discountCode: null, note: "" }),
      setDiscount: (discountCode) => set({ discountCode }),
      setNote: (note) => set({ note }),
    }),
    { name: `${STORAGE_PREFIX}cart`, storage, skipHydration: true, version: 1 },
  ),
);

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  /** IVA incluido (21 %) */
  vat: number;
  freeShippingRemaining: number;
};

export function computeTotals(
  lines: CartLine[],
  discountCode: DiscountCode | null,
  method: ShippingMethod = "estandar",
  freeThreshold = 60,
): CartTotals {
  const subtotal = round2(lines.reduce((s, l) => s + lineTotal(l), 0));
  const discount = discountAmount(discountCode, lines);
  const afterDiscount = round2(subtotal - discount);
  const shipping = lines.length ? shippingCost(afterDiscount, method) : 0;
  const total = round2(afterDiscount + shipping);
  return {
    itemCount: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal,
    discount,
    shipping,
    total,
    vat: round2(total - total / 1.21),
    freeShippingRemaining: Math.max(0, round2(freeThreshold - afterDiscount)),
  };
}

export const attr = (attributes: Attribute[], key: string) => attributes.find((a) => a.key === key)?.value;
