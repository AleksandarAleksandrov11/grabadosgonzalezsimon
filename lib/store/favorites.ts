"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { storage, STORAGE_PREFIX } from "./storage";

type FavState = {
  handles: string[];
  toggle: (handle: string) => boolean;
  has: (handle: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (handle) => {
        const on = !get().handles.includes(handle);
        set({ handles: on ? [handle, ...get().handles] : get().handles.filter((h) => h !== handle) });
        return on;
      },
      has: (handle) => get().handles.includes(handle),
      clear: () => set({ handles: [] }),
    }),
    { name: `${STORAGE_PREFIX}favorites`, storage, skipHydration: true, version: 1 },
  ),
);
