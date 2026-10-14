"use client";

import { useId, useState } from "react";
import * as m from "motion/react-m";
import { Gift, Tag, Truck, X } from "lucide-react";
import { DISCOUNT_CODES, validateDiscount } from "@/lib/commerce/discounts";
import type { LiteProduct } from "@/lib/commerce/catalog-lite";
import { site } from "@/data/site";
import { computeTotals, useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";
import { cn, formatPrice } from "@/lib/utils";

export function FreeShippingBar({ remaining, className }: { remaining: number; className?: string }) {
  const threshold = site.shop.freeShippingThreshold;
  const pct = Math.min(100, ((threshold - remaining) / threshold) * 100);
  return (
    <div className={cn("space-y-2", className)}>
      <p className="flex items-center gap-2 text-[0.8125rem] text-fg-muted" aria-live="polite">
        <Truck className="size-4 shrink-0" strokeWidth={1.5} />
        {remaining > 0 ? (
          <span>
            Te faltan <strong className="text-fg">{formatPrice(remaining)}</strong> para el envío gratis
          </span>
        ) : (
          <span className="font-semibold text-fg">¡Tienes envío gratis!</span>
        )}
      </p>
      <div
        className="h-1 overflow-hidden rounded-full bg-fg/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label="Progreso hacia el envío gratis"
      >
        <m.div
          className="h-full rounded-full bg-fg"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function DiscountInput() {
  const { lines, discountCode, setDiscount } = useCart();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  if (discountCode) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-dashed border-line-strong px-3 py-2 text-[0.875rem]">
        <span className="flex items-center gap-2">
          <Tag className="size-4" strokeWidth={1.5} />
          <strong>{discountCode}</strong>
          <span className="text-fg-subtle">{DISCOUNT_CODES[discountCode].label}</span>
        </span>
        <button
          type="button"
          onClick={() => setDiscount(null)}
          className="inline-flex size-8 items-center justify-center rounded-full hover:bg-fg/8"
          aria-label="Quitar código de descuento"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const res = validateDiscount(value, lines);
        if (!res.ok) return setError(res.error);
        setError(null);
        setDiscount(res.code);
        setValue("");
        toast({ title: `Código ${res.code} aplicado`, description: DISCOUNT_CODES[res.code].label });
      }}
    >
      <label htmlFor={`${id}-code`} className="sr-only">
        Código de descuento
      </label>
      <div className="flex gap-2">
        <input
          id={`${id}-code`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            setError(null);
          }}
          placeholder="Código de descuento"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 min-w-0 flex-1 rounded-[var(--radius)] border border-line-strong bg-surface px-3 !text-[0.875rem] uppercase placeholder:text-fg-subtle placeholder:normal-case focus:border-fg focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-[var(--radius)] border border-fg px-4 text-[0.8125rem] font-semibold hover:bg-fg hover:text-bg"
        >
          Aplicar
        </button>
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-[0.8125rem] font-medium text-[#b3261e] [.theme-dark_&]:text-[#ffb4ab]"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}

export function GiftBoxToggle({ giftBox }: { giftBox: LiteProduct }) {
  const { lines, add, remove } = useCart();
  const existing = lines.find((l) => l.productHandle === giftBox.handle);
  const on = Boolean(existing);
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius)] border border-line px-3 py-3 text-[0.875rem] transition-colors hover:border-line-strong">
      <span className="flex items-center gap-3">
        <Gift className="size-4" strokeWidth={1.5} />
        <span>
          Añadir estuche regalo <span className="text-fg-subtle">(+{formatPrice(giftBox.price)})</span>
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={on}
        onChange={() => {
          if (existing) remove(existing.id);
          else
            add({
              merchandiseId: giftBox.variantId,
              productHandle: giftBox.handle,
              productTitle: giftBox.title,
              variantTitle: "",
              illustration: giftBox.illustration,
              unitPrice: giftBox.price,
              compareAtPrice: null,
              tags: giftBox.tags,
              attributes: [],
            });
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-10 shrink-0 rounded-full bg-fg/15 transition-colors peer-checked:bg-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-bg after:shadow after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  );
}

export function OrderNote() {
  const { note, setNote } = useCart();
  return (
    <div>
      <label htmlFor="order-note" className="mb-2 block text-[0.8125rem] font-semibold">
        Nota para el pedido <span className="font-normal text-fg-subtle">(opcional)</span>
      </label>
      <textarea
        id="order-note"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="¿Para qué fecha lo necesitas? ¿Algún detalle del grabado?"
        className="w-full resize-none rounded-[var(--radius)] border border-line-strong bg-surface px-3 py-2.5 !text-[0.875rem] placeholder:text-fg-subtle focus:border-fg focus:outline-none"
      />
    </div>
  );
}

export function TotalsTable({
  totals,
  showShippingNote = true,
}: {
  totals: ReturnType<typeof computeTotals>;
  showShippingNote?: boolean;
}) {
  return (
    <dl className="space-y-2 text-[0.9375rem]">
      <div className="flex justify-between">
        <dt className="text-fg-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 ? (
        <div className="flex justify-between">
          <dt className="text-fg-muted">Descuento</dt>
          <dd className="font-semibold tabular-nums">−{formatPrice(totals.discount)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between">
        <dt className="text-fg-muted">
          Envío {showShippingNote ? <span className="text-fg-subtle">(estimado)</span> : null}
        </dt>
        <dd className="tabular-nums">{totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-[1.75rem] leading-none font-medium tabular-nums">
          {formatPrice(totals.total)}
        </dd>
      </div>
      <p className="text-right text-[0.75rem] text-fg-subtle">IVA incluido ({formatPrice(totals.vat)})</p>
    </dl>
  );
}
