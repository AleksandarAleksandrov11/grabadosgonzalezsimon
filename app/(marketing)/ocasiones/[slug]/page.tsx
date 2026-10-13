import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { OccasionCard } from "@/components/occasions/OccasionCard";
import { OccasionEngraver } from "@/components/occasions/OccasionEngraver";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/shop/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Emph } from "@/components/ui/Emph";
import { DemoPriceNote, SectionHeading } from "@/components/ui/misc";
import { occasionBySlug, occasions } from "@/data/occasions";
import { allProducts, filterProducts } from "@/lib/commerce/local-provider";
import { designToQuery } from "@/lib/engrave/share";
import { templateById } from "@/lib/engrave/templates";
import { DEFAULT_DESIGN } from "@/lib/engrave/types";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata(props: PageProps<"/ocasiones/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const o = occasionBySlug(slug);
  if (!o) return {};
  return pageMetadata({
    title: o.seoTitle,
    description: o.seoDescription,
    path: `/ocasiones/${o.slug}`,
    image: `/og/ocasion/${o.slug}`,
  });
}

export default async function OcasionPage(props: PageProps<"/ocasiones/[slug]">) {
  const { slug } = await props.params;
  const o = occasionBySlug(slug);
  if (!o) notFound();

  const products = filterProducts(allProducts(), { occasions: [o.tag] });
  const glass = products[0]?.metafields.personalization.engraveOn ?? "copa-vino";
  const preset = templateById(o.template)?.preset ?? {};
  const studioHref = `/personaliza?${designToQuery({ ...DEFAULT_DESIGN, ...preset }, glass)}`;
  const others = occasions.filter((x) => x.slug !== o.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={faqJsonLd(o.faqs)} />
      <PageHero
        crumbs={[
          { name: "Ocasiones", href: "/ocasiones" },
          { name: o.title, href: `/ocasiones/${o.slug}` },
        ]}
        eyebrow={o.title}
        title={<Emph text={o.heroTitle} />}
        lead={o.heroLead}
        glass={o.illustration}
        engraving={o.sample}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#productos" size="lg">
            Ver piezas para {o.title.toLowerCase()}
          </ButtonLink>
          <ButtonLink
            href={studioHref}
            variant="outline"
            size="lg"
            className="border-white/30 text-paper hover:border-paper hover:bg-white/5"
          >
            Diseñar la mía
          </ButtonLink>
        </div>
      </PageHero>

      <section className="theme-light bg-paper section-y" aria-labelledby="por-que">
        <div className="container-x">
          <SectionHeading
            eyebrow="Por qué grabarlo"
            title={
              <span id="por-que">
                Un detalle que <em className="font-light">se queda</em>
              </span>
            }
            size="m"
          />
          <Stagger className="mt-12 grid grid-cols-1 gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-12">
            {o.why.map((w, i) => (
              <StaggerItem key={w.title}>
                <p className="font-display text-xl text-fg-subtle italic">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[1.75rem] leading-tight">{w.title}</h3>
                <p className="mt-3 text-fg-muted">{w.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="productos"
        className="theme-light scroll-mt-24 bg-paper-pure section-y"
        aria-labelledby="productos-title"
      >
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Piezas recomendadas"
              title={<span id="productos-title">Para {o.title.toLowerCase()}</span>}
              size="m"
            />
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <DemoPriceNote />
              <Link
                href={`/tienda?ocasion=${o.tag}`}
                className="group/btn inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
              >
                <span className="link-underline">Ver en la tienda con filtros</span> <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="theme-dark grain relative overflow-hidden bg-ink section-y"
        aria-label={o.ideasTitle}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_75%_50%,rgba(255,255,255,0.07),transparent_70%)]"
        />
        <div className="relative z-[2] container-x">
          <OccasionEngraver template={o.template} glass={glass} ideas={o.ideas} ideasTitle={o.ideasTitle} />
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="faq-ocasion">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Preguntas frecuentes"
              title={<span id="faq-ocasion">Dudas sobre {o.title.toLowerCase()}</span>}
              size="s"
            />
            <Link
              href="/preguntas-frecuentes"
              className="group/btn mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
            >
              <span className="link-underline">Todas las preguntas</span> <ArrowIcon />
            </Link>
          </div>
          <Reveal variant="fade" className="lg:col-span-8">
            <Accordion
              size="lg"
              items={o.faqs.map((f, i) => ({ id: `f${i}`, title: f.q, content: <p>{f.a}</p> }))}
              defaultOpen={["f0"]}
            />
          </Reveal>
        </div>
      </section>

      <section className="theme-light border-t border-line bg-paper section-y" aria-labelledby="otras">
        <div className="container-x">
          <SectionHeading
            eyebrow="Más ocasiones"
            title={<span id="otras">Otros momentos para grabar</span>}
            size="s"
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {others.map((x) => (
              <OccasionCard key={x.slug} occasion={x} />
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
