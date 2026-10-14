import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { QuickContactForm } from "@/components/forms/QuickContactForm";
import { site, whatsappLink } from "@/data/site";

export function FinalCTA() {
  return (
    <section
      className="theme-dark grain relative overflow-hidden border-b border-white/10 bg-ink section-y"
      aria-labelledby="cta-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_40%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="relative z-[2] container-x grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-6">
          <Reveal variant="clip-up" duration={1.2}>
            <h2 id="cta-title" className="font-display text-display-l tracking-[-0.02em] text-paper">
              ¿Tienes una idea? <em className="font-light">La grabamos contigo.</em>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.15}>
            <p className="mt-8 max-w-[46ch] text-lead text-stone-300">
              Estoy a tu disposición para ayudarte en todo lo que necesites. Escríbeme, llámame o déjame un
              mensaje y te respondo tan rápido como sea posible.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shine relative inline-flex min-h-14 items-center justify-center gap-2.5 overflow-hidden rounded-[var(--radius)] bg-paper px-6 font-semibold text-ink transition-colors hover:bg-white"
              >
                <WhatsAppIcon /> Escríbenos por WhatsApp
              </a>
              <a
                href={site.phones.mobile.href}
                className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-[var(--radius)] border border-white/25 px-6 font-semibold text-paper transition-colors hover:border-paper"
              >
                <Phone className="size-4" /> Llamar · {site.phones.mobile.display}
              </a>
            </div>
            <p className="mt-6 text-[0.875rem] text-stone-400">
              También en el {site.phones.landline.display} o en{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-paper">
                {site.email}
              </a>
            </p>
          </Reveal>
        </div>
        <Reveal variant="fade" delay={0.2} className="lg:col-span-5 lg:col-start-8">
          <div className="rounded-[var(--radius-lg)] border border-white/12 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
            <p className="mb-6 font-display text-[1.75rem] text-paper">Déjame un mensaje</p>
            <QuickContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
