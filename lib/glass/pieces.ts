import {
  CX,
  GROUND,
  innerRegion,
  makeProfile,
  rect,
  roundedRect,
  type Profile,
  type SampledProfile,
} from "./geometry";

export type GlassId =
  | "tubo"
  | "agua"
  | "whisky-tallado"
  | "old-fashioned"
  | "copa-vino"
  | "copa-blanco"
  | "copa-cava"
  | "copa-balon"
  | "jarra-cerveza"
  | "jarra-agua"
  | "jarron-cilindrico"
  | "jarron-boca-ancha"
  | "decantador"
  | "metopa"
  | "placa"
  | "trofeo-llama"
  | "trofeo-obelisco"
  | "pack-brindis"
  | "pack-vasos"
  | "set-whisky"
  | "estuche";

export type Zone = { x: number; y: number; w: number; h: number };

type Base = {
  id: GlassId;
  label: string;
  /** zona grabable (rectángulo en coordenadas del viewBox) */
  zone: Zone;
  /** 0 = plano; 1 = la zona abarca medio cilindro visible */
  curvature: number;
  faces: 1 | 2;
};

export type VesselSpec = Base & {
  kind: "vessel";
  profile: Profile;
  wall: number;
  baseThickness: number;
  facets?: { y0: number; y1: number; count: number };
  handle?: "mug" | "pitcher";
  spout?: boolean;
  stopper?: boolean;
};

export type StemSpec = Base & {
  kind: "stem";
  bowl: Profile;
  stem: { top: number; bottom: number; r: number };
  foot: { y: number; rx: number };
  wall: number;
};

export type PanelSpec = Base & {
  kind: "panel";
  shape: "rect" | "landscape" | "flame" | "obelisk";
  body: string;
  bevel: string;
  base: { x: number; y: number; w: number; h: number };
  thickness: number;
};

export type CompositeSpec = Base & {
  kind: "composite";
  items: { id: GlassId; x: number; y: number; scale: number; rotate?: number }[];
  /** pieza sobre la que se aplica el personalizador */
  engraveOn: GlassId;
};

export type BoxSpec = Base & { kind: "box" };

export type GlassSpec = VesselSpec | StemSpec | PanelSpec | CompositeSpec | BoxSpec;

/* -------------------------------------------------------------------------- */

const G = GROUND;

