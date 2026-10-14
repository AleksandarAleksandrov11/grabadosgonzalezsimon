import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OrdersList } from "@/components/orders/OrdersList";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Mis pedidos",
  description: "Pedidos de prueba realizados en esta demo (guardados solo en tu navegador).",
  path: "/mis-pedidos",
  noIndex: true,
});

export default function MisPedidosPage() {
  return (
    <>
      <PageHero
        size="m"
        crumbs={[{ name: "Mis pedidos", href: "/mis-pedidos" }]}
        eyebrow="Tu cuenta (demo)"
        title="Mis pedidos"
        lead="Los pedidos de prueba que has hecho en esta demo. Se guardan solo en este navegador."
      />
      <section className="theme-light bg-paper pt-10 pb-28 sm:pt-14">
        <div className="mx-auto max-w-4xl px-[var(--gutter)]">
          <OrdersList />
        </div>
      </section>
    </>
  );
}
