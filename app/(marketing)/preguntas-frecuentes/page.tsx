import type { Metadata } from "next";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { FinalCTA } from "@/components/home/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQ_GROUPS, faqs } from "@/data/faqs";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Plazos, formatos de logo, cuidados del cristal grabado, envíos, pedidos para empresas y todo lo que necesitas saber antes de encargar tu grabado.",
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        size="m"
        crumbs={[{ name: "Preguntas frecuentes", href: "/preguntas-frecuentes" }]}
        title={
          <>
            Preguntas <em className="font-light">frecuentes</em>
          </>
        }
        lead="Pedidos, personalización, técnica y envíos."
      />
      <section className="theme-light bg-paper section-y">
        <div className="container-x">
          <FaqExplorer faqs={faqs} groups={FAQ_GROUPS} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
