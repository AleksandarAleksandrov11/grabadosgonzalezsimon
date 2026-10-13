import type { ReactNode } from "react";
import { Glass, type StaticEngraving } from "@/components/glassware/Glass";
import { Breadcrumbs } from "@/components/ui/misc";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import type { GlassId } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

/** Cabecera oscura común de las páginas interiores (con migas y JSON-LD de breadcrumbs). */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  glass,
  engraving,
  children,
  size = "l",
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: { name: string; href?: string }[];
  glass?: GlassId;
  engraving?: StaticEngraving;
  children?: ReactNode;
  size?: "l" | "m";
  aside?: ReactNode;
}) {
  return (
    <section className="theme-dark grain relative overflow-hidden bg-ink pt-[calc(var(--header-h)+2.5rem)] pb-14 sm:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_70%_at_80%_40%,rgba(255,255,255,0.07),transparent_70%)]" />
      {crumbs ? (
        <JsonLd data={breadcrumbJsonLd([{ name: "Inicio", path: "/" }, ...crumbs.map((c) => ({ name: c.name, path: c.href ?? "" }))].filter((c) => c.path))} />
      ) : null}
      <div className="container-x relative z-[2] grid items-end gap-10 lg:grid-cols-12">
        <div className={cn(glass || aside ? "lg:col-span-8" : "lg:col-span-10")}>
          {crumbs ? <Breadcrumbs items={[{ name: "Inicio", href: "/" }, ...crumbs]} className="css-fade-in mb-8" /> : null}
          {eyebrow ? (
            <p className="css-fade-up eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "css-fade-up max-w-[20ch] font-display tracking-[-0.02em] text-paper",
              size === "l" ? "text-display-l" : "text-display-m",
            )}
            style={{ "--d": "80ms" } as React.CSSProperties}
          >
            {title}
          </h1>
          {lead ? (
            <div className="css-fade-up text-lead mt-6 max-w-[58ch] text-stone-300" style={{ "--d": "180ms" } as React.CSSProperties}>
              {lead}
            </div>
          ) : null}
          {children ? (
            <div className="css-fade-up mt-8" style={{ "--d": "260ms" } as React.CSSProperties}>
              {children}
            </div>
          ) : null}
        </div>
        {glass ? (
          <div className="css-fade-in hidden lg:col-span-4 lg:block" style={{ "--d": "200ms" } as React.CSSProperties}>
            <div className="mx-auto -mb-10 w-full max-w-[300px]">
              <Glass id={glass} tone="dark" engraving={engraving} />
            </div>
          </div>
        ) : aside ? (
          <div className="lg:col-span-4">{aside}</div>
        ) : null}
      </div>
    </section>
  );
}
