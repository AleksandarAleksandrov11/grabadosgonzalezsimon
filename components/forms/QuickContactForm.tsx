"use client";

import { useForm } from "react-hook-form";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Textarea } from "@/components/ui/Field";
import type { QuickContact } from "@/lib/validation";

// Validación con las reglas nativas de react-hook-form (mismos mensajes que el
// esquema Zod de lib/validation.ts, que se sigue aplicando en /api/contact).
// Así este formulario, presente en muchas páginas, no arrastra Zod al bundle.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
import { SuccessMark } from "./SuccessMark";

/** Formulario rápido (email + mensaje), como el de la web actual del cliente. */
export function QuickContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuickContact>({
    defaultValues: { email: "", message: "", privacy: false, marketing: false },
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
      setSent(true);
      reset();
    } catch {
      setServerError("No hemos podido enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.");
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <m.div
          key="ok"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-4 py-6"
          role="status"
        >
          <SuccessMark />
          <p className="font-display text-3xl">¡Mensaje recibido!</p>
          <p className="text-fg-muted">Te responderemos lo antes posible.</p>
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>
            Enviar otro mensaje
          </Button>
        </m.div>
      ) : (
        <m.form key="form" noValidate onSubmit={onSubmit} className="space-y-5" exit={{ opacity: 0 }}>
          <Input
            label="Tu email"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Escribe tu email.",
              pattern: { value: EMAIL_RE, message: "Ese email no parece válido." },
            })}
          />
          <Textarea
            label="Mensaje"
            required
            rows={4}
            placeholder="Cuéntanos tu idea: pieza, cantidad, texto o logo, fecha…"
            error={errors.message?.message}
            {...register("message", {
              validate: (v) => {
                const t = v.trim();
                if (t.length < 10) return "Cuéntanos un poco más (mínimo 10 caracteres).";
                if (t.length > 2000) return "Máximo 2000 caracteres.";
                return true;
              },
            })}
          />
          <div className="space-y-3">
            <Checkbox
              label="Doy mi consentimiento para recibir comunicaciones comerciales"
              {...register("marketing")}
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
              {...register("privacy", {
                validate: (v) => v === true || "Debes aceptar la política de privacidad.",
              })}
            />
          </div>
          {serverError ? (
            <p role="alert" className="text-[0.875rem] text-[#ffb4ab]">
              {serverError}
            </p>
          ) : null}
          <Button type="submit" size="lg" loading={isSubmitting} block>
            Enviar mensaje
          </Button>
        </m.form>
      )}
    </AnimatePresence>
  );
}
