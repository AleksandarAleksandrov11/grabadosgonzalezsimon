import type { EngraveFont } from "@/components/glassware/Glass";

export type Ornament = "none" | "cross" | "dove" | "star" | "laurel" | "rings" | "shield" | "heart";

/** Configuración serializable de un diseño (va a la URL, a «Mis diseños» y a los attributes del carrito). */
export type Design = {
  mode: "text" | "image";
  line1: string;
  line2: string;
  font: EngraveFont;
  /** fuente de la segunda línea (por defecto la misma) */
  font2: EngraveFont;
  /** tamaño relativo de la 2.ª línea respecto a la 1.ª */
  line2Scale: number;
  /** 0.4 … 2.2 */
  size: number;
  /** interletraje en em (−0.05 … 0.5) */
  tracking: number;
  align: "left" | "center" | "right";
  /** curvatura del texto en arco (−1 … 1); 0 = recto */
  curve: number;
  ornament: Ornament;
  /** imagen subida o logo de ejemplo */
  imageId: string | null;
  imageName: string | null;
  threshold: number;
  invert: boolean;
  /** posición relativa en la zona (−0.5 … 0.5) */
  x: number;
  y: number;
  /** escala del conjunto (0.2 … 2.5) */
  scale: number;
  rotation: number;
  face: "front" | "back";
};

export const DEFAULT_DESIGN: Design = {
  mode: "text",
  line1: "A & M",
  line2: "12 · 06 · 2026",
  font: "script",
  font2: "roman",
  line2Scale: 0.34,
  size: 1,
  tracking: 0,
  align: "center",
  curve: 0,
  ornament: "none",
  imageId: null,
  imageName: null,
  threshold: 200,
  invert: false,
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  face: "front",
};

export const FONT_OPTIONS: { id: EngraveFont; label: string; sample: string }[] = [
  { id: "script", label: "Caligrafía boda", sample: "Elena" },
  { id: "pinyon", label: "Inglesa", sample: "Elena" },
  { id: "classic", label: "Serif clásica", sample: "Elena" },
  { id: "roman", label: "Monograma romano", sample: "ELENA" },
  { id: "thin", label: "Sans fina", sample: "ELENA" },
  { id: "gothic", label: "Escudo gótica", sample: "Elena" },
];

export const FONT_CSS: Record<EngraveFont, { family: string; weight: number }> = {
  classic: { family: "var(--font-cormorant)", weight: 500 },
  roman: { family: "var(--font-cinzel)", weight: 600 },
  script: { family: "var(--font-great-vibes)", weight: 400 },
  pinyon: { family: "var(--font-pinyon)", weight: 400 },
  thin: { family: "var(--font-josefin)", weight: 300 },
  gothic: { family: "var(--font-unifraktur)", weight: 400 },
};
