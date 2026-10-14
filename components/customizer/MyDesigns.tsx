"use client";

import { Trash2 } from "lucide-react";
import { useDesigns, type SavedDesign } from "@/lib/store/designs";
import { useHydrated } from "@/lib/store/hydration";
import { formatDate } from "@/lib/utils";
import { PIECES } from "@/lib/glass/pieces";

/** Lista de «Mis diseños» guardados en este navegador. */
export function MyDesigns({ onLoad }: { onLoad: (d: SavedDesign) => void }) {
  const hydrated = useHydrated((s) => s.hydrated);
  const { designs, remove } = useDesigns();
  if (!hydrated) return null;
  if (!designs.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong px-5 py-10 text-center">
        <p className="font-display text-2xl">Aún no has guardado diseños</p>
        <p className="mt-2 text-[0.9375rem] text-fg-muted">
          Pulsa «Guardar diseño» y lo encontrarás aquí la próxima vez.
        </p>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {designs.map((d) => (
        <li
          key={d.id}
          className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line"
        >
          <button
            type="button"
            onClick={() => onLoad(d)}
            className="block w-full text-left"
            aria-label={`Cargar diseño ${d.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.preview} alt="" className="aspect-[4/5] w-full bg-ink object-cover" />
            <span className="block p-3">
              <span className="block truncate text-[0.875rem] font-semibold">{d.name}</span>
              <span className="block text-[0.75rem] text-fg-subtle">
                {PIECES[d.glass].label} · {formatDate(d.createdAt)}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => remove(d.id)}
            className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full bg-black/50 text-paper backdrop-blur hover:bg-black/70"
            aria-label={`Borrar diseño ${d.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
