import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppIcon } from "@/components/icons";
import { MapEmbed } from "@/components/layout/MapEmbed";
import { PageHero } from "@/components/layout/PageHero";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/misc";
import { fullAddress, mapsUrl, site, whatsappLink } from "@/data/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: `Llámanos al ${site.phones.mobile.display}, escríbenos por WhatsApp o a ${site.email}. Taller de grabado en cristal en ${fullAddress()}.`,
  path: "/contacto",
});

function Card({
  icon,
  title,
  children,
  href,
  external,
  cta,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  external?: boolean;
  cta?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6">
      <span className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong">
        {icon}
      </span>
      <h2 className="mt-5 text-[0.75rem] font-semibold tracking-[0.14em] text-fg-subtle uppercase">
        {title}
      </h2>
      <div className="mt-2 flex-1 text-[1.0625rem]">{children}</div>
      {href && cta ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-5 inline-flex min-h-11 items-center self-start rounded-full border border-fg px-5 text-[0.875rem] font-semibold transition-colors hover:bg-fg hover:text-bg"
        >
          {cta}
        </a>
      ) : null}
    </div>
  );
}

export default function ContactoPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contacto", href: "/contacto" }]}
        title={
          <>
            Hablemos de <em className="font-light">tu idea</em>
          </>
        }
        lead="Respondemos en el mismo día laborable."
        glass="jarra-agua"
        engraving={{ kind: "text", lines: [{ text: "Hola", font: "script", size: 0.4 }] }}
      />

      <section className="theme-light bg-paper pt-14 pb-6 sm:pt-20" aria-label="Formas de contacto">
        <div className="container-x">
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <Card
                icon={<Phone className="size-5" strokeWidth={1.5} />}
                title="Teléfono"
                href={site.phones.mobile.href}
                cta="Llamar"
              >
                <a href={site.phones.mobile.href} className="block font-semibold hover:underline">
                  {site.phones.mobile.display}
                </a>
                <a href={site.phones.landline.href} className="block text-fg-muted hover:underline">
                  {site.phones.landline.display}
                </a>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card
                icon={<WhatsAppIcon className="size-5" />}
                title="WhatsApp"
                href={whatsappLink()}
                external
                cta="Abrir WhatsApp"
              >
                <p className="font-semibold">{site.phones.mobile.display}</p>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card
                icon={<Mail className="size-5" strokeWidth={1.5} />}
                title="Email"
                href={`mailto:${site.email}`}
                cta="Escribir email"
              >
                <a href={`mailto:${site.email}`} className="block font-semibold break-all hover:underline">
                  {site.email}
                </a>
              </Card>
            </StaggerItem>
            <StaggerItem>
              <Card
                icon={<MapPin className="size-5" strokeWidth={1.5} />}
                title="Taller"
                href={mapsUrl()}
                external
                cta="Cómo llegar"
              >
                <p className="font-semibold">{fullAddress()}</p>
                <p className="mt-2 flex items-start gap-2 text-[0.9375rem] text-fg-muted">
                  <Clock className="mt-1 size-4 shrink-0" strokeWidth={1.5} />
                  {site.hours}
                </p>
              </Card>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      <section className="theme-light bg-paper section-y" aria-labelledby="form-title">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading title={<span id="form-title">Escríbenos</span>} size="m" />
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
          <div className="lg:col-span-5">
            <MapEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
