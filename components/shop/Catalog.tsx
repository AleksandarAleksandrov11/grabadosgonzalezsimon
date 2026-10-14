"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Drawer } from "@/components/ui/Drawer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { DemoPriceNote } from "@/components/ui/misc";
import { categories } from "@/data/collections";
import { OCCASION_LABEL } from "@/data/occasion-labels";
import { filterProducts } from "@/lib/commerce/filter";
import type { CategoryHandle, OccasionTag, Product, SortKey } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

const PAGE = 12;
const PRICE_MAX = 100;
const SORTS: { value: SortKey; label: string }[] = [
  { value: "destacados", label: "Destacados" },
  { value: "precio-asc", label: "Precio: de menor a mayor" },
  { value: "precio-desc", label: "Precio: de mayor a menor" },
  { value: "novedades", label: "Novedades" },
];
const OCCASIONS = Object.keys(OCCASION_LABEL) as OccasionTag[];

type State = {
  cat: CategoryHandle | null;
  occ: OccasionTag[];
  min: number;
  max: number;
  pers: ("texto" | "logo")[];
  q: string;
  sort: SortKey;
  page: number;
};

function parse(sp: URLSearchParams, fixedCat: CategoryHandle | null): State {
  const list = (k: string) => (sp.get(k) ?? "").split(",").filter(Boolean);
  const num = (k: string, d: number) => {
    const n = Number(sp.get(k));
    return sp.has(k) && Number.isFinite(n) ? n : d;
  };
  const cat = (fixedCat ?? sp.get("categoria")) as CategoryHandle | null;
  return {
    cat: categories.some((c) => c.handle === cat) ? cat : null,
    occ: list("ocasion").filter((o): o is OccasionTag => OCCASIONS.includes(o as OccasionTag)),
    min: Math.max(0, num("min", 0)),
    max: Math.min(PRICE_MAX, num("max", PRICE_MAX)),
    pers: list("personalizacion").filter((p): p is "texto" | "logo" => p === "texto" || p === "logo"),
    q: sp.get("q") ?? "",
    sort: (SORTS.find((s) => s.value === sp.get("orden"))?.value ?? "destacados") as SortKey,
    page: Math.max(1, num("pagina", 1)),
  };
}

