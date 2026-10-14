"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  tone?: "default" | "success" | "error";
  duration?: number;
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => number;
  dismiss: (id: number) => void;
};

let seq = 0;

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = ++seq;
    set({ toasts: [...get().toasts.slice(-2), { ...t, id }] });
    const duration = t.duration ?? (t.action ? 6000 : 3800);
    window.setTimeout(() => get().dismiss(id), duration);
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}));

export const toast = (t: Omit<Toast, "id">) => useToasts.getState().push(t);
