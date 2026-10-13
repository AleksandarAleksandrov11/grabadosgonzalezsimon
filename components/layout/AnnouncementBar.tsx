"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePrefersReducedMotion, useStorageItem, writeStorage } from "@/lib/hooks";

const MESSAGES = [
  {
    long: "Grabado artesanal en cristal · Hecho a mano en Madrid",
    short: "Grabado artesanal · Hecho en Madrid",
  },
  { long: "Envío gratis a partir de 60 € (demo)", short: "Envío gratis desde 60 € (demo)" },
  { long: "Demo de presentación — los pedidos son de prueba", short: "Demo: los pedidos son de prueba" },
];

const KEY = "ggs-demo:announce-closed";

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const closed = useStorageItem("session", KEY) === "1";
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (closed || reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 4200);
    return () => window.clearInterval(t);
  }, [closed, reduce]);

  if (closed) return null;
  return (
    <div
      className="theme-dark relative z-[60] h-[var(--announce-h)] border-b border-white/10 bg-ink text-paper"
      role="region"
      aria-label="Avisos"
    >
      <div className="container-x flex h-full items-center justify-center">
        <p className="sr-only">{MESSAGES.map((m) => m.long).join(". ")}</p>
        <div className="relative h-full w-full overflow-hidden" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={i}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center justify-center px-8 text-center text-[0.75rem] font-medium tracking-[0.04em] text-stone-200"
            >
              {i === 2 ? <span className="mr-2 inline-block size-1.5 rounded-full bg-champagne" /> : null}
              <span className="truncate sm:hidden">{MESSAGES[i].short}</span>
              <span className="hidden sm:inline">{MESSAGES[i].long}</span>
            </m.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => writeStorage("session", KEY, "1")}
          className="absolute right-2 inline-flex size-8 items-center justify-center rounded-full text-stone-300 hover:text-paper"
          aria-label="Cerrar avisos"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
