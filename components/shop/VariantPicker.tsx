"use client";

import * as m from "motion/react-m";
import type { Product } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

/** Selector de variantes en chips (opciones tipo Shopify). Muestra el sobreprecio de cada valor. */
export function VariantPicker({
  product,
  selected,
  onChange,
  idBase,
}: {
  product: Product;
  selected: Record<string, string>;
  onChange: (name: string, value: string) => void;
  idBase: string;
}) {
  if (!product.options.length) return null;
  const base = product.variants[0].price.amount;
  return (
    <div className="space-y-5">
      {product.options.map((opt) => (
        <fieldset key={opt.id}>
          <legend className="mb-2.5 flex items-baseline gap-2 text-[0.8125rem] font-semibold">
            {opt.name}
            <span className="font-normal text-fg-subtle">{selected[opt.name]}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const active = selected[opt.name] === val;
              // sobreprecio de este valor manteniendo el resto de opciones en su valor base
              const probe = product.variants.find((v) =>
                v.selectedOptions.every((o) =>
                  o.name === opt.name
                    ? o.value === val
                    : o.value === product.variants[0].selectedOptions.find((x) => x.name === o.name)?.value,
                ),
              );
              const delta = probe ? probe.price.amount - base : 0;
              const id = `${idBase}-${opt.name}-${val}`.replace(/\s+/g, "-");
              return (
                <label
                  key={val}
                  htmlFor={id}
                  className={cn(
                    "relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius)] border px-4 text-[0.875rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",
                    active
                      ? "border-fg text-fg"
                      : "border-line-strong text-fg-muted hover:border-fg/60 hover:text-fg",
                  )}
                >
                  <input
                    id={id}
                    type="radio"
                    name={`${idBase}-${opt.name}`}
                    value={val}
                    checked={active}
                    onChange={() => onChange(opt.name, val)}
                    className="sr-only"
                  />
                  {active ? (
                    <m.span
                      layoutId={`${idBase}-${opt.name}-sel`}
                      className="absolute inset-0 rounded-[var(--radius)] bg-fg/[0.06]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative font-medium">{val}</span>
                  {delta > 0 ? (
                    <span className="relative text-[0.75rem] text-fg-subtle">+{formatPrice(delta)}</span>
                  ) : null}
                  {delta < 0 ? (
                    <span className="relative text-[0.75rem] text-fg-subtle">−{formatPrice(-delta)}</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
