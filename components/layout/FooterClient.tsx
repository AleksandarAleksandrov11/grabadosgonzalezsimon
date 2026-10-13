"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "@/lib/store/toast";

export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-2 text-[0.9375rem] text-paper" role="status">
        <Check className="size-4" /> ¡Gracias! (Demo: no se ha enviado nada.)
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError("Introduce un email válido.");
        if (!consent) return setError("Necesitamos tu consentimiento para enviarte novedades.");
        setError(null);
        setDone(true);
        toast({
          title: "Suscripción de prueba registrada",
          description: "En la web real recibirías un email de confirmación.",
        });
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Tu email
      </label>
      <div className="flex border-b border-white/30 focus-within:border-paper">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-h-12 w-full bg-transparent text-paper placeholder:text-stone-500 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex tap items-center justify-center text-paper"
          aria-label="Suscribirme"
        >
          <ArrowRight className="size-5" strokeWidth={1.4} />
        </button>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.8125rem] text-stone-400">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-paper"
        />
        Acepto recibir comunicaciones comerciales y la política de privacidad.
      </label>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-3 text-[0.8125rem] text-[#ffb4ab]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
