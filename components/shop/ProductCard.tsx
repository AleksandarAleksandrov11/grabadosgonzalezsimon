"use client";

import Link from "next/link";
import { useRef } from "react";
import { Eye, Plus } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { FavoriteButton } from "./FavoriteButton";
import { PENDING_DESIGN, toCartLine } from "@/lib/commerce/variant";
import type { Product } from "@/lib/commerce/types";
import { useCart } from "@/lib/store/cart";
import { useUI } from "@/lib/store/ui";
import { cn, formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const art = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);
  const { flyToCart, openQuickView } = useUI();
  const mf = product.metafields;
  const v = product.variants[0];
  const min = mf.minQuantity ?? 1;
  const from =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount || min > 1;

  const quickAdd = () => {
    add(toCartLine(product, v, PENDING_DESIGN), min);
    const r = art.current?.getBoundingClientRect();
    const svg = art.current?.querySelector("svg")?.outerHTML;
    if (r) flyToCart({ x: r.left, y: r.top, w: r.width, h: r.height, image: svg });
    else useUI.getState().setCartOpen(true);
  };

  return (
    <article className={cn("group/card relative flex flex-col", className)} data-cursor="grow">
      <div className="theme-dark relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_42%,rgba(255,255,255,0.09),transparent_70%)] transition-opacity duration-700 group-hover/card:opacity-100 sm:opacity-70"
        />
        <Link
          href={`/producto/${product.handle}`}
          className="absolute inset-0 z-[1]"
          aria-label={product.title}
          tabIndex={-1}
        />
        <div
          ref={art}
          className="pointer-events-none absolute inset-x-[10%] top-[7%] bottom-[3%] transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover/card:scale-[1.03]"
        >
          <Glass
            id={mf.illustration}
            tone="dark"
            engraving={mf.sampleEngraving}
            title={`Ilustración: ${product.title}`}
          />
        </div>
        <FavoriteButton
          handle={product.handle}
          title={product.title}
          className="absolute top-2 right-2 z-[2]"
        />
        <div className="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-3 gap-2 opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 [@media(hover:hover)]:flex">
          <button
            type="button"
            onClick={quickAdd}
            className="btn-shine relative inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-[var(--radius)] bg-paper px-3 text-[0.8125rem] font-semibold text-ink transition-colors hover:bg-white"
            aria-label={`Añadir ${product.title} al carrito`}
          >
            <Plus className="size-4" />
            <span className="max-[380px]:sr-only">Añadir</span>
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] border border-white/25 bg-black/40 text-paper backdrop-blur-md transition-colors hover:bg-black/60"
            aria-label={`Vista rápida de ${product.title}`}
          >
            <Eye className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-[0.9375rem] leading-snug text-fg sm:text-base">
          <Link
            href={`/producto/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            prefetch={priority}
          >
            {product.title}
          </Link>
        </h3>
        <p className="shrink-0 text-[0.9375rem] tabular-nums">
          {from ? <span className="mr-1 text-[0.75rem] text-fg-subtle">desde</span> : null}
          {formatPrice(v.price.amount)}
        </p>
      </div>
    </article>
  );
}
