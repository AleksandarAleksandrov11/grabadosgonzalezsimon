"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox, FieldShell, Input, Select, Textarea } from "@/components/ui/Field";
import { CONTACT_REASONS, contactSchema, type ContactInput } from "@/lib/validation";
import { SuccessMark } from "./SuccessMark";

/** Formulario completo de /contacto. Demo: valida y responde sin enviar nada. */
export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const wrapId = useId();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: undefined,
      message: "",
      attachmentName: "",
      privacy: false,
      marketing: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSentTo(data.name.split(" ")[0]);
      // el mensaje de éxito es más corto que el formulario: llevarlo a la vista
      requestAnimationFrame(() =>
        document.getElementById(wrapId)?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      reset();
      setFileName("");
    } catch {
      setServerError("No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.");
    }
  });

  return (
    <div id={wrapId} className="scroll-mt-28">
      <AnimatePresence mode="wait" initial={false}>
        {sentTo ? (
          <m.div
            key="ok"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-5 py-8"
            role="status"
          >
            <SuccessMark size={72} />
            <p className="font-display text-display-s">¡Gracias, {sentTo}!</p>
            <p className="max-w-[48ch] text-fg-muted">
              Hemos recibido tu mensaje. Te responderemos lo antes posible por email o por teléfono.
            </p>
            <Button variant="outline" onClick={() => setSentTo(null)}>
              Enviar otro mensaje
            </Button>
          </m.div>
        ) : (
          <m.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Nombre"
                autoComplete="name"
                required
                error={errors.name?.message}
                {...register("name")}
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
              <Select
                label="Motivo"
                required
                error={errors.reason?.message}
                defaultValue=""
                {...register("reason")}
              >
                <option value="" disabled>
                  Elige un motivo
                </option>
                {CONTACT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <Textarea
              label="Mensaje"
              required
              rows={5}
              placeholder="Cuéntanos tu idea: pieza, cantidad, texto o logo, fecha…"
              error={errors.message?.message}
              {...register("message")}
            />
            <FieldShell label="Adjuntar imagen o logo" optionalLabel>
              {({ id, describedBy }) => (
                <label
                  htmlFor={id}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius)] border border-dashed border-line-strong px-4 text-[0.9375rem] text-fg-muted transition-colors hover:border-fg/50"
                >
                  <Paperclip className="size-4 shrink-0" strokeWidth={1.5} />
                  <span className="truncate">{fileName || "Elegir archivo (PNG, JPG, PDF, SVG)"}</span>
                  <input
                    id={id}
                    type="file"
                    accept="image/*,.pdf,.svg,.ai,.eps"
                    aria-describedby={describedBy}
                    className="sr-only"
                    onChange={(e) => {
                      const name = e.target.files?.[0]?.name ?? "";
                      setFileName(name);
                      setValue("attachmentName", name);
                    }}
                  />
                </label>
              )}
            </FieldShell>
            <div className="space-y-3 pt-1">
              <Checkbox label="Quiero recibir novedades e ideas de regalo" {...register("marketing")} />
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
            </div>
            {serverError ? (
              <p role="alert" className="text-[0.875rem] font-medium text-[#b3261e]">
                {serverError}
              </p>
            ) : null}
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
              Enviar mensaje
            </Button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
