"use client";

import Link from "next/link";
import { ShoppingBag, Plus } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import type { LiteProduct } from "@/lib/commerce/catalog-lite";
import { computeTotals, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { useUI } from "@/lib/store/ui";
import { site } from "@/data/site";
import { CartLineItem } from "./CartLineItem";
import { DiscountInput, FreeShippingBar, GiftBoxToggle, TotalsTable } from "./CartPieces";

export function CartDrawer({ giftBox }: { giftBox: LiteProduct }) {
  const { cartOpen, setCartOpen } = useUI();
  const hydrated = useHydrated((s) => s.hydrated);
  const { lines, discountCode, setQuantity } = useCart();
  const totals = computeTotals(lines, discountCode, "estandar", site.demo.freeShippingThreshold);
  const close = () => setCartOpen(false);
  const glassLine = lines.find(
    (l) => l.productHandle !== giftBox.handle && /vaso|copa/i.test(l.productTitle),
  );

  return (
    <Drawer
      open={cartOpen}
      onClose={close}
      title={
        <span className="flex items-baseline gap-2">
          Tu carrito{" "}
          {hydrated && totals.itemCount ? (
            <span className="font-sans text-[0.875rem] text-fg-subtle">({totals.itemCount})</span>
          ) : null}
        </span>
      }
      footer={
        lines.length ? (
          <div className="space-y-4">
            <TotalsTable totals={totals} />
            <div className="grid grid-cols-1 gap-2 pb-1">
              <ButtonLink href="/checkout" onClick={close} size="lg" block data-autofocus>
                Tramitar pedido de prueba
              </ButtonLink>
              <Link
                href="/carrito"
                onClick={close}
                className="py-2 text-center text-[0.875rem] font-semibold underline-offset-4 hover:underline"
              >
                Ver carrito completo
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      <div aria-live="polite" className="px-5 sm:px-6">
        {!hydrated ? null : lines.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="mb-6 inline-flex size-16 items-center justify-center rounded-full border border-line">
              <ShoppingBag className="size-6" strokeWidth={1.3} />
            </span>
            <p className="font-display text-3xl">Tu carrito está vacío</p>
            <p className="mt-2 max-w-[28ch] text-fg-muted">
              Elige una pieza y dale tu toque: iniciales, una fecha o tu logo.
            </p>
            <div className="mt-8 grid w-full max-w-xs grid-cols-1 gap-2">
              <ButtonLink href="/tienda" onClick={close}>
                Ver la tienda
              </ButtonLink>
              <ButtonLink href="/personaliza" onClick={close} variant="outline">
                Personaliza el tuyo
              </ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <FreeShippingBar remaining={totals.freeShippingRemaining} className="pt-5" />
            <ul className="divide-y divide-line">
              {lines.map((l) => (
                <CartLineItem key={l.id} line={l} compact />
              ))}
            </ul>
            <div className="space-y-3 border-t border-line py-5">
              <GiftBoxToggle giftBox={giftBox} />
              {glassLine ? (
                <button
                  type="button"
                  onClick={() => setQuantity(glassLine.id, glassLine.quantity + 2)}
                  className="flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border border-line px-3 py-3 text-left text-[0.875rem] transition-colors hover:border-line-strong"
                >
                  <span>
                    Completa el juego: <strong>+2 uds.</strong> de «{glassLine.productTitle}» con el mismo
                    diseño
                  </span>
                  <Plus className="size-4 shrink-0" />
                </button>
              ) : null}
              <DiscountInput />
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
