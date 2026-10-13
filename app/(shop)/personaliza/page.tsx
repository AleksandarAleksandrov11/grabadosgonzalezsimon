import type { Metadata } from "next";
import { StudioLoader } from "@/components/customizer/StudioLoader";
import { allProducts } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Personaliza tu cristal: sube tu logo o escribe tu texto",
  description:
    "Estudio de personalización online: escribe un nombre o sube tu logo y míralo grabado al momento en vasos, copas, jarras y trofeos. Grabado en cristal con chorro de arena en Madrid.",
  path: "/personaliza",
});

export default function PersonalizePage() {
  const products = allProducts().filter((p) => p.metafields.personalization.types.length > 0);
  return (
    <>
      <section className="theme-dark grain relative overflow-hidden bg-ink pt-[calc(var(--header-h)+1.5rem)] pb-8 sm:pb-10">
        <div className="relative z-[2] container-x flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="css-fade-up mb-3 eyebrow">Estudio de personalización</p>
            <h1
              className="css-fade-up font-display text-display-m tracking-[-0.02em] text-paper"
              style={{ "--d": "80ms" } as React.CSSProperties}
            >
              Diséñalo y míralo <em className="font-light">grabado</em>
            </h1>
          </div>
          <p
            className="css-fade-up max-w-md text-[0.9375rem] text-stone-300"
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Sube tu logo o escribe tu texto. Todo ocurre en tu navegador: no subimos nada a ningún servidor.
          </p>
        </div>
      </section>
      <section className="theme-light bg-paper pt-6 pb-24 lg:pt-10">
        <div className="container-x">
          <StudioLoader products={products} />
        </div>
      </section>
    </>
  );
}
