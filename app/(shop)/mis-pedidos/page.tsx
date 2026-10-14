import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OrdersList } from "@/components/orders/OrdersList";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Mis pedidos",
  description: "Consulta tus pedidos y su seguimiento.",
  path: "/mis-pedidos",
  noIndex: true,
});

export default function MisPedidosPage() {
  return (
    <>
      <PageHero size="m" crumbs={[{ name: "Mis pedidos", href: "/mis-pedidos" }]} title="Mis pedidos" />
      <section className="theme-light bg-paper pt-10 pb-28 sm:pt-14">
        <div className="mx-auto max-w-4xl px-[var(--gutter)]">
          <OrdersList />
        </div>
      </section>
    </>
  );
}
