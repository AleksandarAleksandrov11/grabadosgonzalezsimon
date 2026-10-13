"use client";

import { useId, useState } from "react";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import type { GlassId } from "@/lib/glass/pieces";

/** Comparador antes/después: el mismo cristal liso y grabado, con un deslizador. */
export function BeforeAfter({ glass, engraving }: { glass: GlassId; engraving: StaticEngraving }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="theme-dark mx-auto w-full max-w-[520px]">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-ink select-none">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(255,255,255,0.09),transparent_70%)]"
        />
        <div className="relative px-[10%] pt-[4%]">
          <Glass id={glass} tone="dark" title="Pieza grabada" engraving={engraving} />
        </div>
        <div
          className="absolute inset-0 px-[10%] pt-[4%]"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(255,255,255,0.09),transparent_70%)]" />
          <Glass id={glass} tone="dark" className="relative" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-paper/70"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 inline-flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/60 bg-ink/70 text-paper backdrop-blur">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </span>
        </div>
        <span className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-paper uppercase">
          Antes
        </span>
        <span className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-paper uppercase">
          Después
        </span>
        <label htmlFor={id} className="sr-only">
          Deslizar para comparar antes y después del grabado
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-center text-[0.8125rem] text-stone-400">
        Desliza para ver la pieza antes y después del grabado (vista generada)
      </figcaption>
    </figure>
  );
}
