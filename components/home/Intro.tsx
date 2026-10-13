import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Button";

const THINGS = [
  {
    n: "01",
    title: "Iniciales y nombres",
    text: "Monogramas de boda, nombres en caligrafía, la letra de un abuelo.",
  },
  {
    n: "02",
    title: "Logotipos y escudos",
    text: "Tu marca, el escudo del club o el emblema de la asociación, con todo su detalle.",
  },
  {
    n: "03",
    title: "Textos y fechas",
    text: "Una dedicatoria, una frase, unas coordenadas o el día que nunca quieres olvidar.",
  },
];

export function Intro() {
  return (
    <section
      className="theme-light relative overflow-hidden bg-paper section-y"
      aria-labelledby="intro-title"
    >
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {/* revelado con clip-path */}
          <Reveal variant="clip-up" duration={1.3} className="relative">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink">
              <Image
                src="/images/original/vasos-grabados.jpg"
                alt="Vaso de tubo con un logotipo grabado al chorro de arena, recién salido del taller"
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="object-cover object-[50%_35%] grayscale-[35%] transition-transform duration-[1.6s] ease-[var(--ease-out)] hover:scale-[1.03]"
              />
              <figcaption className="absolute bottom-0 left-0 m-4 rounded-full bg-black/55 px-3 py-1.5 text-[0.75rem] font-medium text-paper backdrop-blur">
                Trabajo real del taller
              </figcaption>
            </figure>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal variant="fade">
            <p className="mb-5 flex items-center gap-3 eyebrow">
              <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
              Lo que hacemos
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.05}>
            <h2 id="intro-title" className="font-display text-display-l tracking-[-0.015em] text-fg">
              Transforma tus ideas en recuerdos grabados <em className="font-light">para siempre</em>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.15}>
            <div className="mt-8 max-w-[60ch] space-y-4 text-lead text-fg-muted">
              <p>
                En Grabados González Simón trabajo el cristal con la técnica del{" "}
                <strong className="font-semibold text-fg">chorro de arena</strong>: personalizo vasos, copas,
                jarrones, metopas y trofeos para que cada pieza sea única, ya sea un regalo, un reconocimiento
                o el recuerdo de un día especial.
              </p>
              <p>
                Me adapto a lo que imaginas y te asesoro para que el grabado quede elegante y para siempre.
                Piezas únicas, creadas con dedicación y cariño.
              </p>
            </div>
          </Reveal>
          <Stagger
            className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-3"
            stagger={0.12}
          >
            {THINGS.map((t) => (
              <StaggerItem key={t.n} className="bg-paper p-6">
                <p className="font-display text-[1.1rem] text-fg-subtle italic">{t.n}</p>
                <h3 className="mt-3 text-[1.0625rem] font-semibold text-fg">{t.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{t.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal variant="fade" delay={0.2}>
            <Link
              href="/sobre-nosotros"
              className="group/btn mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
            >
              <span className="link-underline">Conoce el taller</span> <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
