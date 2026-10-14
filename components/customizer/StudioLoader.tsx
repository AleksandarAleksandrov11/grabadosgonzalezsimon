"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/commerce/types";

/** El estudio se carga en un chunk aparte (import dinámico) para no penalizar el resto de la web. */
const Studio = dynamic(() => import("./Studio").then((m) => m.Studio), {
  ssr: false,
  loading: () => (
    <div
      className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12"
      aria-busy="true"
      aria-label="Cargando el estudio de personalización"
    >
      <div className="mx-auto aspect-[4/5] w-[min(100%,calc(44svh*0.8))] animate-pulse rounded-[var(--radius-lg)] bg-ink lg:col-span-7 lg:w-full" />
      <div className="space-y-4 lg:col-span-5">
        <div className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-fg/5" />
        <div className="h-12 animate-pulse rounded-[var(--radius)] bg-fg/5" />
        <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-fg/5" />
      </div>
    </div>
  ),
});

export function StudioLoader({ products }: { products: Product[] }) {
  return <Studio products={products} />;
}
