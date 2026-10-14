import type { Metadata } from "next";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import { WhatsAppIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { faqs } from "@/data/faqs";
import { whatsappLink } from "@/data/site";
import { allProducts, getProductSync } from "@/lib/commerce/local-provider";
import { STANDARD_TIERS, unitPriceFor } from "@/lib/commerce/pricing";
import type { GlassId } from "@/lib/glass/pieces";
import { formatPrice } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Cristalería grabada con logo para empresas y hostelería",
  description:
    "Vasos, copas, jarras, metopas y trofeos grabados con el logotipo de tu empresa. Precio por volumen, prueba de diseño y grabado artesanal con chorro de arena en Madrid.",
  path: "/empresas",
});

const USES: { title: string; text: string; glass: GlassId; engraving: StaticEngraving }[] = [
  {
    title: "Hostelería",
    text: "Vasos, copas y jarras con tu marca para el servicio diario.",
    glass: "tubo",
    engraving: { kind: "logo", logo: "cafe", scale: 0.88 },
  },
  {
    title: "Regalos corporativos",
    text: "Detalles para clientes y equipos que se usan cada día.",
    glass: "whisky-tallado",
    engraving: { kind: "logo", logo: "bodega", scale: 0.8 },
  },
  {
    title: "Premios y reconocimientos",
    text: "Metopas y trofeos para aniversarios, jubilaciones y premios internos.",
    glass: "metopa",
    engraving: { kind: "logo", logo: "club", scale: 0.86 },
  },
  {
    title: "Eventos y torneos",
    text: "Trofeos para campeonatos y recuerdos para asistentes.",
    glass: "trofeo-llama",
    engraving: {
      kind: "text",
      lines: [
        { text: "TORNEO", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
  },
];

const PROCESS = [
  {
    title: "Nos cuentas el proyecto",
    text: "Producto, cantidad, fecha y tu logotipo, mejor en vectorial.",
  },
  {
    title: "Presupuesto y prueba",
    text: "Precio cerrado y una prueba del grabado sobre la pieza.",
  },
  {
    title: "Grabado en el taller",
    text: "Cada pieza se graba a mano y se revisa a contraluz.",
  },
  {
    title: "Entrega",
    text: "Envío a tu empresa o recogida en el taller de Madrid.",
  },
];

export default function EmpresasPage() {
  const b2b = allProducts().filter((p) => p.tags.includes("empresa") || p.tags.includes("hosteleria"));
  const example = getProductSync("vaso-tubo-grabado") ?? b2b[0];
  const base = example.priceRange.minVariantPrice.amount;
  const companyFaqs = faqs.filter((f) => f.group === "Empresas");

  return (
    <>
      <PageHero
        crumbs={[{ name: "Empresas", href: "/empresas" }]}
        title={
          <>
            Tu marca, <em className="font-light">grabada</em> en cristal
          </>
        }
        lead="Cristalería con el logotipo de tu empresa, tu restaurante o tu club, con precio por volumen."
        glass="copa-vino"
        engraving={{ kind: "logo", logo: "bodega", scale: 0.8 }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#presupuesto" size="lg">
            Pedir presupuesto
          </ButtonLink>
          <ButtonLink
            href={whatsappLink("Hola, quería un presupuesto de cristalería grabada para mi empresa.")}
            external
            variant="outline"
            size="lg"
            iconLeft={<WhatsAppIcon className="size-5" />}
            className="border-white/30 text-paper hover:border-paper hover:bg-white/5"
          >
            WhatsApp
          </ButtonLink>
        </div>
      </PageHero>

      <section className="theme-light bg-paper section-y" aria-labelledby="usos">
        <div className="container-x">
          <SectionHeading
            title={
              <span id="usos">
                Lo que grabamos <em className="font-light">para empresas</em>
              </span>
            }
          />
          <Stagger className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
            {USES.map((u) => (
              <StaggerItem key={u.title}>
                <div className="theme-dark overflow-hidden rounded-[var(--radius-lg)] bg-ink px-[16%] pt-[8%] pb-[4%]">
                  <Glass id={u.glass} tone="dark" engraving={u.engraving} />
                </div>
                <h3 className="mt-5 font-display text-[1.5rem] leading-tight">{u.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-fg-muted">{u.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        className="theme-dark grain relative overflow-hidden bg-ink section-y"
        aria-labelledby="volumen"
      >
        <div className="relative z-[2] container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              title={
                <span id="volumen">
                  Cuantas más piezas, <em className="font-light">mejor precio</em>
                </span>
              }
              lead="A partir de 50 unidades preparamos un presupuesto a medida."
            />
          </div>
          <Reveal variant="up" className="lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-white/12">
              <table className="w-full text-left text-[0.9375rem]">
                <caption className="border-b border-white/12 px-5 py-4 text-left text-[0.8125rem] text-stone-400">
                  {example.title}, desde {formatPrice(base)} la unidad
                </caption>
                <thead>
                  <tr className="text-[0.75rem] tracking-[0.1em] text-stone-400 uppercase">
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Unidades
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Descuento
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Precio/ud
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STANDARD_TIERS.map((t) => (
                    <tr key={t.min} className="border-t border-white/8 text-stone-200">
                      <th scope="row" className="px-5 py-4 font-semibold text-paper">
                        {t.max ? `${t.min} a ${t.max}` : `${t.min} o más`}
                      </th>
                      <td className="px-5 py-4">
                        {t.quote
                          ? "A medida"
                          : t.discount
                            ? `−${Math.round(t.discount * 100)} %`
                            : "Sin descuento"}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums">
                        {t.quote ? "Presupuesto" : formatPrice(unitPriceFor(base, STANDARD_TIERS, t.min))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="proceso">
        <div className="container-x">
          <SectionHeading
            title={
              <span id="proceso">
                Del logo a la pieza, <em className="font-light">sin sorpresas</em>
              </span>
            }
          />
          <Stagger as="ol" className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s, i) => (
              <StaggerItem key={s.title} as="li" className="border-t border-fg pt-6">
                <p className="font-display text-[2.5rem] leading-none text-fg-subtle">0{i + 1}</p>
                <h3 className="mt-4 text-[1.0625rem] font-semibold">{s.title}</h3>
                <p className="mt-1 text-[0.9375rem] text-fg-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="presupuesto"
        className="theme-light scroll-mt-24 border-t border-line bg-paper-pure section-y"
        aria-labelledby="presupuesto-title"
      >
        <div className="container-x">
          <SectionHeading
            title={
              <span id="presupuesto-title">
                Pide tu <em className="font-light">presupuesto</em>
              </span>
            }
          />
          <div className="mt-12">
            <QuoteForm
              products={b2b.map((p) => ({
                handle: p.handle,
                title: p.title,
                glass: p.metafields.personalization.engraveOn,
              }))}
            />
          </div>
        </div>
      </section>

      {companyFaqs.length ? (
        <section
          className="theme-light border-t border-line bg-paper section-y"
          aria-labelledby="faq-empresas"
        >
          <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading title={<span id="faq-empresas">Preguntas frecuentes</span>} size="s" />
            </div>
            <div className="lg:col-span-8">
              <Accordion
                size="lg"
                items={companyFaqs.map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))}
                defaultOpen={[companyFaqs[0].id]}
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
