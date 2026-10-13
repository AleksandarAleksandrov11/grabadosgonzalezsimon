"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check, Info, X } from "lucide-react";
import { useToasts } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 top-0 z-[85] flex flex-col items-center gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:top-auto sm:right-auto sm:bottom-0 sm:items-start sm:pt-0 sm:pb-6 sm:pl-6"
      data-floating
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <m.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role={t.tone === "error" ? "alert" : "status"}
            className="theme-dark pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-lg)] border border-line bg-ink-soft/95 p-4 text-fg shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur"
          >
            <span
              className={cn(
                "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                t.tone === "error" ? "bg-[#ffb4ab]/15 text-[#ffb4ab]" : "bg-paper/10 text-paper",
              )}
            >
              {t.tone === "error" ? <Info className="size-3.5" /> : <Check className="size-3.5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.9375rem] font-semibold">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-[0.8125rem] text-fg-muted">{t.description}</p>
              ) : null}
            </div>
            {t.action ? (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="min-h-9 shrink-0 rounded-[var(--radius)] border border-line-strong px-3 text-[0.8125rem] font-semibold hover:bg-paper/10"
              >
                {t.action.label}
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => dismiss(t.id)}
              className="-mt-1 -mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-fg-muted hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
