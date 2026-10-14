import type { Metadata } from "next";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PageHero } from "@/components/layout/PageHero";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { OccasionCard } from "@/components/occasions/OccasionCard";
import { occasions } from "@/data/occasions";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Ocasiones: bodas, comuniones, empresas y más",
  description:
    "Cristalería grabada para cada momento: bodas, comuniones, bautizos, aniversarios, jubilaciones, trofeos, empresas y hostelería. Grabado con chorro de arena en Madrid.",
  path: "/ocasiones",
});

export default function OcasionesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Ocasiones", href: "/ocasiones" }]}
        title={
          <>
            Personaliza tus momentos <em className="font-light">con elegancia</em>
          </>
        }
        lead="De una boda a la jubilación de un compañero, cada ocasión tiene su pieza."
        glass="copa-cava"
        engraving={{ kind: "text", lines: [{ text: "Siempre", font: "script", size: 0.5 }] }}
      />
      <section className="theme-light bg-paper section-y" aria-label="Todas las ocasiones">
        <div className="container-x">
          <Stagger
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            stagger={0.06}
          >
            {occasions.map((o) => (
              <StaggerItem key={o.slug} variant="up">
                <OccasionCard occasion={o} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
