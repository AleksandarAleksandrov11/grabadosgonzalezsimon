import { categories, categoryByHandle } from "@/data/collections";
import { occasionBySlug, occasions } from "@/data/occasions";
import { products } from "@/data/products";
import type { Collection, CommerceProvider } from "./types";
import { filterProducts } from "./filter";

export { filterProducts };

/**
 * Provider local: lee de data/*.ts. Misma interfaz que el futuro
 * shopifyProvider (Storefront API).
 */

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
