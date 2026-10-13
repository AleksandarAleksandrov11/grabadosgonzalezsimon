import { categories, categoryByHandle } from "@/data/collections";
import { occasionBySlug, occasions } from "@/data/occasions";
import { products } from "@/data/products";
import { normalize } from "@/lib/utils";
import type { Collection, CommerceProvider, Product, ProductFilters } from "./types";

/**
 * Provider local: lee de data/*.ts. Misma interfaz que el futuro
 * shopifyProvider (Storefront API).
 */

export function filterProducts(list: Product[], f: ProductFilters = {}): Product[] {
  let out = f.includeHidden ? list : list.filter((p) => !p.metafields.hidden);
  if (f.category) {
    out = out.filter((p) =>
      f.category === "packs" ? p.metafields.category === "packs" || p.tags.includes("pack") : p.metafields.category === f.category,
    );
  }
  if (f.occasions?.length) out = out.filter((p) => f.occasions!.some((o) => p.tags.includes(o)));
  if (typeof f.priceMin === "number") out = out.filter((p) => p.priceRange.minVariantPrice.amount >= f.priceMin!);
  if (typeof f.priceMax === "number") out = out.filter((p) => p.priceRange.minVariantPrice.amount <= f.priceMax!);
  if (f.personalization?.length) {
    out = out.filter((p) =>
      f.personalization!.every((t) =>
        t === "logo" ? p.metafields.personalization.types.includes("logo") : p.metafields.personalization.types.includes("texto"),
      ),
    );
  }
  if (f.query) {
    const q = normalize(f.query.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    out = out.filter((p) => {
      const hay = normalize(
        [p.title, p.description, p.productType, p.tags.join(" "), p.metafields.tagline, p.metafields.category].join(" "),
      );
      return terms.every((t) => hay.includes(t));
    });
  }
  const sort = f.sort ?? "destacados";
  out = [...out].sort((a, b) => {
    switch (sort) {
      case "precio-asc":
        return a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount;
      case "precio-desc":
        return b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount;
      case "novedades":
        return b.createdAt.localeCompare(a.createdAt);
      default:
        return (a.metafields.featuredRank ?? 99) - (b.metafields.featuredRank ?? 99);
    }
  });
  return out;
}

function categoryCollection(handle: string): Collection | null {
  const c = categoryByHandle(handle);
  if (!c) return null;
  return {
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: null,
    illustration: c.illustration,
    products: filterProducts(products, { category: c.handle }),
    seo: { title: c.seoTitle, description: c.seoDescription },
    kind: "category",
  };
}

function occasionCollection(slug: string): Collection | null {
  const o = occasionBySlug(slug);
  if (!o) return null;
  return {
    handle: o.slug,
    title: o.title,
    description: o.heroLead,
    image: null,
    illustration: o.illustration,
    products: filterProducts(products, { occasions: [o.tag] }),
    seo: { title: o.seoTitle, description: o.seoDescription },
    kind: "occasion",
  };
}

export const localProvider: CommerceProvider = {
  async getProducts(filters) {
    return filterProducts(products, filters);
  },
  async getProduct(handle) {
    return products.find((p) => p.handle === handle) ?? null;
  },
  async getCollections(kind) {
    const cats = categories.map((c) => categoryCollection(c.handle)!);
    const occs = occasions.map((o) => occasionCollection(o.slug)!);
    if (kind === "category") return cats;
    if (kind === "occasion") return occs;
    return [...cats, ...occs];
  },
  async getCollection(handle) {
    return categoryCollection(handle) ?? occasionCollection(handle);
  },
};

/** Acceso síncrono (Server Components y build estático). */
export const getProductSync = (handle: string) => products.find((p) => p.handle === handle) ?? null;
export const allProducts = (includeHidden = false) => filterProducts(products, { includeHidden });
