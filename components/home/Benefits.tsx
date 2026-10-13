"use client";

import * as m from "motion/react-m";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/misc";

/** Iconos lineales que se «dibujan» al entrar en pantalla. */
const ICONS: Record<string, string[]> = {
  permanente: ["M12 3l7 3v5c0 5-3.2 8.6-7 10-3.8-1.4-7-5-7-10V6l7-3Z", "M8.5 12.2l2.4 2.4 4.6-4.8"],
  artesanal: [
    "M7 21h10",
    "M9 21c0-4 1-6 3-9 2 3 3 5 3 9",
    "M12 12V7",
    "M8.5 3.5c1.5 1 2.5 2.2 3.5 3.5 1-1.3 2-2.5 3.5-3.5",
  ],
  medida: ["M4 20L20 4", "M14 4h6v6", "M4 14v6h6", "M9 9l2 2M13 13l2 2"],
  asesoramiento: ["M4 5h12v9H9l-4 4v-4H4Z", "M18 9h2v9h-1v3l-3-3h-5v-2", "M7.5 9.5h6M7.5 12h4"],
  volumen: ["M4 20V10M9.5 20V6M15 20v-8M20.5 20V4", "M3 20h18"],
  madrid: [
    "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z",
    "M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  ],
};

const ITEMS = [
  {
    icon: "permanente",
    title: "Grabado permanente",
    text: "No es vinilo ni impresión: el diseño forma parte del cristal. No se borra ni se despega.",
  },
  {
    icon: "artesanal",
    title: "Artesanal, pieza a pieza",
    text: "Cada grabado se hace y se revisa a mano en el taller, con el cuidado de siempre.",
  },
  {
    icon: "medida",
    title: "Totalmente a medida",
    text: "Tu texto, tu tipografía, tu logo o un dibujo a mano. Lo adaptamos a cada pieza.",
  },
  {
    icon: "asesoramiento",
    title: "Asesoramiento cercano",
    text: "Te ayudamos a elegir pieza y diseño, y te enviamos la prueba antes de grabar.",
  },
  {
    icon: "volumen",
    title: "Empresas y eventos",
    text: "Series para empresas, bodas y hostelería con precio por volumen automático.",
  },
  {
    icon: "madrid",
    title: "Hecho en Madrid",
    text: "Taller propio en Madrid. Recogida en taller o envío a toda España.",
  },
];

const COMPARE = [
  {
    label: "Durabilidad",
    sand: "Permanente: forma parte del cristal",
    other: "Se desgasta, se raya o se despega con los lavados",
  },
  { label: "Tacto", sand: "Relieve mate y suave al tacto", other: "Película o tinta superpuesta" },
  {
    label: "Elegancia",
    sand: "Esmerilado blanco que juega con la luz",
    other: "Colores planos, aspecto de pegatina",
  },
  {
    label: "Resistencia al uso",
    sand: "Pensado para usarse a diario",
    other: "Pierde definición con el uso",
  },
];

function LineIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name].map((d, i) => (
        <m.path
          key={i}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, delay: 0.15 + i * 0.2, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  );
}

export function Benefits() {
  return (
    <section className="theme-light bg-paper section-y" aria-labelledby="ventajas-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Por qué elegirnos"
          title={
            <span id="ventajas-title">
              Calidad, precisión y <em className="font-light">atención al detalle</em>
            </span>
          }
          lead="Personalización única y a medida, una amplia gama de piezas en cristal y el cuidado de un taller artesano."
        />
        <Stagger
          className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.09}
        >
          {ITEMS.map((it) => (
            <StaggerItem
              key={it.title}
              variant="fade"
              className="group bg-paper p-7 transition-colors duration-500 hover:bg-paper-pure sm:p-9"
            >
              <span className="text-fg">
                <LineIcon name={it.icon} />
              </span>
              <h3 className="mt-6 font-display text-[1.6rem] leading-tight text-fg">{it.title}</h3>
              <p className="mt-2 leading-relaxed text-fg-muted">{it.text}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal variant="up" className="mt-20">
          {/* móvil: tarjetas apiladas */}
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line sm:hidden">
            <p className="bg-ink px-5 py-5 font-display text-[1.5rem] leading-tight text-paper">
              Chorro de arena <span className="font-light italic">vs.</span> impresión o vinilo
            </p>
            <dl className="divide-y divide-line">
              {COMPARE.map((r) => (
                <div key={r.label} className="space-y-2 px-5 py-4">
                  <dt className="text-[0.75rem] font-semibold tracking-[0.12em] text-fg-muted uppercase">
                    {r.label}
                  </dt>
                  <dd className="flex gap-2.5 font-medium">
                    <svg viewBox="0 0 16 16" className="mt-1 size-3.5 shrink-0" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    <span>
                      <span className="sr-only">Chorro de arena: </span>
                      {r.sand}
                    </span>
                  </dd>
                  <dd className="pl-6 text-[0.875rem] text-fg-subtle">
                    <span className="font-semibold">Impresión/vinilo:</span> {r.other}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-line sm:block">
            <table className="w-full text-left text-[0.9375rem]">
              <caption className="bg-ink px-5 py-5 text-left font-display text-[1.6rem] text-paper sm:px-8">
                Chorro de arena <span className="font-light italic">vs.</span> impresión o vinilo
              </caption>
              <thead className="border-b border-line bg-surface-2 text-[0.75rem] tracking-[0.12em] text-fg-muted uppercase">
                <tr>
                  <th scope="col" className="w-[24%] px-5 py-3 font-semibold sm:px-8">
                    <span className="sr-only">Característica</span>
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold text-fg sm:px-8">
                    Grabado con chorro de arena
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold sm:px-8">
                    Impresión / vinilo
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r) => (
                  <tr key={r.label} className="border-b border-line align-top last:border-0">
                    <th scope="row" className="px-5 py-4 font-semibold sm:px-8">
                      {r.label}
                    </th>
                    <td className="px-5 py-4 sm:px-8">
                      <span className="flex gap-2.5">
                        <svg viewBox="0 0 16 16" className="mt-1 size-3.5 shrink-0" aria-hidden="true">
                          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        {r.sand}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-fg-subtle sm:px-8">{r.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
