import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/misc";
import { Checkout } from "@/components/checkout/Checkout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Finalizar pedido",
  description: "Finaliza tu pedido de cristalería grabada.",
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
      <section className="theme-light bg-paper pt-8 pb-28 sm:pt-12">
        <div className="container-x">
          <Checkout />
        </div>
      </section>
    </>
  );
}
