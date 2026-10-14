/**
 * Datos del negocio centralizados. NO repetir estos datos en otros ficheros:
 * importar siempre desde aquí.
 */

export const site = {
  name: "Grabados González Simón",
  shortName: "González Simón",
  legalName: "TALLA DEL CRISTAL GONZALEZ SIMON SL",
  taxId: "B10897650",
  tagline: "Grabado en cristal con chorro de arena.",
  description:
    "Grabado artesanal en cristal con chorro de arena en Madrid. Vasos, copas, jarras, jarrones, metopas y trofeos personalizados con tu nombre, tu fecha o tu logo.",
  // Dominio público: NEXT_PUBLIC_SITE_URL en Vercel
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://grabadosgonzalezsimon.vercel.app").replace(/\/$/, ""),
  locale: "es_ES",
  /**
   * La demo NO se indexa por defecto (evita que Google la confunda con la web
   * real). Al publicar en el dominio definitivo: NEXT_PUBLIC_INDEXABLE=true.
   */
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === "true",
  email: "grabadosgonzalezs@gmail.com",
  phones: {
    mobile: { display: "659 74 62 90", href: "tel:+34659746290", e164: "+34659746290" },
    landline: { display: "916 00 80 03", href: "tel:+34916008003", e164: "+34916008003" },
  },
  whatsapp: {
    number: "34659746290",
    href: "https://wa.me/34659746290",
    defaultMessage: "Hola, vengo de la web y me gustaría información sobre un grabado en cristal.",
  },
  address: {
    // Corregida la errata «Igleisas» de la web actual.
    street: "Avda. de Pablo Iglesias, 89",
    city: "Madrid",
    region: "Comunidad de Madrid",
    postalCode: "28039",
    country: "ES",
    countryName: "España",
  },
  // Avda. de Pablo Iglesias, 89 (Madrid)
  geo: { lat: 40.4545, lng: -3.7105 },
  mapsQuery: "Avenida de Pablo Iglesias 89, Madrid",
  hours: "Lunes a viernes, de 9:30 a 14:00 y de 16:30 a 19:30",
  social: [] as { name: string; url: string }[], // No tiene redes sociales publicadas
  /** Datos del taller que se muestran en la home y en «Sobre nosotros» */
  facts: {
    since: 1993,
    yearsLabel: "30 años",
    pieces: "25.000",
  },
  /** Condiciones de la tienda */
  shop: {
    freeShippingThreshold: 60,
    shippingStandard: 5.9,
    shippingExpressExtra: 4.9,
    giftBoxPrice: 4.9,
    productionTime: "5 a 7 días laborables",
  },
} as const;

export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `${site.whatsapp.href}?text=${encodeURIComponent(message)}`;
}

export function fullAddress() {
  const { street, postalCode, city } = site.address;
  return [street, [postalCode, city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
}

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
}

export function mapsEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`;
}
