"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronDown, Phone, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import { WhatsAppIcon } from "@/components/icons";
import { categories } from "@/data/collections";
import { occasions } from "@/data/occasions";
import { site, whatsappLink } from "@/data/site";
import { useFocusTrap, useMounted, useScrollLock } from "@/lib/hooks";
import { useUI } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Personaliza", href: "/personaliza" },
  { label: "Empresas", href: "/empresas" },
  { label: "Ocasiones", href: "/ocasiones" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "La técnica", href: "/tecnica" },
  { label: "Contacto", href: "/contacto" },
];

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useUI();
  const mounted = useMounted();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  useFocusTrap(ref, menuOpen, () => setMenuOpen(false));
  useScrollLock(menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  if (!mounted) return null;
  const item = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return createPortal(
    <AnimatePresence>
      {menuOpen ? (
        <m.div
          id="mobile-menu"
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          data-lenis-prevent
          data-floating
          className="theme-dark grain fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-ink text-fg lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between pt-[env(safe-area-inset-top)]">
            <Link href="/" className="text-paper" aria-label="Inicio">
              <Logo size="sm" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-mr-2 inline-flex tap items-center justify-center rounded-full text-paper"
              aria-label="Cerrar menú"
            >
              <X className="size-6" strokeWidth={1.3} />
            </button>
          </div>

          <m.nav
            aria-label="Menú móvil"
            className="relative z-[2] container-x flex flex-1 flex-col py-6"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
          >
            <m.div variants={item} className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setShopOpen((v) => !v)}
                aria-expanded={shopOpen}
                className="flex w-full items-center justify-between py-4 font-display text-[2.5rem] leading-none text-paper"
              >
                Tienda
                <ChevronDown
                  className={cn("size-6 transition-transform duration-500", shopOpen && "rotate-180")}
                  strokeWidth={1.2}
                />
              </button>
              <AnimatePresence initial={false}>
                {shopOpen ? (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 pb-5">
                      <li>
                        <Link
                          href="/tienda"
                          className="inline-flex min-h-11 items-center text-[1rem] font-semibold text-paper"
                        >
                          Ver todo
                        </Link>
                      </li>
                      {categories.map((c) => (
                        <li key={c.handle}>
                          <Link
                            href={`/tienda/${c.handle}`}
                            className="inline-flex min-h-11 items-center text-[1rem] text-stone-300"
                          >
                            {c.short}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="pb-2 eyebrow">Ocasiones</p>
                    <ul className="flex flex-wrap gap-2 pb-6">
                      {occasions.map((o) => (
                        <li key={o.slug}>
                          <Link
                            href={`/ocasiones/${o.slug}`}
                            className="inline-flex min-h-10 items-center rounded-full border border-white/15 px-3.5 text-[0.875rem] text-stone-200"
                          >
                            {o.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </m.div>
            {LINKS.map((l) => (
              <m.div key={l.href} variants={item} className="border-b border-white/10">
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="flex items-center py-4 font-display text-[2.5rem] leading-none text-paper"
                >
                  {l.label}
                </Link>
              </m.div>
            ))}

            <m.div variants={item} className="mt-auto grid grid-cols-2 gap-3 pt-10 safe-bottom">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius)] bg-paper text-[0.9375rem] font-semibold text-ink"
              >
                <WhatsAppIcon /> WhatsApp
              </a>
              <a
                href={site.phones.mobile.href}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius)] border border-white/25 text-[0.9375rem] font-semibold text-paper"
              >
                <Phone className="size-4" /> Llamar
              </a>
              <p className="col-span-2 pt-2 text-center text-[0.8125rem] text-stone-400">
                {site.email} · {site.phones.mobile.display}
              </p>
            </m.div>
          </m.nav>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
