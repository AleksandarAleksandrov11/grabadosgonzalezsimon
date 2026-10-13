import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/misc";
import { Checkout } from "@/components/checkout/Checkout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Finalizar pedido de prueba",
  description: "Checkout de demostración: no se realiza ningún cargo ni se envía ningún pedido real.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <>
      <section className="theme-dark grain relative bg-ink pt-[calc(var(--header-h)+2rem)] pb-10 sm:pb-12">
        <div className="relative z-[2] container-x">
          <Breadcrumbs
            items={[
              { name: "Inicio", href: "/" },
              { name: "Carrito", href: "/carrito" },
              { name: "Checkout" },
            ]}
            className="css-fade-in mb-6"
          />
          <h1 className="css-fade-up font-display text-display-m text-paper">Finalizar pedido</h1>
        </div>
      </section>
      <div
        role="note"
        className="sticky top-[var(--header-h)] z-40 border-b border-champagne/40 bg-champagne px-[var(--gutter)] py-2.5 text-center text-[0.8125rem] leading-snug font-semibold text-ink"
      >
        <span aria-hidden="true">🧪 </span>Modo demostración: no se realizará ningún cargo ni se enviará
        ningún pedido real.
      </div>
      <section className="theme-light bg-paper pt-8 pb-28 sm:pt-12">
        <div className="container-x">
          <Checkout />
        </div>
      </section>
    </>
  );
}
