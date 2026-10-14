"use client";

import Link from "next/link";
import { ArrowLeft, Lock, PenLine, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { PaymentIcons } from "@/components/icons";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { site } from "@/data/site";
import type { LiteProduct } from "@/lib/commerce/catalog-lite";
import type { Product } from "@/lib/commerce/types";
import { computeTotals, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { plural } from "@/lib/utils";
import { CartLineItem } from "./CartLineItem";
import { DiscountInput, FreeShippingBar, GiftBoxToggle, OrderNote, TotalsTable } from "./CartPieces";

/** Página completa del carrito (/carrito). */
export function CartPage({ giftBox, pool }: { giftBox: LiteProduct; pool: Product[] }) {
  const hydrated = useHydrated((s) => s.hydrated);
  const { lines, discountCode } = useCart();
  const totals = computeTotals(lines, discountCode, "estandar", site.shop.freeShippingThreshold);

  if (!hydrated) return <CartSkeleton />;
  if (!lines.length) return <EmptyCart pool={pool} />;

  const inCart = new Set(lines.map((l) => l.productHandle));
  const related = pool
    .filter((p) =>
      lines.some((l) =>
        pool.find((x) => x.handle === l.productHandle)?.metafields.completeTheSet?.includes(p.handle),
      ),
    )
    .concat(pool)
    .filter((p, i, arr) => !inCart.has(p.handle) && arr.findIndex((x) => x.handle === p.handle) === i)
    .slice(0, 3);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
            <p className="text-[0.9375rem] text-fg-muted">
              {plural(totals.itemCount, "artículo", "artículos")} en tu carrito
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold underline-offset-4 hover:underline"
            >
              <ArrowLeft className="size-4" /> Seguir comprando
            </Link>
          </div>
          <FreeShippingBar remaining={totals.freeShippingRemaining} className="pt-5" />
          <ul className="divide-y divide-line" aria-live="polite">
            {lines.map((l) => (
              <CartLineItem key={l.id} line={l} />
            ))}
          </ul>
          <div className="grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <GiftBoxToggle giftBox={giftBox} />
            <Link
              href="/personaliza"
              className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-line px-3 py-3 text-[0.875rem] transition-colors hover:border-line-strong"
            >
              <span className="flex items-center gap-3">
                <PenLine className="size-4" strokeWidth={1.5} /> Diseñar otra pieza
              </span>
              <ArrowIcon />
            </Link>
          </div>
        </div>

        <aside className="self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-5 xl:col-span-4">
          <div className="space-y-6 rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-7">
            <h2 className="font-display text-3xl">Resumen</h2>
            <DiscountInput />
            <OrderNote />
            <TotalsTable totals={totals} />
            <ButtonLink href="/checkout" size="lg" block iconRight={<ArrowIcon />}>
              Tramitar pedido
            </ButtonLink>
            <ul className="space-y-2.5 text-[0.8125rem] text-fg-muted">
              <li className="flex items-center gap-2.5">
                <Lock className="size-4 shrink-0" strokeWidth={1.5} /> Pago seguro
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 shrink-0" strokeWidth={1.5} /> Revisamos cada diseño antes de
                grabar
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="size-4 shrink-0" strokeWidth={1.5} /> Producción en{" "}
                {site.shop.productionTime}
              </li>
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <PaymentIcons />
            </div>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section aria-labelledby="upsell-title" className="mt-24">
          <h2 id="upsell-title" className="mb-8 font-display text-display-s">
            Completa tu pedido
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function EmptyCart({ pool }: { pool: Product[] }) {
  return (
    <div>
      <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center sm:py-16">
        <div className="theme-dark relative mb-8 aspect-[4/5] w-40 overflow-hidden rounded-[var(--radius-lg)] bg-ink">
          <Glass id="copa-vino" tone="dark" className="size-full" />
        </div>
        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full border border-line">
          <ShoppingBag className="size-5" strokeWidth={1.3} />
        </span>
        <h2 className="font-display text-display-s">Tu carrito está vacío</h2>
        <p className="mt-3 max-w-[40ch] text-fg-muted">
          Cada pieza espera su grabado: unas iniciales, una fecha que no quieres olvidar o el logo de tu
          empresa.
        </p>
        <div className="mt-8 grid w-full max-w-sm grid-cols-1 gap-2 sm:grid-cols-2">
          <ButtonLink href="/tienda">Ver la tienda</ButtonLink>
          <ButtonLink href="/personaliza" variant="outline">
            Personaliza el tuyo
          </ButtonLink>
        </div>
      </div>
      <section aria-labelledby="sugerencias" className="mt-16">
        <h2 id="sugerencias" className="mb-8 font-display text-display-s">
          Los más pedidos
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
          {pool.slice(0, 3).map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14"
      aria-busy="true"
      aria-label="Cargando carrito"
    >
      <div className="space-y-6 lg:col-span-7 xl:col-span-8">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4 py-5">
            <div className="aspect-[4/5] w-24 animate-pulse rounded-[var(--radius)] bg-fg/8 sm:w-28" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-2/3 animate-pulse rounded bg-fg/8" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-fg/6" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-fg/6" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[var(--radius-lg)] bg-fg/6 lg:col-span-5 xl:col-span-4" />
    </div>
  );
}
