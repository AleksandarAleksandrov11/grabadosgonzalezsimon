import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Catalog, StaticGrid } from "@/components/shop/Catalog";
import { categories, categoryByHandle } from "@/data/collections";
import { filterProducts } from "@/lib/commerce/filter";
import { forCard } from "@/lib/commerce/catalog-lite";
import { allProducts } from "@/lib/commerce/local-provider";
import type { CategoryHandle } from "@/lib/commerce/types";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/tienda/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const c = categoryByHandle(categoria);
  if (!c) return {};
  return pageMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/tienda/${c.handle}` });
}

export default async function CategoryPage({ params }: PageProps<"/tienda/[categoria]">) {
  const { categoria } = await params;
  const c = categoryByHandle(categoria);
  if (!c) notFound();
  const all = allProducts().map(forCard);
  const inCat = filterProducts(all, { category: c.handle as CategoryHandle });
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Tienda", href: "/tienda" },
          { name: c.short, href: `/tienda/${c.handle}` },
        ]}
        title={c.title}
        lead={c.description}
        glass={c.illustration}
        engraving={c.sample}
      >
        <nav aria-label="Categorías">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href="/tienda"
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-[0.875rem] text-stone-200 hover:border-paper hover:text-paper"
              >
                Todas
              </Link>
            </li>
            {categories.map((k) => (
              <li key={k.handle}>
                <Link
                  href={`/tienda/${k.handle}`}
                  aria-current={k.handle === c.handle ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full border px-4 text-[0.875rem] transition-colors",
                    k.handle === c.handle
                      ? "border-paper bg-paper text-ink"
                      : "border-white/20 text-stone-200 hover:border-paper hover:text-paper",
                  )}
                >
                  {k.short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <section className="theme-light bg-paper pb-28">
        <div className="container-x">
          <Suspense fallback={<StaticGrid products={inCat} />}>
            <Catalog products={all} fixedCategory={c.handle as CategoryHandle} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
