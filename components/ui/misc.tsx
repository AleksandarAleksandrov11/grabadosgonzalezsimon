import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export function Badge({ children, className, tone = "default" }: { children: ReactNode; className?: string; tone?: "default" | "solid" | "frost" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        tone === "default" && "border border-line-strong bg-bg/80 text-fg backdrop-blur",
        tone === "solid" && "bg-fg text-bg",
        tone === "frost" && "border border-white/25 bg-white/10 text-white backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  as: Tag = "h2",
  size = "l",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "l" | "m" | "s";
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
      {eyebrow ? (
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "font-display font-normal tracking-[-0.015em] text-fg",
          size === "xl" && "text-display-xl",
          size === "l" && "text-display-l",
          size === "m" && "text-display-m",
          size === "s" && "text-display-s",
          align === "center" ? "max-w-[18ch]" : "max-w-[20ch]",
        )}
      >
        {title}
      </Tag>
      {lead ? <p className={cn("text-lead max-w-[58ch] text-fg-muted", align === "center" && "mx-auto")}>{lead}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items, className }: { items: { name: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={cn("text-[0.8125rem] text-fg-subtle", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href && i < items.length - 1 ? (
              <Link href={it.href} className="link-underline hover:text-fg">
                {it.name}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-fg-muted">
                {it.name}
              </span>
            )}
            {i < items.length - 1 ? <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Price({
  amount,
  compareAt,
  from,
  className,
  size = "md",
}: {
  amount: number;
  compareAt?: number | null;
  from?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      {from ? <span className="text-[0.75em] font-normal text-fg-subtle">desde</span> : null}
      <span className={cn("font-semibold tabular-nums", size === "lg" && "font-display text-[2rem] font-medium", size === "sm" && "text-[0.9375rem]")}>
        {formatPrice(amount)}
      </span>
      {compareAt && compareAt > amount ? (
        <>
          <s className="text-[0.85em] text-fg-subtle tabular-nums" aria-label={`Antes ${formatPrice(compareAt)}`}>
            {formatPrice(compareAt)}
          </s>
          <span className="text-[0.75em] font-semibold text-fg">−{Math.round((1 - amount / compareAt) * 100)}%</span>
        </>
      ) : null}
    </span>
  );
}

/** Aviso discreto de precios de demostración. */
export function DemoPriceNote({ className }: { className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 text-[0.75rem] text-fg-subtle", className)}>
      <span className="inline-block size-1.5 rounded-full bg-champagne" aria-hidden="true" />
      Precios orientativos de demostración
    </p>
  );
}

/** Etiqueta de dato pendiente de confirmar con el cliente (visible en la demo). */
export function Placeholder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-[3px] border border-dashed border-champagne/70 bg-champagne/10 px-1.5 py-0.5 font-sans text-[0.85em] font-medium not-italic",
        className,
      )}
      title="Dato pendiente de confirmar con el cliente"
    >
      {children}
    </span>
  );
}
