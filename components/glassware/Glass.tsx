import { useId, type ReactNode } from "react";
import {
  arc,
  band,
  CX,
  fmt,
  GROUND,
  offsetSide,
  PERSP,
  polyline,
  vesselOutline,
  type Pt,
  type SampledProfile,
} from "@/lib/glass/geometry";
import {
  engraveClip,
  PIECES,
  profileOf,
  type GlassId,
  type PanelSpec,
  type StemSpec,
  type VesselSpec,
} from "@/lib/glass/pieces";
import { cn, svgId } from "@/lib/utils";
import { DemoLogoArt, type DemoLogoId } from "@/components/brand/demo-logos";

export type GlassTone = "dark" | "light";
export type GlassLayer = "all" | "back" | "front";

export type EngraveFont = "classic" | "roman" | "script" | "pinyon" | "thin" | "gothic";

export const ENGRAVE_FONT_FAMILY: Record<EngraveFont, string> = {
  classic: "var(--font-cormorant), serif",
  roman: "var(--font-cinzel), serif",
  script: "var(--font-great-vibes), cursive",
  pinyon: "var(--font-pinyon), cursive",
  thin: "var(--font-josefin), sans-serif",
  gothic: "var(--font-unifraktur), serif",
};

/** Ancho medio aproximado de un carácter (en em) por fuente, para ajustar el texto a la zona. */
const FONT_WIDTH: Record<EngraveFont, number> = {
  classic: 0.46,
  roman: 0.74,
  script: 0.44,
  pinyon: 0.5,
  thin: 0.52,
  gothic: 0.56,
};

/** Grabado de ejemplo estático (SVG) para catálogo, ocasiones y fallback del hero. */
export type StaticEngraving =
  | {
      kind: "text";
      lines: { text: string; font: EngraveFont; size: number; weight?: number; tracking?: number }[];
      /** desplazamiento vertical relativo (−0.5…0.5) dentro de la zona */
      offsetY?: number;
    }
  | { kind: "logo"; logo: DemoLogoId; scale?: number };

type Props = {
  id: GlassId;
  tone?: GlassTone;
  layer?: GlassLayer;
  engraving?: StaticEngraving | null;
  className?: string;
  title?: string;
  /** muestra la zona grabable (guía) */
  showZone?: boolean;
  /** clases para el grupo del grabado (p. ej. aparecer al hover) */
  engravingClassName?: string;
  children?: ReactNode;
};

/* ------------------------------------------------------------------------ */
/* Paleta por tono                                                          */

const PAL = {
  dark: {
    stroke: "#ffffff",
    edge: 0.58,
    edgeSoft: 0.2,
    inner: 0.14,
    rimFront: 0.85,
    rimBack: 0.34,
    hl: 0.62,
    hlSoft: 0.16,
    body: ["0.13", "0.045", "0.012", "0.045", "0.15"],
    bodyColor: "#ffffff",
    base: ["0.05", "0.2"],
    shadow: "#ffffff",
    shadowOp: 0.07,
    engraveFill: "#ffffff",
    engraveOp: 0.82,
    blend: "screen" as const,
  },
  light: {
    stroke: "#1a1a1a",
    edge: 0.5,
    edgeSoft: 0.16,
    inner: 0.16,
    rimFront: 0.6,
    rimBack: 0.3,
    hl: 0.95,
    hlSoft: 0.45,
    body: ["0.16", "0.06", "0.02", "0.06", "0.18"],
    bodyColor: "#3a3a36",
    base: ["0.06", "0.16"],
    shadow: "#000000",
    shadowOp: 0.22,
    engraveFill: "#a9a9a2",
    engraveOp: 0.8,
    blend: "multiply" as const,
  },
};

type Pal = Omit<(typeof PAL)["dark"], "blend"> & { blend: "screen" | "multiply" | "normal" };

/* ------------------------------------------------------------------------ */

export function Glass(props: Props) {
  const uid = svgId(useId());
  return <GlassMarkup uid={uid} {...props} />;
}

