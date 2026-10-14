import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";

const LINKS = [
  { href: "/legal/aviso-legal", label: "Aviso legal" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/envios-y-devoluciones", label: "Envíos y devoluciones" },
];

/** Plantilla de las páginas legales: cabecera, aviso de revisión y texto con estilos de lectura. */
export function LegalPage({
  title,
  path,
  lead,
  updated = "octubre de 2026",
  children,
}: {
  title: string;
  path: string;
  lead?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero size="m" crumbs={[{ name: title, href: path }]} title={title} lead={lead} />
      <section className="theme-light bg-paper pt-12 pb-28 sm:pt-16">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-3">
            <nav aria-label="Páginas legales">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={l.href === path ? "page" : undefined}
                      className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-[0.875rem] transition-colors hover:border-fg aria-[current=page]:border-fg aria-[current=page]:bg-fg aria-[current=page]:text-bg lg:w-full lg:rounded-[var(--radius)] lg:border-transparent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <article className="legal-prose lg:col-span-8 lg:col-start-5">
            {children}
            <p className="text-[0.8125rem] text-fg-subtle">Última actualización: {updated}.</p>
          </article>
        </div>
      </section>
    </>
  );
}
