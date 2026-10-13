import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-5", className)} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.88 2.4 1 2.56c.12.16 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

/** Icono lineal de copa (marca) para microdetalles. */
export function GlassLineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path d="M8 3h8l-1.2 7.2a2.8 2.8 0 0 1-5.6 0L8 3Z" strokeLinejoin="round" />
      <path d="M12 13v7M8.5 21h7" strokeLinecap="round" />
    </svg>
  );
}

/** Iconos genéricos de métodos de pago (sin marcas). */
export function PaymentIcons({ className }: { className?: string }) {
  const items = ["Tarjeta", "Bizum", "Transferencia"];
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Métodos de pago aceptados (demo)">
      {items.map((t) => (
        <li
          key={t}
          className="inline-flex h-7 items-center gap-1.5 rounded-[4px] border border-white/15 px-2.5 text-[0.6875rem] font-semibold tracking-[0.04em] text-stone-300"
        >
          {t === "Tarjeta" ? (
            <svg
              viewBox="0 0 20 14"
              className="h-3 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <rect x="0.6" y="0.6" width="18.8" height="12.8" rx="2" />
              <path d="M0.6 4.5h18.8M3.5 10h4" />
            </svg>
          ) : null}
          {t}
        </li>
      ))}
    </ul>
  );
}
