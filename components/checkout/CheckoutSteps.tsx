"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CreditCard, Landmark, Smartphone, Store, Truck, Zap } from "lucide-react";
import type { z } from "zod";
import { LineThumb, visibleAttributes } from "@/components/cart/CartLineItem";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { fullAddress, site } from "@/data/site";
import { shippingCost, type ShippingMethod } from "@/lib/commerce/pricing";
import type { CartLine } from "@/lib/commerce/types";
import {
  contactStepSchema,
  detailsStepSchema,
  paymentStepSchema,
  PROVINCE_CP,
  PROVINCES,
  shippingStepSchema,
} from "@/lib/validation";
import { addBusinessDays, cn, formatDate, formatPrice, toISODate } from "@/lib/utils";

export type ContactValues = z.infer<typeof contactStepSchema>;
export type ShippingValues = z.infer<typeof shippingStepSchema>;
export type DetailsValues = z.infer<typeof detailsStepSchema>;
export type PaymentValues = z.infer<typeof paymentStepSchema>;

const SORTED_PROVINCES = [...PROVINCES].sort((a, b) => a.localeCompare(b, "es"));
const provinceByCp = (cp: string) =>
  (Object.entries(PROVINCE_CP) as [string, string][]).find(([, pre]) => pre === cp.slice(0, 2))?.[0];

/* ----------------------------- piezas comunes ---------------------------- */

function RadioCard({
  children,
  className,
  ...input
}: React.ComponentProps<"input"> & { children: ReactNode }) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-[var(--radius)] border border-line-strong bg-surface p-4 transition-[border-color,background-color,box-shadow] hover:border-fg/50 has-[:checked]:border-fg has-[:checked]:shadow-[inset_0_0_0_1px_var(--fg)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fg",
        className,
      )}
    >
      <input type="radio" className="peer sr-only" {...input} />
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors peer-checked:border-fg peer-checked:[&>span]:scale-100"
      >
        <span className="size-2.5 scale-0 rounded-full bg-fg transition-transform" />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}

function StepActions({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      {note ? <div className="text-[0.8125rem] text-fg-subtle">{note}</div> : <span />}
      {children}
    </div>
  );
}

/* --------------------------------- 1. Contacto --------------------------------- */

export function ContactStep({
  defaultValues,
  onDone,
}: {
  defaultValues?: Partial<ContactValues>;
  onDone: (v: ContactValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactStepSchema),
    defaultValues: { email: "", phone: "", newsletter: false, ...defaultValues },
  });
  return (
    <form noValidate onSubmit={handleSubmit(onDone)} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Teléfono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="600 000 000"
          hint="Solo para avisarte sobre el pedido."
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <Checkbox
        label="Quiero recibir ideas de regalo y novedades del taller (demo)"
        {...register("newsletter")}
      />
      <StepActions note="Demo: no hace falta crear una cuenta.">
        <Button type="submit" size="lg" iconRight={<ArrowIcon />}>
          Continuar con el envío
        </Button>
      </StepActions>
    </form>
  );
}

/* --------------------------------- 2. Envío --------------------------------- */

