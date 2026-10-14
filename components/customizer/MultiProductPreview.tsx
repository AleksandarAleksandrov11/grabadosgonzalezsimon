"use client";

import * as m from "motion/react-m";
import { MiniStage } from "./MiniStage";
import type { Product } from "@/lib/commerce/types";
import { useCustomizer } from "@/lib/engrave/store";
import { cn, formatPrice } from "@/lib/utils";

/** Productos que se muestran en «Ver en todos los productos». */
export const MULTI_HANDLES = [
  "vaso-whisky-tallado",
  "copa-vino-tinto-grabada",
  "copa-cava-flauta-grabada",
  "jarra-cerveza-asa",
  "jarron-cilindrico-grabado",
  "metopa-cristal-peana",
  "trofeo-cristal-llama",
  "vaso-tubo-grabado",
];

/**
 * El mismo diseño aplicado a la vez a 8 piezas. Es el momento clave de la demo:
 * el cliente ve su logo o su texto en toda la gama en un segundo.
 */
export function MultiProductPreview({
  products,
  onChoose,
}: {
  products: Product[];
  onChoose: (p: Product) => void;
}) {
  const { design, productHandle } = useCustomizer();
  const list = MULTI_HANDLES.map((h) => products.find((p) => p.handle === h)).filter((p): p is Product =>
    Boolean(p),
  );
  return (
    <div className="px-4 pb-6 sm:px-6">
      <m.ul
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
      >
        {list.map((p) => {
          const active = p.handle === productHandle;
          return (
            <m.li
              key={p.handle}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              className={cn(
                "theme-dark group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-ink",
                active ? "border-champagne" : "border-white/10",
              )}
            >
              <div className="relative bg-[radial-gradient(70%_60%_at_50%_40%,rgba(255,255,255,0.08),transparent_70%)] px-[6%] pt-[6%]">
                <MiniStage glass={p.metafields.personalization.engraveOn} design={design} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                <p className="text-[0.875rem] leading-snug font-semibold text-paper">{p.title}</p>
                <p className="text-[0.8125rem] text-stone-400">
                  desde{" "}
                  <span className="font-semibold text-paper">
                    {formatPrice(p.priceRange.minVariantPrice.amount)}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => onChoose(p)}
                  className="mt-auto inline-flex min-h-10 items-center justify-center rounded-[var(--radius)] bg-paper text-[0.8125rem] font-semibold text-ink transition-colors hover:bg-white"
                >
                  Elegir este
                </button>
              </div>
            </m.li>
          );
        })}
      </m.ul>
    </div>
  );
}
