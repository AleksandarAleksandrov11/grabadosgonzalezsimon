import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TECHNIQUE_STEPS, TechniqueVisual } from "@/components/technique/TechniqueVisual";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { fullAddress, mapsUrl, site } from "@/data/site";
import type { GlassId } from "@/lib/glass/pieces";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Sobre nosotros: grabado artesanal en cristal en Madrid",
  description:
    "Un taller de Madrid dedicado al grabado en cristal con chorro de arena desde 1993: iniciales, logotipos, escudos, trofeos y frases que convierten un objeto de cristal en un recuerdo.",
  path: "/sobre-nosotros",
});

const TIMELINE = [
  {
    year: "1993",
    title: "Los primeros grabados",
    text: "Copas y vasos para bodas, regalos y vecinos del barrio, grabados a mano con chorro de arena.",
  },
  {
    year: "2004",
    title: "El taller de Pablo Iglesias",
    text: "Nos instalamos en la Avenida de Pablo Iglesias, donde seguimos grabando cada pieza.",
  },
  {
    year: "2015",
    title: "Empresas y clubes",
    text: "Restaurantes, empresas y clubes deportivos empiezan a confiarnos su logotipo.",
  },
  {
    year: "2026",
    title: "Tienda online",
    text: "Ahora también puedes diseñar tu pieza y encargarla desde casa.",
  },
];

const ENGRAVES: { title: string; glass: GlassId; engraving: StaticEngraving }[] = [
  {
    title: "Iniciales, nombres y fechas",
    glass: "copa-cava",
    engraving: { kind: "text", lines: [{ text: "E & P", font: "script", size: 0.32 }] },
  },
  {
    title: "Logotipos y escudos",
    glass: "jarra-cerveza",
    engraving: { kind: "logo", logo: "club", scale: 0.8 },
  },
  {
    title: "Trofeos y placas",
    glass: "trofeo-obelisco",
    engraving: {
      kind: "text",
      lines: [
        { text: "GRACIAS", font: "roman", size: 0.09, weight: 600, tracking: 0.1 },
        { text: "25 años", font: "script", size: 0.13 },
      ],
    },
  },
  {
    title: "Textos y frases",
    glass: "jarron-cilindrico",
    engraving: {
      kind: "text",
      lines: [
        { text: "Donde", font: "classic", size: 0.12 },
        { text: "todo empezó", font: "script", size: 0.14 },
      ],
    },
  },
];

