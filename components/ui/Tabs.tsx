"use client";

import * as m from "motion/react-m";
import { useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

/** Pestañas accesibles (patrón WAI-ARIA, flechas para moverse). */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  label,
  idBase,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  label: string;
  idBase?: string;
}) {
  const auto = useId();
  const base = idBase ?? auto;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(tabs[next].value);
      refs.current[next]?.focus();
    }
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("relative -mx-1 scrollbar-none flex gap-1 overflow-x-auto px-1", className)}
    >
      {tabs.map((t, i) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${t.value}`}
            role="tab"
            type="button"
            aria-selected={active}
            aria-controls={`${base}-panel`}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange(t.value)}
            className={cn(
              "relative min-h-11 shrink-0 rounded-full px-5 text-[0.875rem] font-semibold transition-colors",
              active ? "text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            {active ? (
              <m.span
                layoutId={`${base}-pill`}
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
