"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { useCart } from "./cart";
import { useDesigns } from "./designs";
import { useFavorites } from "./favorites";
import { useOrders } from "./orders";
import { toast } from "./toast";

/** `true` cuando los stores persistidos ya se han leído de localStorage. */
export const useHydrated = create<{ hydrated: boolean }>(() => ({ hydrated: false }));

/**
 * Rehidrata los stores tras el montaje (skipHydration) para evitar errores
 * de hidratación: el servidor siempre pinta el estado vacío.
 */
export function StoreHydrator() {
  useEffect(() => {
    Promise.all([
      useCart.persist.rehydrate(),
      useOrders.persist.rehydrate(),
      useFavorites.persist.rehydrate(),
      useDesigns.persist.rehydrate(),
    ]).finally(() => useHydrated.setState({ hydrated: true }));

    // sincronizar entre pestañas
    const onStorage = (e: StorageEvent) => {
      if (!e.key?.startsWith("ggs:")) return;
      if (e.key.endsWith("cart")) useCart.persist.rehydrate();
      if (e.key.endsWith("orders")) useOrders.persist.rehydrate();
      if (e.key.endsWith("favorites")) useFavorites.persist.rehydrate();
      if (e.key.endsWith("designs")) useDesigns.persist.rehydrate();
    };
    const onFull = () =>
      toast({
        title: "Almacenamiento lleno",
        description:
          "El navegador no tiene espacio para guardar más datos. Borra pedidos o diseños antiguos.",
        tone: "error",
      });
    window.addEventListener("storage", onStorage);
    window.addEventListener("ggs:storage-full", onFull);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ggs:storage-full", onFull);
    };
  }, []);
  return null;
}