export function Catalog({
  products,
  fixedCategory = null,
}: {
  products: Product[];
  fixedCategory?: CategoryHandle | null;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = useMemo(() => parse(new URLSearchParams(sp.toString()), fixedCategory), [sp, fixedCategory]);
  const [drawer, setDrawer] = useState(false);
  const [qDraft, setQDraft] = useState(state.q);
  const [prevQ, setPrevQ] = useState(state.q);
  if (prevQ !== state.q) {
    setPrevQ(state.q);
    setQDraft(state.q);
  }

  const update = (patch: Partial<State>, resetPage = true) => {
    const next = { ...state, ...patch, ...(resetPage && !("page" in patch) ? { page: 1 } : {}) };
    const p = new URLSearchParams();
    if (!fixedCategory && next.cat) p.set("categoria", next.cat);
    if (next.occ.length) p.set("ocasion", next.occ.join(","));
    if (next.min > 0) p.set("min", String(next.min));
    if (next.max < PRICE_MAX) p.set("max", String(next.max));
    if (next.pers.length) p.set("personalizacion", next.pers.join(","));
    if (next.q.trim()) p.set("q", next.q.trim());
    if (next.sort !== "destacados") p.set("orden", next.sort);
    if (next.page > 1) p.set("pagina", String(next.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // búsqueda con pequeño retardo
  useEffect(() => {
    if (qDraft === state.q) return;
    const t = window.setTimeout(() => update({ q: qDraft }), 280);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDraft]);

  const results = useMemo(
    () =>
      filterProducts(products, {
        category: state.cat,
        occasions: state.occ,
        priceMin: state.min > 0 ? state.min : undefined,
        priceMax: state.max < PRICE_MAX ? state.max : undefined,
        personalization: state.pers,
        query: state.q,
        sort: state.sort,
      }),
    [products, state],
  );
  const visible = results.slice(0, state.page * PAGE);

  const chips: { label: string; clear: () => void }[] = [];
  if (!fixedCategory && state.cat)
    chips.push({
      label: categories.find((c) => c.handle === state.cat)!.short,
      clear: () => update({ cat: null }),
    });
  state.occ.forEach((o) =>
    chips.push({ label: OCCASION_LABEL[o], clear: () => update({ occ: state.occ.filter((x) => x !== o) }) }),
  );
  if (state.min > 0 || state.max < PRICE_MAX)
    chips.push({
      label: `${formatPrice(state.min)} – ${formatPrice(state.max)}`,
      clear: () => update({ min: 0, max: PRICE_MAX }),
    });
  state.pers.forEach((p) =>
    chips.push({
      label: p === "logo" ? "Con logo" : "Con texto",
      clear: () => update({ pers: state.pers.filter((x) => x !== p) }),
    }),
  );
  if (state.q) chips.push({ label: `«${state.q}»`, clear: () => update({ q: "" }) });
  const clearAll = () => router.replace(pathname, { scroll: false });

  const filterBody = (layout: "drawer" | "bar") => (
    <FilterControls state={state} update={update} showCategory={!fixedCategory} layout={layout} />
  );

  return (
    <div>
      {/* barra de herramientas */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] border-y border-line bg-bg/92 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-subtle"
              aria-hidden="true"
            />
            <label htmlFor="catalog-q" className="sr-only">
              Buscar en la tienda
            </label>
            <input
              id="catalog-q"
              type="search"
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              placeholder="Buscar…"
              className="h-11 w-full rounded-full border border-line-strong bg-surface pr-4 pl-9 !text-[0.9375rem] placeholder:text-fg-subtle focus:border-fg focus:outline-none"
            />
          </div>
          <div className="hidden items-center gap-2 lg:flex">{filterBody("bar")}</div>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.875rem] font-semibold lg:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.6} />
            Filtros
            {chips.length ? (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-fg text-[0.6875rem] text-bg">
                {chips.length}
              </span>
            ) : null}
          </button>
          <SortSelect value={state.sort} onChange={(sort) => update({ sort })} />
        </div>
        <AnimatePresence initial={false}>
          {chips.length ? (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ul className="flex flex-wrap items-center gap-2 pt-3" aria-label="Filtros activos">
                {chips.map((c) => (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={c.clear}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-fg/[0.07] px-3 text-[0.8125rem] font-medium hover:bg-fg/[0.12]"
                      aria-label={`Quitar filtro ${c.label}`}
                    >
                      {c.label} <X className="size-3.5" />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="min-h-9 px-2 text-[0.8125rem] font-semibold underline underline-offset-4"
                  >
                    Limpiar todo
                  </button>
                </li>
              </ul>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-[0.875rem] text-fg-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "producto" : "productos"}
        </p>
        <DemoPriceNote />
      </div>

      {results.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <>
          <h2 className="sr-only">Productos</h2>
          <m.ul
            layout
            className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <m.li
                  key={p.handle}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: Math.min(i, 8) * 0.03 } }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="relative"
                >
                  <ProductCard product={p} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
          {visible.length < results.length ? (
            <div className="mt-14 flex flex-col items-center gap-3">
              <p className="text-[0.8125rem] text-fg-subtle">
                Mostrando {visible.length} de {results.length}
              </p>
              <Button variant="outline" size="lg" onClick={() => update({ page: state.page + 1 }, false)}>
                Cargar más
              </Button>
            </div>
          ) : null}
        </>
      )}

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Filtros"
        side="bottom"
        mobileHeight="auto"
        footer={
          <div className="grid grid-cols-2 gap-2 pb-1">
            <Button variant="outline" onClick={clearAll}>
              Limpiar
            </Button>
            <Button onClick={() => setDrawer(false)}>Ver {results.length} resultados</Button>
          </div>
        }
      >
        <div className="px-5 py-4">{filterBody("drawer")}</div>
      </Drawer>
    </div>
  );
}

/** Grid estático (sin filtros) para el HTML inicial / fallback de Suspense: SEO y sin JS. */
export function StaticGrid({ products }: { products: Product[] }) {
  return (
    <>
      <h2 className="sr-only">Productos</h2>
      <ul className="mt-24 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, PAGE).map((p) => (
          <li key={p.handle} className="relative">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <div className="relative ml-auto">
      <label htmlFor="catalog-sort" className="sr-only">
        Ordenar por
      </label>
      <select
        id="catalog-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-11 appearance-none rounded-full border border-line-strong bg-surface pr-9 pl-4 !text-[0.875rem] font-semibold focus:border-fg focus:outline-none"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

function FilterControls({
  state,
  update,
  showCategory,
  layout,
}: {
  state: State;
  update: (p: Partial<State>) => void;
  showCategory: boolean;
  layout: "drawer" | "bar";
}) {
  const id = useId();
  const sections: { key: string; title: string; count: number; body: ReactNode }[] = [];
  if (showCategory)
    sections.push({
      key: "cat",
      title: "Categoría",
      count: state.cat ? 1 : 0,
      body: (
        <fieldset>
          <legend className="sr-only">Categoría</legend>
          <div className="flex flex-wrap gap-2">
            {[{ handle: null, short: "Todas" }, ...categories].map((c) => (
              <label
                key={c.handle ?? "all"}
                className={cn(
                  "inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 text-[0.875rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg",
                  state.cat === c.handle ? "border-fg bg-fg text-bg" : "border-line-strong hover:border-fg",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-cat`}
                  className="sr-only"
                  checked={state.cat === c.handle}
                  onChange={() => update({ cat: c.handle as CategoryHandle | null })}
                />
                {c.short}
              </label>
            ))}
          </div>
        </fieldset>
      ),
    });
  sections.push({
    key: "occ",
    title: "Ocasión",
    count: state.occ.length,
    body: (
      <fieldset>
        <legend className="sr-only">Ocasión</legend>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => {
            const on = state.occ.includes(o);
            return (
              <label
                key={o}
                className={cn(
                  "inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 text-[0.875rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg",
                  on ? "border-fg bg-fg text-bg" : "border-line-strong hover:border-fg",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => update({ occ: on ? state.occ.filter((x) => x !== o) : [...state.occ, o] })}
                />
                {OCCASION_LABEL[o]}
              </label>
            );
          })}
        </div>
      </fieldset>
    ),
  });
  sections.push({
    key: "price",
    title: "Precio",
    count: state.min > 0 || state.max < PRICE_MAX ? 1 : 0,
    body: <PriceRange min={state.min} max={state.max} onChange={(min, max) => update({ min, max })} />,
  });
  sections.push({
    key: "pers",
    title: "Personalización",
    count: state.pers.length,
    body: (
      <fieldset className="space-y-2">
        <legend className="sr-only">Tipo de personalización</legend>
        {(["texto", "logo"] as const).map((p) => {
          const on = state.pers.includes(p);
          return (
            <label key={p} className="flex min-h-10 cursor-pointer items-center gap-3 text-[0.9375rem]">
              <input
                type="checkbox"
                checked={on}
                onChange={() => update({ pers: on ? state.pers.filter((x) => x !== p) : [...state.pers, p] })}
                className="size-5 accent-[var(--fg)]"
              />
              {p === "texto" ? "Texto, nombres e iniciales" : "Logotipo o escudo"}
            </label>
          );
        })}
      </fieldset>
    ),
  });

  if (layout === "drawer") {
    return (
      <div className="space-y-7">
        {sections.map((s) => (
          <section key={s.key}>
            <h3 className="mb-3 text-[0.8125rem] font-semibold tracking-[0.1em] text-fg-muted uppercase">
              {s.title}
            </h3>
            {s.body}
          </section>
        ))}
      </div>
    );
  }
  return (
    <>
      {sections.map((s) => (
        <Popover key={s.key} label={s.title} count={s.count}>
          {s.body}
        </Popover>
      ))}
    </>
  );
}

function Popover({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[0.875rem] font-semibold transition-colors",
          count ? "border-fg" : "border-line-strong hover:border-fg",
        )}
      >
        {label}
        {count ? (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-fg text-[0.6875rem] text-bg">
            {count}
          </span>
        ) : null}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open ? (
          <m.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-40 mt-2 w-[min(92vw,420px)] rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  const [prev, setPrev] = useState(`${min}-${max}`);
  if (prev !== `${min}-${max}`) {
    setPrev(`${min}-${max}`);
    setLo(min);
    setHi(max);
  }
  const commit = () => onChange(lo, hi);
  const pct = (v: number) => (v / PRICE_MAX) * 100;
  return (
    <div>
      <div className="flex justify-between text-[0.875rem] font-semibold tabular-nums" aria-live="polite">
        <span>{formatPrice(lo)}</span>
        <span>{hi >= PRICE_MAX ? `${formatPrice(PRICE_MAX)}+` : formatPrice(hi)}</span>
      </div>
      <div className="relative mt-4 h-6">
        <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 bg-line-strong" />
        <div
          className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-fg"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={5}
          value={lo}
          aria-label="Precio mínimo"
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 5))}
          onPointerUp={commit}
          onKeyUp={commit}
          className="range-thumb absolute inset-0 w-full"
        />
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={5}
          value={hi}
          aria-label="Precio máximo"
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 5))}
          onPointerUp={commit}
          onKeyUp={commit}
          className="range-thumb absolute inset-0 w-full"
        />
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-16 text-center">
      <p className="font-display text-3xl">No hemos encontrado nada así… todavía</p>
      <p className="mt-3 max-w-md text-fg-muted">
        Prueba a quitar algún filtro o cuéntanos tu idea: grabamos casi cualquier pieza de cristal.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button onClick={onClear}>Quitar filtros</Button>
        <ButtonLink href="/contacto" variant="outline">
          Cuéntanos tu idea
        </ButtonLink>
      </div>
      <p className="mt-8 text-[0.875rem] text-fg-subtle">Lo más buscado:</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {["copas", "vasos", "trofeos", "jarras"].map((c) => (
          <Link
            key={c}
            href={`/tienda/${c}`}
            className="rounded-full border border-line-strong px-3.5 py-1.5 text-[0.875rem] hover:border-fg"
          >
            {c[0].toUpperCase() + c.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  );
}
