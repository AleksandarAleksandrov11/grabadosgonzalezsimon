import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/misc";
import { testimonials } from "@/data/testimonials";

/** Tres opiniones de clientes, sin carrusel. */
export function Testimonials() {
  return (
    <section className="theme-light bg-paper section-y" aria-labelledby="resenas-title">
      <div className="container-x">
        <SectionHeading title={<span id="resenas-title">Lo que dicen nuestros clientes</span>} size="m" />
        <ul className="mt-14 grid grid-cols-1 gap-12 border-t border-line pt-12 md:grid-cols-3 md:gap-10">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal as="li" key={t.author} variant="up" delay={i * 0.08}>
              <blockquote className="font-display text-[1.5rem] leading-snug text-fg">«{t.quote}»</blockquote>
              <p className="mt-6 text-[0.875rem] text-fg-muted">
                <span className="font-semibold text-fg">{t.author}</span> · {t.context}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