/** Igual que <Glass> pero con un id fijo (sin hooks): para generar el SVG fuera de React (imágenes OG). */
export function GlassMarkup({
  uid,
  id,
  tone = "dark",
  layer = "all",
  engraving,
  className,
  title,
  showZone,
  engravingClassName,
  children,
}: Props & { uid: string }) {
  const pal = PAL[tone];
  return (
    <svg
      viewBox="0 0 400 500"
      className={cn("h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Defs uid={uid} pal={pal} tone={tone} />
      <Piece
        id={id}
        uid={uid}
        kid={uid}
        pal={pal}
        tone={tone}
        layer={layer}
        engraving={engraving}
        showZone={showZone}
        engravingClassName={engravingClassName}
      />
      {children}
    </svg>
  );
}

/** Pieza dentro de un <svg> existente (para composiciones). */
function Piece({
  id,
  uid,
  kid,
  pal,
  tone,
  layer,
  engraving,
  showZone,
  engravingClassName,
}: {
  id: GlassId;
  /** prefijo de los <defs> compartidos */
  uid: string;
  /** clave única de esta instancia (clipPaths) */
  kid: string;
  pal: Pal;
  tone: GlassTone;
  layer: GlassLayer;
  engraving?: StaticEngraving | null;
  showZone?: boolean;
  engravingClassName?: string;
}) {
  const spec = PIECES[id];
  const back = layer === "all" || layer === "back";
  const front = layer === "all" || layer === "front";

  if (spec.kind === "composite") {
    return (
      <g>
        {spec.items.map((it, i) => (
          <g
            key={i}
            transform={`translate(${it.x} ${it.y}) translate(${CX} ${GROUND}) scale(${it.scale}) rotate(${
              it.rotate ?? 0
            }) translate(${-CX} ${-GROUND})`}
          >
            <Piece
              id={it.id}
              uid={uid}
              kid={`${kid}c${i}`}
              pal={pal}
              tone={tone}
              layer={layer}
              engraving={engraving}
              engravingClassName={engravingClassName}
            />
          </g>
        ))}
      </g>
    );
  }

  if (spec.kind === "box") return <GiftBox uid={uid} tone={tone} />;

  return (
    <g>
      {back && spec.kind === "vessel" && <VesselBack spec={spec} uid={uid} pal={pal} />}
      {back && spec.kind === "stem" && <StemBack spec={spec} uid={uid} pal={pal} />}
      {back && spec.kind === "panel" && <PanelBack spec={spec} uid={uid} pal={pal} tone={tone} />}
      {layer === "all" && engraving ? (
        <g className={engravingClassName}>
          <EngravingArt id={id} uid={uid} kid={kid} pal={pal} art={engraving} />
        </g>
      ) : null}
      {showZone ? <ZoneGuide id={id} /> : null}
      {front && spec.kind === "vessel" && <VesselFront spec={spec} uid={uid} pal={pal} tone={tone} />}
      {front && spec.kind === "stem" && <StemFront spec={spec} uid={uid} pal={pal} tone={tone} />}
      {front && spec.kind === "panel" && <PanelFront spec={spec} uid={uid} kid={kid} pal={pal} />}
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Defs                                                                     */

function Defs({ uid, pal, tone }: { uid: string; pal: Pal; tone: GlassTone }) {
  const c = pal.bodyColor;
  return (
    <defs>
      <linearGradient id={`${uid}-body`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={c} stopOpacity={pal.body[0]} />
        <stop offset="0.14" stopColor={c} stopOpacity={pal.body[1]} />
        <stop offset="0.5" stopColor={c} stopOpacity={pal.body[2]} />
        <stop offset="0.86" stopColor={c} stopOpacity={pal.body[3]} />
        <stop offset="1" stopColor={c} stopOpacity={pal.body[4]} />
      </linearGradient>
      <linearGradient id={`${uid}-base`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={c} stopOpacity={pal.base[0]} />
        <stop offset="1" stopColor={c} stopOpacity={pal.base[1]} />
      </linearGradient>
      <linearGradient id={`${uid}-hl`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.18" stopColor="#fff" stopOpacity={pal.hl} />
        <stop offset="0.7" stopColor="#fff" stopOpacity={pal.hl * 0.75} />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-hls`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.3" stopColor="#fff" stopOpacity={pal.hlSoft} />
        <stop offset="0.8" stopColor="#fff" stopOpacity={pal.hlSoft * 0.6} />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-stem`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={c} stopOpacity={tone === "dark" ? 0.38 : 0.3} />
        <stop offset="0.35" stopColor={c} stopOpacity={tone === "dark" ? 0.1 : 0.06} />
        <stop offset="0.6" stopColor="#fff" stopOpacity={tone === "dark" ? 0.5 : 0.8} />
        <stop offset="0.8" stopColor={c} stopOpacity={tone === "dark" ? 0.12 : 0.08} />
        <stop offset="1" stopColor={c} stopOpacity={tone === "dark" ? 0.34 : 0.3} />
      </linearGradient>
      <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={pal.shadow} stopOpacity={pal.shadowOp} />
        <stop offset="0.55" stopColor={pal.shadow} stopOpacity={pal.shadowOp * 0.55} />
        <stop offset="1" stopColor={pal.shadow} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${uid}-caustic`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff" stopOpacity={tone === "dark" ? 0.12 : 0.55} />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${uid}-sheen`} x1="0" x2="1" y1="0" y2="1">
        <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.42" stopColor="#fff" stopOpacity={tone === "dark" ? 0.13 : 0.4} />
        <stop offset="0.5" stopColor="#fff" stopOpacity={tone === "dark" ? 0.03 : 0.1} />
        <stop offset="0.58" stopColor="#fff" stopOpacity={tone === "dark" ? 0.09 : 0.3} />
        <stop offset="0.72" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${uid}-plinth`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={tone === "dark" ? "#2a2a2a" : "#2b2b2b"} />
        <stop offset="0.12" stopColor={tone === "dark" ? "#141414" : "#151515"} />
        <stop offset="1" stopColor="#050505" />
      </linearGradient>
      <linearGradient id={`${uid}-plinthSide`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
        <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
      </linearGradient>
      <filter id={`${uid}-frost`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.85 1.18"
          result="grain"
        />
        <feComposite in="SourceGraphic" in2="grain" operator="in" result="grained" />
        <feGaussianBlur in="grained" stdDeviation="0.3" />
      </filter>
    </defs>
  );
}

/* ------------------------------------------------------------------------ */
/* Recipientes (vasos, jarras, jarrones, botella)                           */

function GroundShadow({ uid, rx, y = GROUND }: { uid: string; rx: number; y?: number }) {
  return (
    <g>
      <ellipse cx={CX} cy={y + 2} rx={rx * 1.35} ry={rx * 0.2} fill={`url(#${uid}-shadow)`} />
      <ellipse cx={CX + rx * 0.15} cy={y + 2} rx={rx * 0.55} ry={rx * 0.07} fill={`url(#${uid}-caustic)`} />
    </g>
  );
}

function sides(p: SampledProfile, y0: number, y1: number) {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (const [y, r] of p.pts) {
    if (y < y0 - 0.01 || y > y1 + 0.01) continue;
    left.push([CX - r, y]);
    right.push([CX + r, y]);
  }
  return { left: polyline(left), right: polyline(right) };
}

function VesselBack({ spec, uid, pal }: { spec: VesselSpec; uid: string; pal: Pal }) {
  const p = profileOf(spec.id)!;
  const top = p.top;
  const bot = p.bottom;
  const rTop = p.rOf(top);
  const rBot = p.rOf(bot);
  const floorY = bot - spec.baseThickness;
  const rFloor = p.rOf(floorY) - spec.wall;
  const S = pal.stroke;

  // bloque de base gruesa (frente entre suelo interior y base exterior)
  const bL = sides(p, floorY, bot);
  const basePath = `${polyline(
    p.pts.filter(([y]) => y >= floorY && y <= bot).map(([y, r]) => [CX - r, y] as Pt),
  )}A${fmt(rBot)} ${fmt(rBot * PERSP)} 0 0 0 ${fmt(CX + rBot)} ${fmt(bot)}${polyline(
    p.pts
      .filter(([y]) => y >= floorY && y <= bot)
      .map(([y, r]) => [CX + r, y] as Pt)
      .reverse(),
    false,
  )}A${fmt(p.rOf(floorY))} ${fmt(p.rOf(floorY) * PERSP)} 0 0 1 ${fmt(CX - p.rOf(floorY))} ${fmt(floorY)}Z`;
  void bL;

  return (
    <g>
      <GroundShadow uid={uid} rx={rBot} />
      {spec.handle ? <Handle spec={spec} p={p} pal={pal} uid={uid} part="back" /> : null}
      <path d={vesselOutline(p)} fill={`url(#${uid}-body)`} />
      {/* pared interior */}
      <path
        d={offsetSide(p, -1, spec.wall, top + rTop * PERSP, floorY)}
        fill="none"
        stroke={S}
        strokeOpacity={pal.inner}
        strokeWidth="1"
      />
      <path
        d={offsetSide(p, 1, spec.wall, top + rTop * PERSP, floorY)}
        fill="none"
        stroke={S}
        strokeOpacity={pal.inner}
        strokeWidth="1"
      />
      {/* fondo interior */}
      <ellipse
        cx={CX}
        cy={floorY}
        rx={rFloor}
        ry={rFloor * PERSP}
        fill={pal.bodyColor}
        fillOpacity={0.05}
        stroke={S}
        strokeOpacity={pal.inner * 1.2}
        strokeWidth="1"
      />
      <path d={basePath} fill={`url(#${uid}-base)`} />
      {/* boca (mitad trasera) */}
      <path
        d={arc(CX, top, rTop, rTop * PERSP, "back")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimBack}
        strokeWidth="1.2"
      />
      <path
        d={arc(CX, top + 1.5, rTop - spec.wall * 0.8, (rTop - spec.wall * 0.8) * PERSP, "back")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimBack * 0.5}
        strokeWidth="0.8"
      />
      {spec.facets ? <Facets spec={spec} p={p} pal={pal} /> : null}
      {spec.stopper ? <Stopper p={p} pal={pal} uid={uid} /> : null}
    </g>
  );
}

function VesselFront({ spec, uid, pal, tone }: { spec: VesselSpec; uid: string; pal: Pal; tone: GlassTone }) {
  const p = profileOf(spec.id)!;
  const top = p.top;
  const bot = p.bottom;
  const rTop = p.rOf(top);
  const rBot = p.rOf(bot);
  const S = pal.stroke;
  const { left, right } = sides(p, top, bot);
  const h = bot - top;
  const hlTop = top + Math.min(26, h * 0.08);
  const hlBot = bot - spec.baseThickness * 0.55;
  return (
    <g>
      {/* contorno */}
      <path
        d={left}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d={right}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {tone === "light" ? (
        <>
          <path
            d={offsetSide(p, -1, 2, top + 4, bot - 3)}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.9"
            strokeWidth="1"
          />
          <path
            d={offsetSide(p, 1, 2, top + 4, bot - 3)}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="1"
          />
        </>
      ) : null}
      {/* base */}
      <path
        d={arc(CX, bot, rBot, rBot * PERSP, "front")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge}
        strokeWidth="1.4"
      />
      <path
        d={arc(CX, bot - 4, rBot * 0.92, rBot * 0.92 * PERSP, "front")}
        fill="none"
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.22 : 0.7}
        strokeWidth="1"
      />
      {/* reflejos que siguen la curvatura */}
      <path d={band(p, -0.9, -0.66, hlTop, hlBot)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, -0.84, -0.74, hlTop + 6, hlBot - 10)} fill={`url(#${uid}-hl)`} />
      <path d={band(p, -0.56, -0.5, hlTop + h * 0.08, top + h * 0.5)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, 0.76, 0.88, hlTop + 10, hlBot - 4)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, 0.84, 0.88, hlTop + 18, top + h * 0.62)} fill={`url(#${uid}-hl)`} opacity="0.75" />
      {/* boca (mitad delantera) */}
      <path
        d={arc(CX, top, rTop, rTop * PERSP, "front")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimFront}
        strokeWidth="1.6"
      />
      <path
        d={arc(CX, top + 2.2, rTop - 1.5, (rTop - 1.5) * PERSP, "front")}
        fill="none"
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.3 : 0.85}
        strokeWidth="0.9"
      />
      {/* destello en el borde */}
      <ellipse
        cx={CX - rTop * 0.55}
        cy={top + rTop * PERSP * 0.83}
        rx={rTop * 0.14}
        ry="1.4"
        fill="#fff"
        opacity={tone === "dark" ? 0.75 : 0.95}
      />
      {spec.handle ? <Handle spec={spec} p={p} pal={pal} uid={uid} part="front" /> : null}
      {spec.spout ? <Spout p={p} pal={pal} uid={uid} /> : null}
    </g>
  );
}

function Facets({ spec, p, pal }: { spec: VesselSpec; p: SampledProfile; pal: Pal }) {
  const { y0, y1, count } = spec.facets!;
  const els: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const t0 = -1 + (2 * i) / count;
    const t1 = -1 + (2 * (i + 1)) / count;
    const a0 = Math.asin(Math.max(-1, Math.min(1, t0 * 0.98)));
    const a1 = Math.asin(Math.max(-1, Math.min(1, t1 * 0.98)));
    const r0 = p.rOf(y0) - 1;
    const r1 = p.rOf(y1) - 1;
    const x00 = CX + Math.sin(a0) * r0;
    const x01 = CX + Math.sin(a1) * r0;
    const x10 = CX + Math.sin(a0) * r1;
    const x11 = CX + Math.sin(a1) * r1;
    const shade = Math.cos((a0 + a1) / 2);
    // facetas: cada cara un poco más clara u oscura según su orientación
    const op = (i % 2 === 0 ? 0.05 : 0.015) * (0.3 + shade);
    els.push(
      <path
        key={i}
        d={`M${fmt(x00)} ${fmt(y0 + 6)}L${fmt(x01)} ${fmt(y0 + 6)}L${fmt(x11)} ${fmt(y1)}L${fmt(x10)} ${fmt(y1)}Z`}
        fill={pal.bodyColor}
        fillOpacity={op}
      />,
    );
    els.push(
      <path
        key={`l${i}`}
        d={`M${fmt(x01)} ${fmt(y0 + 6)}L${fmt(x11)} ${fmt(y1)}`}
        stroke={pal.stroke}
        strokeOpacity={pal.edgeSoft * (0.2 + shade * 0.9)}
        strokeWidth="0.9"
      />,
    );
  }
  // arco superior del tallado
  const rr = p.rOf(y0) - 1;
  els.push(
    <path
      key="arc"
      d={arc(CX, y0 + 6, rr, rr * PERSP, "front")}
      fill="none"
      stroke={pal.stroke}
      strokeOpacity={pal.edgeSoft * 1.4}
      strokeWidth="1"
    />,
  );
  return <g>{els}</g>;
}

function Handle({
  spec,
  p,
  pal,
  uid,
  part,
}: {
  spec: VesselSpec;
  p: SampledProfile;
  pal: Pal;
  uid: string;
  part: "back" | "front";
}) {
  const mug = spec.handle === "mug";
  const yA = mug ? p.top + 44 : p.top + 22;
  const yB = mug ? p.bottom - 64 : p.top + 210;
  const xA = CX + p.rOf(yA) - 3;
  const xB = CX + p.rOf(yB) - 3;
  const out = mug ? 66 : 58;
  const d = `M${fmt(xA)} ${fmt(yA)}C${fmt(xA + out * 1.05)} ${fmt(yA - 6)} ${fmt(xB + out * 1.1)} ${fmt(yB - 10)} ${fmt(xB)} ${fmt(yB)}`;
  if (part === "back") {
    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke={pal.bodyColor}
          strokeOpacity={0.09}
          strokeWidth="22"
          strokeLinecap="round"
        />
      </g>
    );
  }
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={pal.stroke}
        strokeOpacity={pal.edge * 0.8}
        strokeWidth="1.3"
        transform="translate(0 -9)"
      />
      <path
        d={d}
        fill="none"
        stroke={pal.stroke}
        strokeOpacity={pal.edge * 0.8}
        strokeWidth="1.3"
        transform="translate(9 8)"
      />
      <path
        d={d}
        fill="none"
        stroke={`url(#${uid}-hl)`}
        strokeOpacity="0.9"
        strokeWidth="2"
        transform="translate(2 -4)"
      />
    </g>
  );
}

