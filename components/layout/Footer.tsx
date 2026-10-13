import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { PaymentIcons, WhatsAppIcon } from "@/components/icons";
import { footerNav } from "@/data/navigation";
import { fullAddress, mapsUrl, site, whatsappLink } from "@/data/site";
import { CurrentYear, NewsletterForm } from "./FooterClient";

export function Footer() {
  return (
    <footer className="theme-dark grain relative overflow-hidden bg-ink text-fg">
      <div className="relative z-[2] container-x pt-20 pb-10 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-4 text-paper" aria-label="Inicio">
              <LogoMark className="h-20" />
              <span className="flex flex-col">
                <span className="font-display text-[2rem] leading-none">González Simón</span>
                <span className="mt-2 text-[0.625rem] font-semibold tracking-[0.3em] text-stone-300 uppercase">
                  Grabados en cristal
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs font-display text-2xl leading-snug text-stone-200 italic">
              {site.tagline}
            </p>
            <ul className="mt-8 space-y-3 text-[0.9375rem] text-stone-300">
              <li>
                <a
                  href={mapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-3 hover:text-paper"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                  <span>
                    {fullAddress()}
                    <span className="sr-only"> (abre Google Maps)</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-paper">
                  <Mail className="size-4 shrink-0" strokeWidth={1.5} />
                  {site.email}
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a href={site.phones.mobile.href} className="inline-flex items-center gap-3 hover:text-paper">
                  <Phone className="size-4 shrink-0" strokeWidth={1.5} />
                  {site.phones.mobile.display}
                </a>
                <a href={site.phones.landline.href} className="hover:text-paper">
                  {site.phones.landline.display}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-paper"
                >
                  <WhatsAppIcon className="size-4" />
                  Escríbenos por WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-3">
            {Object.entries(footerNav).map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <h2 className="mb-4 eyebrow">{title}</h2>
                <ul className="space-y-1">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-9 items-center link-underline text-[0.9375rem] text-stone-300 hover:text-paper"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 eyebrow">Novedades del taller</h2>
            <p className="mb-5 text-[0.9375rem] text-stone-300">
              Ideas de regalo, nuevas piezas y fechas clave. Sin spam, prometido.
            </p>
            <NewsletterForm />
            <h2 className="mt-10 mb-3 eyebrow">Pago seguro (demo)</h2>
            <PaymentIcons />
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 text-[0.8125rem] text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.name}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-2">
            Hecho con cariño en Madrid <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-champagne/40 px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-champagne uppercase">
              Demo de presentación
            </span>
          </p>
        </div>
      </div>

      {/* Kit Digital — logos oficiales (monocromo, tal y como los proporciona la plataforma actual).
          TODO: verificar con el manual de publicidad del Kit Digital si se exige la versión a color. */}
      <div className="relative z-[2] bg-paper">
        <div className="container-x flex flex-col items-center justify-center gap-4 py-5 sm:flex-row sm:gap-10">
          <p className="text-[0.75rem] text-stone-700">
            Esta web está financiada por la Unión Europea — NextGenerationEU
          </p>
          <div className="flex items-center gap-8">
            <Image
              src="/images/original/eu-logo-next-generation.png"
              alt="Financiado por la Unión Europea — NextGenerationEU"
              width={173}
              height={50}
              className="h-9 w-auto sm:h-10"
            />
            <Image
              src="/images/original/eu-logo-plan-recuperacion.png"
              alt="Plan de Recuperación, Transformación y Resiliencia"
              width={175}
              height={50}
              className="h-9 w-auto sm:h-10"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
