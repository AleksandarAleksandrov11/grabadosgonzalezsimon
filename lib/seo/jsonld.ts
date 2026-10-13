import { site } from "@/data/site";
import type { Product } from "@/lib/commerce/types";
import { absoluteUrl } from "./metadata";

type Json = Record<string, unknown>;

export function localBusinessJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#negocio`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: [site.phones.mobile.e164, site.phones.landline.e164],
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl("/brand/logo-mark.svg"),
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [
      { "@type": "City", name: "Madrid" },
      { "@type": "Country", name: "España" },
    ],
    knowsAbout: ["Grabado en cristal", "Chorro de arena", "Cristalería personalizada", "Trofeos de cristal"],
  };
}

export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organizacion`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/brand/icon-512.png"),
    email: site.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phones.mobile.e164,
        contactType: "customer service",
        areaServed: "ES",
        availableLanguage: "es",
      },
    ],
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#web`,
    name: site.name,
    url: site.url,
    inLanguage: "es-ES",
    publisher: { "@id": `${site.url}/#organizacion` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/tienda?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function productJsonLd(p: Product): Json {
  const url = absoluteUrl(`/producto/${p.handle}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    sku: p.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    category: p.productType,
    image: [absoluteUrl(`/og/producto/${p.handle}`), ...p.images.map((i) => absoluteUrl(i.url))],
    url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: p.priceRange.minVariantPrice.amount.toFixed(2),
      highPrice: p.priceRange.maxVariantPrice.amount.toFixed(2),
      offerCount: p.variants.length,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@id": `${site.url}/#organizacion` },
      // Precios orientativos de demostración
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\[[^\]]+\]/g, "").trim() },
    })),
  };
}

/** Serializa JSON-LD de forma segura para incrustar en <script>. */
export function jsonLdString(data: Json | Json[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
