import { useId } from "react";
import { Glass } from "@/components/glassware/Glass";
import { cn, svgId } from "@/lib/utils";

export const TECHNIQUE_STEPS = [
  {
    title: "Diseño",
    lead: "Preparamos tu diseño a medida",
    text: "Adaptamos tu texto, logotipo o escudo a la pieza: tamaño, grosor de trazo y posición para que el grabado quede nítido y equilibrado.",
  },
  {
    title: "Máscara",
    lead: "Protegemos el cristal",
    text: "Cubrimos la pieza con una plantilla resistente y recortamos el diseño. Solo lo que queda al descubierto se grabará.",
  },
  {
    title: "Chorro de arena",
    lead: "La arena esmerila el cristal",
    text: "Proyectamos arena a presión con precisión. Las zonas descubiertas se vuelven blancas y mate, con la profundidad justa para no debilitar la pieza.",
  },
  {
    title: "Acabado",
    lead: "Revisión pieza a pieza",
    text: "Retiramos la máscara, limpiamos y revisamos cada pieza a mano. El resultado: un grabado permanente que no se borra con el tiempo.",
  },
] as const;

const CX = 200;
const ZY = 292; // centro vertical de la zona del Old Fashioned

/** Ilustración del proceso en 4 estados (0–3) sobre un vaso Old Fashioned. */
export function TechniqueVisual({ step, className }: { step: number; className?: string }) {
  const uid = svgId(useId());
  const on = (s: number) => (step === s ? "opacity-100" : "opacity-0");
  return (
    <div className={cn("relative aspect-[4/5]", className)} data-step={step}>
      <Glass id="old-fashioned" tone="dark" layer="back" className="absolute inset-0" />
      <svg viewBox="0 0 400 500" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          <filter id={`${uid}-frost`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" result="n" />
            <feColorMatrix
              in="n"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.85 1.18"
              result="g"
            />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
          </filter>
          <mask id={`${uid}-cut`}>
            <rect x="0" y="0" width="400" height="500" fill="#fff" />
            <g fill="#000">
              <Design />
            </g>
          </mask>
          <linearGradient id={`${uid}-vinyl`} x1="0" x2="1">
            <stop offset="0" stopColor="#CFC8BB" stopOpacity="0.28" />
            <stop offset="0.5" stopColor="#CFC8BB" stopOpacity="0.42" />
            <stop offset="1" stopColor="#CFC8BB" stopOpacity="0.28" />
          </linearGradient>
          <radialGradient id={`${uid}-burst`}>
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 0 · Diseño: trazo vectorial con guías */}
        <g className={cn("transition-opacity duration-700", on(0))}>
          <rect
            x="118"
            y="222"
            width="164"
            height="140"
            fill="none"
            stroke="#CFC8BB"
            strokeOpacity="0.7"
            strokeDasharray="4 5"
          />
          {[
            [118, 222],
            [282, 222],
            [118, 362],
            [282, 362],
          ].map(([x, y]) => (
            <rect
              key={`${x}${y}`}
              x={x - 3.5}
              y={y - 3.5}
              width="7"
              height="7"
              fill="#0a0a0a"
              stroke="#CFC8BB"
            />
          ))}
          <g fill="none" stroke="#fff" strokeWidth="0.9" strokeOpacity="0.95">
            <Design />
          </g>
          <path d="M200 208v-26M200 376v26" stroke="#CFC8BB" strokeOpacity="0.5" strokeDasharray="2 4" />
          <text
            x="290"
            y="214"
            fill="#CFC8BB"
            fontSize="9"
            fontFamily="var(--font-manrope), sans-serif"
            letterSpacing="1"
          >
            164 × 140 mm
          </text>
        </g>

        {/* 1-2 · Máscara (vinilo) con el diseño recortado */}
        <g
          className={cn(
            "transition-opacity duration-700",
            step === 1 || step === 2 ? "opacity-100" : "opacity-0",
          )}
        >
          <path d="M104 214H296V372H104Z" fill={`url(#${uid}-vinyl)`} mask={`url(#${uid}-cut)`} />
          <path d="M104 214H296V372H104Z" fill="none" stroke="#CFC8BB" strokeOpacity="0.6" />
          <g fill="none" stroke="#CFC8BB" strokeOpacity="0.9" strokeWidth="0.6">
            <Design />
          </g>
        </g>

        {/* 2 · Chorro: el diseño se esmerila y la arena rebota */}
        <g className={cn("transition-opacity duration-700", on(2))}>
          <g fill="#fff" filter={`url(#${uid}-frost)`} className="technique-frost">
            <Design />
          </g>
          <path
            d="M392 40L214 286"
            stroke={`url(#${uid}-burst)`}
            strokeOpacity="0.2"
            strokeWidth="18"
            strokeLinecap="round"
            className="opacity-25"
          />
          <circle cx="214" cy="286" r="34" fill={`url(#${uid}-burst)`} />
          <g className="technique-sand" fill="#fff">
            {Array.from({ length: 26 }).map((_, i) => {
              const t = i / 26;
              return (
                <circle
                  key={i}
                  cx={392 - t * 178 + ((i * 37) % 13) - 6}
                  cy={40 + t * 246 + ((i * 53) % 11) - 5}
                  r={0.8 + (i % 3) * 0.5}
                  style={{ animationDelay: `${-(i * 0.09).toFixed(2)}s` }}
                />
              );
            })}
          </g>
        </g>

        {/* 3 · Acabado */}
        <g className={cn("transition-opacity duration-700", on(3))}>
          <g fill="#fff" fillOpacity="0.86" filter={`url(#${uid}-frost)`}>
            <Design />
          </g>
          {[
            [128, 236, 1],
            [276, 250, 0.7],
            [248, 352, 0.85],
          ].map(([x, y, s], i) => (
            <path
              key={i}
              d={`M${x} ${y - 9 * s}L${x + 2 * s} ${y - 2 * s}L${x + 9 * s} ${y}L${x + 2 * s} ${y + 2 * s}L${x} ${y + 9 * s}L${x - 2 * s} ${y + 2 * s}L${x - 9 * s} ${y}L${x - 2 * s} ${y - 2 * s}Z`}
              fill="#fff"
              className="technique-sparkle"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </g>
      </svg>
      <Glass id="old-fashioned" tone="dark" layer="front" className="absolute inset-0" />
    </div>
  );
}

/** El diseño de ejemplo (iniciales + fecha). */
function Design() {
  return (
    <>
      <text x={CX} y={ZY - 6} textAnchor="middle" fontFamily="var(--font-great-vibes), cursive" fontSize="54">
        A &amp; M
      </text>
      <text
        x={CX}
        y={ZY + 36}
        textAnchor="middle"
        fontFamily="var(--font-cinzel), serif"
        fontSize="13"
        letterSpacing="2.5"
      >
        12 · 06 · 2026
      </text>
    </>
  );
}
