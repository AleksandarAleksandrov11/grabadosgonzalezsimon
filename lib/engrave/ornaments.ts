import type { Ornament } from "./types";

/**
 * Ornamentos de las plantillas, dibujados en una caja de 100 × 100 con
 * Path2D (sin dependencias). Todos son de una sola tinta (blanco).
 */

const PATHS: Partial<Record<Ornament, string>> = {
  cross: "M45 6h10v24h22v10H55v54H45V40H23V30h22Z",
  dove: "M10 58c8-2 15-1 21 3 3-12 12-22 25-26 9-3 18-2 26 2-9 1-16 5-21 11 9 1 16 5 20 12-8-3-16-3-23 0 4 6 4 13 0 19-5-6-11-9-18-10-8 6-18 8-28 4 5-2 9-5 11-9-5 0-9-2-13-6Z",
  heart:
    "M50 88C20 66 6 50 6 33 6 19 17 9 30 9c9 0 16 5 20 12 4-7 11-12 20-12 13 0 24 10 24 24 0 17-14 33-44 55Z",
  star: (() => {
    const pts: string[] = [];
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const r = k % 2 === 0 ? 46 : 19;
      pts.push(`${(50 + r * Math.cos(a)).toFixed(1)} ${(52 + r * Math.sin(a)).toFixed(1)}`);
    }
    return `M${pts.join("L")}Z`;
  })(),
};

/** ¿El ornamento va encima del texto (true) o lo enmarca (false)? */
export function ornamentOnTop(o: Ornament) {
  return o === "cross" || o === "dove" || o === "heart" || o === "star" || o === "rings";
}

const cache = new Map<string, Path2D>();
function path(o: Ornament) {
  const d = PATHS[o];
  if (!d) return null;
  let p = cache.get(o);
  if (!p) {
    p = new Path2D(d);
    cache.set(o, p);
  }
  return p;
}

/** Dibuja un ornamento superior centrado en (cx, cy) con lado `size`. */
export function drawTopOrnament(
  ctx: CanvasRenderingContext2D,
  o: Ornament,
  cx: number,
  cy: number,
  size: number,
) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(size / 100, size / 100);
  if (o === "rings") {
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(38, 52, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(62, 52, 26, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const p = path(o);
    if (p) ctx.fill(p);
  }
  ctx.restore();
}

/** Laurel: dos ramas curvas bajo y a los lados del bloque de texto. */
export function drawLaurel(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const R = Math.max(w, h) * 0.62;
  const leaves = 9;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(side, 1);
    // tallo
    ctx.lineWidth = Math.max(1.2, R * 0.022);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.arc(0, -R * 0.05, R, Math.PI * 0.12, Math.PI * 0.62);
    ctx.stroke();
    for (let i = 0; i < leaves; i++) {
      const t = Math.PI * 0.14 + (i / (leaves - 1)) * Math.PI * 0.46;
      const x = Math.cos(t) * R;
      const y = Math.sin(t) * R - R * 0.05;
      const len = R * (0.2 - i * 0.008);
      for (const dir of [-1, 1]) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t + Math.PI / 2 + dir * 0.55);
        ctx.beginPath();
        ctx.ellipse(0, -len / 2, len * 0.22, len / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }
}

/** Escudo que enmarca el texto (contorno). */
export function drawShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number) {
  const W = w;
  const H = h;
  const x = cx - W / 2;
  const y = cy - H / 2;
  const lw = Math.max(2, W * 0.035);
  ctx.save();
  ctx.lineWidth = lw;
  ctx.strokeStyle = "#fff";
  ctx.lineJoin = "round";
  const shield = (inset: number) => {
    ctx.beginPath();
    ctx.moveTo(x + W / 2, y + inset);
    ctx.lineTo(x + W - inset, y + H * 0.12 + inset);
    ctx.bezierCurveTo(x + W - inset, y + H * 0.62, x + W * 0.78, y + H * 0.86, x + W / 2, y + H - inset);
    ctx.bezierCurveTo(x + W * 0.22, y + H * 0.86, x + inset, y + H * 0.62, x + inset, y + H * 0.12 + inset);
    ctx.closePath();
    ctx.stroke();
  };
  shield(lw / 2);
  ctx.lineWidth = lw * 0.4;
  shield(lw * 2.4);
  ctx.restore();
}