export function ShippingStep({
  defaultValues,
  afterDiscount,
  onMethodChange,
  onDone,
}: {
  defaultValues?: Partial<ShippingValues>;
  afterDiscount: number;
  onMethodChange: (m: ShippingMethod) => void;
  onDone: (v: ShippingValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ShippingValues>({
    resolver: zodResolver(shippingStepSchema),
    defaultValues: {
      method: "estandar",
      firstName: "",
      lastName: "",
      address: "",
      address2: "",
      postalCode: "",
      city: "",
      province: "",
      country: "España",
      ...defaultValues,
    },
  });
  const method = useWatch({ control, name: "method" });
  const cpReg = register("postalCode");
  const methodReg = register("method", { onChange: (e) => onMethodChange(e.target.value) });
  const std = shippingCost(afterDiscount, "estandar");
  const urg = shippingCost(afterDiscount, "urgente");

  return (
    <form noValidate onSubmit={handleSubmit(onDone)} className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-[0.8125rem] font-semibold">Método de entrega</legend>
        <div className="grid grid-cols-1 gap-3">
          <RadioCard value="estandar" {...methodReg}>
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <Truck className="size-4" strokeWidth={1.5} /> Envío estándar
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">
                  48–72 h tras la producción (ejemplo)
                </span>
              </span>
              <span className="font-semibold tabular-nums">{std === 0 ? "Gratis" : formatPrice(std)}</span>
            </span>
          </RadioCard>
          <RadioCard value="urgente" {...methodReg}>
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <Zap className="size-4" strokeWidth={1.5} /> Envío urgente
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">
                  24 h tras la producción (ejemplo)
                </span>
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(urg)}</span>
            </span>
          </RadioCard>
          <RadioCard value="recogida" {...methodReg}>
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  <Store className="size-4" strokeWidth={1.5} /> Recogida en el taller
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-fg-muted">
                  {fullAddress()} · te avisamos cuando esté lista
                </span>
              </span>
              <span className="font-semibold">Gratis</span>
            </span>
          </RadioCard>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Nombre"
          autoComplete="given-name"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Apellidos"
          autoComplete="family-name"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      {method === "recogida" ? (
        <div className="rounded-[var(--radius)] border border-dashed border-line-strong p-4 text-[0.875rem] text-fg-muted">
          <p className="font-semibold text-fg">Recogida en el taller</p>
          <p className="mt-1">{fullAddress()}</p>
          <p className="mt-1">Horario: {site.hours}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
          <Input
            className="sm:col-span-6"
            label="Dirección"
            autoComplete="address-line1"
            required
            placeholder="Calle, número"
            error={errors.address?.message}
            {...register("address")}
          />
          <Input
            className="sm:col-span-6"
            label="Piso, puerta, escalera…"
            optionalLabel
            autoComplete="address-line2"
            {...register("address2")}
          />
          <Input
            className="sm:col-span-2"
            label="Código postal"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            required
            error={errors.postalCode?.message}
            {...cpReg}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5);
              cpReg.onChange(e);
              const prov = e.target.value.length === 5 ? provinceByCp(e.target.value) : undefined;
              if (prov && getValues("province") !== prov)
                setValue("province", prov, { shouldValidate: Boolean(errors.province) });
            }}
          />
          <Input
            className="sm:col-span-4"
            label="Ciudad"
            autoComplete="address-level2"
            required
            error={errors.city?.message}
            {...register("city")}
          />
          <Select
            className="sm:col-span-3"
            label="Provincia"
            autoComplete="address-level1"
            required
            error={errors.province?.message}
            {...register("province")}
          >
            <option value="">Elige provincia</option>
            {SORTED_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Input
            className="sm:col-span-3"
            label="País"
            readOnly
            hint="Demo: envíos solo a España."
            {...register("country")}
          />
        </div>
      )}
      <StepActions>
        <Button type="submit" size="lg" iconRight={<ArrowIcon />}>
          Continuar
        </Button>
      </StepActions>
    </form>
  );
}

/* ----------------------------- 3. Personalización ----------------------------- */

