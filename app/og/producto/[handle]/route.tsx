import { allProducts, getProductSync } from "@/lib/commerce/local-provider";
import { ogImage } from "@/lib/og/render";
import { formatPrice } from "@/lib/utils";

/**
 * Imagen OG de producto con URL estable (/og/producto/[handle]) para poder
 * usarla también en el JSON-LD de Product. Se genera en el build.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts(true).map((p) => ({ handle: p.handle }));
}

export async function GET(_req: Request, ctx: RouteContext<"/og/producto/[handle]">) {
  const { handle } = await ctx.params;
  const p = getProductSync(handle);
  if (!p) return new Response("Not found", { status: 404 });
  return ogImage({
    eyebrow: "Personalízalo",
    title: p.title,
    subtitle: p.metafields.tagline,
    foot: `Desde ${formatPrice(p.priceRange.minVariantPrice.amount)}`,
    glass: p.metafields.illustration,
    engraving: p.metafields.sampleEngraving,
  });
}
