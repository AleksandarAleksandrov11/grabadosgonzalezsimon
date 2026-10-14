import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ProductExperience } from "@/components/shop/ProductExperience";
import { ProductCard } from "@/components/shop/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/misc";
import { JsonLd } from "@/components/seo/JsonLd";
import { categoryByHandle } from "@/data/collections";
import { occasionByTag } from "@/data/occasions";
import { products } from "@/data/products";
import { allProducts, getProductSync } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = getProductSync(handle);
  if (!p) return {};
  return pageMetadata({
    title: p.seo.title,
    description: p.seo.description,
    path: `/producto/${p.handle}`,
    image: `/og/producto/${p.handle}`,
    noIndex: p.metafields.hidden,
  });
}

export default async function ProductPage({ params }: PageProps<"/producto/[handle]">) {
  const { handle } = await params;
  const product = getProductSync(handle);
  if (!product) notFound();
  const mf = product.metafields;
  const cat = categoryByHandle(mf.category);
  const all = allProducts();
  const set = (mf.completeTheSet ?? [])
    .map((h) => getProductSync(h))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = all
    .filter((p) => p.handle !== product.handle && !set.some((s) => s.handle === p.handle))
    .map((p) => ({
      p,
      score:
        (p.metafields.category === mf.category ? 3 : 0) +
        p.tags.filter((t) => product.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  const occasions = product.tags
    .map((t) => occasionByTag(t))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));
  const t = mf.technical;

  const crumbs = [
    { name: "Inicio", href: "/" },
    { name: "Tienda", href: "/tienda" },
    ...(cat ? [{ name: cat.short, href: `/tienda/${cat.handle}` }] : []),
    { name: product.title },
  ];

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd(
            crumbs.map((c) => ({ name: c.name, path: c.href ?? `/producto/${product.handle}` })),
          ),
        ]}
      />
      {/* banda oscura bajo el header */}
      <div className="theme-dark h-[calc(var(--header-h)+0.5rem)] bg-ink" aria-hidden="true" />
      <div className="theme-light bg-paper pt-6 pb-24">
        <div className="container-x">
          <Breadcrumbs items={crumbs} className="mb-6" />
          <ProductExperience product={product} />

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="mb-4 font-display text-display-s">Todo sobre esta pieza</h2>
              <Accordion
                multiple
                defaultOpen={["desc"]}
                items={[
                  {
                    id: "desc",
                    title: "Descripción",
                    content: <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />,
                  },
                  {
                    id: "tech",
                    title: "Detalles técnicos",
                    content: (
                      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                        <dt className="font-semibold text-fg">Material</dt>
                        <dd>{t.material}</dd>
                        <dt className="font-semibold text-fg">Medidas</dt>
                        <dd>{t.dimensions}</dd>
                        {t.capacity ? (
                          <>
                            <dt className="font-semibold text-fg">Capacidad</dt>
                            <dd>{t.capacity}</dd>
                          </>
                        ) : null}
                        <dt className="font-semibold text-fg">Zona de grabado</dt>
                        <dd>{t.engravingArea}</dd>
                        <dt className="font-semibold text-fg">Caras grabables</dt>
                        <dd>{mf.personalization.faces === 2 ? "Delantera y trasera" : "Frontal"}</dd>
                        <dt className="font-semibold text-fg">Producción</dt>
                        <dd>{t.productionTime}</dd>
                        <dt className="font-semibold text-fg">SKU</dt>
                        <dd className="tabular-nums">{product.variants[0].sku}</dd>
                      </dl>
                    ),
                  },
                  {
                    id: "care",
                    title: "Cuidados",
                    content: (
                      <>
                        <p>
                          El grabado con chorro de arena es permanente: forma parte del cristal y no se
                          despega.
                        </p>
                        <p>
                          Apto para lavavajillas. Para conservar el brillo del cristal, mejor en programas de
                          baja temperatura.
                        </p>
                        <p>
                          Evita cambios bruscos de temperatura y estropajos abrasivos sobre la zona grabada.
                        </p>
                      </>
                    ),
                  },
                  {
                    id: "ship",
                    title: "Envío y devoluciones",
                    content: (
                      <>
                        <p>
                          Envío gratis a partir de 60 €. Envío estándar 5,90 € y urgente 10,80 €. Recogida
                          gratuita en el taller de Madrid.
                        </p>
                        <p>
                          Los productos personalizados se fabrican a medida y no admiten devolución salvo
                          defecto de fabricación o rotura en el transporte.{" "}
                          <Link href="/legal/envios-y-devoluciones">Ver condiciones</Link>.
                        </p>
                      </>
                    ),
                  },
                ]}
              />
            </div>
            <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="ideal-para">
              <h2 id="ideal-para" className="mb-4 font-display text-display-s">
                Ideal para
              </h2>
              <ul className="divide-y divide-line border-y border-line">
                {occasions.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/ocasiones/${o.slug}`}
                      className="flex min-h-12 items-center justify-between gap-3 text-[0.9375rem] transition-colors hover:text-fg-muted"
                    >
                      {o.title} <ArrowUpRight className="size-4 text-fg-subtle" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <p className="font-semibold">¿Muchas unidades?</p>
                <p className="mt-1 text-[0.9375rem] text-fg-muted">
                  Preparamos presupuesto con precio por volumen.
                </p>
                <Link
                  href={`/empresas?producto=${product.handle}#presupuesto`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold underline underline-offset-4"
                >
                  Pedir presupuesto <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </aside>
          </div>

          <section className="mt-24" aria-labelledby="rel-title">
            <h2 id="rel-title" className="font-display text-display-s">
              También te puede gustar
            </h2>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
              {[...set, ...related].slice(0, 3).map((p) => (
                <li key={p.handle} className="relative">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
