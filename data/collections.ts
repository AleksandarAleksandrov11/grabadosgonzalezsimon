import type { CategoryHandle } from "@/lib/commerce/types";
import type { GlassId } from "@/lib/glass/pieces";
import type { StaticEngraving } from "@/components/glassware/Glass";

export type CategoryDef = {
  handle: CategoryHandle;
  title: string;
  short: string;
  description: string;
  illustration: GlassId;
  sample?: StaticEngraving;
  seoTitle: string;
  seoDescription: string;
};

export const categories: CategoryDef[] = [
  {
    handle: "vasos",
    title: "Vasos grabados",
    short: "Vasos",
    description:
      "Vasos de whisky, de tubo y de agua grabados a mano con chorro de arena. Con iniciales, nombres, fechas o el logo de tu negocio.",
    illustration: "whisky-tallado",
    sample: { kind: "text", lines: [{ text: "J · M", font: "roman", size: 0.36, weight: 600, tracking: 0.08 }] },
    seoTitle: "Vasos grabados personalizados en Madrid",
    seoDescription:
      "Vasos grabados en Madrid con chorro de arena: vasos de whisky, de tubo y de agua personalizados con nombre, iniciales o logotipo.",
  },
  {
    handle: "copas",
    title: "Copas grabadas",
    short: "Copas",
    description:
      "Copas de vino, de cava y de balón con grabado esmerilado permanente. Las protagonistas de bodas, aniversarios y brindis.",
    illustration: "copa-vino",
    sample: { kind: "text", lines: [{ text: "A & M", font: "script", size: 0.4 }] },
    seoTitle: "Copas grabadas personalizadas para bodas y regalos",
    seoDescription:
      "Copas grabadas para boda, aniversario y regalo: copas de vino, cava y gin-tonic personalizadas con iniciales y fecha. Grabado en cristal en Madrid.",
  },
  {
    handle: "jarras",
    title: "Jarras grabadas",
    short: "Jarras",
    description: "Jarras de cerveza y de agua con nombre, escudo o logotipo. Para regalar, para tu peña o para la mesa de tu restaurante.",
    illustration: "jarra-cerveza",
    sample: { kind: "logo", logo: "club", scale: 0.78 },
    seoTitle: "Jarras de cerveza grabadas y jarras de agua personalizadas",
    seoDescription: "Jarras de cerveza grabadas con nombre o escudo y jarras de agua con el logo de tu restaurante. Grabado al chorro de arena en Madrid.",
  },
  {
    handle: "jarrones",
    title: "Jarrones grabados",
    short: "Jarrones",
    description: "Jarrones de cristal grabados para regalar, decorar o vestir las mesas de una boda o un evento.",
    illustration: "jarron-boca-ancha",
    sample: { kind: "text", lines: [{ text: "C & J", font: "script", size: 0.34 }] },
    seoTitle: "Jarrones de cristal grabados y centros de mesa",
    seoDescription: "Jarrones de cristal grabados con iniciales, frases o escudos. Centros de mesa para bodas y eventos y regalos de empresa.",
  },
  {
    handle: "metopas-y-placas",
    title: "Metopas y placas de cristal",
    short: "Metopas y placas",
    description: "Metopas con peana y placas conmemorativas para homenajes, aniversarios de empresa y reconocimientos.",
    illustration: "metopa",
    sample: { kind: "logo", logo: "club", scale: 0.86 },
    seoTitle: "Metopas de cristal y placas conmemorativas grabadas",
    seoDescription: "Metopas de cristal con peana y placas conmemorativas grabadas con escudos, logotipos y textos. Homenajes y reconocimientos en Madrid.",
  },
  {
    handle: "trofeos",
    title: "Trofeos de cristal personalizados",
    short: "Trofeos",
    description: "Trofeos de cristal para torneos, premios de empresa, jubilaciones y homenajes. Grabados con el máximo detalle.",
    illustration: "trofeo-llama",
    sample: {
      kind: "text",
      lines: [
        { text: "CAMPEONES", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
    seoTitle: "Trofeos de cristal personalizados",
    seoDescription: "Trofeos de cristal personalizados para premios deportivos y corporativos, jubilaciones y homenajes. Grabado artesanal en Madrid.",
  },
  {
    handle: "packs",
    title: "Packs y cristalería para eventos",
    short: "Packs",
    description: "Packs para comuniones y bodas, sets de regalo y cristalería con logo para hostelería con precio por volumen.",
    illustration: "pack-vasos",
    sample: { kind: "text", lines: [{ text: "Hugo", font: "script", size: 0.34 }] },
    seoTitle: "Packs de vasos y copas grabadas para eventos y hostelería",
    seoDescription: "Packs de vasos para comuniones, copas para invitados de boda, sets de regalo y cristalería con logo para hostelería con precio por volumen.",
  },
];

export const categoryByHandle = (h: string) => categories.find((c) => c.handle === h) ?? null;
