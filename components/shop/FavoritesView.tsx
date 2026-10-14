"use client";

import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Product } from "@/lib/commerce/types";
import { useFavorites } from "@/lib/store/favorites";
import { useHydrated } from "@/lib/store/hydration";
import { plural } from "@/lib/utils";

/** Favoritos guardados en este navegador. */
export function FavoritesView({ products }: { products: Product[] }) {
  const hydrated = useHydrated((s) => s.hydrated);
  const { handles, clear } = useFavorites();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-[var(--radius-lg)] bg-fg/6" />
        ))}
      </div>
    );
  }

  const favs = handles
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is Product => Boolean(p));

  if (!favs.length) {
    return (
      <div className="space-y-20">
        <div className="flex flex-col items-center rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-16 text-center">
          <span className="mb-5 inline-flex size-14 items-center justify-center rounded-full border border-line">
            <Heart className="size-6" strokeWidth={1.3} />
          </span>
          <h2 className="font-display text-display-s">Aún no tienes favoritos</h2>
          <p className="mt-3 max-w-[44ch] text-fg-muted">
            Pulsa el corazón de cualquier pieza para guardarla aquí y compararla con calma.
          </p>
          <ButtonLink href="/tienda" className="mt-8">
            Explorar la tienda
          </ButtonLink>
        </div>
        <section aria-labelledby="ideas">
          <h2 id="ideas" className="mb-8 font-display text-display-s">
            Para inspirarte
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <p className="text-fg-muted" aria-live="polite">
          {plural(favs.length, "pieza guardada", "piezas guardadas")}
        </p>
        <Button variant="ghost" size="sm" onClick={clear}>
          Vaciar favoritos
        </Button>
      </div>
      <h2 className="sr-only">Tus favoritos</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {favs.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </div>
  );
}
