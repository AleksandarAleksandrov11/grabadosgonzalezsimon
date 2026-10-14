"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, Trash2 } from "lucide-react";
import { LineThumb } from "@/components/cart/CartLineItem";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { writeStorage } from "@/lib/hooks";
import { useCart } from "@/lib/store/cart";
import { useDesigns } from "@/lib/store/designs";
import { useFavorites } from "@/lib/store/favorites";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders } from "@/lib/store/orders";
import { STORAGE_PREFIX } from "@/lib/store/storage";
import { toast } from "@/lib/store/toast";
import { formatDate, formatPrice, plural } from "@/lib/utils";

/** Lista de pedidos guardados en este navegador. */
export function OrdersList() {
  const hydrated = useHydrated((s) => s.hydrated);
  const orders = useOrders((s) => s.orders);

  if (!hydrated) {
    return (
      <div className="space-y-4" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-[var(--radius-lg)] bg-fg/6" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {orders.length ? (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/pedido/${o.id}`}
                className="group grid grid-cols-1 gap-5 rounded-[var(--radius-lg)] border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
              >
                <div className="min-w-0">
                  <p className="font-display text-2xl tabular-nums">{o.id}</p>
                  <p className="mt-1 text-[0.875rem] text-fg-muted">
                    {formatDate(o.createdAt)} · {plural(o.totals.itemCount, "artículo", "artículos")} ·{" "}
                    <strong className="text-fg">{formatPrice(o.totals.total)}</strong>
                  </p>
                  <ul className="mt-4 flex gap-2" aria-label="Piezas del pedido">
                    {o.lines.slice(0, 5).map((l) => (
                      <li key={l.id}>
                        <LineThumb line={l} className="w-12" />
                      </li>
                    ))}
                    {o.lines.length > 5 ? (
                      <li className="flex w-12 items-center justify-center rounded-[var(--radius)] border border-line text-[0.8125rem] text-fg-muted">
                        +{o.lines.length - 5}
                      </li>
                    ) : null}
                  </ul>
                </div>
                <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold underline-offset-4 group-hover:underline">
                  Ver pedido →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-16 text-center">
          <span className="mb-5 inline-flex size-14 items-center justify-center rounded-full border border-line">
            <Package className="size-6" strokeWidth={1.3} />
          </span>
          <h2 className="font-display text-display-s">Aún no hay pedidos</h2>
          <p className="mt-3 max-w-[44ch] text-fg-muted">
            Cuando hagas un pedido aparecerá aquí con su número y su seguimiento.
          </p>
          <ButtonLink href="/tienda" className="mt-8">
            Ir a la tienda
          </ButtonLink>
        </div>
      )}
      <ClearData />
    </div>
  );
}

/** Borra todo lo que la tienda ha guardado en este navegador. */
export function ClearData() {
  const [open, setOpen] = useState(false);
  const wipe = () => {
    useCart.getState().clear();
    useOrders.getState().clear();
    useFavorites.getState().clear();
    useDesigns.getState().clear();
    for (const kind of ["local", "session"] as const) {
      let keys: string[] = [];
      try {
        keys = Object.keys(kind === "local" ? window.localStorage : window.sessionStorage);
      } catch {
        /* sin almacenamiento */
      }
      keys.filter((k) => k.startsWith(STORAGE_PREFIX)).forEach((k) => writeStorage(kind, k, null));
    }
    setOpen(false);
    toast({ title: "Datos borrados", description: "Carrito, pedidos, favoritos y diseños." });
  };
  return (
    <div className="rounded-[var(--radius-lg)] border border-line p-5 sm:p-6">
      <h2 className="font-semibold">Tus datos en este navegador</h2>
      <p className="mt-1 max-w-[60ch] text-[0.875rem] text-fg-muted">
        El carrito, los pedidos, los favoritos y los diseños se guardan en este dispositivo.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        iconLeft={<Trash2 className="size-4" />}
        onClick={() => setOpen(true)}
      >
        Borrar mis datos
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="¿Borrar tus datos?" size="md">
        <div className="px-5 pb-6">
          <p className="text-fg-muted">
            Se borrarán el carrito, los pedidos, los favoritos, los diseños guardados y tus preferencias de
            cookies de este navegador. No se puede deshacer.
          </p>
          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={wipe} iconLeft={<Trash2 className="size-4" />}>
              Sí, borrar todo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
