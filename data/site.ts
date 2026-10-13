/**
 * Datos del negocio centralizados. NO repetir estos datos en otros ficheros:
 * importar siempre desde aquí.
 */

export const site = {
  name: "Grabados González Simón",
  shortName: "González Simón",
  legalName: "TALLA DEL CRISTAL GONZALEZ SIMON SL", // TODO: verificar con el cliente (dato tomado de su aviso legal actual)
  taxId: "B10897650", // TODO: verificar NIF con el cliente (dato tomado de su aviso legal actual)
  tagline: "Grabados en chorro de arena de cristal.",
  description:
    "Grabado artesanal en cristal con chorro de arena en Madrid. Vasos, copas, jarras, jarrones, metopas y trofeos personalizados con tu nombre, tu fecha o tu logo.",
  // TODO: sustituir por el dominio definitivo cuando se publique (o definir NEXT_PUBLIC_SITE_URL en Vercel)
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://grabadosgonzalezsimon.vercel.app").replace(/\/$/, ""),
  locale: "es_ES",
  email: "grabadosgonzalezs@gmail.com",
  phones: {
    mobile: { display: "659 74 62 90", href: "tel:+34659746290", e164: "+34659746290" },
    landline: { display: "916 00 80 03", href: "tel:+34916008003", e164: "+34916008003" },
  },
  // TODO: confirmar que el número tiene WhatsApp
  whatsapp: {
    number: "34659746290",
    href: "https://wa.me/34659746290",
    defaultMessage: "Hola, vengo de la web y me gustaría información sobre un grabado en cristal.",
  },
  address: {
    // Corregida la errata «Igleisas» de la web actual.
    // TODO: verificar dirección completa y CP con el cliente
    street: "Avda. de Pablo Iglesias, 89",
    city: "Madrid",
    region: "Comunidad de Madrid",
    postalCode: "", // TODO: CP pendiente de confirmar
    country: "ES",
    countryName: "España",
  },
  // Coordenadas aproximadas de Avda. de Pablo Iglesias, 89 (Madrid). TODO: verificar
  geo: { lat: 40.4545, lng: -3.7105 },
  mapsQuery: "Avenida de Pablo Iglesias 89, Madrid",
  hours: "[Horario — confirmar]", // TODO: pedir horario al cliente
  social: [] as { name: string; url: string }[], // No tiene redes sociales publicadas
  demo: {
    isDemo: true,
    freeShippingThreshold: 60,
    shippingStandard: 5.9,
    shippingExpressExtra: 4.9,
    giftBoxPrice: 4.9,
    productionTime: "5–7 días laborables", // TODO: plazo real
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
