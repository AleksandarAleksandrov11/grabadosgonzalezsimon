import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/misc";
import type { GlassId } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

type Card = {
  slug: string;
  title: string;
  line: string;
  glass: GlassId;
  engraving: StaticEngraving;
  span: string;
};

const CARDS: Card[] = [
  {
    slug: "bodas",
    title: "Bodas",
    line: "Vuestras iniciales en el primer brindis.",
    glass: "pack-brindis",
    engraving: {
      kind: "text",
      lines: [
        { text: "A & M", font: "script", size: 0.26 },
        { text: "12·06·26", font: "roman", size: 0.07, tracking: 0.1 },
      ],
    },
    span: "md:col-span-2 md:row-span-2",
  },
  {
    slug: "comuniones",
    title: "Comuniones y bautizos",
    line: "Su nombre y su gran día.",
    glass: "agua",
    engraving: {
      kind: "text",
      lines: [
        { text: "Lucía", font: "script", size: 0.38 },
        { text: "1ª COMUNIÓN", font: "thin", size: 0.08, tracking: 0.2 },
      ],
    },
    span: "",
  },
  {
    slug: "aniversarios",
    title: "Aniversarios",
    line: "Los años juntos, en un brindis.",
    glass: "jarron-cilindrico",
    engraving: {
      kind: "text",
      lines: [
        { text: "25", font: "classic", size: 0.24, weight: 500 },
        { text: "años", font: "script", size: 0.16 },
      ],
    },
    span: "",
  },
  {
    slug: "empresas",
    title: "Empresas y logotipos",
    line: "Tu marca, grabada con detalle.",
    glass: "metopa",
    engraving: { kind: "logo", logo: "club", scale: 0.86 },
    span: "md:row-span-2",
  },
  {
    slug: "hosteleria",
    title: "Hostelería",
    line: "Tu logo en cada servicio.",
    glass: "tubo",
    engraving: { kind: "logo", logo: "cafe", scale: 0.88 },
    span: "",
  },
  {
    slug: "trofeos-y-homenajes",
    title: "Trofeos y homenajes",
    line: "Para los que se lo han ganado.",
    glass: "trofeo-llama",
    engraving: {
      kind: "text",
      lines: [
        { text: "CAMPEONES", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
    span: "",
  },
  {
    slug: "jubilaciones",
    title: "Jubilaciones",
    line: "Toda una vida, en cristal.",
    glass: "trofeo-obelisco",
    engraving: {
      kind: "text",
      lines: [
        { text: "Feliz", font: "script", size: 0.14 },
        { text: "jubilación", font: "script", size: 0.14 },
      ],
    },
    span: "",
  },
  {
    slug: "regalos",
    title: "Regalos",
    line: "El regalo que no se repite.",
    glass: "whisky-tallado",
    engraving: {
      kind: "text",
      lines: [{ text: "J · M", font: "roman", size: 0.36, weight: 600, tracking: 0.08 }],
    },
    span: "col-span-2 md:col-span-1",
  },
];

/** Bento editorial de ocasiones. Al pasar el ratón, el grabado «aparece» sobre el cristal. */
export function OccasionsBento() {
  return (
    <section className="theme-light bg-paper-pure section-y" aria-labelledby="ocasiones-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Ocasiones"
            title={
              <span id="ocasiones-title">
                Para cada momento, <em className="font-light">un grabado</em>
              </span>
            }
            lead="Personaliza tus momentos con elegancia: de una boda a la jubilación de un compañero, cada ocasión tiene su pieza."
          />
          <Link
            href="/ocasiones"
            className="group/btn inline-flex items-center gap-2 self-start text-[0.9375rem] font-semibold lg:self-end"
          >
            <span className="link-underline">Todas las ocasiones</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <Stagger
          className="mt-12 grid grid-flow-dense auto-rows-[minmax(220px,auto)] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[270px] md:grid-cols-4"
          stagger={0.07}
        >
          {CARDS.map((c, i) => (
            <StaggerItem
              key={c.slug}
              variant="scale"
              className={cn("relative", c.span, i === 0 && "col-span-2")}
            >
              <Link
                href={`/ocasiones/${c.slug}`}
                className="theme-dark group/occ relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-ink p-5 text-fg sm:p-6"
                data-cursor="grow"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(60%_60%_at_60%_35%,rgba(255,255,255,0.08),transparent_70%)]"
                />
                <div
                  className={cn(
                    "pointer-events-none absolute transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover/occ:scale-[1.06]",
                    i === 0
                      ? "inset-y-[4%] right-[2%] w-[58%] md:inset-y-[6%] md:right-[4%] md:w-[55%]"
                      : "top-[3%] right-[-6%] bottom-[16%] w-[62%]",
                  )}
                >
                  <Glass
                    id={c.glass}
                    tone="dark"
                    engraving={c.engraving}
                    engravingClassName="transition-opacity duration-700 [@media(hover:hover)]:opacity-30 [@media(hover:hover)]:group-hover/occ:opacity-100 [@media(hover:hover)]:group-focus-visible/occ:opacity-100"
                    className="h-full w-full"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent"
                />
                <div className="relative max-w-[92%] sm:max-w-[75%]">
                  <h3
                    className={cn(
                      "font-display leading-[1.02] text-paper",
                      i === 0
                        ? "text-[clamp(2.2rem,1.6rem+2.4vw,3.6rem)]"
                        : "text-[clamp(1.3rem,1.05rem+1vw,2rem)]",
                    )}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] text-stone-300 sm:text-[0.875rem]">{c.line}</p>
                </div>
                <span className="absolute top-4 left-4 inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-paper transition-[background-color,transform] duration-500 group-hover/occ:rotate-45 group-hover/occ:bg-white/10">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
