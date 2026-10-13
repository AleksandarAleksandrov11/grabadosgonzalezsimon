import type { VolumeTier } from "@/lib/commerce/types";
import { tierFor } from "@/lib/commerce/pricing";
import { cn, formatPrice, round2 } from "@/lib/utils";

/** Tabla de precio por volumen; resalta el tramo activo según la cantidad. */
export function VolumePricing({
  tiers,
  base,
  quantity,
  className,
}: {
  tiers: VolumeTier[];
  base: number;
  quantity: number;
  className?: string;
}) {
  const active = tierFor(tiers, quantity);
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-lg)] border border-line", className)}>
      <table className="w-full text-[0.875rem]">
        <caption className="border-b border-line bg-surface-2 px-4 py-2.5 text-left text-[0.75rem] font-semibold tracking-[0.12em] text-fg-muted uppercase">
          Precio por volumen
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Unidades</th>
            <th scope="col">Precio por unidad</th>
            <th scope="col">Descuento</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((t) => {
            const isActive = active === t;
            const label = t.max === null ? `${t.min}+ uds.` : `${t.min}–${t.max} uds.`;
            return (
              <tr
                key={t.min}
                className={cn(
                  "border-b border-line transition-colors last:border-0",
                  isActive && "bg-fg/[0.06]",
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <th scope="row" className="px-4 py-2.5 text-left font-medium">
                  {isActive ? (
                    <span
                      className="mr-2 inline-block size-1.5 rounded-full bg-fg align-middle"
                      aria-hidden="true"
                    />
                  ) : null}
                  {label}
                </th>
                <td className="px-4 py-2.5 text-right tabular-nums">
                  {t.quote ? (
                    <span className="font-semibold">Pide presupuesto</span>
                  ) : (
                    formatPrice(round2(base * (1 - t.discount)))
                  )}
                </td>
                <td className="w-20 px-4 py-2.5 text-right text-fg-subtle tabular-nums">
                  {t.discount > 0 && !t.quote ? `−${Math.round(t.discount * 100)} %` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
