import { LineThumb, visibleAttributes } from "@/components/cart/CartLineItem";
import { lineTotal } from "@/lib/commerce/pricing";
import type { CartLine } from "@/lib/commerce/types";
import { cn, formatPrice } from "@/lib/utils";

const TECHNICAL = ["Posición", "Escala", "Rotación", "Curvatura"];

/** Lista compacta de líneas (resumen del checkout y del pedido). */
export function SummaryLines({
  lines,
  className,
  maxAttrs = 2,
}: {
  lines: CartLine[];
  className?: string;
  maxAttrs?: number;
}) {
  return (
    <ul className={cn("divide-y divide-line", className)}>
      {lines.map((l) => {
        // los ajustes técnicos (posición, escala…) no aportan al cliente en el resumen
        const attrs = visibleAttributes(l).filter((a) => !TECHNICAL.includes(a.key));
        return (
          <li key={l.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="relative shrink-0">
              <LineThumb line={l} className="w-16" />
              <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full bg-fg text-[0.6875rem] font-bold text-bg tabular-nums">
                {l.quantity}
                <span className="sr-only"> unidades</span>
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.9375rem] leading-snug font-semibold">{l.productTitle}</p>
                <p className="shrink-0 text-[0.9375rem] font-semibold tabular-nums">
                  {formatPrice(lineTotal(l))}
                </p>
              </div>
              {l.variantTitle ? <p className="text-[0.8125rem] text-fg-subtle">{l.variantTitle}</p> : null}
              {attrs.length ? (
                <dl className="mt-1 space-y-0.5 text-[0.8125rem] text-fg-muted">
                  {attrs.slice(0, maxAttrs).map((a) => (
                    <div key={a.key} className="flex gap-1.5">
                      <dt className="shrink-0 text-fg-subtle">{a.key}:</dt>
                      <dd className="min-w-0 truncate">{a.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
