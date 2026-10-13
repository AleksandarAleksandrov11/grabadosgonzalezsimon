import { normalize } from "@/lib/utils";
import type { Product, ProductFilters } from "./types";

/** Filtro y orden del catálogo (sin datos: se puede usar en cliente sin arrastrar el catálogo). */
export function filterProducts(list: Product[], f: ProductFilters = {}): Product[] {
  let out = f.includeHidden ? list : list.filter((p) => !p.metafields.hidden);
  if (f.category) {
    out = out.filter((p) =>
      f.category === "packs"
        ? p.metafields.category === "packs" || p.tags.includes("pack")
        : p.metafields.category === f.category,
    );
  }
  if (f.occasions?.length) out = out.filter((p) => f.occasions!.some((o) => p.tags.includes(o)));
  if (typeof f.priceMin === "number")
    out = out.filter((p) => p.priceRange.minVariantPrice.amount >= f.priceMin!);
  if (typeof f.priceMax === "number")
    out = out.filter((p) => p.priceRange.minVariantPrice.amount <= f.priceMax!);
  if (f.personalization?.length) {
    out = out.filter((p) =>
      f.personalization!.every((t) =>
        t === "logo"
          ? p.metafields.personalization.types.includes("logo")
          : p.metafields.personalization.types.includes("texto"),
      ),
    );
  }
  if (f.query) {
    const q = normalize(f.query.trim());
    const terms = q.split(/\s+/).filter(Boolean);
    out = out.filter((p) => {
      const hay = normalize(
        [
          p.title,
          p.description,
          p.productType,
          p.tags.join(" "),
          p.metafields.tagline,
          p.metafields.category,
        ].join(" "),
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

