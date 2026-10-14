"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

type Slide =
  | { kind: "live"; label: string }
  | { kind: "illus"; tone: "dark" | "light"; engraved: boolean; label: string }
  | { kind: "photo"; src: string; alt: string; w: number; h: number; label: string };

/**
 * Galería de la ficha: vista en vivo del personalizador, ilustración, vista con
 * grabado de ejemplo y fotos reales. Zoom al pasar el ratón (escritorio) y
 * swipe en móvil.
 */
export function ProductGallery({
  product,
  live,
  className,
}: {
  product: Product;
  live?: ReactNode;
  className?: string;
}) {
  const mf = product.metafields;
  const slides: Slide[] = [
    ...(live ? [{ kind: "live" as const, label: "Tu diseño" }] : []),
    { kind: "illus", tone: "dark", engraved: Boolean(mf.sampleEngraving), label: "Grabado" },
    { kind: "illus", tone: "light", engraved: Boolean(mf.sampleEngraving), label: "Sobre fondo claro" },
    { kind: "illus", tone: "dark", engraved: false, label: "Sin grabar" },
    // Fotos de producto: rellenar `images` en data/products.ts.
    ...product.images.map((img) => ({
      kind: "photo" as const,
      src: img.url,
      alt: img.altText,
      w: img.width,
      h: img.height,
      label: "Foto",
    })),
  ];
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const cur = slides[i];
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative overflow-hidden rounded-[var(--radius-lg)]"
        onPointerDown={(e) => {
          if (cur.kind !== "live") swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(dx < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {cur.kind === "live" ? (
              live
            ) : (
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]",
                  cur.kind === "illus" && cur.tone === "dark" ? "theme-dark bg-ink" : "bg-[#efeee9]",
                  "lg:cursor-zoom-in",
                )}
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse") return;
                  const r = e.currentTarget.getBoundingClientRect();
                  setZoom({
                    x: ((e.clientX - r.left) / r.width) * 100,
                    y: ((e.clientY - r.top) / r.height) * 100,
                  });
                }}
                onPointerLeave={() => setZoom(null)}
              >
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={
                    zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined
                  }
                >
                  {cur.kind === "illus" ? (
                    <div className="absolute inset-[4%]">
                      <Glass
                        id={mf.illustration}
                        tone={cur.tone}
                        engraving={cur.engraved ? mf.sampleEngraving : null}
                        title={`${product.title}, ${cur.label.toLowerCase()}`}
                        className="size-full"
                      />
                    </div>
                  ) : (
                    <Image
                      src={cur.src}
                      alt={cur.alt}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>
        {slides.length > 1 ? (
          <div className="gallery-arrows pointer-events-none absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={() => go(-1)}
              className="pointer-events-auto inline-flex tap items-center justify-center rounded-full bg-black/35 text-paper backdrop-blur hover:bg-black/55"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="pointer-events-auto inline-flex tap items-center justify-center rounded-full bg-black/35 text-paper backdrop-blur hover:bg-black/55"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
      <ul
        className="gallery-thumbs relative scrollbar-none flex gap-2 overflow-x-auto"
        aria-label="Imágenes del producto"
      >
        {slides.map((s, k) => (
          <li key={k} className="shrink-0">
            <button
              type="button"
              onClick={() => setI(k)}
              aria-label={`Ver: ${s.label}`}
              aria-current={k === i ? "true" : undefined}
              className={cn(
                "relative block w-16 overflow-hidden rounded-[var(--radius)] border-2 transition-colors sm:w-20",
                k === i ? "border-fg" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  "block aspect-[4/5]",
                  s.kind === "illus" && s.tone === "light" ? "bg-[#efeee9]" : "bg-ink",
                )}
              >
                {s.kind === "photo" ? (
                  <Image src={s.src} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <Glass
                    id={mf.illustration}
                    tone={s.kind === "illus" ? s.tone : "dark"}
                    engraving={s.kind === "illus" && s.engraved ? mf.sampleEngraving : null}
                    className="size-full p-1"
                  />
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
