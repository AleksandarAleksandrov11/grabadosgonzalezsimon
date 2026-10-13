"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Design } from "@/lib/engrave/types";
import type { GlassId } from "@/lib/glass/pieces";
import { storage, STORAGE_PREFIX } from "./storage";

export type SavedDesign = {
  id: string;
  name: string;
  design: Design;
  glass: GlassId;
  productHandle: string | null;
  /** miniatura JPEG pequeña */
  preview: string;
  /** máscara procesada (PNG reducido) si el diseño usa una imagen subida */
  imageData?: string;
  createdAt: string;
};

type DesignsState = {
  designs: SavedDesign[];
  save: (d: Omit<SavedDesign, "id" | "createdAt">) => SavedDesign;
  remove: (id: string) => void;
  clear: () => void;
};

const MAX = 12;

export const useDesigns = create<DesignsState>()(
  persist(
    (set, get) => ({
      designs: [],
      save: (d) => {
        const item: SavedDesign = {
          ...d,
          id: `d${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
        };
        set({ designs: [item, ...get().designs].slice(0, MAX) });
        return item;
      },
      remove: (id) => set({ designs: get().designs.filter((x) => x.id !== id) }),
      clear: () => set({ designs: [] }),
    }),
    { name: `${STORAGE_PREFIX}designs`, storage, skipHydration: true, version: 1 },
  ),
);