export const PIECES: Record<GlassId, GlassSpec> = {
  tubo: {
    id: "tubo",
    label: "Vaso de tubo",
    kind: "vessel",
    profile: [
      [70, 60],
      [250, 58.5],
      [G - 4, 56],
      [G, 55],
    ],
    wall: 4,
    baseThickness: 34,
    zone: { x: CX - 50, y: 140, w: 100, h: 200 },
    curvature: 0.75,
    faces: 2,
  },
  agua: {
    id: "agua",
    label: "Vaso de agua",
    kind: "vessel",
    profile: [
      [176, 80],
      [300, 73],
      [G - 5, 63],
      [G, 62],
    ],
    wall: 4,
    baseThickness: 24,
    zone: { x: CX - 62, y: 214, w: 124, h: 160 },
    curvature: 0.75,
    faces: 2,
  },
  "whisky-tallado": {
    id: "whisky-tallado",
    label: "Vaso de whisky tallado",
    kind: "vessel",
    profile: [
      [206, 96],
      [330, 92],
      [G - 5, 88],
      [G, 87],
    ],
    wall: 5,
    baseThickness: 40,
    facets: { y0: 352, y1: G - 6, count: 9 },
    zone: { x: CX - 74, y: 236, w: 148, h: 104 },
    curvature: 0.8,
    faces: 2,
  },
  "old-fashioned": {
    id: "old-fashioned",
    label: "Vaso Old Fashioned",
    kind: "vessel",
    profile: [
      [190, 100],
      [320, 98],
      [G - 6, 95],
      [G, 94],
    ],
    wall: 6,
    baseThickness: 64,
    zone: { x: CX - 78, y: 224, w: 156, h: 136 },
    curvature: 0.8,
    faces: 2,
  },
  "copa-vino": {
    id: "copa-vino",
    label: "Copa de vino tinto",
    kind: "stem",
    bowl: [
      [52, 74],
      [110, 92],
      [168, 97],
      [222, 86],
      [262, 56],
      [286, 20],
      [298, 7],
    ],
    stem: { top: 298, bottom: G - 10, r: 5.2 },
    foot: { y: G - 6, rx: 86 },
    wall: 3,
    zone: { x: CX - 70, y: 96, w: 140, h: 126 },
    curvature: 0.8,
    faces: 2,
  },
  "copa-blanco": {
    id: "copa-blanco",
    label: "Copa de vino blanco",
    kind: "stem",
    bowl: [
      [74, 60],
      [130, 74],
      [184, 75],
      [232, 58],
      [266, 26],
      [284, 6.5],
    ],
    stem: { top: 284, bottom: G - 10, r: 4.6 },
    foot: { y: G - 6, rx: 74 },
    wall: 3,
    zone: { x: CX - 56, y: 112, w: 112, h: 108 },
    curvature: 0.8,
    faces: 2,
  },
  "copa-cava": {
    id: "copa-cava",
    label: "Copa de cava (flauta)",
    kind: "stem",
    bowl: [
      [34, 40],
      [110, 42],
      [190, 39],
      [256, 28],
      [298, 12],
      [316, 5.5],
    ],
    stem: { top: 316, bottom: G - 10, r: 4.4 },
    foot: { y: G - 6, rx: 66 },
    wall: 3,
    zone: { x: CX - 34, y: 76, w: 68, h: 150 },
    curvature: 0.75,
    faces: 2,
  },
  "copa-balon": {
    id: "copa-balon",
    label: "Copa de balón",
    kind: "stem",
    bowl: [
      [58, 100],
      [118, 124],
      [184, 122],
      [240, 94],
      [278, 46],
      [298, 14],
      [306, 7],
    ],
    stem: { top: 306, bottom: G - 10, r: 5.6 },
    foot: { y: G - 6, rx: 92 },
    wall: 3,
    zone: { x: CX - 92, y: 104, w: 184, h: 130 },
    curvature: 0.85,
    faces: 2,
  },
  "jarra-cerveza": {
    id: "jarra-cerveza",
    label: "Jarra de cerveza",
    kind: "vessel",
    profile: [
      [108, 78],
      [280, 81],
      [G - 6, 80],
      [G, 79],
    ],
    wall: 5,
    baseThickness: 36,
    handle: "mug",
    zone: { x: CX - 62, y: 156, w: 124, h: 210 },
    curvature: 0.72,
    faces: 1,
  },
  "jarra-agua": {
    id: "jarra-agua",
    label: "Jarra de agua",
    kind: "vessel",
    profile: [
      [92, 72],
      [140, 74],
      [280, 86],
      [G - 8, 78],
      [G, 76],
    ],
    wall: 4,
    baseThickness: 24,
    handle: "pitcher",
    spout: true,
    zone: { x: CX - 66, y: 170, w: 132, h: 190 },
    curvature: 0.72,
    faces: 1,
  },
  "jarron-cilindrico": {
    id: "jarron-cilindrico",
    label: "Jarrón cilíndrico",
    kind: "vessel",
    profile: [
      [40, 80],
      [300, 80],
      [G - 6, 80],
      [G, 79],
    ],
    wall: 5,
    baseThickness: 32,
    zone: { x: CX - 64, y: 110, w: 128, h: 250 },
    curvature: 0.72,
    faces: 2,
  },
  "jarron-boca-ancha": {
    id: "jarron-boca-ancha",
    label: "Jarrón de boca ancha",
    kind: "vessel",
    profile: [
      [96, 132],
      [150, 112],
      [230, 92],
      [320, 82],
      [400, 82],
      [G - 6, 86],
      [G, 85],
    ],
    wall: 5,
    baseThickness: 30,
    zone: { x: CX - 80, y: 172, w: 160, h: 196 },
    curvature: 0.72,
    faces: 2,
  },
  decantador: {
    id: "decantador",
    label: "Botella decantador",
    kind: "vessel",
    profile: [
      [66, 21],
      [112, 22],
      [150, 30],
      [186, 74],
      [222, 96],
      [260, 100],
      [G - 8, 98],
      [G, 96],
    ],
    wall: 5,
    baseThickness: 34,
    stopper: true,
    zone: { x: CX - 76, y: 262, w: 152, h: 128 },
    curvature: 0.78,
    faces: 1,
  },
  metopa: {
    id: "metopa",
    label: "Metopa de cristal",
    kind: "panel",
    shape: "rect",
    body: roundedRect(98, 58, 204, 312, 3),
    bevel: roundedRect(112, 72, 176, 284, 2),
    base: { x: 84, y: 370, w: 232, h: 82 },
    thickness: 12,
    zone: { x: 120, y: 92, w: 160, h: 248 },
    curvature: 0,
    faces: 1,
  },
  placa: {
    id: "placa",
    label: "Placa conmemorativa",
    kind: "panel",
    shape: "landscape",
    body: roundedRect(44, 128, 312, 224, 3),
    bevel: roundedRect(58, 142, 284, 196, 2),
    base: { x: 74, y: 352, w: 252, h: 100 },
    thickness: 12,
    zone: { x: 70, y: 152, w: 260, h: 176 },
    curvature: 0,
    faces: 1,
  },
  "trofeo-llama": {
    id: "trofeo-llama",
    label: "Trofeo llama",
    kind: "panel",
    shape: "flame",
    body:
      "M134 396C126 330 138 270 162 214C184 162 210 120 222 52C246 104 270 158 272 222C274 290 266 340 266 396Z",
    bevel:
      "M148 384C142 326 152 274 174 222C192 178 212 144 222 96C238 138 256 182 258 230C260 290 254 336 254 384Z",
    base: { x: 108, y: 396, w: 184, h: 56 },
    thickness: 12,
    zone: { x: 150, y: 210, w: 104, h: 160 },
    curvature: 0,
    faces: 1,
  },
  "trofeo-obelisco": {
    id: "trofeo-obelisco",
    label: "Trofeo obelisco",
    kind: "panel",
    shape: "obelisk",
    body: "M128 392L148 96L252 64L272 392Z",
    bevel: "M142 380L160 108L240 84L258 380Z",
    base: { x: 104, y: 392, w: 192, h: 60 },
    thickness: 12,
    zone: { x: 150, y: 126, w: 100, h: 236 },
    curvature: 0,
    faces: 1,
  },
  "pack-brindis": {
    id: "pack-brindis",
    label: "Pack copas de brindis",
    kind: "composite",
    items: [
      { id: "copa-cava", x: -62, y: 18, scale: 0.92, rotate: 9 },
      { id: "copa-cava", x: 62, y: 18, scale: 0.92, rotate: -9 },
    ],
    engraveOn: "copa-cava",
    zone: { x: 0, y: 0, w: 0, h: 0 },
    curvature: 0,
    faces: 2,
  },
  "pack-vasos": {
    id: "pack-vasos",
    label: "Pack de vasos",
    kind: "composite",
    items: [
      { id: "tubo", x: -96, y: 40, scale: 0.78 },
      { id: "tubo", x: 96, y: 40, scale: 0.78 },
      { id: "tubo", x: 0, y: 14, scale: 0.84 },
    ],
    engraveOn: "tubo",
    zone: { x: 0, y: 0, w: 0, h: 0 },
    curvature: 0,
    faces: 2,
  },
  "set-whisky": {
    id: "set-whisky",
    label: "Set decantador y vasos",
    kind: "composite",
    items: [
      { id: "decantador", x: -14, y: -6, scale: 0.86 },
      { id: "whisky-tallado", x: -108, y: 64, scale: 0.6 },
      { id: "whisky-tallado", x: 104, y: 64, scale: 0.6 },
    ],
    engraveOn: "decantador",
    zone: { x: 0, y: 0, w: 0, h: 0 },
    curvature: 0,
    faces: 1,
  },
  estuche: {
    id: "estuche",
    label: "Estuche regalo",
    kind: "box",
    zone: { x: 0, y: 0, w: 0, h: 0 },
    curvature: 0,
    faces: 1,
  },
};

