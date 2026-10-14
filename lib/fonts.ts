import {
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Josefin_Sans,
  Manrope,
  Pinyon_Script,
  UnifrakturMaguntia,
} from "next/font/google";

/** Display editorial: serif clásica con cursiva elegante (eco de la «G» del logo). */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-cormorant",
});

/** Texto / UI: sans moderna muy legible. */
export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

/* Fuentes de grabado (personalizador). `preload: false`: solo se descargan
   cuando realmente se pintan, para no penalizar el resto de páginas. */

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
  variable: "--font-cinzel",
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-great-vibes",
});

export const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-pinyon",
});

export const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  preload: false,
  variable: "--font-josefin",
});

export const unifraktur = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-unifraktur",
});

export const fontVariables = [
  cormorant.variable,
  manrope.variable,
  cinzel.variable,
  greatVibes.variable,
  pinyon.variable,
  josefin.variable,
  unifraktur.variable,
].join(" ");
