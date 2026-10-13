"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/commerce/types";
import type { ShippingMethod } from "@/lib/commerce/pricing";
import type { CartTotals } from "./cart";
import { storage, STORAGE_PREFIX } from "./storage";

export type OrderPayment = "tarjeta" | "bizum" | "transferencia";

export type Order = {
  id: string; // GGS-2026-XXXX
  createdAt: string;
  status: "recibido";
  lines: CartLine[];
  contact: { email: string; phone: string; newsletter: boolean };
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    province: string;
    country: string;
    method: ShippingMethod;
  };
  desiredDate?: string;
  note?: string;
  payment: { method: OrderPayment; last4?: string };
  discountCode: string | null;
  totals: CartTotals;
};

type OrdersState = {
  orders: Order[];
  add: (order: Omit<Order, "id" | "createdAt" | "status">) => Order;
  clear: () => void;
};

const MAX_ORDERS = 12;

function newOrderId(existing: Order[]) {
  const year = new Date().getFullYear();
  let id = "";
  do {
    id = `GGS-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;
  } while (existing.some((o) => o.id === id));
  return id;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (data) => {
        const order: Order = { ...data, id: newOrderId(get().orders), createdAt: new Date().toISOString(), status: "recibido" };
        // los pedidos antiguos conservan los datos pero pierden las miniaturas para no llenar localStorage
        const older = get()
          .orders.slice(0, MAX_ORDERS - 1)
          .map((o, i) => (i < 3 ? o : { ...o, lines: o.lines.map((l) => ({ ...l, preview: undefined })) }));
        set({ orders: [order, ...older] });
        return order;
      },
      clear: () => set({ orders: [] }),
    }),
    { name: `${STORAGE_PREFIX}orders`, storage, skipHydration: true, version: 1 },
  ),
);
