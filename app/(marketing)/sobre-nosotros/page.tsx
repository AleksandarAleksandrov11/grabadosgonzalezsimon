import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, UserRound } from "lucide-react";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TECHNIQUE_STEPS, TechniqueVisual } from "@/components/technique/TechniqueVisual";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Placeholder, SectionHeading } from "@/components/ui/misc";
import { fullAddress, mapsUrl, site } from "@/data/site";
import type { GlassId } from "@/lib/glass/pieces";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Sobre nosotros: grabado artesanal en cristal en Madrid",
  description:
    "Un taller de Madrid dedicado al grabado en cristal con chorro de arena: iniciales, logotipos, escudos, trofeos y frases que convierten un objeto de cristal en un recuerdo eterno.",
  path: "/sobre-nosotros",
});

// TODO: completar la historia con el cliente (año de inicio, cómo empezó, hitos reales)
const TIMELINE = [
  {
    year: "[Año]",
    title: "Los primeros grabados",
    text: "El oficio empieza con arena, paciencia y muchas pruebas sobre cristal. [Historia pendiente de contar con el cliente]",
  },
  {
    year: "[Año]",
    title: "El taller de Madrid",
    text: `El taller se instala en ${fullAddress()}, donde se graba cada pieza todavía hoy.`,
  },
  {
    year: "[Año]",
    title: "Talla del Cristal González Simón",
    text: "El taller se constituye como empresa y amplía su trabajo a empresas, hostelería, clubes y asociaciones.",
  },
  {
    year: "2026",
    title: "La tienda online (propuesta)",
    text: "Una nueva web para personalizar y encargar piezas desde casa, con vista previa del grabado. Esta demo.",
  },
];

