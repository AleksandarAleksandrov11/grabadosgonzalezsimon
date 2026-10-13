/**
 * Geometría del sistema de ilustraciones de cristalería.
 *
 * Todas las piezas se dibujan en un lienzo común de 400 × 500 unidades
 * (proporción 4:5, la de las tarjetas de producto) con el suelo en y = 452.
 * Las piezas de revolución (vasos, copas, jarras, jarrones) se definen por su
 * PERFIL (pares [y, radio]) y el resto de la geometría (contorno, boca en
 * perspectiva, pared interior, reflejos que siguen la forma) se calcula aquí.
 */

export const VB_W = 400;
export const VB_H = 500;
export const CX = 200;
export const GROUND = 452;
/** Relación alto/ancho de las elipses en perspectiva (cámara ligeramente elevada). */
export const PERSP = 0.13;

export type Pt = [number, number];
/** [y, radio] — de arriba (boca) a abajo */
export type Profile = [number, number][];

const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** Muestrea una spline Catmull-Rom (uniforme) que pasa por todos los puntos. */
export function sampleSpline(points: Pt[], perSeg = 14): Pt[] {
  if (points.length < 3) return points.slice();
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y =
        0.5 *
        (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([x, y]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export function polyline(points: Pt[], move = true) {
  return points.map((p, i) => `${i === 0 && move ? "M" : "L"}${f(p[0])} ${f(p[1])}`).join("");
}

/** Perfil muestreado y función r(y) por interpolación lineal. */
export function makeProfile(profile: Profile, perSeg = 14) {
  const pts = sampleSpline(
    profile.map(([y, r]) => [r, y] as Pt),
    perSeg,
  ).map(([r, y]) => [y, Math.max(0, r)] as [number, number]);
  // asegurar y monótona
  for (let i = 1; i < pts.length; i++) if (pts[i][0] < pts[i - 1][0]) pts[i][0] = pts[i - 1][0];
  const rOf = (y: number) => {
    if (y <= pts[0][0]) return pts[0][1];
    if (y >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
    for (let i = 1; i < pts.length; i++) {
      if (y <= pts[i][0]) {
        const [y0, r0] = pts[i - 1];
        const [y1, r1] = pts[i];
        const t = y1 === y0 ? 0 : (y - y0) / (y1 - y0);
        return r0 + (r1 - r0) * t;
      }
    }
    return pts[pts.length - 1][1];
  };
  return { pts, rOf, top: pts[0][0], bottom: pts[pts.length - 1][0] };
}

export type SampledProfile = ReturnType<typeof makeProfile>;

/** Semielipse. half = "front" (inferior, delante) | "back" (superior, detrás). */
export function arc(cx: number, cy: number, rx: number, ry: number, half: "front" | "back", reverse = false) {
  const sweep = half === "front" ? (reverse ? 1 : 0) : reverse ? 0 : 1;
  const [x0, x1] = reverse ? [cx + rx, cx - rx] : [cx - rx, cx + rx];
  return `M${f(x0)} ${f(cy)}A${f(rx)} ${f(ry)} 0 0 ${sweep} ${f(x1)} ${f(cy)}`;
}

/** Contorno de una pieza de revolución: lado izq. hacia abajo, base delante, lado der. hacia arriba, boca detrás. */
export function vesselOutline(p: SampledProfile, persp = PERSP) {
  const left = p.pts.map(([y, r]) => [CX - r, y] as Pt);
  const right = p.pts.map(([y, r]) => [CX + r, y] as Pt).reverse();
  const top = p.pts[0];
  const bot = p.pts[p.pts.length - 1];
  return (
    polyline(left) +
    `A${f(bot[1])} ${f(bot[1] * persp)} 0 0 0 ${f(CX + bot[1])} ${f(bot[0])}` +
    polyline(right, false) +
    `A${f(top[1])} ${f(top[1] * persp)} 0 0 0 ${f(CX - top[1])} ${f(top[0])}Z`
  );
}

/** Banda que sigue la curvatura: entre u0·r(y) y u1·r(y) (u ∈ [-1, 1]) desde y0 hasta y1. */
export function band(p: SampledProfile, u0: number, u1: number, y0: number, y1: number, steps = 28) {
  const a: Pt[] = [];
  const b: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    const r = p.rOf(y);
    // estrechar los extremos para que el brillo termine en punta
    const taper = Math.sin((Math.PI * i) / steps) ** 0.35;
    const mid = (u0 + u1) / 2;
    const half = ((u1 - u0) / 2) * (0.25 + 0.75 * taper);
    a.push([CX + (mid - half) * r, y]);
    b.push([CX + (mid + half) * r, y]);
  }
  return polyline(a) + polyline(b.reverse(), false) + "Z";
}

/** Línea paralela al contorno (pared interior). */
export function offsetSide(p: SampledProfile, side: -1 | 1, inset: number, y0: number, y1: number, steps = 40) {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    pts.push([CX + side * Math.max(0, p.rOf(y) - inset), y]);
  }
  return polyline(pts);
}

/** Región interior (para recortar el grabado) entre y0 e y1, retranqueada `inset`. */
export function innerRegion(p: SampledProfile, inset: number, y0: number, y1: number, steps = 40) {
  const l: Pt[] = [];
  const r: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    const rr = Math.max(0, p.rOf(y) - inset);
    l.push([CX - rr, y]);
    r.push([CX + rr, y]);
  }
  return polyline(l) + polyline(r.reverse(), false) + "Z";
}

export function rect(x: number, y: number, w: number, h: number) {
  return `M${f(x)} ${f(y)}H${f(x + w)}V${f(y + h)}H${f(x)}Z`;
}

export function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${f(x + r)} ${f(y)}H${f(x + w - r)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)}V${f(y + h - r)}Q${f(x + w)} ${f(
    y + h,
  )} ${f(x + w - r)} ${f(y + h)}H${f(x + r)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)}V${f(y + r)}Q${f(x)} ${f(y)} ${f(
    x + r,
  )} ${f(y)}Z`;
}

export { f as fmt };
