import type { Metadata } from "next";
import { forCard } from "@/lib/commerce/catalog-lite";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Catalog, StaticGrid } from "@/components/shop/Catalog";
import { categories } from "@/data/collections";
import { allProducts } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Tienda de cristalería grabada personalizada",
  description:
    "Vasos, copas, jarras, jarrones, metopas y trofeos grabados con chorro de arena en Madrid. Filtra por ocasión y personaliza con tu texto o tu logo.",
  path: "/tienda",
});

export default function ShopPage() {
  const products = allProducts().map(forCard);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Tienda", href: "/tienda" }]}
        eyebrow="La tienda"
        title={
          <>
            Cristalería grabada, <em className="font-light">a tu medida</em>
          </>
        }
        lead="Elige la pieza, personalízala con tu texto o tu logo y la grabamos a mano en el taller de Madrid."
        glass="copa-balon"
        engraving={{ kind: "text", lines: [{ text: "Salud", font: "script", size: 0.42 }] }}
      >
        <nav aria-label="Categorías">
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/tienda/${c.handle}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-[0.875rem] text-stone-200 transition-colors hover:border-paper hover:text-paper"
                >
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <section className="theme-light bg-paper pb-28">
        <div className="container-x">
          <Suspense fallback={<StaticGrid products={products} />}>
            <Catalog products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
