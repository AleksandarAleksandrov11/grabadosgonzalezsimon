import { Glass } from "@/components/glassware/Glass";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";

const POINTS = [
  "Regalos corporativos para clientes y equipos",
  "Cristalería de hostelería con tu marca",
  "Trofeos y premios para eventos y torneos",
  "Reconocimientos y premios a empleados",
];

/** Bloque B2B: cristalería con logos ficticios de ejemplo (no son marcas reales). */
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
              { id: "tubo" as const, logo: "cafe" as const, name: "Café Muestra" },
              { id: "copa-vino" as const, logo: "bodega" as const, name: "Bodega Ejemplo" },
              { id: "jarra-cerveza" as const, logo: "club" as const, name: "Club Deportivo Demo" },
            ].map((p, i) => (
              <StaggerItem key={p.id} variant="up" className={i === 1 ? "-mb-6" : ""}>
                <Glass
                  id={p.id}
                  tone="dark"
                  engraving={{ kind: "logo", logo: p.logo, scale: 0.86 }}
                  title={`${p.name} (logo ficticio) grabado`}
                />
                <p className="mt-1 text-center text-[0.6875rem] tracking-[0.04em] text-stone-400">{p.name}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-center text-[0.75rem] text-stone-500">Logotipos ficticios de ejemplo</p>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <SectionHeading
            eyebrow="Para empresas"
            title={
              <span id="empresas-title">
                Tu marca, <em className="font-light">grabada</em> en cada brindis
              </span>
            }
            lead="Empresas, asociaciones y negocios que quieren su logotipo o su escudo en cristal, con la calidad del trabajo artesano y precio por volumen."
          />
          <Reveal variant="up" delay={0.1}>
            <ul className="mt-8 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-stone-200">
                  <span className="mt-2.5 inline-block h-px w-5 shrink-0 bg-champagne" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/empresas" size="lg" className="mt-10" iconRight={<ArrowIcon />}>
              Pide presupuesto para tu empresa
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
