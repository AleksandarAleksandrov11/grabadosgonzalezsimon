import type { Metadata } from "next";
import { OrderView } from "@/components/orders/OrderView";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(props: PageProps<"/pedido/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  return pageMetadata({
    title: `Pedido ${decodeURIComponent(id)}`,
    description: "Confirmación de tu pedido.",
    path: `/pedido/${id}`,
    noIndex: true,
  });
}

export default async function PedidoPage(props: PageProps<"/pedido/[id]">) {
  const { id } = await props.params;
  return <OrderView id={decodeURIComponent(id).toUpperCase()} />;
}
