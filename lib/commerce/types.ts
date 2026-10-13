/**
 * Tipos de comercio que IMITAN el modelo de la Storefront API de Shopify,
 * para que migrar sea sustituir el provider (ver SHOPIFY_MIGRATION.md).
 *
 * Diferencias conscientes con Shopify (documentadas):
 *  - `Money.amount` es `number` (en Shopify es un string decimal). El
 *    shopifyProvider lo convierte con `Number(amount)`.
 *  - Los metafields se exponen ya tipados en `metafields` (en Shopify llegan
 *    como `{ namespace, key, type, value }` y el adaptador los parsea).
 */

import type { GlassId } from "@/lib/glass/pieces";

export type CurrencyCode = "EUR";
export type Money = { amount: number; currencyCode: CurrencyCode };

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SelectedOption = { name: string; value: string };

export type ProductOption = {
  id: string;
  name: string;
  /** valores disponibles (Shopify: optionValues[].name) */
  values: string[];
};

export type ProductVariant = {
  id: string; // gid://shopify/ProductVariant/…
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  availableForSale: boolean;
  sku: string;
};

export type SEO = { title: string; description: string };

export type OccasionTag =
  | "boda"
  | "comunion"
  | "bautizo"
  | "aniversario"
  | "regalo"
  | "empresa"
  | "hosteleria"
  | "trofeo"
  | "jubilacion"
  | "navidad";

export type CategoryHandle = "vasos" | "copas" | "jarras" | "jarrones" | "metopas-y-placas" | "trofeos" | "packs";

export type PersonalizationType = "texto" | "iniciales" | "logo" | "fecha";

export type Personalization = {
  types: PersonalizationType[];
  /** caracteres máximos por línea de texto */
  maxChars: number;
  maxLines: 1 | 2;
  /** número de caras grabables */
  faces: 1 | 2;
  /** pieza sobre la que se aplica el personalizador */
  engraveOn: GlassId;
};

/** Precio por volumen (quantity breaks). `discount` en tanto por uno. */
export type VolumeTier = { min: number; max: number | null; discount: number; quote?: boolean };

export type Badge = "Más vendido" | "Ideal bodas" | "Para empresas" | "Nuevo";

export type TechnicalDetails = {
  material: string;
  dimensions: string;
  capacity?: string;
  engravingArea: string;
  productionTime: string;
  weight?: string;
};

/** Metafields `custom.*` del producto en Shopify. */
export type ProductMetafields = {
  badge?: Badge;
  illustration: GlassId;
  /** descripción emocional corta (tarjetas, hero de ficha) */
  tagline: string;
  personalization: Personalization;
  volumePricing?: VolumeTier[];
  minQuantity?: number;
  technical: TechnicalDetails;
  /** ejemplo de grabado que se muestra en la ilustración del catálogo */
  sampleEngraving?: import("@/components/glassware/Glass").StaticEngraving;
  category: CategoryHandle;
  /** orden en «Destacados» (menor = antes) */
  featuredRank?: number;
  /** oculto del catálogo (accesorios como el estuche) */
  hidden?: boolean;
  /** productos para «Completa el set» */
  completeTheSet?: string[];
};

export type Product = {
  id: string; // gid://shopify/Product/…
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[]; // incluye ocasiones (OccasionTag) y otros
  options: ProductOption[];
  variants: ProductVariant[];
  images: Image[]; // fotos reales (vacío → se usa la ilustración)
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { maxVariantPrice: Money } | null;
  availableForSale: boolean;
  seo: SEO;
  metafields: ProductMetafields;
  createdAt: string; // ISO — para «Novedades»
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  /** texto largo para la cabecera de la colección */
  descriptionLong?: string;
  image: Image | null;
  illustration: GlassId;
  products: Product[];
  seo: SEO;
  kind: "category" | "occasion";
};

export type SortKey = "destacados" | "precio-asc" | "precio-desc" | "novedades";

export type ProductFilters = {
  category?: CategoryHandle | null;
  occasions?: OccasionTag[];
  priceMin?: number;
  priceMax?: number;
  personalization?: ("texto" | "logo")[];
  query?: string;
  sort?: SortKey;
  includeHidden?: boolean;
};

export interface CommerceProvider {
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollections(kind?: Collection["kind"]): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
}

/* ------------------------------ Carrito -------------------------------- */

/** Igual que los line item properties de Shopify. Las claves con «_» delante son privadas. */
export type Attribute = { key: string; value: string };

export type CartLine = {
  /** clave única de línea: variante + hash del diseño */
  id: string;
  merchandiseId: string; // variant id
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  illustration: GlassId;
  quantity: number;
  /** precio unitario base de la variante (sin tramos de volumen) */
  unitPrice: number;
  compareAtPrice: number | null;
  volumePricing?: VolumeTier[];
  minQuantity?: number;
  tags: string[];
  attributes: Attribute[];
  /** miniatura JPEG/WebP comprimida con el grabado (≤ ~60 KB) */
  preview?: string;
  addedAt: number;
};
