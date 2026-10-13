/**
 * Catálogo de DEMO. Precios orientativos de demostración (IVA incluido).
 * TODO: sustituir precios, medidas y plazos por los reales del cliente
 * (ver CONTENT_TODO.md). Cada producto usa una ilustración SVG propia; para
 * usar fotos reales basta con rellenar `images` (TODO por producto).
 */

import { STANDARD_TIERS } from "@/lib/commerce/pricing";
import type {
  Badge,
  CategoryHandle,
  Image,
  OccasionTag,
  Personalization,
  Product,
  ProductMetafields,
  ProductOption,
  ProductVariant,
  TechnicalDetails,
  VolumeTier,
} from "@/lib/commerce/types";
import type { StaticEngraving } from "@/components/glassware/Glass";
import type { GlassId } from "@/lib/glass/pieces";

type OptionDef = { name: string; values: { label: string; delta?: number }[] };

type ProductInput = {
  handle: string;
  title: string;
  productType: string;
  category: CategoryHandle;
  occasions: OccasionTag[];
  extraTags?: string[];
  price: number;
  compareAt?: number;
  options: OptionDef[];
  tagline: string;
  description: string;
  body: string[];
  badge?: Badge;
  illustration: GlassId;
  sample?: StaticEngraving;
  personalization: Personalization;
  volumePricing?: VolumeTier[];
  minQuantity?: number;
  technical: TechnicalDetails;
  createdAt: string;
  featuredRank?: number;
  hidden?: boolean;
  images?: Image[];
  completeTheSet?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

const VENDOR = "Grabados González Simón";
const PRODUCTION = "5–7 días laborables (ejemplo)"; // TODO: plazo real

const money = (amount: number) => ({ amount: Math.round(amount * 100) / 100, currencyCode: "EUR" as const });

function cartesian(defs: OptionDef[]) {
  return defs.reduce<{ label: string; delta?: number }[][]>(
    (acc, def) => acc.flatMap((combo) => def.values.map((v) => [...combo, v])),
    [[]],
  );
}

function defineProduct(p: ProductInput): Product {
  const combos = cartesian(p.options);
  const abbr = p.handle
    .split("-")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 6);
  const variants: ProductVariant[] = combos.map((combo, i) => {
    const delta = combo.reduce((s, v) => s + (v.delta ?? 0), 0);
    return {
      id: `gid://shopify/ProductVariant/${p.handle}-${i + 1}`,
      title: combo.map((v) => v.label).join(" / ") || "Default Title",
      price: money(p.price + delta),
      compareAtPrice: p.compareAt ? money(p.compareAt + delta) : null,
      selectedOptions: combo.map((v, k) => ({ name: p.options[k].name, value: v.label })),
      availableForSale: true,
      sku: `GGS-${abbr}-${String(i + 1).padStart(2, "0")}`,
    };
  });
  const options: ProductOption[] = p.options.map((o, i) => ({
    id: `gid://shopify/ProductOption/${p.handle}-${i + 1}`,
    name: o.name,
    values: o.values.map((v) => v.label),
  }));
  const prices = variants.map((v) => v.price.amount);
  const metafields: ProductMetafields = {
    badge: p.badge,
    illustration: p.illustration,
    tagline: p.tagline,
    personalization: p.personalization,
    volumePricing: p.volumePricing,
    minQuantity: p.minQuantity,
    technical: p.technical,
    sampleEngraving: p.sample,
    category: p.category,
    featuredRank: p.featuredRank,
    hidden: p.hidden,
    completeTheSet: p.completeTheSet,
  };
  const images = p.images ?? [];
  return {
    id: `gid://shopify/Product/${p.handle}`,
    handle: p.handle,
    title: p.title,
    description: p.description,
    descriptionHtml: p.body.map((t) => `<p>${t}</p>`).join(""),
    productType: p.productType,
    vendor: VENDOR,
    tags: [...p.occasions, ...(p.extraTags ?? []), p.category],
    options,
    variants,
    images,
    featuredImage: images[0] ?? null,
    priceRange: { minVariantPrice: money(Math.min(...prices)), maxVariantPrice: money(Math.max(...prices)) },
    compareAtPriceRange: p.compareAt ? { maxVariantPrice: money(p.compareAt) } : null,
    availableForSale: true,
    seo: {
      title: p.seoTitle ?? `${p.title} personalizado`,
      description:
        p.seoDescription ??
        `${p.title} grabado a mano con chorro de arena en Madrid. ${p.tagline} Personalízalo con tu texto, fecha o logo.`,
    },
    metafields,
    createdAt: p.createdAt,
  };
}

/* ---------------------------- Opciones comunes ---------------------------- */

const ACABADO = (dosCaras = 3): OptionDef => ({
  name: "Grabado",
  values: [{ label: "Una cara" }, { label: "Dos caras", delta: dosCaras }],
});
const ESTUCHE: OptionDef = {
  name: "Estuche",
  values: [{ label: "Sin estuche" }, { label: "Con estuche regalo", delta: 4.9 }],
};

