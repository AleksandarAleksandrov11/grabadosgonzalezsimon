import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CartPage } from "@/components/cart/CartPage";
import { forCard, giftBoxLite } from "@/lib/commerce/catalog-lite";
import { allProducts } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Tu carrito",
  description: "Revisa las piezas y los grabados de tu pedido antes de tramitarlo.",
  path: "/carrito",
  noIndex: true,
});

export default function CarritoPage() {
  return (
    <>
      <PageHero size="m" crumbs={[{ name: "Carrito", href: "/carrito" }]} title="Tu carrito" />
      <section className="theme-light bg-paper pt-10 pb-28 sm:pt-14">
        <div className="container-x">
          <CartPage giftBox={giftBoxLite()} pool={allProducts().map(forCard)} />
        </div>
      </section>
    </>
  );
}
