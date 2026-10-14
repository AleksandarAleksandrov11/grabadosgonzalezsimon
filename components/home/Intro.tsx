import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Button";

const THINGS = ["Iniciales y nombres", "Logotipos y escudos", "Fechas y dedicatorias"];

export function Intro() {
  return (
    <section
      className="theme-light relative overflow-hidden bg-paper section-y"
      aria-labelledby="intro-title"
    >
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <Reveal variant="clip-up" duration={1.3} className="relative">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink">
              <Image
                src="/images/original/vasos-grabados.jpg"
                alt="Vaso de tubo con un logotipo grabado al chorro de arena, recién salido del taller"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_35%] grayscale-[35%] transition-transform duration-[1.6s] ease-[var(--ease-out)] hover:scale-[1.03]"
              />
            </figure>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal variant="up">
            <h2 id="intro-title" className="font-display text-display-l tracking-[-0.015em] text-fg">
              Ideas que se quedan <em className="font-light">para siempre</em>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="mt-8 max-w-[46ch] text-lead text-fg-muted">
              Grabamos el cristal con chorro de arena: un acabado blanco y mate que forma parte de la pieza y
              no se borra con el tiempo.
            </p>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {THINGS.map((t) => (
                <li key={t} className="py-4 font-display text-[1.5rem] leading-tight">
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href="/tecnica"
              className="group/btn mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
            >
              <span className="link-underline">Cómo grabamos</span> <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
