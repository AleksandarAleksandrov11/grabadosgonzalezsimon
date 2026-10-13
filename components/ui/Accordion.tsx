"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

/** Acordeón accesible (botón + región) con animación de altura. */
export function Accordion({
  items,
  defaultOpen,
  multiple = false,
  className,
  size = "md",
}: {
  items: AccordionItem[];
  defaultOpen?: string[];
  multiple?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen ?? []);
  const base = useId();
  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : multiple ? [...cur, id] : [id]));
  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        const btnId = `${base}-${it.id}-b`;
        const panelId = `${base}-${it.id}-p`;
        return (
          <div key={it.id} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className={cn(
                  "group flex w-full items-center justify-between gap-6 text-left transition-colors hover:text-fg",
                  size === "lg" ? "py-6 font-display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight" : "",
                  size === "md" ? "py-5 text-[1.0625rem] font-semibold" : "",
                  size === "sm" ? "py-4 text-[0.9375rem] font-semibold" : "",
                )}
              >
                <span>{it.title}</span>
                <span className="relative inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-fg">
                  <span className="absolute h-px w-2.5 bg-current" />
                  <span
                    className={cn(
                      "absolute h-2.5 w-px bg-current transition-transform duration-500 ease-[var(--ease-out)]",
                      isOpen && "scale-y-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <m.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10 text-[0.98rem] leading-relaxed text-fg-muted [&_a]:underline [&_a]:underline-offset-4 [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
                    {it.content}
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
