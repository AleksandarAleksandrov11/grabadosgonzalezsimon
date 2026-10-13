"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ImageUp, Loader2, X } from "lucide-react";
import type { z } from "zod";
import { MiniStage } from "@/components/customizer/MiniStage";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageError, loadImageFile, ACCEPTED_TYPES } from "@/lib/engrave/image";
import { DEFAULT_DESIGN, type Design } from "@/lib/engrave/types";
import type { GlassId } from "@/lib/glass/pieces";
import { toISODate, addBusinessDays } from "@/lib/utils";
import { quoteSchema, type QuoteInput } from "@/lib/validation";
import { SuccessMark } from "./SuccessMark";

type QuoteFormIn = z.input<typeof quoteSchema>;
export type QuoteProduct = { handle: string; title: string; glass: GlassId };

/**
 * Presupuesto para empresas. El logo se procesa en el navegador para
 * enseñarlo grabado sobre la pieza elegida; al servidor solo viaja su nombre.
 */
export function QuoteForm({ products }: { products: QuoteProduct[] }) {
  const [result, setResult] = useState<{ reference: string; data: QuoteInput } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [logo, setLogo] = useState<{ design: Design; name: string } | null>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const wrapId = useId();
  const [minDate] = useState(() => toISODate(addBusinessDays(new Date(), 10)));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormIn, unknown, QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      company: "",
      cif: "",
      contact: "",
      email: "",
      phone: "",
      product: "",
      quantity: 24,
      date: "",
      logoName: "",
      message: "",
      privacy: false,
    },
  });
  const productHandle = useWatch({ control, name: "product" });
  const glass = products.find((p) => p.handle === productHandle)?.glass ?? "tubo";

  // ?producto=…&cantidad=… (desde la ficha de producto o el personalizador)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const prod = sp.get("producto");
    const qty = Number(sp.get("cantidad"));
    if (prod && products.some((p) => p.handle === prod)) setValue("product", prod);
    if (Number.isFinite(qty) && qty > 0) setValue("quantity", Math.max(12, Math.round(qty)));
  }, [products, setValue]);

  const onLogo = async (file: File | undefined) => {
    if (!file) return;
    setLogoError(null);
    setLogoBusy(true);
    try {
      const src = await loadImageFile(file);
      setLogo({
        name: file.name,
        design: {
          ...DEFAULT_DESIGN,
          mode: "image",
          imageId: src.id,
          threshold: src.defaultThreshold,
          invert: false,
        },
      });
      setValue("logoName", file.name);
    } catch (e) {
      setLogoError(e instanceof ImageError ? e.message : "No hemos podido leer la imagen.");
    } finally {
      setLogoBusy(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string };
      if (!res.ok || !json.ok || !json.reference) throw new Error();
      setResult({ reference: json.reference, data });
      // el mensaje de éxito es más corto que el formulario: llevarlo a la vista
      requestAnimationFrame(() =>
        document.getElementById(wrapId)?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
    } catch {
      setServerError("No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.");
    }
  });

  return (
    <div id={wrapId} className="scroll-mt-28">
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <m.div
            key="ok"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-5 py-4"
            role="status"
          >
            <SuccessMark size={72} />
            <p className="font-display text-display-s">¡Solicitud recibida!</p>
            <p className="max-w-[52ch] text-fg-muted">
              Referencia <strong className="text-fg tabular-nums">{result.reference}</strong>. En la web real
              te enviaríamos el presupuesto para {result.data.quantity} uds. en 24–48 h laborables (ejemplo).
            </p>
            <p className="rounded-full border border-line-strong px-3 py-1.5 text-[0.8125rem] text-fg-muted">
              🧪 Demo: la solicitud se ha validado pero no se ha enviado a nadie.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                reset();
                setLogo(null);
                setResult(null);
              }}
            >
              Hacer otra solicitud
            </Button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-12"
          >
            <div className="space-y-5 lg:col-span-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Empresa"
                  autoComplete="organization"
                  required
                  error={errors.company?.message}
                  {...register("company")}
                />
                <Input
                  label="CIF"
                  optionalLabel
                  placeholder="B12345678"
                  hint="Para la factura."
                  error={errors.cif?.message}
                  {...register("cif")}
                />
                <Input
                  label="Persona de contacto"
                  autoComplete="name"
                  required
                  error={errors.contact?.message}
                  {...register("contact")}
                />
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Teléfono"
                  type="tel"
                  autoComplete="tel"
                  optionalLabel
                  error={errors.phone?.message}
                  {...register("phone")}
                />
                <Select label="Producto" required error={errors.product?.message} {...register("product")}>
                  <option value="">Elige un producto</option>
                  {products.map((p) => (
                    <option key={p.handle} value={p.handle}>
                      {p.title}
                    </option>
                  ))}
                  <option value="otro">Otro / varios productos</option>
                </Select>
                <Input
                  label="Cantidad"
                  type="number"
                  inputMode="numeric"
                  min={12}
                  step={1}
                  required
                  hint="Mínimo 12 unidades."
                  error={errors.quantity?.message}
                  {...register("quantity")}
                />
                <Input
                  label="Fecha de entrega deseada"
                  type="date"
                  min={minDate}
                  optionalLabel
                  error={errors.date?.message}
                  {...register("date")}
                />
              </div>
              <Textarea
                label="Cuéntanos el proyecto"
                optionalLabel
                rows={4}
                placeholder="Uso (regalo, hostelería, evento), tamaño del logo, una o dos caras, embalaje…"
                error={errors.message?.message}
                {...register("message")}
              />
              <Checkbox
                label={
                  <>
                    Acepto la{" "}
                    <a href="/legal/privacidad" className="underline underline-offset-2">
                      política de privacidad
                    </a>
                  </>
                }
                required
                error={errors.privacy?.message}
                {...register("privacy")}
              />
              {serverError ? (
                <p role="alert" className="text-[0.875rem] font-medium text-[#b3261e]">
                  {serverError}
                </p>
              ) : null}
              <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
                Solicitar presupuesto
              </Button>
            </div>

            <div className="lg:col-span-5">
              <div className="theme-dark rounded-[var(--radius-lg)] bg-ink p-5 sm:p-6">
                <p className="text-[0.8125rem] font-semibold text-paper">Tu logo, grabado (vista previa)</p>
                <div className="relative mx-auto mt-3 max-w-[300px] bg-[radial-gradient(60%_55%_at_50%_42%,rgba(255,255,255,0.08),transparent_70%)]">
                  {logo ? (
                    <MiniStage glass={glass} design={logo.design} />
                  ) : (
                    <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 px-6 text-center text-[0.875rem] text-stone-400">
                      <ImageUp className="size-8" strokeWidth={1.2} />
                      Sube tu logo y lo verás grabado sobre la pieza elegida.
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-[0.875rem] font-semibold text-ink"
                  >
                    {logoBusy ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
                    {logo ? "Cambiar logo" : "Subir logo"}
                  </button>
                  {logo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setLogo(null);
                        setValue("logoName", "");
                      }}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] text-stone-300 hover:text-paper"
                    >
                      <X className="size-4" /> Quitar
                    </button>
                  ) : null}
                  <input
                    ref={fileRef}
                    type="file"
                    accept={[...ACCEPTED_TYPES, ".svg"].join(",")}
                    className="sr-only"
                    aria-label="Subir logo de la empresa"
                    onChange={(e) => {
                      onLogo(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
                <p className="mt-2 truncate text-[0.75rem] text-stone-400">
                  {logo ? logo.name : "PNG, JPG, SVG o WEBP · el archivo no sale de tu navegador"}
                </p>
                {logoError ? (
                  <p role="alert" className="mt-2 text-[0.8125rem] text-[#ffb4ab]">
                    {logoError}
                  </p>
                ) : null}
              </div>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
