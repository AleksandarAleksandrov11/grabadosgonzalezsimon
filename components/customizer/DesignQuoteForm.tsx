"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Select, Textarea } from "@/components/ui/Field";
import { SuccessMark } from "@/components/forms/SuccessMark";
import { CONTACT_REASONS, contactSchema, type ContactInput } from "@/lib/validation";

/** Pedir presupuesto con el diseño actual (la vista previa se adjunta en el resumen). */
export function DesignQuoteForm({
  preview,
  summary,
  onDone,
}: {
  preview: string | null;
  summary: string;
  onDone?: () => void;
}) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "Pedido particular",
      message: `Hola, me gustaría presupuesto para este diseño:\n${summary}\n\nCantidad aproximada: `,
      privacy: false,
      marketing: false,
    },
  });

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 pt-4 pb-10 text-center" role="status">
        <SuccessMark />
        <p className="font-display text-3xl">¡Solicitud registrada!</p>
        <p className="max-w-sm text-fg-muted">Te responderemos con el presupuesto y la prueba del diseño.</p>
        <Button onClick={onDone}>Volver al estudio</Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="grid grid-cols-1 gap-6 px-5 pb-6 sm:grid-cols-[200px_1fr] sm:px-6"
      onSubmit={handleSubmit(async (data) => {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, attachmentName: "vista-previa.png" }),
        });
        if (res.ok) setSent(true);
      })}
    >
      <div>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Vista previa del diseño adjunta"
            className="w-full rounded-[var(--radius)] bg-ink"
          />
        ) : null}
        <p className="mt-2 text-[0.75rem] text-fg-subtle">Se adjunta esta vista previa a tu solicitud.</p>
      </div>
      <div className="space-y-4">
        <Input
          label="Nombre"
          required
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Teléfono"
            type="tel"
            optionalLabel
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
        <Select label="Motivo" required error={errors.reason?.message} {...register("reason")}>
          {CONTACT_REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Select>
        <Textarea
          label="Mensaje"
          required
          rows={5}
          error={errors.message?.message}
          {...register("message")}
        />
        <Checkbox
          label="Acepto la política de privacidad"
          required
          error={errors.privacy?.message}
          {...register("privacy")}
        />
        <Button type="submit" size="lg" block loading={isSubmitting}>
          Pedir presupuesto con este diseño
        </Button>
      </div>
    </form>
  );
}