function Spout({ p, pal }: { p: SampledProfile; pal: Pal; uid: string }) {
  const top = p.top;
  const r = p.rOf(top);
  const x = CX - r;
  const d = `M${fmt(x + 18)} ${fmt(top - 1)}C${fmt(x + 4)} ${fmt(top - 4)} ${fmt(x - 14)} ${fmt(top - 14)} ${fmt(
    x - 24,
  )} ${fmt(top - 16)}C${fmt(x - 16)} ${fmt(top - 4)} ${fmt(x - 6)} ${fmt(top + 8)} ${fmt(x + 2)} ${fmt(top + 22)}`;
  return (
    <path
      d={d}
      fill={pal.bodyColor}
      fillOpacity={0.06}
      stroke={pal.stroke}
      strokeOpacity={pal.edge}
      strokeWidth="1.3"
    />
  );
}

function Stopper({ p, pal, uid }: { p: SampledProfile; pal: Pal; uid: string }) {
  const top = p.top;
  return (
    <g>
      <path
        d={`M${CX - 13} ${top + 6}L${CX - 13} ${top - 12}L${CX + 13} ${top - 12}L${CX + 13} ${top + 6}Z`}
        fill={`url(#${uid}-stem)`}
        stroke={pal.stroke}
        strokeOpacity={pal.edge * 0.7}
        strokeWidth="1"
      />
      <circle
        cx={CX}
        cy={top - 34}
        r="25"
        fill={`url(#${uid}-body)`}
        stroke={pal.stroke}
        strokeOpacity={pal.edge}
        strokeWidth="1.4"
      />
      <path
        d={`M${CX - 16} ${top - 46}A18 18 0 0 1 ${CX - 2} ${top - 55}`}
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse
        cx={CX}
        cy={top - 12}
        rx="20"
        ry="3.5"
        fill="none"
        stroke={pal.stroke}
        strokeOpacity={pal.edge * 0.8}
        strokeWidth="1.2"
      />
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Copas                                                                    */

function stemPath(spec: StemSpec) {
  const { top, bottom, r } = spec.stem;
  const mid = (top + bottom) / 2;
  return `M${CX - r * 1.4} ${top}C${CX - r * 0.9} ${top + 20} ${CX - r * 0.9} ${mid} ${CX - r} ${mid}C${CX - r} ${
    bottom - 30
  } ${CX - r * 1.2} ${bottom - 8} ${CX - r * 4.4} ${bottom}L${CX + r * 4.4} ${bottom}C${CX + r * 1.2} ${bottom - 8} ${CX + r} ${
    bottom - 30
  } ${CX + r} ${mid}C${CX + r * 0.9} ${mid} ${CX + r * 0.9} ${top + 20} ${CX + r * 1.4} ${top}Z`;
}

function StemBack({ spec, uid, pal }: { spec: StemSpec; uid: string; pal: Pal }) {
  const p = profileOf(spec.id)!;
  const top = p.top;
  const rTop = p.rOf(top);
  const { y, rx } = spec.foot;
  const S = pal.stroke;
  const bowlBottom = p.bottom;
  return (
    <g>
      <GroundShadow uid={uid} rx={rx * 0.8} y={y + 4} />
      {/* pie */}
      <ellipse cx={CX} cy={y} rx={rx} ry={rx * 0.17} fill={`url(#${uid}-body)`} />
      <path
        d={arc(CX, y, rx, rx * 0.17, "back")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimBack}
        strokeWidth="1.1"
      />
      {/* tallo */}
      <path d={stemPath(spec)} fill={`url(#${uid}-stem)`} />
      {/* cáliz */}
      <path d={vesselOutline(p)} fill={`url(#${uid}-body)`} />
      <path
        d={offsetSide(p, -1, spec.wall, top + rTop * PERSP, bowlBottom - 22)}
        fill="none"
        stroke={S}
        strokeOpacity={pal.inner}
        strokeWidth="1"
      />
      <path
        d={offsetSide(p, 1, spec.wall, top + rTop * PERSP, bowlBottom - 22)}
        fill="none"
        stroke={S}
        strokeOpacity={pal.inner}
        strokeWidth="1"
      />
      <path
        d={arc(CX, top, rTop, rTop * PERSP, "back")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimBack}
        strokeWidth="1.2"
      />
    </g>
  );
}

function StemFront({ spec, uid, pal, tone }: { spec: StemSpec; uid: string; pal: Pal; tone: GlassTone }) {
  const p = profileOf(spec.id)!;
  const top = p.top;
  const bot = p.bottom;
  const rTop = p.rOf(top);
  const { y, rx } = spec.foot;
  const S = pal.stroke;
  const { left, right } = sides(p, top, bot);
  const h = bot - top;
  const { top: st, bottom: sb, r } = spec.stem;
  return (
    <g>
      <path
        d={left}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d={right}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {tone === "light" ? (
        <path
          d={offsetSide(p, -1, 2, top + 4, bot - 20)}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.9"
          strokeWidth="1"
        />
      ) : null}
      {/* tallo: bordes y brillo */}
      <path d={stemPath(spec)} fill="none" stroke={S} strokeOpacity={pal.edge * 0.7} strokeWidth="1" />
      <path
        d={`M${CX + r * 0.25} ${st + 14}L${CX + r * 0.25} ${sb - 22}`}
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.6 : 0.9}
        strokeWidth="1.1"
      />
      {/* pie */}
      <path
        d={arc(CX, y, rx, rx * 0.17, "front")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimFront * 0.9}
        strokeWidth="1.5"
      />
      <path
        d={arc(CX, y + 3, rx - 1, (rx - 1) * 0.17, "front")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.edge * 0.6}
        strokeWidth="1"
      />
      <path
        d={arc(CX, y - 1.5, rx * 0.86, rx * 0.86 * 0.17, "front")}
        fill="none"
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.25 : 0.8}
        strokeWidth="1"
      />
      {/* reflejos del cáliz */}
      <path d={band(p, -0.9, -0.64, top + h * 0.06, top + h * 0.82)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, -0.84, -0.74, top + h * 0.1, top + h * 0.7)} fill={`url(#${uid}-hl)`} />
      <path d={band(p, -0.54, -0.48, top + h * 0.16, top + h * 0.48)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, 0.74, 0.88, top + h * 0.1, top + h * 0.74)} fill={`url(#${uid}-hls)`} />
      <path d={band(p, 0.83, 0.88, top + h * 0.14, top + h * 0.5)} fill={`url(#${uid}-hl)`} opacity="0.8" />
      {/* boca */}
      <path
        d={arc(CX, top, rTop, rTop * PERSP, "front")}
        fill="none"
        stroke={S}
        strokeOpacity={pal.rimFront}
        strokeWidth="1.5"
      />
      <path
        d={arc(CX, top + 2, rTop - 1.5, (rTop - 1.5) * PERSP, "front")}
        fill="none"
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.3 : 0.85}
        strokeWidth="0.9"
      />
      <ellipse
        cx={CX - rTop * 0.55}
        cy={top + rTop * PERSP * 0.83}
        rx={rTop * 0.14}
        ry="1.3"
        fill="#fff"
        opacity={tone === "dark" ? 0.75 : 0.95}
      />
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Metopas, placas y trofeos                                                */

