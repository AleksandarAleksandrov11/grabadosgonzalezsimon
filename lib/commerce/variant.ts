import type { NewLine } from "@/lib/store/cart";
import type { Attribute, Product, ProductVariant } from "./types";

export function findVariant(product: Product, selected: Record<string, string>): ProductVariant {
  return (
    product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ??
    product.variants[0]
  );
}

export function selectedFromVariant(v: ProductVariant): Record<string, string> {
  return Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value]));
}

export function variantById(product: Product, id: string | null | undefined) {
  if (!id) return null;
  return product.variants.find((v) => v.id === id || v.id.endsWith(`-${id}`)) ?? null;
}

/** Construye una línea de carrito a partir de producto + variante + atributos. */
export function toCartLine(
  product: Product,
  variant: ProductVariant,
  attributes: Attribute[],
  preview?: string,
): NewLine {
  return {
    merchandiseId: variant.id,
    productHandle: product.handle,
    productTitle: product.title,
    variantTitle: variant.title === "Default Title" ? "" : variant.title,
    illustration: product.metafields.illustration,
    unitPrice: variant.price.amount,
    compareAtPrice: variant.compareAtPrice?.amount ?? null,
    volumePricing: product.metafields.volumePricing,
    minQuantity: product.metafields.minQuantity,
    tags: product.tags,
    attributes,
    preview,
  };
}

/** Atributos para un producto añadido sin diseño (se acuerda después con el cliente). */
export const PENDING_DESIGN: Attribute[] = [
  { key: "Personalización", value: "Pendiente: te contactamos para preparar el diseño" },
];
