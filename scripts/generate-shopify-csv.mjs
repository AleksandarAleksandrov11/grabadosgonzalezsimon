#!/usr/bin/env node
/**
 * Genera shopify/products.csv a partir del catálogo de la demo (data/products.ts)
 * con el formato de importación de productos de Shopify.
 *
 *   pnpm shopify:csv
 *
 * - Una fila por variante; la primera fila de cada producto lleva los datos del producto.
 * - Los metafields `custom.*` van como columnas «Nombre (product.metafields.custom.clave)».
 *   Antes de importar hay que crear sus definiciones en Shopify (ver SHOPIFY_MIGRATION.md).
 * - Los productos se importan como BORRADOR (Status = draft) para revisarlos antes de publicar.
 * - Precios orientativos de la demo: sustituir por los reales (CONTENT_TODO.md).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root } });
const { products } = await jiti.import(resolve(root, "data/products.ts"));

const METAFIELDS = [
  ["Frase corta", "tagline", (p) => p.metafields.tagline],
  ["Distintivo", "badge", (p) => p.metafields.badge ?? ""],
  ["Categoría", "category", (p) => p.metafields.category],
  ["Ilustración", "illustration", (p) => p.metafields.illustration],
  ["Cantidad mínima", "min_quantity", (p) => p.metafields.minQuantity ?? ""],
  ["Personalización", "personalization", (p) => JSON.stringify(p.metafields.personalization)],
  [
    "Precio por volumen",
    "volume_pricing",
    (p) => (p.metafields.volumePricing ? JSON.stringify(p.metafields.volumePricing) : ""),
  ],
  ["Ficha técnica", "technical", (p) => JSON.stringify(p.metafields.technical)],
  ["Completa el set", "complete_the_set", (p) => (p.metafields.completeTheSet ?? []).join(",")],
];

const HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option2 Name",
  "Option2 Value",
  "Option3 Name",
  "Option3 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Gift Card",
  "SEO Title",
  "SEO Description",
  "Variant Weight Unit",
  ...METAFIELDS.map(([label, key]) => `${label} (product.metafields.custom.${key})`),
  "Status",
];

const esc = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const price = (m) => (m ? m.amount.toFixed(2) : "");

const rows = [HEADERS];
for (const p of products) {
  if (p.options.length > 3)
    throw new Error(`${p.handle}: Shopify admite como máximo 3 opciones por producto`);
  p.variants.forEach((v, i) => {
    const first = i === 0;
    const opt = (n) => v.selectedOptions[n];
    const row = {
      Handle: p.handle,
      Title: first ? p.title : "",
      "Body (HTML)": first ? p.descriptionHtml : "",
      Vendor: first ? p.vendor : "",
      "Product Category": "",
      Type: first ? p.productType : "",
      Tags: first ? p.tags.join(", ") : "",
      Published: first ? "TRUE" : "",
      "Option1 Name": first ? (opt(0)?.name ?? "Title") : "",
      "Option1 Value": opt(0)?.value ?? "Default Title",
      "Option2 Name": first ? (opt(1)?.name ?? "") : "",
      "Option2 Value": opt(1)?.value ?? "",
      "Option3 Name": first ? (opt(2)?.name ?? "") : "",
      "Option3 Value": opt(2)?.value ?? "",
      "Variant SKU": v.sku,
      "Variant Grams": 0, // TODO: peso real para calcular envíos
      "Variant Inventory Tracker": "", // fabricación bajo pedido: sin control de stock
      "Variant Inventory Policy": "continue",
      "Variant Fulfillment Service": "manual",
      "Variant Price": price(v.price),
      "Variant Compare At Price": price(v.compareAtPrice),
      "Variant Requires Shipping": "TRUE",
      "Variant Taxable": "TRUE",
      "Image Src": "", // TODO: subir fotos reales (la demo usa ilustraciones SVG)
      "Image Position": "",
      "Image Alt Text": "",
      "Gift Card": first ? "FALSE" : "",
      "SEO Title": first ? p.seo.title : "",
      "SEO Description": first ? p.seo.description : "",
      "Variant Weight Unit": "g",
      Status: first ? "draft" : "",
    };
    for (const [label, key, get] of METAFIELDS) {
      row[`${label} (product.metafields.custom.${key})`] = first ? get(p) : "";
    }
    rows.push(HEADERS.map((h) => row[h]));
  });
}

const out = resolve(root, "shopify/products.csv");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, rows.map((r) => r.map(esc).join(",")).join("\n") + "\n", "utf8");
console.log(`✓ ${products.length} productos · ${rows.length - 1} variantes → ${out}`);
