import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Gallery } from "@/components/home/Gallery";
import { TechniquePinned } from "@/components/home/TechniquePinned";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { BeforeAfter } from "@/components/technique/BeforeAfter";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/misc";
import { faqs } from "@/data/faqs";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "La técnica: grabado en cristal con chorro de arena",
  description:
    "Cómo grabamos el cristal con chorro de arena: diseño, máscara, arena a presión y acabado. Un grabado blanco mate, permanente y con la profundidad justa.",
  path: "/tecnica",
});

const COMPARE = [
  {
    label: "Acabado",
    sand: "Blanco mate y aterciopelado, parte del propio cristal",
    laser: "Marca fina y superficial",
    vinyl: "Pegatina o tinta sobre la superficie",
  },
  {
    label: "Durabilidad",
    sand: "Permanente: no se despega ni se borra",
    laser: "Permanente",
    vinyl: "Se desgasta con el uso y los lavados",
  },
  {
    label: "Profundidad y relieve",
    sand: "Profundidad regulable, admite sombreados",
    laser: "Plano",
    vinyl: "Sin relieve",
  },
  {
    label: "Logos con detalle",
    sand: "Muy buena definición con máscara a medida",
    laser: "Buena",
    vinyl: "Limitada en trazos finos",
  },
  {
    label: "Piezas curvas",
    sand: "Vasos, copas, jarras, jarrones y trofeos",
    laser: "Según la máquina",
    vinyl: "Arrugas en curvas cerradas",
  },
];

const FACTS = [
  {
    title: "Es irreversible",
    text: "El grabado forma parte del cristal, por eso siempre enviamos una prueba antes.",
  },
  {
    title: "Profundidad justa",
    text: "Se ve y se toca, sin debilitar la pieza.",
  },
  {
    title: "Blanco, no color",
    text: "La arena esmerila el cristal. Sin tintas ni pinturas.",
  },
  {
    title: "Cada pieza, revisada",
    text: "Limpiamos y revisamos cada grabado a contraluz.",
  },
];

function Cell({ text, best }: { text: string; best?: boolean }) {
  return (
    <td className="px-4 py-4 align-top text-[0.9375rem]">
      <span className="flex items-start gap-2">
        {best ? (
          <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        ) : (
          <Minus className="mt-0.5 size-4 shrink-0 opacity-40" aria-hidden="true" />
        )}
        <span className={best ? "text-fg" : "text-fg-muted"}>{text}</span>
      </span>
    </td>
  );
}

export default function TecnicaPage() {
  const techFaqs = faqs.filter((f) => f.group === "Técnica");
  return (
    <>
      <PageHero
        crumbs={[{ name: "La técnica", href: "/tecnica" }]}
        title={
          <>
            Chorro de arena: <em className="font-light">luz</em> dentro del cristal
          </>
        }
        lead="Arena a presión sobre el cristal protegido con una máscara. Lo que queda al descubierto se vuelve blanco y mate para siempre."
        glass="old-fashioned"
        engraving={{ kind: "text", lines: [{ text: "Arena", font: "classic", size: 0.26 }] }}
      />

      <TechniquePinned link={false} />

      <section
        className="theme-dark grain relative overflow-hidden border-t border-white/10 bg-ink section-y"
        aria-labelledby="antes-despues"
      >
        <div className="relative z-[2] container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              title={
                <span id="antes-despues">
                  De cristal liso a <em className="font-light">recuerdo</em>
                </span>
              }
            />
          </div>
          <Reveal variant="scale">
            <BeforeAfter
              glass="copa-balon"
              engraving={{
                kind: "text",
                lines: [
                  { text: "E & P", font: "script", size: 0.42 },
                  { text: "12 · 06 · 2026", font: "roman", size: 0.09, tracking: 0.12 },
                ],
              }}
            />
          </Reveal>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="comparativa">
        <div className="container-x">
          <SectionHeading
            title={
              <span id="comparativa">
                ¿Por qué <em className="font-light">chorro de arena</em>?
              </span>
            }
          />
          <Reveal variant="up" className="mt-12">
            <p className="mb-3 text-[0.8125rem] text-fg-subtle md:hidden" aria-hidden="true">
              Desliza para ver todas las técnicas
            </p>
            <div className="relative -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line-strong">
                    <th
                      scope="col"
                      className="w-[18%] px-4 py-4 text-[0.75rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase"
                    >
                      <span className="sr-only">Característica</span>
                    </th>
                    <th scope="col" className="bg-fg/[0.04] px-4 py-4 font-display text-[1.5rem] font-normal">
                      Chorro de arena
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 font-display text-[1.5rem] font-normal text-fg-muted"
                    >
                      Láser
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 font-display text-[1.5rem] font-normal text-fg-muted"
                    >
                      Vinilo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r) => (
                    <tr key={r.label} className="border-b border-line">
                      <th scope="row" className="px-4 py-4 align-top text-[0.875rem] font-semibold">
                        {r.label}
                      </th>
                      <td className="bg-fg/[0.04] px-4 py-4 align-top text-[0.9375rem]">
                        <span className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                          {r.sand}
                        </span>
                      </td>
                      <Cell text={r.laser} />
                      <Cell text={r.vinyl} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-paper-pure section-y" aria-labelledby="saber">
        <div className="container-x">
          <SectionHeading title={<span id="saber">Antes de encargar</span>} size="m" />
          <Stagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((f) => (
              <StaggerItem key={f.title} className="border-t border-fg pt-6">
                <h3 className="font-display text-[1.6rem] leading-tight">{f.title}</h3>
                <p className="mt-2 text-fg-muted">{f.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Gallery />

      <section className="theme-light border-t border-line bg-paper section-y" aria-labelledby="faq-tecnica">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading title={<span id="faq-tecnica">Preguntas frecuentes</span>} size="s" />
          </div>
          <div className="lg:col-span-8">
            <Accordion
              size="lg"
              items={techFaqs.map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))}
              defaultOpen={techFaqs.length ? [techFaqs[0].id] : []}
            />
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
