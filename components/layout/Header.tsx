"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { MegaMenu } from "./MegaMenu";
import { mainNav } from "@/data/navigation";
import { useCart } from "@/lib/store/cart";
import { useFavorites } from "@/lib/store/favorites";
import { useHydrated } from "@/lib/store/hydration";
import { useUI } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const lastY = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);
  const { setCartOpen, setSearchOpen, setMenuOpen, menuOpen } = useUI();
  const hydrated = useHydrated((s) => s.hydrated);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const favCount = useFavorites((s) => s.handles.length);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 320);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cerrar el mega-menú al navegar (ajuste de estado durante el render)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMegaOpen(false);
  }

  // atajo ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  const solid = scrolled || megaOpen;

  return (
    <header
      className={cn(
        "theme-dark sticky top-0 z-50 h-[var(--header-h)] text-fg transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out)]",
        hidden && !megaOpen && !menuOpen && !pathname.startsWith("/checkout")
          ? "-translate-y-full"
          : "translate-y-0",
        solid
          ? "border-b border-white/10 bg-ink/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={closeMegaSoon}
      onKeyDown={(e) => {
        if (e.key === "Escape") setMegaOpen(false);
      }}
    >
      <div className="container-x flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="relative z-10 -ml-1 flex items-center rounded-sm p-1 text-paper"
          aria-label="Grabados González Simón — inicio"
        >
          <Logo size="sm" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              if ("mega" in item && item.mega) {
                return (
                  <li key={item.href} onMouseEnter={openMega}>
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu"
                      onClick={() => setMegaOpen((v) => !v)}
                      onFocus={openMega}
                      className={cn(
                        "relative inline-flex min-h-11 items-center gap-1.5 px-3.5 text-[0.875rem] font-medium tracking-[0.01em] text-stone-200 transition-colors hover:text-paper",
                        (active || megaOpen) && "text-paper",
                      )}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 10 6"
                        className={cn("h-1.5 w-2.5 transition-transform", megaOpen && "rotate-180")}
                        aria-hidden="true"
                      >
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.href} onMouseEnter={closeMegaSoon}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative inline-flex min-h-11 items-center px-3.5 text-[0.875rem] font-medium tracking-[0.01em] text-stone-200 transition-colors hover:text-paper",
                      active && "text-paper",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-3.5 bottom-2 h-px origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100",
                        active && "scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex tap items-center justify-center gap-2 rounded-full text-paper transition-colors hover:bg-white/8 lg:px-3"
            aria-label="Buscar productos (Ctrl + K)"
          >
            <Search className="size-[1.15rem]" strokeWidth={1.5} />
            <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 font-sans text-[0.625rem] text-stone-300 xl:inline">
              ⌘K
            </kbd>
          </button>
          <Link
            href="/favoritos"
            className="relative hidden tap items-center justify-center rounded-full text-paper transition-colors hover:bg-white/8 sm:inline-flex"
            aria-label={`Favoritos${hydrated && favCount ? ` (${favCount})` : ""}`}
          >
            <Heart className="size-[1.15rem]" strokeWidth={1.5} />
            {hydrated && favCount > 0 ? (
              <span
                className="absolute top-2 right-2 size-1.5 rounded-full bg-champagne"
                aria-hidden="true"
              />
            ) : null}
          </Link>
          <button
            id="cart-button"
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative inline-flex tap items-center justify-center rounded-full text-paper transition-colors hover:bg-white/8"
            aria-label={`Abrir carrito${hydrated ? `, ${count} ${count === 1 ? "artículo" : "artículos"}` : ""}`}
          >
            <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
            <AnimatePresence>
              {hydrated && count > 0 ? (
                <m.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute top-1 right-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-paper px-1 text-[0.625rem] font-bold text-ink tabular-nums"
                  aria-hidden="true"
                >
                  {count > 99 ? "99+" : count}
                </m.span>
              ) : null}
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-mr-2 inline-flex tap items-center justify-center rounded-full text-paper hover:bg-white/8 lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-6" strokeWidth={1.3} />
          </button>
        </div>
      </div>

      <MegaMenu
        open={megaOpen}
        onEnter={openMega}
        onLeave={closeMegaSoon}
        onNavigate={() => setMegaOpen(false)}
      />
    </header>
  );
}