export const GLASS_IDS = Object.keys(PIECES) as GlassId[];

/* -------------------------------------------------------------------------- */
/* Modelo calculado (cacheado) — compartido por el SVG y el motor de grabado. */

export type StemGeom = { bowl: SampledProfile };
export type VesselGeom = { profile: SampledProfile };

const geomCache = new Map<GlassId, SampledProfile>();

export function profileOf(id: GlassId): SampledProfile | null {
  const spec = PIECES[id];
  if (spec.kind !== "vessel" && spec.kind !== "stem") return null;
  let p = geomCache.get(id);
  if (!p) {
    p = makeProfile(spec.kind === "vessel" ? spec.profile : spec.bowl);
    geomCache.set(id, p);
  }
  return p;
}

/** Pieza sobre la que se graba (resuelve composiciones/packs). */
export function engraveTarget(id: GlassId): GlassId {
  const spec = PIECES[id];
  return spec.kind === "composite" ? spec.engraveOn : id;
}

export function isEngravable(id: GlassId) {
  return PIECES[engraveTarget(id)].kind !== "box";
}

/** Trazado (en coordenadas del viewBox) donde el grabado es visible. */
export function engraveClip(id: GlassId): string {
  const spec = PIECES[id];
  const z = spec.zone;
  if (spec.kind === "vessel" || spec.kind === "stem") {
    const p = profileOf(id)!;
    const inset = spec.wall + 4;
    return innerRegion(p, inset, Math.max(z.y, p.top + 6), z.y + z.h);
  }
  if (spec.kind === "panel") return spec.bevel;
  return rect(z.x, z.y, z.w, z.h);
}
