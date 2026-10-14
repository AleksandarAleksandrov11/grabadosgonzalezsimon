import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { OccasionCard } from "@/components/occasions/OccasionCard";
import { ArrowIcon } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { occasionBySlug, type Occasion } from "@/data/occasions";

const SLUGS = ["bodas", "empresas", "comuniones", "aniversarios", "trofeos-y-homenajes", "regalos"];

/** Ocasiones principales en una cuadrícula tranquila de tres columnas. */
export function OccasionsBento() {
  const list = SLUGS.map(occasionBySlug).filter((o): o is Occasion => Boolean(o));
  return (
    <section className="theme-light bg-paper section-y" aria-labelledby="ocasiones-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={<span id="ocasiones-title">Para cada momento</span>} size="m" />
          <Link
            href="/ocasiones"
            className="group/btn inline-flex items-center gap-2 self-start text-[0.9375rem] font-semibold sm:self-end"
          >
            <span className="link-underline">Todas las ocasiones</span> <ArrowIcon />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
          {list.map((o, i) => (
            <Reveal key={o.slug} variant="up" delay={(i % 3) * 0.08}>
              <OccasionCard occasion={o} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
