import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/misc";
import { CountUp } from "./CountUp";

export function StoryTeaser() {
  return (
    <section className="theme-light overflow-hidden bg-paper section-y" aria-labelledby="historia-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <Parallax
            offset={50}
            className="aspect-[4/5] rounded-[var(--radius-lg)] bg-ink"
            innerClassName="absolute -inset-y-[60px] inset-x-0"
          >
            <Image
              src="/images/original/vasos-grabados.jpg"
              alt="Detalle del taller: arena de grabado y maquinaria junto a un vaso recién grabado"
              fill
              sizes="(min-width: 1024px) 80vw, 160vw"
              className="origin-[70%_100%] scale-[1.7] object-cover object-[70%_100%] grayscale"
            />
          </Parallax>
          {/* TODO: sustituir por una foto real del artesano trabajando en el taller */}
        </div>
        <div className="lg:col-span-6 lg:row-start-1">
          <Reveal variant="blur">
            <p className="mb-5 flex items-center gap-3 eyebrow">
              <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
              Nuestra historia
            </p>
            <h2 id="historia-title" className="font-display text-display-m tracking-[-0.015em]">
              Convertir un simple objeto de cristal en un <em className="font-light">recuerdo eterno</em>
            </h2>
          </Reveal>
          <Reveal variant="blur" delay={0.1}>
            <div className="mt-8 space-y-4 text-lead text-fg-muted">
              <p>
                En un taller de Madrid, entre arena fina y cristal, el tiempo va de otra manera. Cada pieza
                pide paciencia: preparar el diseño, protegerla, dejar que la arena haga su trabajo y revisarla
                a contraluz.
              </p>
              <p>
                Así nacen los vasos de una boda, la copa de un aniversario o el trofeo de un equipo. Objetos
                cotidianos que, grabados, se convierten en memoria.
              </p>
            </div>
          </Reveal>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
            <div className="flex flex-col gap-2">
              <dt className="text-[0.8125rem] text-fg-subtle">de oficio</dt>
              <dd className="order-first font-display text-[2.2rem] leading-none">
                <Placeholder className="text-[0.55em]">+[X] años</Placeholder>
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.8125rem] text-fg-subtle">piezas grabadas</dt>
              <dd className="order-first font-display text-[2.2rem] leading-none">
                <Placeholder className="text-[0.55em]">[X]</Placeholder>
              </dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="text-[0.8125rem] text-fg-subtle">hecho a mano</dt>
              <dd className="order-first font-display text-[2.2rem] leading-none tabular-nums">
                <CountUp to={100} suffix=" %" />
              </dd>
            </div>
          </dl>
          <Link
            href="/sobre-nosotros"
            className="group/btn mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
          >
            <span className="link-underline">Conoce nuestra historia</span> <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
