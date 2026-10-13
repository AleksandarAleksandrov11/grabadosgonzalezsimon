"use client";

import { create } from "zustand";

/** Estado de UI global (no persistente): drawers, overlays, modales. */
type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickView: string | null; // handle del producto
  /** Rect del origen de la animación «vuelo al carrito» */
  flyFrom: { x: number; y: number; w: number; h: number; image?: string } | null;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  openQuickView: (handle: string | null) => void;
  flyToCart: (from: UIState["flyFrom"]) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickView: null,
  flyFrom: null,
  setCartOpen: (cartOpen) => set({ cartOpen, ...(cartOpen ? { searchOpen: false, menuOpen: false } : {}) }),
  setSearchOpen: (searchOpen) => set({ searchOpen, ...(searchOpen ? { cartOpen: false, menuOpen: false } : {}) }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  openQuickView: (quickView) => set({ quickView }),
  flyToCart: (flyFrom) => set({ flyFrom }),
}));
