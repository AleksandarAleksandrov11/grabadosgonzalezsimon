"use client";

import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUpRight } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import { categories } from "@/data/collections";
import { occasions } from "@/data/occasions";

export function MegaMenu({
  open,
  onEnter,
  onLeave,
  onNavigate,
}: {
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onNavigate: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <m.div
          id="mega-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-ink/95 backdrop-blur-xl lg:block"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <div className="container-x grid grid-cols-12 gap-10 py-10">
            <div className="col-span-7">
              <p className="mb-5 eyebrow">Categorías</p>
              <ul className="grid grid-cols-4 gap-3">
                {categories.map((c, i) => (
                  <m.li
                    key={c.handle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.5 }}
                  >
                    <Link
                      href={`/tienda/${c.handle}`}
                      onClick={onNavigate}
                      className="group flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-transparent p-3 text-center transition-colors hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <span className="block w-16 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1">
                        <Glass id={c.illustration} tone="dark" />
                      </span>
                      <span className="text-[0.8125rem] font-medium text-stone-200 group-hover:text-paper">
                        {c.short}
                      </span>
                    </Link>
                  </m.li>
                ))}
                <m.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  <Link
                    href="/tienda"
                    onClick={onNavigate}
                    className="flex h-full flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-white/10 p-3 text-center text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-white/[0.06]"
                  >
                    <ArrowUpRight className="size-5" strokeWidth={1.4} />
                    Ver toda la tienda
                  </Link>
                </m.li>
              </ul>
            </div>
            <div className="col-span-2">
              <p className="mb-5 eyebrow">Ocasiones</p>
              <ul className="space-y-1">
                {occasions.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/ocasiones/${o.slug}`}
                      onClick={onNavigate}
                      className="inline-block link-underline py-1 text-[0.875rem] text-stone-300 hover:text-paper"
                    >
                      {o.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-3">
              <Link
                href="/personaliza"
                onClick={onNavigate}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6"
              >
                <span className="absolute -right-6 -bottom-10 w-44 opacity-90 transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-2">
                  <Glass
                    id="copa-balon"
                    tone="dark"
                    engraving={{ kind: "text", lines: [{ text: "Tu nombre", font: "script", size: 0.32 }] }}
                  />
                </span>
                <span className="relative">
                  <span className="eyebrow">Estudio de personalización</span>
                  <span className="mt-3 block max-w-[12ch] font-display text-3xl leading-[1.05] text-paper">
                    Míralo grabado <em className="font-light">antes</em> de pedirlo
                  </span>
                </span>
                <span className="relative mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-paper">
                  Abrir el estudio{" "}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
