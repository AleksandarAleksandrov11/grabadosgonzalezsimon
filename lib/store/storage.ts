"use client";

import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * localStorage tolerante a fallos: si se supera la cuota (miniaturas de
 * grabados), se emite un evento para que la UI avise y se descarta la
 * escritura sin romper la aplicación.
 */
const safe: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch (err) {
      window.dispatchEvent(new CustomEvent("ggs:storage-full", { detail: { name, error: String(err) } }));
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* noop */
    }
  },
};

export const storage = createJSONStorage(() => safe);

/** Prefijo común de las claves de la demo (para «Borrar datos de la demo»). */
export const STORAGE_PREFIX = "ggs-demo:";
