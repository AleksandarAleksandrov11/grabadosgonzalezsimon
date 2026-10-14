"use client";

import { create } from "zustand";
import type { Product } from "@/lib/commerce/types";

/** Estado de UI global (no persistente): drawers, overlays, modales. */
type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickView: Product | null;
  /** Origen y destino de la animación «vuelo al carrito» */
  flyFrom: { x: number; y: number; w: number; h: number; image?: string; tx: number; ty: number } | null;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  openQuickView: (product: Product | null) => void;
  flyToCart: (from: { x: number; y: number; w: number; h: number; image?: string } | null) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickView: null,
  flyFrom: null,
  setCartOpen: (cartOpen) => set({ cartOpen, ...(cartOpen ? { searchOpen: false, menuOpen: false } : {}) }),
  setSearchOpen: (searchOpen) =>
    set({ searchOpen, ...(searchOpen ? { cartOpen: false, menuOpen: false } : {}) }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  openQuickView: (quickView) => set({ quickView }),
  flyToCart: (from) => {
    if (!from) return set({ flyFrom: null });
    // con movimiento reducido no hay vuelo: se abre el carrito directamente
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return set({ flyFrom: null, cartOpen: true });
    }
    const btn = document.getElementById("cart-button")?.getBoundingClientRect();
    set({
      flyFrom: {
        ...from,
        tx: btn ? btn.left + btn.width / 2 : window.innerWidth - 40,
        ty: btn ? btn.top + btn.height / 2 : 30,
      },
    });
  },
}));