function Plinth({ uid, b, tone }: { uid: string; b: PanelSpec["base"]; tone: GlassTone }) {
  return (
    <g>
      <ellipse cx={CX} cy={b.y + b.h + 2} rx={b.w * 0.62} ry="10" fill={`url(#${uid}-shadow)`} />
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={`url(#${uid}-plinth)`} />
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill={`url(#${uid}-plinthSide)`} />
      <path
        d={`M${b.x + 2} ${b.y + 0.6}H${b.x + b.w - 2}`}
        stroke="#fff"
        strokeOpacity={tone === "dark" ? 0.38 : 0.3}
        strokeWidth="1"
      />
      {/* placa metálica de la peana */}
      <rect
        x={CX - b.w * 0.28}
        y={b.y + b.h * 0.36}
        width={b.w * 0.56}
        height={Math.min(16, b.h * 0.26)}
        rx="1.5"
        fill="#CFC8BB"
        fillOpacity="0.16"
        stroke="#CFC8BB"
        strokeOpacity="0.35"
        strokeWidth="0.8"
      />
    </g>
  );
}

function PanelBack({ spec, uid, pal, tone }: { spec: PanelSpec; uid: string; pal: Pal; tone: GlassTone }) {
  const t = spec.thickness;
  return (
    <g>
      <Plinth uid={uid} b={spec.base} tone={tone} />
      {/* grosor: copia desplazada detrás */}
      <path
        d={spec.body}
        transform={`translate(${t * 0.55} ${-t * 0.45})`}
        fill={pal.bodyColor}
        fillOpacity={tone === "dark" ? 0.05 : 0.08}
        stroke={pal.stroke}
        strokeOpacity={pal.edgeSoft}
        strokeWidth="1"
      />
      <path d={spec.body} fill={`url(#${uid}-body)`} />
      <path d={spec.body} fill={pal.bodyColor} fillOpacity={tone === "dark" ? 0.035 : 0.05} />
    </g>
  );
}

