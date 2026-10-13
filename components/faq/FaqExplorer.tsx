"use client";

import { useDeferredValue, useState } from "react";
import { Search, X } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq, FaqGroup } from "@/data/faqs";
import { cn, normalize } from "@/lib/utils";

/** Buscador + acordeones agrupados de las preguntas frecuentes. */
export function FaqExplorer({ faqs, groups }: { faqs: Faq[]; groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<FaqGroup | "Todas">("Todas");
  const q = normalize(useDeferredValue(query).trim());
  const matches = faqs.filter(
    (f) => (group === "Todas" || f.group === group) && (!q || normalize(`${f.q} ${f.a}`).includes(q)),
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      <aside className="self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-4">
        <label htmlFor="faq-search" className="sr-only">
          Buscar en las preguntas frecuentes
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-subtle" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca: lavavajillas, logo, plazo…"
            className="h-13 w-full rounded-full border border-line-strong bg-surface pr-11 pl-11 text-fg placeholder:text-fg-subtle focus:border-fg focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-fg/6"
              aria-label="Borrar búsqueda"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <nav aria-label="Temas" className="mt-6">
          <ul className="-mx-[var(--gutter)] scrollbar-none flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {(["Todas", ...groups] as const).map((g) => {
              const count = g === "Todas" ? faqs.length : faqs.filter((f) => f.group === g).length;
              return (
                <li key={g} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setGroup(g)}
                    aria-pressed={group === g}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-4 rounded-full border px-4 text-[0.9375rem] transition-colors lg:rounded-[var(--radius)] lg:border-transparent",
                      group === g
                        ? "border-fg bg-fg text-bg"
                        : "border-line-strong hover:border-fg lg:hover:border-line-strong",
                    )}
                  >
                    {g}
                    <span className={cn("text-[0.8125rem]", group === g ? "text-bg/70" : "text-fg-subtle")}>
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="lg:col-span-8" aria-live="polite">
        {matches.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-14 text-center">
            <p className="font-display text-3xl">Sin resultados</p>
            <p className="mt-2 text-fg-muted">
              No encontramos «{query}». Prueba con otra palabra o pregúntanos directamente.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups
              .filter((g) => matches.some((f) => f.group === g))
              .map((g) => (
                <section key={g} aria-labelledby={`grupo-${g}`}>
                  <h2 id={`grupo-${g}`} className="mb-2 font-display text-display-s">
                    {g}
                  </h2>
                  <Accordion
                    key={`${g}-${q}`}
                    size="md"
                    multiple
                    items={matches
                      .filter((f) => f.group === g)
                      .map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))}
                    defaultOpen={q ? matches.filter((f) => f.group === g).map((f) => f.id) : []}
                  />
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
