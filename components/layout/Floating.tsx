"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { WhatsAppIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { whatsappLink } from "@/data/site";
import { useStorageItem, writeStorage } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Botón flotante de WhatsApp. En móvil sube cuando hay barra sticky de compra (--float-offset). */
export function WhatsAppButton() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  // aparece al hacer scroll (no tapa los CTA del hero) o tras unos segundos
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.55) setShow(true);
    };
    const t = window.setTimeout(() => setShow(true), 9000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  if (pathname.startsWith("/checkout") || pathname.startsWith("/personaliza")) return null;
  return (
    <AnimatePresence>
      {show ? (
        <m.a
          data-floating
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp (se abre en una pestaña nueva)"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ bottom: "calc(max(1rem, env(safe-area-inset-bottom)) + var(--float-offset, 0px))" }}
          className="group fixed right-4 z-[45] inline-flex size-12 items-center justify-center rounded-full border border-white/15 bg-ink text-paper shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-[bottom,transform] duration-300 hover:scale-105 sm:right-6 sm:size-14"
        >
          <WhatsAppIcon className="size-6" />
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-ink px-3 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
            ¿Hablamos?
          </span>
        </m.a>
      ) : null}
    </AnimatePresence>
  );
}

const COOKIE_KEY = "ggs:cookies";
type Consent = { necessary: true; analytics: boolean; preferences: boolean; date: string };

/** Banner de cookies funcional (aceptar / rechazar / configurar), guardado en localStorage. */
export function CookieBanner() {
  const stored = useStorageItem("local", COOKIE_KEY);
  const [delayPassed, setDelayPassed] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [preferences, setPreferences] = useState(true);
  const visible = !stored && delayPassed;

  useEffect(() => {
    const t = window.setTimeout(() => setDelayPassed(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const openConfig = () => {
    try {
      const c = stored ? (JSON.parse(stored) as Consent) : null;
      if (c) {
        setAnalytics(c.analytics);
        setPreferences(c.preferences);
      }
    } catch {}
    setConfigOpen(true);
  };

  useEffect(() => {
    window.addEventListener("ggs:cookie-settings", openConfig);
    return () => window.removeEventListener("ggs:cookie-settings", openConfig);
  });

  const save = (c: Omit<Consent, "date" | "necessary">) => {
    writeStorage(
      "local",
      COOKIE_KEY,
      JSON.stringify({ necessary: true, ...c, date: new Date().toISOString() }),
    );
    setConfigOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && !configOpen ? (
          <m.div
            data-floating
            role="region"
            aria-label="Aviso de cookies"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="theme-dark fixed inset-x-3 bottom-3 z-[65] rounded-[var(--radius-lg)] border border-white/12 bg-ink-soft/95 p-4 text-fg shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-[420px] sm:p-6"
          >
            <p className="font-display text-xl leading-tight sm:text-2xl">Cookies, solo las justas</p>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-fg-muted sm:mt-2 sm:text-[0.875rem]">
              Usamos cookies técnicas para que la tienda funcione (carrito, preferencias). Las analíticas solo
              si las aceptas.{" "}
              <Link href="/legal/cookies" className="underline underline-offset-2">
                Política de cookies
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => save({ analytics: true, preferences: true })}
                className="order-3 ml-auto"
              >
                Aceptar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => save({ analytics: false, preferences: false })}
              >
                Rechazar
              </Button>
              <Button size="sm" variant="ghost" onClick={openConfig} className="px-2">
                Configurar
              </Button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
      <Modal open={configOpen} onClose={() => setConfigOpen(false)} title="Configurar cookies" size="md">
        <div className="space-y-4 px-5 pt-2 pb-6">
          {[
            {
              id: "nec",
              label: "Técnicas (necesarias)",
              desc: "Carrito, pedidos y preferencias. Siempre activas.",
              value: true,
              set: null,
            },
            {
              id: "pref",
              label: "Preferencias",
              desc: "Recordar avisos cerrados y ajustes de visualización.",
              value: preferences,
              set: setPreferences,
            },
            {
              id: "ana",
              label: "Analíticas",
              desc: "Medición anónima de visitas para mejorar la web.",
              value: analytics,
              set: setAnalytics,
            },
          ].map((c) => (
            <label
              key={c.id}
              className={cn(
                "flex items-start justify-between gap-4 rounded-[var(--radius)] border border-line p-4",
                c.set ? "cursor-pointer" : "opacity-80",
              )}
            >
              <span>
                <span className="block font-semibold">{c.label}</span>
                <span className="mt-1 block text-[0.8125rem] text-fg-muted">{c.desc}</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={c.value}
                disabled={!c.set}
                onChange={(e) => c.set?.(e.target.checked)}
                className="mt-1 size-5 shrink-0 accent-[var(--fg)]"
              />
            </label>
          ))}
          <div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
            <Button onClick={() => save({ analytics, preferences })}>Guardar preferencias</Button>
            <Button variant="outline" onClick={() => save({ analytics: true, preferences: true })}>
              Aceptar todas
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("ggs:cookie-settings"));
}