const ENGRAVES: { title: string; text: string; glass: GlassId; engraving: StaticEngraving }[] = [
  {
    title: "Iniciales, nombres y fechas",
    text: "Para bodas, aniversarios, comuniones y regalos.",
    glass: "copa-cava",
    engraving: { kind: "text", lines: [{ text: "E & P", font: "script", size: 0.32 }] },
  },
  {
    title: "Logotipos y escudos",
    text: "De empresas, restaurantes, clubes y asociaciones.",
    glass: "jarra-cerveza",
    engraving: { kind: "logo", logo: "club", scale: 0.8 },
  },
  {
    title: "Trofeos y placas",
    text: "Para premios, homenajes y reconocimientos.",
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
    text: "Una dedicatoria, unas coordenadas, un verso.",
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

const PILLARS = [
  {
    title: "Personalización única y a medida",
    text: "Bodas, aniversarios, eventos corporativos o trofeos: cada pieza se diseña para su momento.",
  },
  {
    title: "Una amplia gama de cristal",
    text: "Vasos y copas, jarras y jarrones, metopas, placas y trofeos. Si no está en la tienda, pregúntanos.",
  },
  {
    title: "Calidad y atención al detalle",
    text: "Trato cercano, asesoramiento honesto y una revisión meticulosa de cada grabado.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Sobre nosotros", href: "/sobre-nosotros" }]}
        eyebrow="Sobre nosotros"
        title={
          <>
            Personaliza tus momentos <em className="font-light">con elegancia</em>
          </>
        }
        lead="Somos un taller de Madrid dedicado al grabado en cristal con chorro de arena. Convertimos objetos cotidianos en piezas con valor sentimental."
        aside={
          <div className="relative mx-auto -mb-6 aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[var(--radius-lg)] border border-white/10">
            <Image
              src="/images/original/vasos-grabados.jpg"
              alt="Base de un vaso recién grabado sobre el banco del taller, cubierto de arena de grabado"
              fill
              priority
              sizes="(min-width: 1024px) 740px, 200vw"
              className="origin-[50%_100%] scale-[2.3] object-cover object-[50%_100%] grayscale"
            />
          </div>
        }
      />

      <section className="theme-light bg-paper section-y" aria-labelledby="historia">
        <div className="container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Nuestra historia"
              title={
                <span id="historia">
                  Arena, cristal y <em className="font-light">paciencia</em>
                </span>
              }
            />
            <Reveal variant="blur" delay={0.1}>
              <div className="mt-8 space-y-5 text-lead text-fg-muted">
                <p>
                  En el taller, el tiempo va de otra manera. Cada pieza pide preparar el diseño, protegerla
                  con una máscara, dejar que la arena haga su trabajo y revisarla a contraluz.
                </p>
                <p>
                  Grabamos iniciales, nombres y fechas, logotipos y escudos, trofeos, placas y frases. Siempre
                  con la misma idea: que el grabado quede limpio, elegante y permanente, con la profundidad
                  adecuada y sin comprometer la integridad del cristal.
                </p>
              </div>
            </Reveal>
            <Reveal variant="fade" delay={0.2}>
              <blockquote className="mt-10 border-l border-fg pl-6 font-display text-[1.75rem] leading-snug italic">
                «Convertir un simple objeto de cristal en un recuerdo eterno.»
              </blockquote>
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="mb-8 text-[0.75rem] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
              Hitos del taller
            </h3>
            <ol className="relative space-y-10 border-l border-line-strong pl-8">
              {TIMELINE.map((t, i) => (
                <Reveal as="li" key={t.title} variant="left" delay={i * 0.08} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[2.3rem] size-3 rounded-full border border-fg bg-paper"
                  />
                  <p className="font-display text-[2rem] leading-none">
                    {t.year.startsWith("[") ? (
                      <Placeholder className="text-[0.5em]">{t.year}</Placeholder>
                    ) : (
                      t.year
                    )}
                  </p>
                  <p className="mt-3 font-semibold">{t.title}</p>
                  <p className="mt-1 text-fg-muted">
                    {t.text.includes("[") ? (
                      <>
                        {t.text.split("[")[0]}
                        <Placeholder>{`[${t.text.split("[")[1]}`}</Placeholder>
                      </>
                    ) : (
                      t.text
                    )}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        className="theme-dark grain relative overflow-hidden bg-ink section-y"
        aria-labelledby="artesano"
      >
        <div className="relative z-[2] container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            {/* TODO: foto real del artesano trabajando (pedir al cliente) */}
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-champagne/50 bg-white/[0.03] p-8 text-center">
              <UserRound className="size-12 text-champagne" strokeWidth={1} />
              <Placeholder>Foto del artesano — pendiente</Placeholder>
              <p className="max-w-[28ch] text-[0.875rem] text-stone-400">
                Aquí irá una foto real del artesano en el taller, con la cabina de chorro de arena.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              eyebrow="El artesano"
              title={
                <span id="artesano">
                  Hecho con cariño, <em className="font-light">dedicación y oficio</em>
                </span>
              }
            />
            <Reveal variant="up" delay={0.1}>
              <p className="mt-8 text-lead text-stone-300">
                Detrás de cada pieza está <Placeholder>[Nombre del artesano]</Placeholder>, con{" "}
                <Placeholder>+[X] años</Placeholder> de oficio. Trato cercano, asesoramiento sincero y una
                atención al detalle meticulosa: si algo no va a quedar bien grabado, te lo decimos antes.
              </p>
              <ul className="mt-8 space-y-3 text-stone-200">
                {[
                  "Te ayudamos a elegir pieza, tipografía y tamaño",
                  "Preparamos tu logo para el grabado",
                  "Te enviamos una prueba antes de grabar",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-2.5 inline-block h-px w-5 shrink-0 bg-champagne" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="taller">
        <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <a
              href={mapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-dark group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-ink p-6 sm:p-8"
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
              <span className="relative mt-1 text-[0.9375rem] text-stone-300">
                {site.address.city} · Abrir en Google Maps ↗
              </span>
            </a>
            {/* TODO: sustituir por fotos reales del taller */}
          </div>
          <div className="lg:col-span-5 lg:row-start-1">
            <SectionHeading
              eyebrow="El taller"
              title={
                <span id="taller">
                  Un taller en <em className="font-light">Madrid</em>
                </span>
              }
              lead={`En ${fullAddress()} grabamos y revisamos cada pieza. Si lo prefieres, puedes recoger tu pedido allí.`}
            />
            <p className="mt-6 text-[0.9375rem] text-fg-muted">
              Horario: <Placeholder>{site.hours}</Placeholder>
            </p>
            <ButtonLink href="/contacto" variant="outline" className="mt-8" iconRight={<ArrowIcon />}>
              Cómo llegar y contacto
            </ButtonLink>
          </div>
        </div>
      </section>

      <section
        className="theme-dark grain relative overflow-hidden bg-ink section-y"
        aria-labelledby="tecnica-resumen"
      >
        <div className="relative z-[2] container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="La técnica"
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
                <TechniqueVisual step={i} className="mx-auto max-w-[220px]" />
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-stone-400 italic">0{i + 1}</span>
                  <span className="font-display text-[1.6rem] text-paper">{s.title}</span>
                </p>
                <p className="mt-1 text-[0.9375rem] text-stone-300">{s.lead}.</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="grabamos">
        <div className="container-x">
          <SectionHeading
            eyebrow="Qué grabamos"
            title={
              <span id="grabamos">
                Casi todo lo que <em className="font-light">se te ocurra</em>
              </span>
            }
          />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ENGRAVES.map((e) => (
              <StaggerItem
                key={e.title}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-line"
              >
                <div className="theme-dark bg-ink px-[18%] pt-[6%]">
                  <Glass id={e.glass} tone="dark" engraving={e.engraving} />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold">{e.title}</h3>
                  <p className="mt-1 text-[0.875rem] text-fg-muted">{e.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-20 grid grid-cols-1 gap-10 border-t border-line pt-12 md:grid-cols-3">
            {PILLARS.map((p) => (
              <Reveal key={p.title} variant="up">
                <h3 className="font-display text-[1.75rem] leading-tight">{p.title}</h3>
                <p className="mt-3 text-fg-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
