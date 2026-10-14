import { Glass } from "@/components/glassware/Glass";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";

/** Bloque para empresas con tres piezas grabadas con logotipo. */
export function BusinessBlock() {
  return (
    <section
      className="theme-dark grain relative overflow-hidden bg-ink section-y"
      aria-labelledby="empresas-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_30%_60%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="relative z-[2] container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <Stagger className="grid grid-cols-3 items-end gap-2 sm:gap-6" stagger={0.15}>
            {[
              { id: "tubo" as const, logo: "cafe" as const, name: "Café Lumbre" },
              { id: "copa-vino" as const, logo: "bodega" as const, name: "Bodega Valdecruz" },
              { id: "jarra-cerveza" as const, logo: "club" as const, name: "Club Deportivo Alameda" },
            ].map((p, i) => (
              <StaggerItem key={p.id} variant="up" className={i === 1 ? "-mb-6" : ""}>
                <Glass
                  id={p.id}
                  tone="dark"
                  engraving={{ kind: "logo", logo: p.logo, scale: 0.86 }}
                  title={`${p.name} grabado en cristal`}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <SectionHeading
            title={
              <span id="empresas-title">
                Tu marca, <em className="font-light">grabada</em> en cada brindis
              </span>
            }
            lead="Tu logotipo en vasos, copas, jarras y trofeos, con precio por volumen."
          />
          <Reveal variant="up" delay={0.1}>
            <ButtonLink href="/empresas" size="lg" className="mt-10" iconRight={<ArrowIcon />}>
              Pedir presupuesto
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
