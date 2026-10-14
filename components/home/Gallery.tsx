"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Glass, type GlassTone, type StaticEngraving } from "@/components/glassware/Glass";
import { Modal } from "@/components/ui/Modal";
import { SectionHeading } from "@/components/ui/misc";
import type { GlassId } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

type Item =
  | { kind: "photo"; src: string; alt: string; caption: string; ratio: string; position?: string }
  | {
      kind: "glass";
      id: GlassId;
      tone: GlassTone;
      engraving: StaticEngraving;
      alt: string;
      caption: string;
      bg: string;
    };

const ITEMS: Item[] = [
  {
    kind: "photo",
    src: "/images/original/vasos-grabados.jpg",
    alt: "Vaso de tubo con logotipo grabado al chorro de arena en el taller",
    caption: "Trabajo real del taller · vaso de tubo con logotipo",
    ratio: "aspect-[3/4]",
    position: "object-[50%_40%]",
  },
  {
    kind: "glass",
    id: "copa-vino",
    tone: "dark",
    engraving: {
      kind: "text",
      lines: [
        { text: "A & M", font: "script", size: 0.4 },
        { text: "12 · 06 · 2026", font: "roman", size: 0.1, tracking: 0.1 },
      ],
    },
    alt: "Copa de vino con iniciales de boda",
    caption: "Vista generada · iniciales de boda",
    bg: "bg-ink",
  },
  {
    kind: "glass",
    id: "metopa",
    tone: "light",
    engraving: { kind: "logo", logo: "club", scale: 0.86 },
    alt: "Metopa de cristal con escudo deportivo de ejemplo",
    caption: "Vista generada · escudo de club (ficticio)",
    bg: "bg-[#ecebe6]",
  },
  {
    kind: "photo",
    src: "/images/original/cristaleria-grabada-sobre-mi.jpg",
    alt: "Copa de balón de cristal antes de grabar",
    caption: "Copa de balón antes de grabar",
    ratio: "aspect-[4/5]",
  },
  {
    kind: "glass",
    id: "jarra-cerveza",
    tone: "dark",
    engraving: { kind: "logo", logo: "cafe", scale: 0.8 },
    alt: "Jarra de cerveza con logotipo de cafetería de ejemplo",
    caption: "Vista generada · logotipo de hostelería (ficticio)",
    bg: "bg-ink",
  },
  {
    kind: "glass",
    id: "trofeo-llama",
    tone: "dark",
    engraving: {
      kind: "text",
      lines: [
        { text: "CAMPEONES", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
    alt: "Trofeo de cristal tipo llama con la palabra Campeones",
    caption: "Vista generada · trofeo de torneo",
    bg: "bg-ink-soft",
  },
  {
    kind: "glass",
    id: "agua",
    tone: "light",
    engraving: {
      kind: "text",
      lines: [
        { text: "Lucía", font: "script", size: 0.4 },
        { text: "1ª COMUNIÓN", font: "thin", size: 0.08, tracking: 0.2 },
      ],
    },
    alt: "Vaso de agua con nombre de comunión",
    caption: "Vista generada · comunión",
    bg: "bg-[#efece5]",
  },
  {
    kind: "glass",
    id: "jarron-boca-ancha",
    tone: "light",
    engraving: { kind: "text", lines: [{ text: "C & J", font: "script", size: 0.34 }] },
    alt: "Jarrón de boca ancha para centro de mesa con iniciales",
    caption: "Vista generada · centro de mesa de boda",
    bg: "bg-[#f3f1ec]",
  },
  {
    kind: "glass",
    id: "set-whisky",
    tone: "dark",
    engraving: {
      kind: "text",
      lines: [{ text: "R G", font: "roman", size: 0.3, weight: 600, tracking: 0.1 }],
    },
    alt: "Set de decantador y dos vasos de whisky con monograma",
    caption: "Vista generada · set de regalo con monograma",
    bg: "bg-ink",
  },
];

function Art({ item, large = false }: { item: Item; large?: boolean }) {
  if (item.kind === "photo") {
    return (
      <div className={cn("relative w-full overflow-hidden", large ? "h-[70dvh]" : item.ratio)}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={large ? "90vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"}
          className={cn(large ? "object-contain" : "object-cover", item.position)}
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        item.tone === "dark" ? "theme-dark" : "",
        item.bg,
        large ? "h-[70dvh]" : "aspect-[4/5] p-6",
      )}
    >
      <Glass
        id={item.id}
        tone={item.tone}
        engraving={item.engraving}
        title={item.alt}
        className={large ? "h-full w-auto" : ""}
      />
    </div>
  );
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const go = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + ITEMS.length) % ITEMS.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  return (
    <section
      className="theme-dark grain relative overflow-hidden bg-ink section-y"
      aria-labelledby="galeria-title"
    >
      <div className="relative z-[2] container-x">
        <SectionHeading
          eyebrow="Galería"
          title={
            <span id="galeria-title">
              Detalles que <em className="font-light">brillan</em>
            </span>
          }
          lead="Una muestra del trabajo del taller y de vistas generadas con el personalizador. Pronto, con más fotos reales de cada encargo."
        />
        <ul className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {ITEMS.map((it, i) => (
            <m.li
              key={i}
              className="break-inside-avoid"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-[var(--radius-lg)] text-left"
                aria-label={`Ampliar: ${it.caption}`}
              >
                <div className="transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.03]">
                  <Art item={it} />
                </div>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3 text-[0.8125rem] text-stone-200">
                  {it.caption}
                  <Expand className="size-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
                </span>
              </button>
            </m.li>
          ))}
        </ul>
      </div>

      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open !== null ? ITEMS[open].caption : "Galería"}
        size="xl"
        theme="dark"
      >
        {open !== null ? (
          <div className="relative px-4 pb-5">
            <AnimatePresence mode="wait">
              <m.div
                key={open}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-[var(--radius)]"
              >
                <Art item={ITEMS[open]} large />
              </m.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex tap items-center justify-center rounded-full border border-white/20 text-paper hover:bg-white/10"
                aria-label="Anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-center text-[0.875rem] text-stone-300" aria-live="polite">
                {open + 1} / {ITEMS.length} · {ITEMS[open].alt}
              </p>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex tap items-center justify-center rounded-full border border-white/20 text-paper hover:bg-white/10"
                aria-label="Siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
