import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FavoritesView } from "@/components/shop/FavoritesView";
import { allProducts } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Favoritos",
  description: "Las piezas que has guardado para personalizar más tarde.",
  path: "/favoritos",
  noIndex: true,
});

export default function FavoritosPage() {
  return (
    <>
      <PageHero
        size="m"
        crumbs={[{ name: "Favoritos", href: "/favoritos" }]}
        eyebrow="Tu selección"
        title="Favoritos"
        lead="Las piezas que te han gustado, guardadas en este navegador."
      />
      <section className="theme-light bg-paper pt-10 pb-28 sm:pt-14">
        <div className="container-x">
          <FavoritesView products={allProducts()} />
        </div>
      </section>
    </>
  );
}
