"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { createPortal } from "react-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import type { LiteProduct } from "@/lib/commerce/catalog-lite";
import { occasions } from "@/data/occasions";
import { useFocusTrap, useMounted, useScrollLock } from "@/lib/hooks";
import { useUI } from "@/lib/store/ui";
import { formatPrice, normalize } from "@/lib/utils";

const SUGGESTIONS = ["copas boda", "vaso whisky", "logo empresa", "trofeo", "comunión", "jarra cerveza"];

export function SearchOverlay({ index }: { index: LiteProduct[] }) {
  const { searchOpen, setSearchOpen } = useUI();
  const mounted = useMounted();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const close = () => {
    setSearchOpen(false);
    setQ("");
  };
  useFocusTrap(ref, searchOpen, close);
  useScrollLock(searchOpen);

  const results = useMemo(() => {
    const n = normalize(dq.trim());
    if (!n) return [];
    const terms = n.split(/\s+/);
    return index
      .map((p) => {
        const hay = normalize(`${p.title} ${p.tagline} ${p.tags.join(" ")} ${p.category}`);
        const ok = terms.every((t) => hay.includes(t.replace(/s$/, "")));
        const score = normalize(p.title).includes(terms[0]) ? 2 : 1;
        return ok ? { p, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, 6)
      .map((x) => x!.p);
  }, [dq, index]);

  const occ = useMemo(() => {
    const n = normalize(dq.trim());
    if (!n) return [];
    return occasions.filter((o) => normalize(o.title).includes(n.slice(0, 4))).slice(0, 3);
  }, [dq]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {searchOpen ? (
        <div className="fixed inset-0 z-[78]" data-floating>
          <m.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en la tienda"
            data-lenis-prevent
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="theme-dark relative mx-auto mt-0 max-h-[100dvh] w-full max-w-3xl overflow-y-auto bg-ink-soft text-fg shadow-2xl sm:mt-[10vh] sm:max-h-[80dvh] sm:rounded-[var(--radius-lg)] sm:border sm:border-white/10"
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (!q.trim()) return;
                close();
                router.push(`/tienda?q=${encodeURIComponent(q.trim())}`);
              }}
              className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-ink-soft px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3"
            >
              <Search className="size-5 shrink-0 text-stone-400" strokeWidth={1.5} />
              <label htmlFor="global-search" className="sr-only">
                Buscar productos
              </label>
              <input
                id="global-search"
                data-autofocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca copas, vasos, trofeos, «boda»…"
                autoComplete="off"
                className="min-h-14 w-full bg-transparent !text-lg text-paper placeholder:text-stone-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={close}
                className="inline-flex tap items-center justify-center rounded-full text-stone-300 hover:text-paper"
                aria-label="Cerrar búsqueda"
              >
                <X className="size-5" />
              </button>
            </form>
            <div className="p-5" aria-live="polite">
              {!dq.trim() ? (
                <div>
                  <p className="mb-4 eyebrow">Búsquedas populares</p>
                  <ul className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => setQ(s)}
                          className="min-h-10 rounded-full border border-white/15 px-4 text-[0.875rem] text-stone-200 hover:border-white/40 hover:text-paper"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : results.length === 0 && occ.length === 0 ? (
                <p className="py-10 text-center text-stone-300">
                  No hay resultados para «{dq}». Prueba con «copa», «vaso» o{" "}
                  <Link href="/contacto" onClick={close} className="underline">
                    cuéntanos tu idea
                  </Link>
                  .
                </p>
              ) : (
                <>
                  <p className="sr-only">{results.length} resultados</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {results.map((p) => (
                      <li key={p.handle}>
                        <Link
                          href={`/producto/${p.handle}`}
                          onClick={close}
                          className="group flex items-center gap-4 rounded-[var(--radius)] p-2 transition-colors hover:bg-white/5"
                        >
                          <span className="w-14 shrink-0 rounded-[var(--radius)] bg-ink p-1">
                            <Glass id={p.illustration} tone="dark" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-paper">{p.title}</span>
                            <span className="text-[0.8125rem] text-stone-400">
                              {p.from ? "desde " : ""}
                              {formatPrice(p.price)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {occ.length ? (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {occ.map((o) => (
                        <Link
                          key={o.slug}
                          href={`/ocasiones/${o.slug}`}
                          onClick={close}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[0.875rem] text-stone-200 hover:text-paper"
                        >
                          Ocasión: {o.title} <ArrowRight className="size-3.5" />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    onClick={() => {
                      close();
                      router.push(`/tienda?q=${encodeURIComponent(q.trim())}`);
                    }}
                    className="mt-6 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-paper underline-offset-4 hover:underline"
                  >
                    Ver todos los resultados en la tienda <ArrowRight className="size-4" />
                  </button>
                </>
              )}
            </div>
            <p className="hidden border-t border-white/10 px-5 py-3 text-[0.75rem] text-stone-500 sm:block">
              Pulsa <kbd className="rounded border border-white/20 px-1">Esc</kbd> para cerrar ·{" "}
              <kbd className="rounded border border-white/20 px-1">⌘K</kbd> /{" "}
              <kbd className="rounded border border-white/20 px-1">Ctrl K</kbd> para abrir
            </p>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
