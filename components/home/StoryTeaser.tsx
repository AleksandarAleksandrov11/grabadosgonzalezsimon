import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { site } from "@/data/site";

export function StoryTeaser() {
  const { since, pieces } = site.facts;
  return (
    <section className="theme-light overflow-hidden bg-paper section-y" aria-labelledby="historia-title">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <Parallax
            offset={50}
            className="aspect-[4/5] rounded-[var(--radius-lg)] bg-[#d9c7b0] sm:aspect-[5/6]"
            innerClassName="absolute -inset-y-[60px] inset-x-0"
          >
            <Image
              src="/images/original/hero-cristaleria-madrid.jpg"
              alt="Copa de cristal labrado sobre un mantel de lino"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[50%_65%]"
            />
          </Parallax>
        </div>
        <div className="lg:col-span-5 lg:row-start-1">
          <Reveal variant="blur">
            <h2 id="historia-title" className="font-display text-display-m tracking-[-0.015em]">
              Un taller de Madrid desde <em className="font-light">{since}</em>
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <p className="mt-8 text-lead text-fg-muted">
              Cada pieza se prepara, se protege y se graba a mano. Después se revisa a contraluz, una a una.
              Así llevamos más de {pieces} piezas grabadas.
            </p>
          </Reveal>
          <Link
            href="/sobre-nosotros"
            className="group/btn mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
          >
            <span className="link-underline">Conoce el taller</span> <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
