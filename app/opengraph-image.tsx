import { site } from "@/data/site";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og/render";

export const alt = `${site.name} — grabados en cristal con chorro de arena en Madrid`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "Tienda online · Madrid",
    title: "Graba tus recuerdos en piezas únicas",
    subtitle: "Vasos, copas, jarras, metopas y trofeos personalizados con tu texto o tu logo.",
    glass: "copa-balon",
    engraving: { kind: "text", lines: [{ text: "A & M", font: "script", size: 0.4 }] },
  });
}