export default function SobreNosotrosPage() {
  const { since, yearsLabel, pieces } = site.facts;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Sobre nosotros", href: "/sobre-nosotros" }]}
        title={
          <>
            Personaliza tus momentos <em className="font-light">con elegancia</em>
          </>
        }
        lead={`Un taller de Madrid dedicado al grabado en cristal con chorro de arena desde ${since}.`}
      />

      <section className="theme-light bg-paper pt-14 sm:pt-20" aria-label="El taller">
        <div className="container-x">
          <Reveal variant="clip-up" duration={1.3}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink sm:aspect-[16/9]">
              <Image
                src="/images/original/libreria-media-pexels-11110961.jpg"
                alt="Vaso de cristal tallado con el borde dorado"
                fill
                priority
                sizes="(min-width: 1440px) 1360px, 100vw"
                className="object-cover object-[50%_60%]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="historia">
        <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading
              title={
                <span id="historia">
                  Arena, cristal y <em className="font-light">paciencia</em>
                </span>
              }
            />
            <Reveal variant="blur" delay={0.1}>
              <div className="mt-8 space-y-5 text-lead text-fg-muted">
                <p>
                  En el taller cada pieza pasa por las mismas manos: preparamos el diseño, protegemos el
                  cristal con una máscara, dejamos que la arena haga su trabajo y revisamos el resultado a
                  contraluz.
                </p>
                <p>
                  Así convertimos un vaso, una copa o un trofeo en un recuerdo que se usa durante años. Un
                  grabado limpio y permanente, con la profundidad justa para no debilitar el cristal.
                </p>
              </div>
            </Reveal>
          </div>
          <dl className="grid grid-cols-3 gap-6 self-end border-t border-line pt-8 lg:col-span-5 lg:col-start-8 lg:grid-cols-1 lg:border-t-0 lg:pt-0">
            {[
              [yearsLabel, "de oficio"],
              [pieces, "piezas grabadas"],
              ["100 %", "hecho a mano"],
            ].map(([n, label]) => (
              <div key={label} className="flex flex-col gap-1 lg:border-b lg:border-line lg:pb-6">
                <dt className="order-last text-[0.875rem] text-fg-muted">{label}</dt>
                <dd className="font-display text-[clamp(1.8rem,1.2rem+2vw,3.25rem)] leading-none">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-paper-pure section-y" aria-labelledby="hitos">
        <div className="container-x">
          <SectionHeading title={<span id="hitos">Nuestra historia</span>} size="m" />
          <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} variant="up" delay={i * 0.08} className="border-t border-fg pt-6">
                <p className="font-display text-[2.5rem] leading-none">{t.year}</p>
                <p className="mt-4 font-semibold">{t.title}</p>
                <p className="mt-1 text-fg-muted">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="theme-dark grain relative overflow-hidden bg-ink section-y"
        aria-labelledby="tecnica-resumen"
      >
        <div className="relative z-[2] container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              title={
                <span id="tecnica-resumen">
                  Cuatro pasos, <em className="font-light">una pieza para siempre</em>
                </span>
              }
            />
            <Link
              href="/tecnica"
              className="group/btn inline-flex items-center gap-2 font-semibold text-paper"
            >
              <span className="link-underline">La técnica en detalle</span> <ArrowIcon />
            </Link>
          </div>
          <Stagger as="ol" className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {TECHNIQUE_STEPS.map((s, i) => (
              <StaggerItem as="li" key={s.title}>
                <TechniqueVisual step={i} className="mx-auto max-w-[240px]" />
                <p className="mt-4 font-display text-[1.6rem] text-paper">{s.title}</p>
                <p className="mt-1 text-[0.9375rem] text-stone-300">{s.lead}.</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="grabamos">
        <div className="container-x">
          <SectionHeading title={<span id="grabamos">Qué grabamos</span>} size="m" />
          <Stagger className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
            {ENGRAVES.map((e) => (
              <StaggerItem key={e.title}>
                <div className="theme-dark overflow-hidden rounded-[var(--radius-lg)] bg-ink px-[16%] pt-[8%] pb-[4%]">
                  <Glass id={e.glass} tone="dark" engraving={e.engraving} />
                </div>
                <h3 className="mt-4 font-display text-[1.4rem] leading-tight">{e.title}</h3>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-paper section-y" aria-labelledby="taller">
        <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              title={
                <span id="taller">
                  Ven a <em className="font-light">vernos</em>
                </span>
              }
              lead={`${fullAddress()}. ${site.hours}.`}
            />
            <ButtonLink href="/contacto" variant="outline" className="mt-8" iconRight={<ArrowIcon />}>
              Contacto
            </ButtonLink>
          </div>
          <a
            href={mapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-dark group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-ink p-6 sm:p-8 lg:col-span-7"
          >
            <svg aria-hidden="true" className="absolute inset-0 size-full text-white/[0.06]">
              <defs>
                <pattern id="taller-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M36 0H0v36" fill="none" stroke="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#taller-grid)" />
              <path
                d="M-20 260 C 180 200, 320 320, 760 140"
                fill="none"
                stroke="currentColor"
                strokeWidth="18"
              />
              <path d="M220 -20 L 300 520" fill="none" stroke="currentColor" strokeWidth="10" />
            </svg>
            <span className="absolute top-[38%] left-[52%] inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-[0_0_0_10px_rgba(255,255,255,0.08)] transition-transform duration-500 group-hover:scale-110">
              <MapPin className="size-6" strokeWidth={1.6} />
            </span>
            <span className="relative font-display text-[1.75rem] leading-tight text-paper">
              {site.address.street}
            </span>
            <span className="relative mt-1 text-[0.9375rem] text-stone-300">Abrir en Google Maps ↗</span>
          </a>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
