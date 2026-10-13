"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Check, ChevronDown, Lock, Pencil } from "lucide-react";
import { DiscountInput, TotalsTable } from "@/components/cart/CartPieces";
import { Spinner } from "@/components/ui/Button";
import { fullAddress, site } from "@/data/site";
import { SHIPPING_METHODS, type ShippingMethod } from "@/lib/commerce/pricing";
import { computeTotals, useCart } from "@/lib/store/cart";
import { useHydrated } from "@/lib/store/hydration";
import { useOrders } from "@/lib/store/orders";
import { toast } from "@/lib/store/toast";
import { cn, formatDate, formatPrice, plural } from "@/lib/utils";
import {
  ContactStep,
  DetailsStep,
  PaymentStep,
  ShippingStep,
  type ContactValues,
  type DetailsValues,
  type PaymentValues,
  type ShippingValues,
} from "./CheckoutSteps";
import { SummaryLines } from "./SummaryLines";

const STEPS = ["Contacto", "Envío", "Personalización", "Pago"] as const;
const DRAFT_KEY = "ggs-demo:checkout";

type Draft = {
  step: number;
  contact?: ContactValues;
  shipping?: ShippingValues;
  details?: Omit<DetailsValues, "confirmDesigns">;
};

function readDraft(): Draft {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (raw)
      return { ...(JSON.parse(raw) as Partial<Draft>), step: (JSON.parse(raw) as Partial<Draft>).step ?? 0 };
  } catch {
    /* sin sessionStorage */
  }
  return { step: 0 };
}
function writeDraft(d: Draft | null) {
  try {
    if (d) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

/** Checkout simulado en 4 pasos. Solo se monta en cliente (tras hidratar los stores). */
export function Checkout() {
  const hydrated = useHydrated((s) => s.hydrated);
  if (!hydrated) return <CheckoutSkeleton />;
  return <CheckoutBody />;
}

function CheckoutBody() {
  const router = useRouter();
  const { lines, discountCode, note: cartNote, clear } = useCart();
  const addOrder = useOrders((s) => s.add);
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [method, setMethod] = useState<ShippingMethod>(() => draft.shipping?.method ?? "estandar");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const firstRender = useRef(true);
  const totals = computeTotals(lines, discountCode, method, site.demo.freeShippingThreshold);
  const afterDiscount = totals.subtotal - totals.discount;
  const step = Math.min(draft.step, completedUpTo(draft));

  // carrito vacío → a la tienda con aviso
  useEffect(() => {
    if (lines.length || placed) return;
    toast({ title: "Tu carrito está vacío", description: "Añade alguna pieza antes de tramitar el pedido." });
    router.replace("/tienda");
  }, [lines.length, placed, router]);

  // al cambiar de paso: llevar el paso activo a la vista y mover el foco a su título
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = document.getElementById(`paso-${step}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }, [step]);

  const save = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    writeDraft(next);
  };

  const placeOrder = async (pay: PaymentValues) => {
    if (!draft.contact || !draft.shipping) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const s = draft.shipping;
    const pickup = s.method === "recogida";
    const order = addOrder({
      lines,
      contact: { ...draft.contact, newsletter: Boolean(draft.contact.newsletter) },
      shipping: {
        firstName: s.firstName,
        lastName: s.lastName,
        address: pickup ? `Recogida en taller · ${site.address.street}` : s.address,
        address2: pickup ? undefined : s.address2 || undefined,
        postalCode: pickup ? site.address.postalCode : s.postalCode,
        city: pickup ? site.address.city : s.city,
        province: pickup ? "Madrid" : s.province,
        country: "España",
        method: s.method,
      },
      desiredDate: draft.details?.desiredDate || undefined,
      note: draft.details?.note || undefined,
      payment: {
        method: pay.method,
        last4: pay.method === "tarjeta" ? pay.cardNumber?.replace(/\D/g, "").slice(-4) : undefined,
      },
      discountCode,
      totals,
    });
    setPlaced(true);
    writeDraft(null);
    router.replace(`/pedido/${order.id}`);
    clear();
  };

  if (placed || !lines.length) {
    return (
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-fg-muted"
        role="status"
      >
        <Spinner className="size-6" />
        {placed ? "Abriendo tu pedido…" : "Redirigiendo a la tienda…"}
      </div>
    );
  }

  const summaries: ReactNode[] = [
    draft.contact ? `${draft.contact.email} · ${draft.contact.phone}` : null,
    draft.shipping
      ? draft.shipping.method === "recogida"
        ? `Recogida en taller · ${draft.shipping.firstName} ${draft.shipping.lastName}`
        : `${SHIPPING_METHODS.find((x) => x.id === draft.shipping!.method)?.label} · ${draft.shipping.firstName} ${draft.shipping.lastName}, ${draft.shipping.address}, ${draft.shipping.postalCode} ${draft.shipping.city}`
      : null,
    draft.details
      ? [
          draft.details.desiredDate
            ? `Para el ${formatDate(draft.details.desiredDate)}`
            : "Sin fecha concreta",
          draft.details.note ? `Nota: «${draft.details.note}»` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : null,
    null,
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
      {/* resumen plegable en móvil */}
      <div className="-mx-[var(--gutter)] border-y border-line bg-surface lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          aria-expanded={summaryOpen}
          aria-controls="resumen-movil"
          className="flex min-h-14 w-full items-center justify-between gap-3 px-[var(--gutter)] text-[0.9375rem]"
        >
          <span className="flex items-center gap-2 font-semibold">
            {summaryOpen ? "Ocultar" : "Mostrar"} resumen del pedido
            <ChevronDown className={cn("size-4 transition-transform", summaryOpen && "rotate-180")} />
          </span>
          <span className="font-display text-2xl tabular-nums">{formatPrice(totals.total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {summaryOpen ? (
            <m.div
              id="resumen-movil"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 px-[var(--gutter)] pt-2 pb-6">
                <SummaryLines lines={lines} />
                <DiscountInput />
                <TotalsTable totals={totals} showShippingNote={false} />
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="lg:col-span-7">
        <Stepper current={step} onGo={(i) => save({ step: i })} />
        <div className="mt-8 space-y-4">
          {STEPS.map((label, i) => (
            <StepSection
              key={label}
              index={i}
              label={label}
              state={i === step ? "active" : i < step ? "done" : "todo"}
              summary={summaries[i]}
              onEdit={() => save({ step: i })}
            >
              {i === 0 ? (
                <ContactStep defaultValues={draft.contact} onDone={(contact) => save({ contact, step: 1 })} />
              ) : i === 1 ? (
                <ShippingStep
                  defaultValues={draft.shipping}
                  afterDiscount={afterDiscount}
                  onMethodChange={setMethod}
                  onDone={(shipping) => {
                    setMethod(shipping.method);
                    save({ shipping, step: 2 });
                  }}
                />
              ) : i === 2 ? (
                <DetailsStep
                  lines={lines}
                  defaultValues={{
                    note: draft.details?.note ?? cartNote,
                    desiredDate: draft.details?.desiredDate,
                  }}
                  onDone={({ desiredDate, note }) => save({ details: { desiredDate, note }, step: 3 })}
                />
              ) : (
                <PaymentStep
                  total={totals.total}
                  phone={draft.contact?.phone}
                  placing={placing}
                  onDone={placeOrder}
                />
              )}
            </StepSection>
          ))}
        </div>
        <p className="mt-8 flex items-center gap-2 text-[0.8125rem] text-fg-subtle">
          <Lock className="size-3.5" strokeWidth={1.6} /> Demo: tus datos solo se guardan en este navegador.
        </p>
      </div>

      <aside className="hidden self-start lg:sticky lg:top-[calc(var(--header-h)+3.5rem)] lg:col-span-5 lg:block">
        <div className="space-y-6 rounded-[var(--radius-lg)] border border-line bg-surface p-7">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl">Tu pedido</h2>
            <Link
              href="/carrito"
              className="text-[0.8125rem] font-semibold underline-offset-4 hover:underline"
            >
              Editar carrito
            </Link>
          </div>
          <p className="-mt-3 text-[0.8125rem] text-fg-subtle">
            {plural(totals.itemCount, "artículo", "artículos")}
          </p>
          <SummaryLines lines={lines} className="max-h-[42vh] overflow-y-auto pt-2 pr-2" />
          <DiscountInput />
          <TotalsTable totals={totals} showShippingNote={step < 1 && !draft.shipping} />
          {method === "recogida" ? (
            <p className="text-[0.8125rem] text-fg-muted">Recogida en {fullAddress()}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

/** Último paso al que se puede llegar con los datos guardados. */
function completedUpTo(d: Draft) {
  if (!d.contact) return 0;
  if (!d.shipping) return 1;
  if (!d.details) return 2;
  return 3;
}

function Stepper({ current, onGo }: { current: number; onGo: (i: number) => void }) {
  return (
    <nav aria-label="Pasos del checkout">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const content = (
            <>
              <span
                className={cn(
                  "h-1 w-full rounded-full transition-colors duration-500",
                  done || active ? "bg-fg" : "bg-fg/12",
                )}
                aria-hidden="true"
              />
              <span className="mt-2.5 flex items-center gap-1.5 text-[0.75rem] font-semibold sm:text-[0.8125rem]">
                {done ? <Check className="size-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" /> : null}
                <span
                  className={cn(
                    "truncate",
                    !active && !done && "text-fg-subtle",
                    !active && "max-sm:sr-only",
                  )}
                >
                  {label}
                </span>
                {!active && !done ? (
                  <span className="text-fg-subtle sm:hidden" aria-hidden="true">
                    {i + 1}
                  </span>
                ) : null}
              </span>
            </>
          );
          return (
            <li key={label} aria-current={active ? "step" : undefined}>
              {done ? (
                <button
                  type="button"
                  onClick={() => onGo(i)}
                  className="flex w-full flex-col items-start text-left hover:opacity-70"
                  aria-label={`Volver al paso ${i + 1}: ${label}`}
                >
                  {content}
                </button>
              ) : (
                <div className="flex flex-col items-start">
                  {content}
                  <span className="sr-only">
                    {active ? ` (paso actual, ${i + 1} de ${STEPS.length})` : ` (paso ${i + 1}, pendiente)`}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepSection({
  index,
  label,
  state,
  summary,
  onEdit,
  children,
}: {
  index: number;
  label: string;
  state: "active" | "done" | "todo";
  summary: ReactNode;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section
      id={`paso-${index}`}
      aria-labelledby={`paso-${index}-titulo`}
      className={cn(
        "scroll-mt-[calc(var(--header-h)+4rem)] rounded-[var(--radius-lg)] border transition-[border-color,box-shadow] duration-300",
        state === "active"
          ? "border-line-strong bg-surface p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] sm:p-7"
          : "border-line px-5 py-4 sm:px-7",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id={`paso-${index}-titulo`}
          tabIndex={-1}
          className={cn(
            "flex items-center gap-3 font-display focus:outline-none",
            state === "active" ? "text-[1.75rem] sm:text-[2rem]" : "text-[1.375rem]",
            state === "todo" && "text-fg-subtle",
          )}
        >
          <span
            className={cn(
              "inline-flex size-7 shrink-0 items-center justify-center rounded-full font-sans text-[0.75rem] font-bold",
              state === "done"
                ? "bg-fg text-bg"
                : state === "active"
                  ? "border border-fg"
                  : "border border-line-strong",
            )}
            aria-hidden="true"
          >
            {state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
          </span>
          {label}
        </h2>
        {state === "done" ? (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-semibold hover:bg-fg/6"
            aria-label={`Editar ${label.toLowerCase()}`}
          >
            <Pencil className="size-3.5" /> Editar
          </button>
        ) : null}
      </div>
      {state === "done" && summary ? (
        <p className="mt-2 pl-10 text-[0.875rem] break-words text-fg-muted">{summary}</p>
      ) : null}
      <AnimatePresence initial={false}>
        {state === "active" ? (
          <m.div
            key="body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6"
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function CheckoutSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14"
      aria-busy="true"
      aria-label="Cargando checkout"
    >
      <div className="space-y-4 lg:col-span-7">
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-1 animate-pulse rounded-full bg-fg/10" />
          ))}
        </div>
        <div className="mt-8 h-72 animate-pulse rounded-[var(--radius-lg)] bg-fg/6" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-[var(--radius-lg)] bg-fg/5" />
        ))}
      </div>
      <div className="hidden h-96 animate-pulse rounded-[var(--radius-lg)] bg-fg/6 lg:col-span-5 lg:block" />
    </div>
  );
}
