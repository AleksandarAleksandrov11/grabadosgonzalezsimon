import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { HeroGlass } from "./HeroGlass";

const TITLE = "Graba tus recuerdos en piezas *únicas*";

/** Titular con revelado palabra a palabra por CSS (sin esperar a JS: el LCP es el texto). */
function HeroTitle() {
  const words = TITLE.split(" ");
  return (
    <h1 className="font-display text-display-xl font-normal tracking-[-0.025em] text-paper">
      {words.map((w, i) => {
        const italic = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <span className="word-reveal" style={{ "--i": i } as React.CSSProperties}>
              {italic ? <em className="text-[1.04em] font-light">{clean}</em> : clean}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
}

export function Hero() {
  return (
    <section
      aria-label="Presentación"
      className="theme-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[var(--header-h)]"
    >
      {/* luz ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_72%_42%,rgba(255,255,255,0.08),transparent_70%),radial-gradient(40%_40%_at_10%_90%,rgba(207,200,187,0.06),transparent_70%)]"
      />
      <div className="relative z-[2] container-x grid flex-1 grid-cols-1 content-center items-center gap-4 pt-2 pb-20 sm:gap-6 lg:grid-cols-12 lg:gap-8 lg:pt-0 lg:pb-16">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <HeroTitle />
          <p
            className="css-fade-up mt-5 max-w-[34rem] text-lead text-stone-300 sm:mt-7"
            style={{ "--d": "650ms" } as React.CSSProperties}
          >
            Vasos, copas y trofeos grabados a mano con chorro de arena en nuestro taller de Madrid.
          </p>
          <div
            className="css-fade-up mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row"
            style={{ "--d": "800ms" } as React.CSSProperties}
          >
            <ButtonLink href="/personaliza" size="lg" iconRight={<ArrowIcon />}>
              Personaliza el tuyo
            </ButtonLink>
            <ButtonLink href="/tienda" size="lg" variant="outline">
              Ver la tienda
            </ButtonLink>
          </div>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <HeroGlass />
        </div>
      </div>
    </section>
  );
}
