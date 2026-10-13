"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { lineTotal, tierFor, unitPriceFor } from "@/lib/commerce/pricing";
import type { CartLine } from "@/lib/commerce/types";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";
import { cn, formatPrice } from "@/lib/utils";

/** Atributos visibles (los que empiezan por «_» son privados, como en Shopify). */
export function visibleAttributes(line: Pick<CartLine, "attributes">) {
  return line.attributes.filter((a) => !a.key.startsWith("_") && a.value);
}

export function LineThumb({
  line,
  className,
}: {
  line: Pick<CartLine, "preview" | "illustration" | "productTitle">;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "theme-dark relative aspect-[4/5] shrink-0 overflow-hidden rounded-[var(--radius)] bg-ink",
        className,
      )}
    >
      {line.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={line.preview}
          alt={`Vista previa del grabado: ${line.productTitle}`}
          className="size-full object-cover"
        />
      ) : (
        <Glass id={line.illustration} tone="dark" className="size-full" />
      )}
    </div>
  );
}

export function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { setQuantity, remove, restore } = useCart();
  const unit = unitPriceFor(line.unitPrice, line.volumePricing, line.quantity);
  const tier = tierFor(line.volumePricing, line.quantity);
  const attrs = visibleAttributes(line);

  const onRemove = () => {
    const removed = remove(line.id);
    if (!removed) return;
    toast({
      title: "Producto eliminado",
      description: line.productTitle,
      action: { label: "Deshacer", onClick: () => restore(removed.line, removed.index) },
    });
  };

  return (
    <li className="flex gap-4 py-5">
      <LineThumb line={line} className={compact ? "w-20" : "w-24 sm:w-28"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/producto/${line.productHandle}`}
              className="leading-snug font-semibold hover:underline"
            >
              {line.productTitle}
            </Link>
            {line.variantTitle && line.variantTitle !== "Default Title" ? (
              <p className="mt-0.5 text-[0.8125rem] text-fg-subtle">{line.variantTitle}</p>
            ) : null}
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(lineTotal(line))}</p>
        </div>
        {attrs.length ? (
          <dl className="mt-2 space-y-0.5 text-[0.8125rem] text-fg-muted">
            {attrs.slice(0, compact ? 3 : 8).map((a) => (
              <div key={a.key} className="flex gap-1.5">
                <dt className="shrink-0 text-fg-subtle">{a.key}:</dt>
                <dd className="truncate">{a.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {tier && tier.discount > 0 ? (
          <p className="mt-1.5 text-[0.75rem] font-semibold text-fg">
            Precio por volumen: {formatPrice(unit)}/ud (−{Math.round(tier.discount * 100)} %)
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            min={line.minQuantity ?? 1}
            onChange={(n) => setQuantity(line.id, n)}
            label={`Cantidad de ${line.productTitle}`}
          />
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex tap items-center justify-center gap-1.5 rounded-full text-[0.8125rem] text-fg-subtle transition-colors hover:text-fg"
            aria-label={`Eliminar ${line.productTitle}`}
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
        {line.minQuantity && line.minQuantity > 1 ? (
          <p className="mt-1 text-[0.75rem] text-fg-subtle">Pedido mínimo: {line.minQuantity} uds.</p>
        ) : null}
      </div>
    </li>
  );
}
