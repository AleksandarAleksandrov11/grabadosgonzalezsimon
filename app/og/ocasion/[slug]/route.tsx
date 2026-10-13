import { plainEmph } from "@/components/ui/Emph";
import { occasionBySlug, occasions } from "@/data/occasions";
import { ogImage } from "@/lib/og/render";

/** Imagen OG de cada ocasión (URL estable, generada en el build). */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function GET(_req: Request, ctx: RouteContext<"/og/ocasion/[slug]">) {
  const { slug } = await ctx.params;
  const o = occasionBySlug(slug);
  if (!o) return new Response("Not found", { status: 404 });
  return ogImage({
    eyebrow: `Ocasiones · ${o.title}`,
    title: plainEmph(o.heroTitle),
    subtitle: o.line,
    glass: o.illustration,
    engraving: o.sample,
  });
}
