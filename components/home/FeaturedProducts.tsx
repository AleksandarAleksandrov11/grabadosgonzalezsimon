import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowIcon } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import type { Product } from "@/lib/commerce/types";

/** Selección corta de piezas, en tres columnas amplias. */
export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="theme-light bg-paper-pure section-y" aria-labelledby="destacados-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={<span id="destacados-title">Las más pedidas</span>} size="m" />
          <Link
            href="/tienda"
            className="group/btn inline-flex items-center gap-2 self-start text-[0.9375rem] font-semibold sm:self-end"
          >
            <span className="link-underline">Ver toda la tienda</span> <ArrowIcon />
          </Link>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.handle}>
              <ProductCard product={p} priority={i < 2} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
