"use client";

import Link from "next/link";
import { useRef } from "react";
import { Eye, Plus } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { Badge } from "@/components/ui/misc";
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
          className="pointer-events-none absolute inset-x-[8%] top-[6%] bottom-[2%] [transform:perspective(900px)] transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover/card:[transform:perspective(900px)_rotateY(-9deg)_translateY(-2%)_scale(1.03)]"
        >
          <Glass
            id={mf.illustration}
            tone="dark"
            engraving={mf.sampleEngraving}
            title={`Ilustración: ${product.title}`}
          />
        </div>
        {/* barrido de luz */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-none group-hover/card:left-[130%] group-hover/card:opacity-100 group-hover/card:transition-[left,opacity] group-hover/card:duration-[1100ms]"
        />
        {mf.badge ? (
          <Badge tone="frost" className="absolute top-3 left-3 z-[2]">
            {mf.badge}
          </Badge>
        ) : null}
        <FavoriteButton
          handle={product.handle}
          title={product.title}
          className="absolute top-2 right-2 z-[2]"
        />
        <div className="absolute inset-x-3 bottom-3 z-[2] flex gap-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within/card:translate-y-0 [@media(hover:hover)]:group-focus-within/card:opacity-100 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100">
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
      <div className="flex flex-1 flex-col gap-1 pt-4">
        <h3 className="text-[0.9375rem] leading-snug font-semibold text-fg sm:text-base">
          <Link
            href={`/producto/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            prefetch={priority}
          >
            {product.title}
          </Link>
        </h3>
        <p className="line-clamp-1 text-[0.8125rem] text-fg-subtle">{mf.tagline}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[0.9375rem] tabular-nums">
          {from ? <span className="text-[0.75rem] text-fg-subtle">desde</span> : null}
          <span className="font-semibold">{formatPrice(v.price.amount)}</span>
          {min > 1 ? <span className="text-[0.75rem] text-fg-subtle">/ud · mín. {min}</span> : null}
          {v.compareAtPrice ? (
            <s className="text-[0.8125rem] text-fg-subtle">{formatPrice(v.compareAtPrice.amount)}</s>
          ) : null}
        </p>
      </div>
    </article>
  );
}
