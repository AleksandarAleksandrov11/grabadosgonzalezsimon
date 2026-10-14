"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Sparkles } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { Modal } from "@/components/ui/Modal";
import { Button, ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { Price } from "@/components/ui/misc";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { VariantPicker } from "./VariantPicker";
import { unitPriceFor } from "@/lib/commerce/pricing";
import { findVariant, PENDING_DESIGN, selectedFromVariant, toCartLine } from "@/lib/commerce/variant";
import { useCart } from "@/lib/store/cart";
import { useUI } from "@/lib/store/ui";
import type { Product } from "@/lib/commerce/types";

export function QuickView() {
  const { quickView: product, openQuickView } = useUI();
  return (
    <Modal
      open={Boolean(product)}
      onClose={() => openQuickView(null)}
      title={product?.title ?? "Vista rápida"}
      hideTitle
      size="xl"
    >
      {product ? <QuickViewBody key={product.handle} product={product} /> : null}
    </Modal>
  );
}

function QuickViewBody({ product }: { product: Product }) {
  const { openQuickView, setCartOpen } = useUI();
  const add = useCart((s) => s.add);
  const idBase = useId();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    selectedFromVariant(product.variants[0]),
  );
  const [qty, setQty] = useState(product.metafields.minQuantity ?? 1);
  const close = () => openQuickView(null);
  const variant = findVariant(product, selected);
  const unit = unitPriceFor(variant.price.amount, product.metafields.volumePricing, qty);

  return (
    <>
      {
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="theme-dark relative flex items-center justify-center bg-ink px-10 pt-14 pb-6 sm:rounded-l-[var(--radius-lg)] sm:py-10">
            <div className="w-full max-w-[300px]">
              <Glass
                id={product.metafields.illustration}
                tone="dark"
                engraving={product.metafields.sampleEngraving}
                title={product.title}
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div>
              <h3 className="font-display text-[2rem] leading-[1.05]">{product.title}</h3>
              <p className="mt-3 text-fg-muted">{product.description}</p>
            </div>
            <div>
              <Price amount={unit} compareAt={variant.compareAtPrice?.amount} size="lg" />
              {product.metafields.minQuantity ? (
                <p className="text-[0.8125rem] text-fg-subtle">
                  Precio por unidad · mínimo {product.metafields.minQuantity} uds.
                </p>
              ) : null}
            </div>
            <VariantPicker
              product={product}
              selected={selected}
              onChange={(n, v) => setSelected((s) => ({ ...s, [n]: v }))}
              idBase={idBase}
            />
            <div className="flex items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} min={product.metafields.minQuantity ?? 1} />
              <Button
                className="flex-1"
                size="lg"
                onClick={() => {
                  add(toCartLine(product, variant, PENDING_DESIGN), qty);
                  close();
                  setCartOpen(true);
                }}
              >
                Añadir al carrito
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
              <ButtonLink
                href={`/producto/${product.handle}#personalizar`}
                variant="outline"
                onClick={close}
                iconLeft={<Sparkles className="size-4" />}
              >
                Personalizar
              </ButtonLink>
              <Link
                href={`/producto/${product.handle}`}
                onClick={close}
                className="group/btn inline-flex items-center gap-2 text-[0.875rem] font-semibold"
              >
                Ver ficha completa <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      }
    </>
  );
}
