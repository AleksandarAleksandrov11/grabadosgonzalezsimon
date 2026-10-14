"use client";

import { useId, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ProductCard } from "@/components/shop/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { DemoPriceNote, SectionHeading } from "@/components/ui/misc";
import type { Product } from "@/lib/commerce/types";

type TabKey = "best" | "boda" | "empresa" | "regalo";

const TABS: { value: TabKey; label: string }[] = [
  { value: "best", label: "Más vendidos" },
  { value: "boda", label: "Bodas" },
  { value: "empresa", label: "Empresas" },
  { value: "regalo", label: "Regalos" },
];

export function FeaturedProducts({ lists }: { lists: Record<TabKey, Product[]> }) {
  const [tab, setTab] = useState<TabKey>("best");
  const base = useId();
  return (
    <section className="theme-light bg-paper section-y" aria-labelledby={`${base}-t`}>
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="La tienda"
            title={
              <span id={`${base}-t`}>
                Piezas para grabar, <em className="font-light">listas para ti</em>
              </span>
            }
          />
          <div className="flex flex-col gap-4 lg:items-end">
            <Tabs
              tabs={TABS}
              value={tab}
              onChange={setTab}
              label="Filtrar productos destacados"
              idBase={base}
            />
            <DemoPriceNote />
          </div>
        </div>
        <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${tab}`} className="mt-12">
          <m.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {lists[tab].map((p, i) => (
                <m.li
                  key={p.handle}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                  className="relative"
                >
                  <ProductCard product={p} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        </div>
        <div className="mt-14 flex justify-center">
          <ButtonLink href="/tienda" variant="outline" size="lg" iconRight={<ArrowIcon />}>
            Ver toda la tienda
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
