"use client";

import Link from "next/link";
import * as m from "motion/react-m";
import { ArrowLeft, Printer } from "lucide-react";
import { TotalsTable } from "@/components/cart/CartPieces";
import { SummaryLines } from "@/components/checkout/SummaryLines";
import { WhatsAppIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { site, whatsappLink } from "@/data/site";
import { SHIPPING_METHODS } from "@/lib/commerce/pricing";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders, type Order } from "@/lib/store/orders";
import { addBusinessDays, cn, formatDate } from "@/lib/utils";

const PAYMENT_LABEL: Record<Order["payment"]["method"], string> = {
  tarjeta: "Tarjeta",
  bizum: "Bizum",
  transferencia: "Transferencia bancaria",
};

/** Confirmación / detalle de un pedido de prueba guardado en este navegador. */
export function OrderView({ id }: { id: string }) {
  const hydrated = useHydrated((s) => s.hydrated);
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) {
    return (
      <div className="container-x py-40" aria-busy="true">
        <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-[var(--radius-lg)] bg-fg/6" />
      </div>
    );
  }
  if (!order) return <NotFound id={id} />;
  return <OrderDetail order={order} />;
}

function NotFound({ id }: { id: string }) {
  return (
    <section className="theme-dark grain relative bg-ink pt-[calc(var(--header-h)+5rem)] pb-28">
      <div className="relative z-[2] container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pedido {id}</p>
          <h1 className="mt-4 font-display text-display-m text-paper">No encontramos este pedido</h1>
          <p className="mt-5 text-stone-300">
            Los pedidos de prueba solo se guardan en el navegador donde se hicieron. Puede que se hayan
            borrado o que lo abrieras en otro dispositivo.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/mis-pedidos" variant="invert">
              Ver mis pedidos
            </ButtonLink>
            <ButtonLink href="/tienda" variant="outline">
              Ir a la tienda
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const created = new Date(order.createdAt);
  const pickup = order.shipping.method === "recogida";
  const timeline = [
    { label: "Pedido recibido", date: created, done: true },
    {
      label: "Revisión del diseño",
      date: addBusinessDays(created, 1),
      detail: "Te enviaríamos una prueba por email",
    },
    { label: "En grabado", date: addBusinessDays(created, 3), detail: "Chorro de arena en el taller" },
    {
      label: pickup ? "Listo para recoger" : "Enviado",
      date: addBusinessDays(created, pickup ? 6 : 7),
      detail: pickup ? "Te avisaríamos por teléfono" : "Con número de seguimiento",
    },
  ];
  const s = order.shipping;
  const methodLabel = SHIPPING_METHODS.find((x) => x.id === s.method)?.label ?? s.method;

  return (
    <>
      <section className="theme-dark grain relative overflow-hidden bg-ink pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_30%,rgba(255,255,255,0.09),transparent_70%)]"
        />
        <div className="relative z-[2] mx-auto flex max-w-3xl flex-col items-center px-[var(--gutter)] text-center">
          <EngravedCheck />
          <p className="css-fade-up mt-8 eyebrow" style={{ "--d": "500ms" } as React.CSSProperties}>
            Pedido de prueba confirmado
          </p>
          <h1
            className="css-fade-up mt-4 font-display text-display-m text-paper"
            style={{ "--d": "620ms" } as React.CSSProperties}
          >
            ¡Gracias, {s.firstName}!
          </h1>
          <p
            className="css-fade-up mt-5 max-w-[52ch] text-lead text-stone-300"
            style={{ "--d": "740ms" } as React.CSSProperties}
          >
            Tu pedido <strong className="font-semibold text-paper tabular-nums">{order.id}</strong> se ha
            registrado en este navegador. En la tienda real recibirías un email en{" "}
            <span className="text-paper">{order.contact.email}</span> con la prueba del grabado.
          </p>
          <p
            className="css-fade-up mt-6 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-[0.8125rem] text-champagne"
            style={{ "--d": "860ms" } as React.CSSProperties}
          >
            🧪 Demo: no se ha realizado ningún cargo ni se ha enviado ningún pedido.
          </p>
        </div>
      </section>

      <section className="theme-light bg-paper py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-[var(--gutter)] lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <div>
              <h2 className="mb-6 font-display text-display-s">Seguimiento</h2>
              <ol className="relative space-y-7 pl-10">
                <span
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line-strong"
                />
                {timeline.map((t, i) => (
                  <m.li
                    key={t.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute top-0.5 -left-10 inline-flex size-[1.375rem] items-center justify-center rounded-full border",
                        t.done ? "border-fg bg-fg text-bg" : "border-line-strong bg-paper",
                      )}
                    >
                      {t.done ? (
                        <svg viewBox="0 0 16 16" className="size-3">
                          <path
                            d="M3.5 8.5l3 3 6-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <p className={cn("font-semibold", !t.done && "text-fg-muted")}>
                      {t.label}
                      {t.done ? <span className="sr-only"> (completado)</span> : null}
                    </p>
                    <p className="text-[0.875rem] text-fg-subtle">
                      {t.done ? formatDate(t.date) : `Estimado: ${formatDate(t.date)} (ejemplo)`}
                      {t.detail ? ` · ${t.detail}` : ""}
                    </p>
                  </m.li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InfoBlock title={pickup ? "Recogida" : "Envío"}>
                <p>
                  {s.firstName} {s.lastName}
                </p>
                <p>{s.address}</p>
                {s.address2 ? <p>{s.address2}</p> : null}
                <p>
                  {[s.postalCode, s.city].filter(Boolean).join(" ")}
                  {s.province ? ` (${s.province})` : ""}
                </p>
                <p className="mt-2 text-fg-subtle">{methodLabel}</p>
              </InfoBlock>
              <InfoBlock title="Contacto y pago">
                <p className="break-all">{order.contact.email}</p>
                <p>{order.contact.phone}</p>
                <p className="mt-2">
                  {PAYMENT_LABEL[order.payment.method]}
                  {order.payment.last4 ? ` ···· ${order.payment.last4}` : ""}{" "}
                  <span className="text-fg-subtle">(simulado)</span>
                </p>
                <p className="text-fg-subtle">{formatDate(order.createdAt)}</p>
              </InfoBlock>
              {order.desiredDate || order.note ? (
                <InfoBlock title="Indicaciones" className="sm:col-span-2">
                  {order.desiredDate ? <p>Lo necesitas para el {formatDate(order.desiredDate)}.</p> : null}
                  {order.note ? <p className="mt-1 break-words">«{order.note}»</p> : null}
                </InfoBlock>
              ) : null}
            </div>

            <div className="no-print flex flex-wrap gap-3">
              <Button
                variant="outline"
                iconLeft={<Printer className="size-4" />}
                onClick={() => window.print()}
              >
                Imprimir o guardar PDF
              </Button>
              <ButtonLink
                href={whatsappLink(`Hola, tengo una pregunta sobre mi pedido ${order.id} (demo web).`)}
                external
                variant="outline"
                iconLeft={<WhatsAppIcon className="size-4" />}
              >
                Preguntar por WhatsApp
              </ButtonLink>
            </div>
          </div>

          <aside className="self-start lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-5">
            <div className="space-y-6 rounded-[var(--radius-lg)] border border-line bg-surface p-5 sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-3xl">Resumen</h2>
                <span className="text-[0.8125rem] font-semibold tabular-nums">{order.id}</span>
              </div>
              <SummaryLines lines={order.lines} maxAttrs={4} />
              <TotalsTable totals={order.totals} showShippingNote={false} />
              {order.discountCode ? (
                <p className="text-[0.8125rem] text-fg-muted">Código aplicado: {order.discountCode}</p>
              ) : null}
            </div>
            <div className="no-print mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ButtonLink href="/mis-pedidos" variant="outline" iconLeft={<ArrowLeft className="size-4" />}>
                Mis pedidos
              </ButtonLink>
              <ButtonLink href="/tienda">Seguir comprando</ButtonLink>
            </div>
            <p className="mt-6 text-[0.8125rem] text-fg-subtle">
              ¿Dudas? Llámanos al{" "}
              <a href={site.phones.mobile.href} className="underline underline-offset-2">
                {site.phones.mobile.display}
              </a>{" "}
              o escribe a{" "}
              <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                {site.email}
              </a>
              .{" "}
              <Link href="/preguntas-frecuentes" className="underline underline-offset-2">
                Preguntas frecuentes
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-line p-5 text-[0.9375rem]", className)}>
      <h3 className="mb-3 text-[0.75rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Check «grabado»: disco esmerilado que aparece con arena y un trazo que se dibuja. */
function EngravedCheck() {
  const grains = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const r = 70 + (i % 3) * 14;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, d: 0.15 + (i % 5) * 0.04 };
  });
  return (
    <div className="relative size-28 sm:size-32" aria-hidden="true">
      {grains.map((g, i) => (
        <m.span
          key={i}
          className="absolute top-1/2 left-1/2 size-1 rounded-full bg-champagne"
          initial={{ x: g.x, y: g.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
          transition={{ duration: 0.7, delay: g.d, ease: "easeIn" }}
        />
      ))}
      <m.div
        className="absolute inset-0 rounded-full border border-white/25 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.35),rgba(255,255,255,0.08)_60%,rgba(255,255,255,0.03))] shadow-[inset_0_0_30px_rgba(255,255,255,0.12)] backdrop-blur-sm"
        initial={{ scale: 0.6, opacity: 0, filter: "blur(8px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full text-paper">
        <m.path
          d="M20 33l8 8 16-18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </div>
  );
}