export function DetailsStep({
  lines,
  defaultValues,
  onDone,
}: {
  lines: CartLine[];
  defaultValues?: Partial<DetailsValues>;
  onDone: (v: DetailsValues) => void;
}) {
  // fecha mínima orientativa: producción + envío (días laborables)
  const [minDate] = useState(() => toISODate(addBusinessDays(new Date(), 8)));
  const schema = useMemo(
    () =>
      detailsStepSchema.superRefine((v, ctx) => {
        if (v.desiredDate && v.desiredDate < minDate)
          ctx.addIssue({
            code: "custom",
            path: ["desiredDate"],
            message: `La fecha más próxima que podemos garantizar es el ${formatDate(minDate)}. Si es urgente, escríbenos.`,
          });
      }),
    [minDate],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsValues>({
    resolver: zodResolver(schema),
    defaultValues: { desiredDate: "", note: "", confirmDesigns: false, ...defaultValues },
  });
  const pending = lines.filter((l) => l.attributes.some((a) => a.key === "Personalización"));

  return (
    <form noValidate onSubmit={handleSubmit(onDone)} className="space-y-7">
      <div>
        <p className="mb-3 text-[0.8125rem] font-semibold">Revisa tus grabados</p>
        <ul className="space-y-3">
          {lines.map((l) => {
            const attrs = visibleAttributes(l).filter(
              (a) => !["Posición", "Escala", "Rotación"].includes(a.key),
            );
            return (
              <li key={l.id} className="flex gap-4 rounded-[var(--radius)] border border-line p-3">
                <LineThumb line={l} className="w-20" />
                <div className="min-w-0 flex-1 text-[0.875rem]">
                  <p className="font-semibold">
                    {l.productTitle} <span className="font-normal text-fg-subtle">× {l.quantity}</span>
                  </p>
                  {attrs.length ? (
                    <dl className="mt-1 space-y-0.5 text-[0.8125rem] text-fg-muted">
                      {attrs.slice(0, 5).map((a) => (
                        <div key={a.key} className="flex gap-1.5">
                          <dt className="shrink-0 text-fg-subtle">{a.key}:</dt>
                          <dd className="min-w-0 break-words">{a.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-1 text-[0.8125rem] text-fg-subtle">Sin grabado</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {pending.length ? (
          <p className="mt-3 flex items-start gap-2 text-[0.8125rem] text-fg-muted">
            <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
            Hay {pending.length === 1 ? "una pieza" : `${pending.length} piezas`} sin diseño: te
            contactaríamos para prepararlo contigo. Puedes adelantarnos la idea en la nota.
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="¿Para cuándo lo necesitas?"
          type="date"
          min={minDate}
          optionalLabel
          hint={`Plazo orientativo: ${site.demo.productionTime} + envío (ejemplo).`}
          error={errors.desiredDate?.message}
          {...register("desiredDate")}
        />
      </div>
      <Textarea
        label="Nota para el taller"
        optionalLabel
        rows={3}
        placeholder="Detalles del grabado, ortografía de nombres, tono del regalo…"
        error={errors.note?.message}
        {...register("note")}
      />
      <Checkbox
        label="He revisado los textos (nombres, fechas, ortografía) y entiendo que el grabado es irreversible."
        required
        error={errors.confirmDesigns?.message}
        {...register("confirmDesigns")}
      />
      <StepActions note="Antes de grabar te enviaríamos una prueba para aprobarla.">
        <Button type="submit" size="lg" iconRight={<ArrowIcon />}>
          Continuar al pago
        </Button>
      </StepActions>
    </form>
  );
}

/* --------------------------------- 4. Pago --------------------------------- */

const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};
const brandOf = (num: string) => {
  const d = num.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "American Express";
  return null;
};

export function PaymentStep({
  total,
  phone,
  placing,
  onDone,
}: {
  total: number;
  phone?: string;
  placing: boolean;
  onDone: (v: PaymentValues) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentStepSchema),
    defaultValues: {
      method: "tarjeta",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      bizumPhone: phone ?? "",
      terms: false,
    },
  });
  const method = useWatch({ control, name: "method" });
  const cardNumber = useWatch({ control, name: "cardNumber" }) ?? "";
  const brand = brandOf(cardNumber);
  const numReg = register("cardNumber");
  const expReg = register("cardExpiry");
  const cvcReg = register("cardCvc");

  const fillTestCard = () => {
    const yy = String((new Date().getFullYear() + 3) % 100).padStart(2, "0");
    setValue("cardName", "Cliente Demo");
    setValue("cardNumber", "4242 4242 4242 4242");
    setValue("cardExpiry", `12/${yy}`);
    setValue("cardCvc", "123");
    clearErrors(["cardName", "cardNumber", "cardExpiry", "cardCvc"]);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onDone)} className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-[0.8125rem] font-semibold">Método de pago (simulado)</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RadioCard value="tarjeta" {...register("method")}>
            <span className="flex items-center gap-2 font-semibold">
              <CreditCard className="size-4" strokeWidth={1.5} /> Tarjeta
            </span>
          </RadioCard>
          <RadioCard value="bizum" {...register("method")}>
            <span className="flex items-center gap-2 font-semibold">
              <Smartphone className="size-4" strokeWidth={1.5} /> Bizum
            </span>
          </RadioCard>
          <RadioCard value="transferencia" {...register("method")}>
            <span className="flex items-center gap-2 font-semibold">
              <Landmark className="size-4" strokeWidth={1.5} /> Transferencia
            </span>
          </RadioCard>
        </div>
      </fieldset>

      {method === "tarjeta" ? (
        <div className="space-y-5 rounded-[var(--radius-lg)] border border-line p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius)] bg-champagne/15 px-3 py-2.5 text-[0.8125rem]">
            <span>
              Tarjeta de prueba: <strong className="tabular-nums">4242 4242 4242 4242</strong> · fecha futura
              · cualquier CVC
            </span>
            <button
              type="button"
              onClick={fillTestCard}
              className="font-semibold underline underline-offset-4 hover:no-underline"
            >
              Rellenar
            </button>
          </div>
          <Input
            label="Titular de la tarjeta"
            autoComplete="cc-name"
            required
            error={errors.cardName?.message}
            {...register("cardName")}
          />
          <div className="relative">
            <Input
              label="Número de tarjeta"
              inputMode="numeric"
              autoComplete="cc-number"
              required
              placeholder="0000 0000 0000 0000"
              error={errors.cardNumber?.message}
              {...numReg}
              onChange={(e) => {
                e.target.value = formatCard(e.target.value);
                numReg.onChange(e);
              }}
            />
            {brand ? (
              <span className="pointer-events-none absolute top-[2.35rem] right-3 rounded-[4px] border border-line-strong bg-surface px-2 py-1 text-[0.6875rem] font-bold tracking-[0.04em] uppercase">
                {brand}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Caducidad"
              inputMode="numeric"
              autoComplete="cc-exp"
              required
              placeholder="MM/AA"
              maxLength={5}
              error={errors.cardExpiry?.message}
              {...expReg}
              onChange={(e) => {
                e.target.value = formatExpiry(e.target.value);
                expReg.onChange(e);
              }}
            />
            <Input
              label="CVC"
              inputMode="numeric"
              autoComplete="cc-csc"
              required
              placeholder="123"
              maxLength={4}
              error={errors.cardCvc?.message}
              {...cvcReg}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                cvcReg.onChange(e);
              }}
            />
          </div>
          <p className="text-[0.75rem] text-fg-subtle">
            Los datos no salen de tu navegador ni se guardan. En la tienda real el pago lo gestionaría una
            pasarela segura (Shopify Payments, Redsys…).
          </p>
        </div>
      ) : method === "bizum" ? (
        <div className="space-y-3 rounded-[var(--radius-lg)] border border-line p-4 sm:p-5">
          <Input
            label="Móvil asociado a Bizum"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            error={errors.bizumPhone?.message}
            {...register("bizumPhone")}
          />
          <p className="text-[0.8125rem] text-fg-muted">
            Simulación: en la tienda real recibirías una notificación en la app de tu banco para aceptar el
            pago.
          </p>
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-line p-4 text-[0.875rem] text-fg-muted sm:p-5">
          <p className="font-semibold text-fg">Transferencia bancaria</p>
          <p className="mt-1">
            Te enviaríamos los datos bancarios por email y empezaríamos a grabar al recibir el pago. (Demo: no
            se muestra ninguna cuenta real.)
          </p>
        </div>
      )}

      <Checkbox
        label={
          <>
            Acepto las{" "}
            <a href="/legal/envios-y-devoluciones" target="_blank" className="underline underline-offset-2">
              condiciones de envío y devolución
            </a>{" "}
            y la{" "}
            <a href="/legal/privacidad" target="_blank" className="underline underline-offset-2">
              política de privacidad
            </a>
            .
          </>
        }
        required
        error={errors.terms?.message}
        {...register("terms")}
      />

      <div className="space-y-3 border-t border-line pt-6">
        <Button type="submit" size="lg" block loading={placing}>
          {placing ? "Procesando pedido de prueba…" : `Confirmar pedido de prueba · ${formatPrice(total)}`}
        </Button>
        <p className="text-center text-[0.8125rem] text-fg-subtle" aria-live="polite">
          {placing
            ? "Simulando el pago… no se realiza ningún cargo."
            : "🧪 Pedido de prueba: no se realiza ningún cargo ni se envía nada."}
        </p>
      </div>
    </form>
  );
}