const P_GLASS: Personalization = { types: ["texto", "iniciales", "fecha", "logo"], maxChars: 22, maxLines: 2, faces: 2, engraveOn: "tubo" };
const pers = (engraveOn: GlassId, over: Partial<Personalization> = {}): Personalization => ({ ...P_GLASS, engraveOn, ...over });

const tech = (t: Partial<TechnicalDetails> & Pick<TechnicalDetails, "dimensions" | "engravingArea">): TechnicalDetails => ({
  material: "Cristal transparente de alta calidad",
  productionTime: PRODUCTION,
  ...t,
});

/* -------------------------------- Productos ------------------------------- */

export const products: Product[] = [
  // ─────────────── VASOS ───────────────
  defineProduct({
    handle: "vaso-whisky-tallado",
    title: "Vaso de whisky tallado",
    productType: "Vaso",
    category: "vasos",
    occasions: ["regalo", "aniversario", "jubilacion", "navidad", "empresa"],
    price: 14.9,
    options: [
      { name: "Modelo", values: [{ label: "Tallado clásico 30 cl" }, { label: "Tallado diamante 32 cl", delta: 2 }] },
      ACABADO(),
      ESTUCHE,
    ],
    badge: "Más vendido",
    tagline: "El regalo que se queda en casa para siempre.",
    description:
      "Un vaso con peso, tallado en la base y con tus iniciales grabadas a mano. Para brindar despacio y recordar quién te lo regaló.",
    body: [
      "Hay regalos que se usan una vez y regalos que acompañan durante años. Este vaso de whisky, con la base tallada que atrapa la luz, es de los segundos.",
      "Grabo en él unas iniciales, un nombre, una fecha o un pequeño escudo con chorro de arena. El resultado es un esmerilado blanco, fino y permanente: no es una pegatina ni una impresión, es el propio cristal trabajado.",
    ],
    illustration: "whisky-tallado",
    sample: { kind: "text", lines: [{ text: "J · M", font: "roman", size: 0.36, weight: 600, tracking: 0.08 }] },
    personalization: pers("whisky-tallado"),
    technical: tech({ dimensions: "Ø 8,5 × 9,5 cm aprox. (medida orientativa)", capacity: "30–32 cl", engravingArea: "Hasta 6 × 4 cm por cara" }),
    createdAt: "2026-02-10",
    featuredRank: 1,
    completeTheSet: ["set-regalo-decantador-whisky", "vaso-old-fashioned", "estuche-regalo"],
  }),
  defineProduct({
    handle: "vaso-old-fashioned",
    title: "Vaso Old Fashioned de fondo grueso",
    productType: "Vaso",
    category: "vasos",
    occasions: ["regalo", "jubilacion", "aniversario", "navidad", "empresa", "hosteleria"],
    price: 16.9,
    options: [ACABADO(), ESTUCHE],
    tagline: "Fondo pesado, presencia de bar clásico.",
    description:
      "Vaso bajo de fondo grueso, robusto y elegante. Ideal para un regalo con nombre propio o para la carta de cócteles de tu local.",
    body: [
      "El fondo grueso le da equilibrio en la mano y ese sonido seco al dejarlo sobre la barra. Es el vaso de los clásicos: Old Fashioned, whisky solo, un buen ron.",
      "Lo personalizo con un nombre, un mensaje corto o el logotipo de tu negocio. Antes de grabar, te envío la prueba del diseño para que la apruebes.",
    ],
    illustration: "old-fashioned",
    sample: {
      kind: "text",
      lines: [
        { text: "Para Papá", font: "script", size: 0.3 },
        { text: "2026", font: "roman", size: 0.1, tracking: 0.3 },
      ],
    },
    personalization: pers("old-fashioned"),
    technical: tech({ dimensions: "Ø 9 × 9 cm aprox. (medida orientativa)", capacity: "33 cl", engravingArea: "Hasta 7 × 5 cm por cara" }),
    createdAt: "2026-03-02",
    featuredRank: 9,
    completeTheSet: ["vaso-whisky-tallado", "estuche-regalo"],
  }),
  defineProduct({
    handle: "vaso-tubo-grabado",
    title: "Vaso de tubo grabado",
    productType: "Vaso",
    category: "vasos",
    occasions: ["hosteleria", "empresa", "comunion", "regalo", "boda"],
    price: 12.9,
    options: [{ name: "Capacidad", values: [{ label: "30 cl" }, { label: "36 cl", delta: 1 }] }, ACABADO()],
    tagline: "El clásico del cubata, con tu marca o tu nombre.",
    description:
      "El vaso de tubo de toda la vida, alto y ligero, con grabado permanente. El favorito de bares, eventos y celebraciones.",
    body: [
      "Es el vaso que más grabo para hostelería y eventos: tiene una superficie generosa y recta, perfecta para logotipos con detalle.",
      "Si lo necesitas para tu bar, una peña o una boda, consulta el precio por volumen: a partir de 12 unidades el precio por vaso baja automáticamente.",
    ],
    illustration: "tubo",
    sample: { kind: "logo", logo: "cafe", scale: 0.88 },
    personalization: pers("tubo"),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 6,5 × 15 cm aprox. (medida orientativa)", capacity: "30–36 cl", engravingArea: "Hasta 5 × 9 cm por cara" }),
    createdAt: "2026-01-18",
    featuredRank: 3,
    // Foto real del taller (trabajo del cliente). TODO: confirmar permiso para mostrar logos de terceros.
    images: [
      {
        url: "/images/original/vasos-grabados.jpg",
        altText: "Vaso de tubo con un logotipo grabado al chorro de arena, fotografiado en el taller",
        width: 2448,
        height: 3264,
      },
    ],
    completeTheSet: ["pack-hosteleria-logo", "vaso-agua-grabado"],
  }),
  defineProduct({
    handle: "vaso-agua-grabado",
    title: "Vaso de agua o refresco",
    productType: "Vaso",
    category: "vasos",
    occasions: ["hosteleria", "empresa", "comunion", "bautizo", "boda"],
    price: 9.9,
    options: [ACABADO(2.5)],
    tagline: "Sencillo, versátil y para todos los días.",
    description:
      "Vaso de agua de línea limpia, perfecto para mesas de eventos, comuniones o la vajilla diaria de un restaurante con su nombre.",
    body: [
      "Un vaso sencillo que gana personalidad con un grabado discreto: un nombre en la mesa de la comunión, el logo del restaurante o la fecha de una celebración.",
      "Al ser grabado con chorro de arena, el diseño no se despega ni pierde color con el uso.",
    ],
    illustration: "agua",
    sample: {
      kind: "text",
      lines: [
        { text: "Lucía", font: "script", size: 0.4 },
        { text: "Primera Comunión", font: "thin", size: 0.09, tracking: 0.16 },
      ],
    },
    personalization: pers("agua"),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 7,5 × 11 cm aprox. (medida orientativa)", capacity: "27 cl", engravingArea: "Hasta 6 × 6 cm por cara" }),
    createdAt: "2026-04-05",
    featuredRank: 12,
  }),

  // ─────────────── COPAS ───────────────
  defineProduct({
    handle: "copa-vino-tinto-grabada",
    title: "Copa de vino tinto grabada",
    productType: "Copa",
    category: "copas",
    occasions: ["boda", "aniversario", "regalo", "hosteleria", "empresa"],
    price: 13.9,
    options: [ACABADO(), ESTUCHE],
    tagline: "Para brindar con nombre propio.",
    description:
      "Copa de vino tinto de cáliz amplio. Grabada con iniciales, una fecha o el logo de tu bodega para que cada brindis sea único.",
    body: [
      "El cáliz amplio deja respirar el vino y ofrece una zona de grabado perfecta para monogramas, fechas y logotipos de bodega.",
      "Es una de las piezas que más me piden para bodas, aniversarios y regalos de empresa. Si necesitas varias, el precio por volumen se aplica automáticamente.",
    ],
    illustration: "copa-vino",
    sample: { kind: "logo", logo: "bodega", scale: 0.86 },
    personalization: pers("copa-vino"),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 9,5 × 22 cm aprox. (medida orientativa)", capacity: "47 cl", engravingArea: "Hasta 6 × 5 cm por cara" }),
    createdAt: "2026-02-22",
    featuredRank: 2,
    completeTheSet: ["copa-vino-blanco-grabada", "jarra-agua-sangria", "estuche-regalo"],
  }),
  defineProduct({
    handle: "copa-vino-blanco-grabada",
    title: "Copa de vino blanco grabada",
    productType: "Copa",
    category: "copas",
    occasions: ["boda", "aniversario", "regalo", "hosteleria"],
    price: 12.9,
    options: [ACABADO(), ESTUCHE],
    tagline: "Ligera, fina y con un detalle para siempre.",
    description:
      "Copa de vino blanco de cáliz estilizado. Un detalle precioso para una mesa de boda o un regalo de aniversario.",
    body: [
      "Más estilizada que la copa de tinto, es perfecta para nombres en caligrafía y fechas pequeñas y elegantes.",
      "Combínala con la copa de tinto para crear un juego completo con el mismo grabado.",
    ],
    illustration: "copa-blanco",
    sample: {
      kind: "text",
      lines: [
        { text: "Elena & Pablo", font: "script", size: 0.26 },
        { text: "· 2026 ·", font: "roman", size: 0.09, tracking: 0.2 },
      ],
    },
    personalization: pers("copa-blanco"),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 8 × 21 cm aprox. (medida orientativa)", capacity: "35 cl", engravingArea: "Hasta 5 × 4,5 cm por cara" }),
    createdAt: "2026-03-14",
    featuredRank: 10,
    completeTheSet: ["copa-vino-tinto-grabada", "estuche-regalo"],
  }),
  defineProduct({
    handle: "copa-cava-flauta-grabada",
    title: "Copa de cava (flauta) grabada",
    productType: "Copa",
    category: "copas",
    occasions: ["boda", "aniversario", "navidad", "regalo"],
    price: 12.9,
    options: [ACABADO(), ESTUCHE],
    tagline: "La copa del «sí, quiero» y de las campanadas.",
    description:
      "Flauta de cava esbelta, con iniciales o fecha grabadas. La protagonista de los brindis de boda, aniversarios y Nochevieja.",
    body: [
      "La flauta mantiene la burbuja y tiene una silueta que es pura celebración. Su zona de grabado es estrecha y alta: ideal para iniciales, monogramas y fechas en vertical.",
      "Es la forma que inspira el logotipo del taller, y no es casualidad: es la copa de los grandes momentos.",
    ],
    illustration: "copa-cava",
    sample: {
      kind: "text",
      lines: [
        { text: "A & M", font: "script", size: 0.26 },
        { text: "12·06·26", font: "roman", size: 0.07, tracking: 0.1 },
      ],
    },
    personalization: pers("copa-cava", { maxChars: 14 }),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 7 × 24 cm aprox. (medida orientativa)", capacity: "21 cl", engravingArea: "Hasta 3,5 × 7 cm por cara" }),
    createdAt: "2026-01-30",
    featuredRank: 6,
    completeTheSet: ["pack-copas-brindis-boda", "estuche-regalo"],
  }),
  defineProduct({
    handle: "copa-balon-gin-tonic",
    title: "Copa de balón (gin-tonic) grabada",
    productType: "Copa",
    category: "copas",
    occasions: ["regalo", "hosteleria", "empresa", "navidad"],
    price: 14.9,
    options: [ACABADO(), ESTUCHE],
    tagline: "Grande, generosa y con mucho espacio para tu diseño.",
    description:
      "Copa de balón para gin-tonic y combinados. Su cáliz amplio es el lienzo perfecto para logotipos y diseños con detalle.",
    body: [
      "La copa de balón es la reina de los combinados. Su superficie amplia permite grabar logotipos con mucho detalle, ideales para coctelerías y eventos de empresa.",
      "También funciona muy bien como regalo personal con un nombre o una frase corta.",
    ],
    illustration: "copa-balon",
    sample: { kind: "text", lines: [{ text: "Salud", font: "script", size: 0.42 }] },
    personalization: pers("copa-balon"),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 11 × 20 cm aprox. (medida orientativa)", capacity: "70 cl", engravingArea: "Hasta 8 × 6 cm por cara" }),
    createdAt: "2026-05-12",
    featuredRank: 7,
  }),
  defineProduct({
    handle: "pack-copas-brindis-boda",
    title: "Pack 2 copas de brindis para boda",
    productType: "Pack",
    category: "copas",
    occasions: ["boda", "aniversario"],
    extraTags: ["pack"],
    price: 29.9,
    compareAt: 32,
    options: [
      { name: "Modelo", values: [{ label: "Flauta de cava" }, { label: "Copa de vino", delta: 2 }] },
      ESTUCHE,
    ],
    badge: "Ideal bodas",
    tagline: "Vuestras iniciales y vuestra fecha, en el primer brindis.",
    description:
      "Dos copas a juego grabadas con vuestras iniciales y la fecha de la boda. El recuerdo que vuelve a la mesa en cada aniversario.",
    body: [
      "Las copas del brindis son de las pocas cosas de la boda que se usan una y otra vez. Por eso merece la pena que estén grabadas: vuestras iniciales, la fecha y, si queréis, una palabra que sea solo vuestra.",
      "Os envío la prueba del diseño antes de grabar y, si lo pedís con estuche, llegan listas para regalar.",
    ],
    illustration: "pack-brindis",
    sample: {
      kind: "text",
      lines: [
        { text: "A & M", font: "script", size: 0.26 },
        { text: "12·06·26", font: "roman", size: 0.07, tracking: 0.1 },
      ],
    },
    personalization: pers("copa-cava", { maxChars: 14 }),
    technical: tech({ dimensions: "2 copas · Ø 7 × 24 cm aprox. (medida orientativa)", capacity: "21 cl cada una", engravingArea: "Hasta 3,5 × 7 cm por copa" }),
    createdAt: "2026-04-20",
    featuredRank: 4,
    completeTheSet: ["jarron-boca-ancha-centro-mesa", "pack-boda-invitados-copas", "estuche-regalo"],
  }),

  // ─────────────── JARRAS ───────────────
  defineProduct({
    handle: "jarra-cerveza-asa",
    title: "Jarra de cerveza con asa 0,5 L",
    productType: "Jarra",
    category: "jarras",
    occasions: ["regalo", "empresa", "hosteleria", "navidad", "jubilacion"],
    price: 17.9,
    options: [{ name: "Capacidad", values: [{ label: "0,5 L" }, { label: "1 L", delta: 6 }] }, ESTUCHE],
    tagline: "Para la caña de los domingos, con su nombre.",
    description:
      "Jarra cervecera de cristal grueso con asa. Con un nombre, el escudo de tu peña o el logo de tu cervecería.",
    body: [
      "Una jarra contundente, de cristal grueso, que aguanta el ritmo de una buena terraza. Es un regalo infalible para cumpleaños, despedidas y jubilaciones.",
      "Para peñas, clubes y cervecerías hago series con escudo o logotipo con precio por volumen.",
    ],
    illustration: "jarra-cerveza",
    sample: { kind: "logo", logo: "club", scale: 0.78 },
    personalization: pers("jarra-cerveza", { faces: 1 }),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Ø 8,5 × 16 cm aprox. (medida orientativa)", capacity: "0,5 L / 1 L", engravingArea: "Hasta 7 × 9 cm (cara frontal)" }),
    createdAt: "2026-03-28",
    featuredRank: 5,
  }),
  defineProduct({
    handle: "jarra-agua-sangria",
    title: "Jarra de agua o sangría",
    productType: "Jarra",
    category: "jarras",
    occasions: ["hosteleria", "boda", "regalo", "empresa"],
    price: 24.9,
    options: [{ name: "Capacidad", values: [{ label: "1 L" }, { label: "1,5 L", delta: 5 }] }],
    tagline: "El toque de casa en cada mesa.",
    description:
      "Jarra de cristal con pico vertedor, grabada con el nombre de tu restaurante, de tu casa o de los novios.",
    body: [
      "Una jarra grabada en el centro de la mesa dice mucho de un restaurante… y de una casa. Queda preciosa con un nombre en caligrafía o con el logotipo del local.",
      "Combínala con copas o vasos con el mismo diseño para crear un juego completo.",
    ],
    illustration: "jarra-agua",
    sample: {
      kind: "text",
      lines: [
        { text: "La Sobremesa", font: "classic", size: 0.2, weight: 500 },
        { text: "DESDE 2026", font: "thin", size: 0.07, tracking: 0.3 },
      ],
    },
    personalization: pers("jarra-agua", { faces: 1 }),
    technical: tech({ dimensions: "Ø 10 × 23 cm aprox. (medida orientativa)", capacity: "1 L / 1,5 L", engravingArea: "Hasta 8 × 8 cm (cara frontal)" }),
    createdAt: "2026-06-03",
    featuredRank: 14,
    completeTheSet: ["copa-vino-tinto-grabada", "vaso-agua-grabado"],
  }),

  // ─────────────── JARRONES ───────────────
  defineProduct({
    handle: "jarron-cilindrico-grabado",
    title: "Jarrón cilíndrico grabado",
    productType: "Jarrón",
    category: "jarrones",
    occasions: ["boda", "aniversario", "regalo", "empresa", "trofeo"],
    price: 34.9,
    options: [{ name: "Altura", values: [{ label: "25 cm" }, { label: "30 cm", delta: 6 }] }, ACABADO(5)],
    tagline: "Un regalo que florece cada vez que se usa.",
    description:
      "Jarrón cilíndrico de líneas puras, grabado con iniciales, una frase o un escudo. Para aniversarios, regalos de empresa o como premio.",
    body: [
      "Un jarrón grabado es un regalo que vuelve a protagonizar la casa cada vez que se llena de flores. Su forma recta permite diseños grandes, frases y escudos.",
      "También lo preparo como premio o reconocimiento en eventos corporativos.",
    ],
    illustration: "jarron-cilindrico",
    sample: {
      kind: "text",
      lines: [
        { text: "Bodas de Plata", font: "classic", size: 0.14, weight: 500 },
        { text: "25 años", font: "script", size: 0.16 },
      ],
    },
    personalization: pers("jarron-cilindrico", { maxChars: 28 }),
    technical: tech({ dimensions: "Ø 10 × 25/30 cm aprox. (medida orientativa)", engravingArea: "Hasta 10 × 14 cm por cara" }),
    createdAt: "2026-02-02",
    featuredRank: 11,
  }),
  defineProduct({
    handle: "jarron-boca-ancha-centro-mesa",
    title: "Jarrón de boca ancha para centro de mesa",
    productType: "Jarrón",
    category: "jarrones",
    occasions: ["boda", "comunion", "bautizo", "empresa", "hosteleria"],
    price: 39.9,
    options: [{ name: "Tamaño", values: [{ label: "Mediano 20 cm" }, { label: "Grande 26 cm", delta: 8 }] }],
    badge: "Nuevo",
    tagline: "Centros de mesa que los invitados querrán llevarse.",
    description:
      "Jarrón de boca ancha pensado para centros de mesa de bodas y eventos, grabado con las iniciales o el logotipo del evento.",
    body: [
      "Los centros de mesa grabados son un detalle que se nota: con flores, velas o vacíos, el grabado brilla con la luz del salón.",
      "Para eventos con varias mesas aplico precio por volumen. Después, los novios o la empresa pueden regalarlos a los invitados.",
    ],
    illustration: "jarron-boca-ancha",
    sample: { kind: "text", lines: [{ text: "C & J", font: "script", size: 0.34 }] },
    personalization: pers("jarron-boca-ancha", { maxChars: 24 }),
    volumePricing: STANDARD_TIERS,
    technical: tech({ dimensions: "Boca Ø 16 × 20/26 cm aprox. (medida orientativa)", engravingArea: "Hasta 12 × 10 cm por cara" }),
    createdAt: "2026-07-01",
    featuredRank: 8,
  }),

  // ─────────────── METOPAS, PLACAS Y TROFEOS ───────────────
  defineProduct({
    handle: "metopa-cristal-peana",
    title: "Metopa de cristal con peana",
    productType: "Metopa",
    category: "metopas-y-placas",
    occasions: ["trofeo", "jubilacion", "empresa", "aniversario", "regalo"],
    price: 49.9,
    options: [{ name: "Tamaño", values: [{ label: "15 × 20 cm" }, { label: "20 × 30 cm", delta: 15 }] }, ESTUCHE],
    tagline: "El reconocimiento que se queda en la vitrina.",
    description:
      "Metopa de cristal grueso con peana negra. Para homenajes, aniversarios de empresa, premios y reconocimientos con escudo o logotipo.",
    body: [
      "Las metopas son el formato clásico del reconocimiento: cristal grueso con bisel, un escudo o logotipo y un texto que cuenta por qué.",
      "Grabo escudos de clubes, logotipos corporativos y textos largos con mucho detalle. Antes de grabar te envío la maqueta para revisarla juntos.",
    ],
    illustration: "metopa",
    sample: { kind: "logo", logo: "club", scale: 0.86 },
    personalization: pers("metopa", { maxChars: 36, faces: 1 }),
    volumePricing: STANDARD_TIERS,
    technical: tech({ material: "Cristal grueso biselado y peana negra", dimensions: "15 × 20 cm o 20 × 30 cm (cristal), grosor aprox. 1,5 cm", engravingArea: "Toda la superficie frontal" }),
    createdAt: "2026-01-12",
    featuredRank: 13,
  }),
  defineProduct({
    handle: "placa-conmemorativa-cristal",
    title: "Placa conmemorativa de cristal",
    productType: "Placa",
    category: "metopas-y-placas",
    occasions: ["trofeo", "jubilacion", "empresa", "aniversario"],
    price: 44.9,
    options: [{ name: "Tamaño", values: [{ label: "20 × 15 cm" }, { label: "30 × 20 cm", delta: 14 }] }, ESTUCHE],
    tagline: "Las palabras justas, grabadas en cristal.",
    description:
      "Placa horizontal de cristal con soporte, para dedicatorias, inauguraciones, aniversarios y agradecimientos.",
    body: [
      "Hay momentos que merecen quedar por escrito: una inauguración, 25 años en la empresa, un agradecimiento. La placa horizontal da espacio para un texto completo con un logotipo.",
      "Cuéntame qué quieres decir y te propongo la composición.",
    ],
    illustration: "placa",
    sample: {
      kind: "text",
      lines: [
        { text: "GRACIAS POR", font: "thin", size: 0.08, tracking: 0.3 },
        { text: "25 años", font: "script", size: 0.3 },
        { text: "DE DEDICACIÓN", font: "thin", size: 0.08, tracking: 0.3 },
      ],
    },
    personalization: pers("placa", { maxChars: 40, faces: 1 }),
    technical: tech({ material: "Cristal grueso biselado con soporte", dimensions: "20 × 15 cm o 30 × 20 cm aprox.", engravingArea: "Toda la superficie frontal" }),
    createdAt: "2026-05-30",
    featuredRank: 16,
  }),
  defineProduct({
    handle: "trofeo-cristal-llama",
    title: "Trofeo de cristal tipo llama",
    productType: "Trofeo",
    category: "trofeos",
    occasions: ["trofeo", "empresa"],
    price: 59.9,
    options: [{ name: "Altura", values: [{ label: "22 cm" }, { label: "28 cm", delta: 12 }] }],
    badge: "Nuevo",
    tagline: "Para los que se lo han ganado.",
    description:
      "Trofeo de cristal con forma de llama sobre peana negra. Para torneos, premios de empresa y reconocimientos deportivos.",
    body: [
      "Un trofeo de cristal tiene algo que no tiene el metal: la luz lo atraviesa. Esta llama es perfecta para campeonatos, galas y premios a empleados.",
      "Si organizas un torneo o una gala, pide varias unidades y aplico precio por volumen.",
    ],
    illustration: "trofeo-llama",
    sample: {
      kind: "text",
      lines: [
        { text: "CAMPEONES", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
    personalization: pers("trofeo-llama", { maxChars: 18, faces: 1 }),
    volumePricing: STANDARD_TIERS,
    technical: tech({ material: "Cristal grueso y peana negra", dimensions: "22 o 28 cm de altura aprox.", engravingArea: "Hasta 6 × 10 cm" }),
    createdAt: "2026-08-15",
    featuredRank: 15,
  }),
  defineProduct({
    handle: "trofeo-jubilacion-homenaje",
    title: "Trofeo de jubilación u homenaje con estuche",
    productType: "Trofeo",
    category: "trofeos",
    occasions: ["jubilacion", "trofeo", "empresa", "aniversario"],
    price: 69.9,
    options: [{ name: "Altura", values: [{ label: "24 cm" }, { label: "30 cm", delta: 12 }] }],
    tagline: "Toda una vida de trabajo merece algo para siempre.",
    description:
      "Obelisco de cristal con peana y estuche de presentación, grabado con el nombre, los años y unas palabras de despedida.",
    body: [
      "Una jubilación o un homenaje es un cierre emocionante. Este obelisco de cristal, con su estuche, es el regalo que el homenajeado pondrá en un lugar especial de casa.",
      "Lo grabo con su nombre, los años de trayectoria y una dedicatoria del equipo.",
    ],
    illustration: "trofeo-obelisco",
    sample: {
      kind: "text",
      lines: [
        { text: "Feliz", font: "script", size: 0.14 },
        { text: "jubilación", font: "script", size: 0.14 },
      ],
    },
    personalization: pers("trofeo-obelisco", { maxChars: 18, faces: 1 }),
    technical: tech({ material: "Cristal grueso, peana negra y estuche de presentación", dimensions: "24 o 30 cm de altura aprox.", engravingArea: "Hasta 6 × 14 cm" }),
    createdAt: "2026-06-21",
    featuredRank: 17,
  }),

  // ─────────────── PACKS Y EMPRESAS ───────────────
  defineProduct({
    handle: "pack-comunion-12-vasos",
    title: "Pack comunión: 12 vasos con nombre y fecha",
    productType: "Pack",
    category: "packs",
    occasions: ["comunion", "bautizo"],
    extraTags: ["pack"],
    price: 89,
    options: [{ name: "Vaso", values: [{ label: "Vaso de agua" }, { label: "Vaso de tubo", delta: 12 }] }],
    tagline: "El recuerdo de su gran día, en cada vaso de la mesa.",
    description:
      "Doce vasos grabados con el nombre y la fecha de la comunión. Para la mesa del banquete y como recuerdo para la familia.",
    body: [
      "Un detalle precioso para la mesa principal de la comunión o el bautizo: doce vasos con el nombre del protagonista, la fecha y un pequeño símbolo.",
      "Después, cada familia se lleva el suyo como recuerdo. Si necesitas más unidades, escríbeme y te preparo presupuesto.",
    ],
    illustration: "pack-vasos",
    sample: {
      kind: "text",
      lines: [
        { text: "Hugo", font: "script", size: 0.34 },
        { text: "1ª COMUNIÓN", font: "thin", size: 0.08, tracking: 0.2 },
      ],
    },
    personalization: pers("agua"),
    technical: tech({ dimensions: "12 vasos · Ø 7,5 × 11 cm aprox. (medida orientativa)", capacity: "27 cl cada uno", engravingArea: "Hasta 6 × 6 cm por vaso" }),
    createdAt: "2026-03-08",
    featuredRank: 18,
  }),
  defineProduct({
    handle: "pack-boda-invitados-copas",
    title: "Copas para invitados de boda con iniciales",
    productType: "Pack",
    category: "packs",
    occasions: ["boda"],
    extraTags: ["pack", "volumen"],
    price: 9.9,
    options: [
      {
        name: "Modelo",
        values: [{ label: "Copa de vino" }, { label: "Flauta de cava" }, { label: "Copa de balón", delta: 1.5 }],
      },
    ],
    badge: "Ideal bodas",
    tagline: "El detalle para invitados que sí se usa.",
    description:
      "Copas grabadas con vuestras iniciales y la fecha para cada invitado. Precio por unidad, mínimo 24 copas, con descuentos por volumen.",
    body: [
      "Un detalle para invitados que no acaba en un cajón: cada uno brinda con su copa grabada y se la lleva a casa.",
      "Precio por unidad con tramos por volumen. Para más de 200 copas, te preparo un presupuesto a medida.",
    ],
    illustration: "copa-vino",
    sample: {
      kind: "text",
      lines: [
        { text: "L & D", font: "script", size: 0.32 },
        { text: "2026", font: "roman", size: 0.08, tracking: 0.3 },
      ],
    },
    personalization: pers("copa-vino", { maxChars: 16 }),
    minQuantity: 24,
    volumePricing: [
      { min: 24, max: 49, discount: 0 },
      { min: 50, max: 99, discount: 0.08 },
      { min: 100, max: 199, discount: 0.15 },
      { min: 200, max: null, discount: 0.15, quote: true },
    ],
    technical: tech({ dimensions: "Según modelo (medidas orientativas)", engravingArea: "Hasta 6 × 5 cm por copa" }),
    createdAt: "2026-09-01",
    featuredRank: 19,
  }),
  defineProduct({
    handle: "pack-hosteleria-logo",
    title: "Cristalería con tu logo para hostelería",
    productType: "Pack",
    category: "packs",
    occasions: ["hosteleria", "empresa"],
    extraTags: ["pack", "volumen"],
    price: 7.9,
    options: [
      {
        name: "Pieza",
        values: [
          { label: "Vaso de tubo" },
          { label: "Vaso de agua", delta: -1 },
          { label: "Copa de vino", delta: 1.5 },
          { label: "Copa de balón", delta: 2.5 },
        ],
      },
    ],
    badge: "Para empresas",
    tagline: "Tu marca en cada servicio, sin que se borre en el lavado.",
    description:
      "Vasos y copas con el logotipo de tu bar, restaurante o bodega. Precio por unidad desde 24 piezas, con tramos por volumen.",
    body: [
      "La cristalería con tu logo eleva la imagen del local en cada servicio. Al ser grabado con chorro de arena, el logo no se despega ni pierde color con el uso diario.",
      "Envíame tu logotipo (vale PDF, SVG, AI o una imagen nítida) y te devuelvo una prueba del grabado antes de producir.",
    ],
    illustration: "pack-vasos",
    sample: { kind: "logo", logo: "cafe", scale: 0.86 },
    personalization: pers("tubo", { types: ["logo", "texto"] }),
    minQuantity: 24,
    volumePricing: [
      { min: 24, max: 49, discount: 0 },
      { min: 50, max: 99, discount: 0.1 },
      { min: 100, max: 249, discount: 0.18 },
      { min: 250, max: null, discount: 0.18, quote: true },
    ],
    technical: tech({ dimensions: "Según pieza elegida (medidas orientativas)", engravingArea: "Adaptada a cada pieza" }),
    createdAt: "2026-08-02",
    featuredRank: 20,
  }),
  defineProduct({
    handle: "set-regalo-decantador-whisky",
    title: "Set regalo: decantador y 2 vasos de whisky",
    productType: "Pack",
    category: "packs",
    occasions: ["regalo", "jubilacion", "navidad", "empresa", "aniversario"],
    extraTags: ["pack"],
    price: 49.9,
    options: [ESTUCHE],
    tagline: "El regalo de los grandes momentos.",
    description:
      "Decantador de cristal y dos vasos de whisky tallados, grabados con el mismo diseño. Un regalo redondo para jubilaciones, aniversarios y Navidad.",
    body: [
      "Un set pensado para regalar: el decantador con un monograma o un nombre y dos vasos tallados a juego.",
      "Es uno de los regalos corporativos favoritos para directivos, clientes y homenajes.",
    ],
    illustration: "set-whisky",
    sample: { kind: "text", lines: [{ text: "R G", font: "roman", size: 0.3, weight: 600, tracking: 0.1 }] },
    personalization: pers("decantador", { faces: 1 }),
    technical: tech({ dimensions: "Decantador 75 cl aprox. + 2 vasos de 30 cl (medidas orientativas)", engravingArea: "Hasta 7 × 5 cm en cada pieza" }),
    createdAt: "2026-09-20",
    featuredRank: 21,
  }),
  defineProduct({
    handle: "estuche-regalo",
    title: "Estuche regalo",
    productType: "Accesorio",
    category: "packs",
    occasions: ["regalo"],
    extraTags: ["accesorio"],
    price: 4.9,
    options: [],
    tagline: "Listo para regalar.",
    description: "Estuche de presentación negro con lazo champán para regalar tu pieza grabada.",
    body: ["Estuche rígido negro con interior protegido y lazo champán. Llega montado y listo para regalar."],
    illustration: "estuche",
    personalization: { types: [], maxChars: 0, maxLines: 1, faces: 1, engraveOn: "estuche" },
    technical: tech({ material: "Cartón rígido forrado", dimensions: "Adaptado a cada pieza", engravingArea: "No aplica", productionTime: "Inmediato" }),
    createdAt: "2026-01-01",
    hidden: true,
  }),
];

export const GIFT_BOX_HANDLE = "estuche-regalo";
