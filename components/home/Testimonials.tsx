"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/misc";
import { testimonials } from "@/data/testimonials";

/** Slider de reseñas (scroll-snap nativo: swipe en móvil, flechas y teclado). Todas marcadas como ejemplo. */
export function Testimonials() {
  const track = useRef<HTMLUListElement>(null);
  const scrollBy = (d: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: d * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
  };
  return (
    <section className="theme-light overflow-hidden bg-paper section-y" aria-labelledby="resenas-title">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Opiniones"
            title={
              <span id="resenas-title">
                Lo que <em className="font-light">se cuenta</em> del taller
              </span>
            }
          />
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="inline-flex tap items-center justify-center rounded-full border border-line-strong hover:border-fg"
              aria-label="Reseña anterior"
            >
              <ChevronLeft className="size-5" strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="inline-flex tap items-center justify-center rounded-full border border-line-strong hover:border-fg"
              aria-label="Reseña siguiente"
            >
              <ChevronRight className="size-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </div>
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Reseñas de ejemplo"
        className="relative mt-12 scrollbar-none flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-4 focus-visible:outline-offset-[-4px] min-[1440px]:scroll-px-[calc((100vw-1440px)/2+var(--gutter))] min-[1440px]:px-[calc((100vw-1440px)/2+var(--gutter))]"
        data-lenis-prevent-horizontal
      >
        {testimonials.map((t, i) => (
          <li
            key={i}
            className="flex w-[86%] shrink-0 snap-start flex-col justify-between rounded-[var(--radius-lg)] border border-line bg-paper-pure p-7 sm:w-[46%] sm:p-9 lg:w-[31%]"
          >
            <div>
              <span className="inline-flex rounded-full border border-dashed border-champagne bg-champagne/15 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] text-stone-700 uppercase">
                Reseña de ejemplo
              </span>
              <svg viewBox="0 0 32 24" className="mt-6 h-5 w-7 text-fg-subtle" aria-hidden="true">
                <path
                  d="M0 24V14C0 6 4 1 12 0l1 4c-4 1-6 4-6 8h6v12H0Zm19 0V14c0-8 4-13 12-14l1 4c-4 1-6 4-6 8h6v12H19Z"
                  fill="currentColor"
                />
              </svg>
              <blockquote className="mt-4 font-display text-[1.5rem] leading-snug text-fg">
                «{t.quote}»
              </blockquote>
            </div>
            <footer className="mt-8 border-t border-line pt-5 text-[0.875rem]">
              <p className="font-semibold">{t.author}</p>
              <p className="text-fg-subtle">
                {t.context} · {t.product}
              </p>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
