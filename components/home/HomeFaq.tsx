import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { ArrowIcon } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/motion/Reveal";
import { faqs } from "@/data/faqs";

export function HomeFaq() {
  const items = faqs.filter((f) => f.home).slice(0, 5);
  return (
    <section className="theme-light border-t border-line bg-paper section-y" aria-labelledby="faq-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Dudas frecuentes"
            title={
              <span id="faq-title">
                Preguntas <em className="font-light">y respuestas</em>
              </span>
            }
            size="m"
          />
          <Link
            href="/preguntas-frecuentes"
            className="group/btn mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
          >
            <span className="link-underline">Ver todas las preguntas</span> <ArrowIcon />
          </Link>
        </div>
        <Reveal variant="fade" className="lg:col-span-8">
          <Accordion
            size="lg"
            items={items.map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))}
            defaultOpen={[items[0].id]}
          />
        </Reveal>
      </div>
    </section>
  );
}
