"use client";

import * as m from "motion/react-m";
import { SectionHeading } from "@/components/ui/misc";

const STEPS = [
  { title: "Elige tu pieza", text: "Vasos, copas, jarras, jarrones, metopas o trofeos." },
  { title: "Personalízala", text: "Escribe tu texto o sube tu logo y míralo al momento." },
  {
    title: "Revisamos tu diseño contigo",
    text: "Te enviamos la prueba y la ajustamos hasta que te encante.",
  },
  { title: "La grabamos y te la enviamos", text: "A mano, pieza a pieza. Recogida en taller o envío." },
];

/** Cómo hacer un pedido: 4 pasos con una línea que se dibuja. */
export function OrderSteps() {
  return (
    <section className="theme-light bg-stone-50 section-y" aria-labelledby="pedido-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Cómo funciona"
          title={
            <span id="pedido-title">
              Así de sencillo es <em className="font-light">tu pedido</em>
            </span>
          }
          align="center"
          className="mx-auto"
        />
        <div className="relative mt-16">
          {/* línea horizontal (desktop) */}
          <svg
            className="absolute top-[22px] right-[12.5%] left-[12.5%] hidden h-px w-[75%] overflow-visible lg:block"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <m.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="currentColor"
              strokeOpacity="0.35"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>
          {/* línea vertical (móvil) */}
          <svg
            className="absolute top-2 bottom-2 left-[22px] w-px overflow-visible lg:hidden"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <m.line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="currentColor"
              strokeOpacity="0.35"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            />
          </svg>
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s, i) => (
              <m.li
                key={s.title}
                className="flex gap-5 lg:flex-col lg:items-center lg:text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="relative z-[1] inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-fg bg-stone-50 font-display text-lg italic">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[1.6rem] leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-[28ch] text-fg-muted lg:mx-auto">{s.text}</p>
                </div>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
