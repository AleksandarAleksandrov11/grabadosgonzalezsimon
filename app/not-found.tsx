import type { Metadata } from "next";
import Link from "next/link";
import { Glass } from "@/components/glassware/Glass";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/tienda", label: "Tienda" },
  { href: "/personaliza", label: "Personaliza" },
  { href: "/ocasiones", label: "Ocasiones" },
  { href: "/empresas", label: "Empresas" },
  { href: "/contacto", label: "Contacto" },
];

export default function NotFound() {
  return (
    <section className="theme-dark grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-[calc(var(--header-h)+2rem)] pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_70%_50%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="relative z-[2] container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="css-fade-up eyebrow">Error 404</p>
          <h1
            className="css-fade-up mt-5 max-w-[16ch] font-display text-display-l text-paper"
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            Esta página se ha quedado <em className="font-light">sin grabar</em>
          </h1>
          <p
            className="css-fade-up mt-6 max-w-[48ch] text-lead text-stone-300"
            style={{ "--d": "160ms" } as React.CSSProperties}
          >
            Puede que el enlace haya cambiado o que nunca existiera. Lo que sí existe es una pieza esperando
            tu grabado.
          </p>
          <div
            className="css-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <ButtonLink href="/" size="lg">
              Volver al inicio
            </ButtonLink>
            <ButtonLink
              href="/personaliza"
              variant="outline"
              size="lg"
              iconRight={<ArrowIcon />}
              className="border-white/30 text-paper hover:border-paper hover:bg-white/5"
            >
              Grabar la mía
            </ButtonLink>
          </div>
          <nav aria-label="Páginas principales" className="mt-12">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-stone-300">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-underline hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div
          className="css-fade-in lg:col-span-4 lg:col-start-9"
          style={{ "--d": "200ms" } as React.CSSProperties}
        >
          <div className="mx-auto w-full max-w-[300px]">
            <Glass id="copa-vino" tone="dark" showZone title="Copa de vino sin grabar" />
          </div>
        </div>
      </div>
    </section>
  );
}
