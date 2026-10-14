"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/** true tras el primer render en cliente (evita desajustes de hidratación). */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Atrapa el foco dentro de `ref` mientras `active`. Devuelve el foco al
 * elemento que lo tenía al cerrar. Cierra con Escape.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape?: () => void) {
  const escRef = useRef(onEscape);
  useEffect(() => {
    escRef.current = onEscape;
  });
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    if (!node) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusFirst = () => {
      const auto = node.querySelector<HTMLElement>("[data-autofocus]");
      const first = auto ?? node.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? node).focus({ preventScroll: true });
    };
    const t = window.setTimeout(focusFirst, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        escRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      node.removeEventListener("keydown", onKey);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [active, ref]);
}

let lockCount = 0;
/** Bloquea el scroll del documento (y pausa Lenis) mientras `active`. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount++;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    if (lockCount === 1) {
      html.style.overflow = "hidden";
      if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
      window.dispatchEvent(new CustomEvent("ggs:scroll-lock", { detail: true }));
    }
    return () => {
      lockCount--;
      if (lockCount === 0) {
        html.style.overflow = "";
        html.style.paddingRight = "";
        window.dispatchEvent(new CustomEvent("ggs:scroll-lock", { detail: false }));
      }
    };
  }, [active]);
}

/** Ejecuta `fn` cuando el navegador está libre (tras el LCP), con fallback. */
export function whenIdle(fn: () => void, timeout = 1500) {
  if (typeof window === "undefined") return () => {};
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 200);
  return () => window.clearTimeout(id);
}

export function useInViewOnce<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);
  return [ref, inView] as const;
}

/* ---- Lectura reactiva de localStorage / sessionStorage sin setState en efectos ---- */

const STORAGE_EVENT = "ggs:storage-key";

function readStorage(kind: "local" | "session", key: string) {
  try {
    return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(kind: "local" | "session", key: string, value: string | null) {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* almacenamiento no disponible */
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
}

/** Valor de un item de storage como estado externo (null en el servidor). */
export function useStorageItem(kind: "local" | "session", key: string) {
  return useSyncExternalStore(
    (cb) => {
      const on = (e: Event) => {
        const k = e instanceof StorageEvent ? e.key : (e as CustomEvent<string>).detail;
        if (k === key) cb();
      };
      window.addEventListener("storage", on);
      window.addEventListener(STORAGE_EVENT, on);
      return () => {
        window.removeEventListener("storage", on);
        window.removeEventListener(STORAGE_EVENT, on);
      };
    },
    () => readStorage(kind, key),
    () => null,
  );
}
