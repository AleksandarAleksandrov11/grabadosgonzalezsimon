import { allProducts, getProductSync } from "./local-provider";
import type { Product } from "./types";
import type { GlassId } from "@/lib/glass/pieces";

/** Índice ligero del catálogo para el buscador y los upsells (se serializa al cliente). */
export type LiteProduct = {
  handle: string;
  title: string;
  tagline: string;
  price: number;
  from: boolean;
  illustration: GlassId;
  category: string;
  tags: string[];
  variantId: string;
  variantTitle: string;
  compareAt: number | null;
};

export function toLite(p: Product): LiteProduct {
  const v = p.variants[0];
  return {
    handle: p.handle,
    title: p.title,
    tagline: p.metafields.tagline,
    price: p.priceRange.minVariantPrice.amount,
    from:
      p.priceRange.minVariantPrice.amount !== p.priceRange.maxVariantPrice.amount ||
      Boolean(p.metafields.minQuantity),
    illustration: p.metafields.illustration,
    category: p.metafields.category,
    tags: p.tags,
    variantId: v.id,
    variantTitle: v.title,
    compareAt: v.compareAtPrice?.amount ?? null,
  };
}

export function searchIndex(): LiteProduct[] {
  return allProducts().map(toLite);
}

export function giftBoxLite(): LiteProduct {
  return toLite(getProductSync("estuche-regalo")!);
}

/**
 * Producto «para tarjeta»: sin los campos largos que las tarjetas y la vista
 * rápida no usan (descriptionHtml, SEO). Reduce el payload RSC de los listados.
 */
export function forCard(p: Product): Product {
  return { ...p, descriptionHtml: "", seo: { title: "", description: "" } };
}