function PanelFront({ spec, uid, kid, pal }: { spec: PanelSpec; uid: string; kid: string; pal: Pal }) {
  const clip = `${kid}-pclip`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={spec.body} />
      </clipPath>
      {/* biselado: banda entre el contorno y el bisel */}
      <path
        d={`${spec.body} ${spec.bevel}`}
        fillRule="evenodd"
        fill="#fff"
        fillOpacity={pal === PAL.dark ? 0.07 : 0.35}
      />
      <path
        d={spec.bevel}
        fill="none"
        stroke={pal.stroke}
        strokeOpacity={pal.edgeSoft * 1.3}
        strokeWidth="0.9"
      />
      {/* brillo diagonal */}
      <rect x="0" y="0" width="400" height="460" fill={`url(#${uid}-sheen)`} clipPath={`url(#${clip})`} />
      <path
        d={spec.body}
        fill="none"
        stroke={pal.stroke}
        strokeOpacity={pal.edge}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d={spec.body}
        fill="none"
        stroke="#fff"
        strokeOpacity={pal === PAL.dark ? 0.2 : 0.8}
        strokeWidth="0.8"
        transform="translate(1.2 1.2)"
        clipPath={`url(#${clip})`}
      />
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Estuche regalo                                                            */

function GiftBox({ uid, tone }: { uid: string; tone: GlassTone }) {
  return (
    <g>
      <ellipse cx={CX} cy={GROUND + 2} rx="170" ry="16" fill={`url(#${uid}-shadow)`} />
      {/* caja */}
      <path d="M70 220L330 220L330 448L70 448Z" fill={`url(#${uid}-plinth)`} />
      <path d="M70 220L330 220L330 448L70 448Z" fill={`url(#${uid}-plinthSide)`} />
      {/* tapa */}
      <path d="M58 180L342 180L342 236L58 236Z" fill={`url(#${uid}-plinth)`} />
      <path d="M58 180.6H342" stroke="#fff" strokeOpacity={tone === "dark" ? 0.4 : 0.35} strokeWidth="1" />
      <path d="M58 236H342" stroke="#000" strokeOpacity="0.6" strokeWidth="1.5" />
      {/* cinta champán */}
      <rect x="186" y="180" width="28" height="268" fill="#CFC8BB" fillOpacity="0.85" />
      <rect x="186" y="180" width="8" height="268" fill="#fff" fillOpacity="0.25" />
      {/* lazo */}
      <path d="M200 182C170 140 112 136 118 166C124 192 176 186 200 182Z" fill="#CFC8BB" fillOpacity="0.9" />
      <path d="M200 182C230 140 288 136 282 166C276 192 224 186 200 182Z" fill="#CFC8BB" fillOpacity="0.8" />
      <path
        d="M200 182C186 200 176 224 168 246M200 182C214 200 226 224 236 246"
        stroke="#CFC8BB"
        strokeWidth="9"
        fill="none"
        strokeOpacity="0.85"
        strokeLinecap="round"
      />
      <ellipse cx="200" cy="181" rx="13" ry="10" fill="#CFC8BB" />
      <path
        d="M132 160C150 150 176 160 192 176"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="1.4"
        fill="none"
      />
      {/* monograma estampado */}
      <text
        x="120"
        y="360"
        fontFamily="var(--font-cormorant), serif"
        fontStyle="italic"
        fontSize="36"
        fill="#CFC8BB"
        fillOpacity="0.5"
      >
        GS
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Grabado estático (SVG)                                                    */

function EngravingArt({
  id,
  uid,
  kid,
  pal,
  art,
}: {
  id: GlassId;
  uid: string;
  kid: string;
  pal: Pal;
  art: StaticEngraving;
}) {
  const spec = PIECES[id];
  const z = spec.zone;
  if (!z.w) return null;
  const clipId = `${kid}-eclip`;
  const cx = z.x + z.w / 2;
  let content: ReactNode = null;
  if (art.kind === "text") {
    const total = art.lines.reduce((s, l) => s + l.size, 0);
    const gap = z.h * 0.04;
    let yCursor = z.y + z.h / 2 - (total * z.h + gap * (art.lines.length - 1)) / 2 + (art.offsetY ?? 0) * z.h;
    content = art.lines.map((l, i) => {
      const est = l.text.length * (FONT_WIDTH[l.font] + (l.tracking ?? 0)) || 1;
      const fs = Math.min(l.size * z.h, (z.w * 0.84) / est);
      const y = yCursor + fs * 0.5;
      yCursor += fs + gap;
      return (
        <text
          key={i}
          x={cx}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={ENGRAVE_FONT_FAMILY[l.font]}
          fontSize={fs}
          fontWeight={l.weight ?? 400}
          letterSpacing={l.tracking ? `${l.tracking}em` : undefined}
          fill={pal.engraveFill}
        >
          {l.text}
        </text>
      );
    });
  } else {
    const s = art.scale ?? 0.82;
    const size = Math.min(z.w, z.h) * s;
    content = (
      <g
        transform={`translate(${cx - size / 2} ${z.y + z.h / 2 - size / 2}) scale(${size / 400})`}
        fill={pal.engraveFill}
      >
        <DemoLogoArt logo={art.logo} />
      </g>
    );
  }
  // compresión horizontal suave para insinuar la curvatura del cristal
  const squash = spec.curvature > 0 ? 1 - spec.curvature * 0.12 : 1;
  return (
    <g>
      <clipPath id={clipId}>
        <path d={engraveClip(id)} />
      </clipPath>
      <g clipPath={`url(#${clipId})`} style={{ mixBlendMode: pal.blend }}>
        <g
          filter={`url(#${uid}-frost)`}
          opacity={pal.engraveOp}
          transform={`translate(${cx} 0) scale(${squash} 1) translate(${-cx} 0)`}
        >
          {content}
        </g>
      </g>
    </g>
  );
}

function ZoneGuide({ id }: { id: GlassId }) {
  const z = PIECES[id].zone;
  if (!z.w) return null;
  return (
    <rect
      x={z.x}
      y={z.y}
      width={z.w}
      height={z.h}
      fill="none"
      stroke="#CFC8BB"
      strokeOpacity="0.8"
      strokeDasharray="4 4"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  );
}
