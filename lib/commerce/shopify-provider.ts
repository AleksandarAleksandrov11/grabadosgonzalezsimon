/**
 * STUB documentado del provider de Shopify (Storefront API).
 *
 * Para migrar la demo a Shopify headless (o Hydrogen):
 *  1. Crea una app personalizada en el admin de Shopify con acceso a la
 *     Storefront API y copia el token público.
 *  2. Define en Vercel: SHOPIFY_STORE_DOMAIN y SHOPIFY_STOREFRONT_ACCESS_TOKEN.
 *  3. Implementa las consultas de abajo y cambia `commerce` en
 *     lib/commerce/index.ts para usar `shopifyProvider`.
 *  4. Los metafields `custom.*` (badge, illustration, personalization,
 *     volume_pricing, technical…) se crean en Ajustes › Datos personalizados
 *     y se mapean en `toProduct()`.
 *
 * Ver SHOPIFY_MIGRATION.md para la correspondencia completa.
 */

import type { Collection, CommerceProvider, Product, ProductFilters } from "./types";

const API_VERSION = "2026-07"; // TODO: usar la versión estable vigente de la Storefront API

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token)
    throw new Error("Shopify no está configurado (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN).");
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    createdAt
    options {
      id
      name
      optionValues {
        name
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        sku
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    seo {
      title
      description
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "badge" }
        { namespace: "custom", key: "illustration" }
        { namespace: "custom", key: "personalization" }
        { namespace: "custom", key: "volume_pricing" }
        { namespace: "custom", key: "technical" }
        { namespace: "custom", key: "tagline" }
        { namespace: "custom", key: "category" }
        { namespace: "custom", key: "min_quantity" }
        { namespace: "custom", key: "complete_the_set" }
      ]
    ) {
      namespace
      key
      type
      value
    }
  }
`;

/** Convierte un nodo de Shopify al tipo Product de la demo. */
function toProduct(_node: unknown): Product {
  // TODO: mapear money.amount (string) → number, optionValues → values,
  // y parsear los metafields JSON a ProductMetafields.
  throw new Error("toProduct: pendiente de implementar en la migración a Shopify");
}

export const shopifyProvider: CommerceProvider = {
  async getProducts(_filters?: ProductFilters) {
    const data = await storefront<{ products: { nodes: unknown[] } }>(
      `${PRODUCT_FRAGMENT} query Products($query: String) { products(first: 100, query: $query) { nodes { ...ProductFields } } }`,
    );
    return data.products.nodes.map(toProduct);
  },
  async getProduct(handle: string) {
    const data = await storefront<{ product: unknown | null }>(
      `${PRODUCT_FRAGMENT} query Product($handle: String!) { product(handle: $handle) { ...ProductFields } }`,
      { handle },
    );
    return data.product ? toProduct(data.product) : null;
  },
  async getCollections() {
    // collections(first: 50) { nodes { handle title description image { url altText width height } } }
    return [] as Collection[];
  },
  async getCollection(_handle: string) {
    // collection(handle: $handle) { handle title description products(first: 100) { nodes { ...ProductFields } } }
    return null;
  },
};

/*
 * Carrito en Shopify (Storefront API):
 *   cartCreate(input: { lines: [{ merchandiseId, quantity, attributes: [{ key, value }] }] })
 *   cartLinesAdd / cartLinesUpdate / cartLinesRemove
 *   cartDiscountCodesUpdate(cartId, discountCodes: ["DEMO10"])
 *   → cart.checkoutUrl redirige al checkout nativo de Shopify.
 * Los `attributes` de nuestras CartLine son exactamente los line item properties.
 */
