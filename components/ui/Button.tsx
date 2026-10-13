import Link from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "invert" | "link";
type Size = "sm" | "md" | "lg" | "icon";

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
  block,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  block?: boolean;
} = {}) {
  return cn(
    "group/btn relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-sans font-semibold tracking-[0.02em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
    variant !== "link" && "btn-shine rounded-[var(--radius)]",
    size === "sm" && "min-h-10 px-4 text-[0.8125rem]",
    size === "md" && "min-h-12 px-6 text-[0.9375rem]",
    size === "lg" && "min-h-14 px-8 text-base",
    size === "icon" && "size-11 p-0",
    variant === "primary" && "bg-fg text-bg hover:bg-fg/88 btn-on-light",
    variant === "invert" && "bg-bg text-fg hover:bg-surface-2",
    variant === "outline" && "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
    variant === "ghost" && "text-fg hover:bg-fg/6",
    variant === "link" && "min-h-0 px-0 underline-offset-4 hover:underline",
    block && "w-full",
    className,
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button"> & CommonProps>(function Button(
  { variant, size, block, className, children, iconLeft, iconRight, loading, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : iconLeft}
      <span className="relative">{children}</span>
      {!loading && iconRight}
    </button>
  );
});

export function ButtonLink({
  variant,
  size,
  block,
  className,
  children,
  iconLeft,
  iconRight,
  external,
  ...rest
}: ComponentProps<typeof Link> & CommonProps & { external?: boolean }) {
  const cls = buttonClasses({ variant, size, block, className });
  if (external) {
    return (
      <a
        className={cls}
        href={String(rest.href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={rest["aria-label"]}
        onClick={rest.onClick as ComponentProps<"a">["onClick"]}
      >
        {iconLeft}
        <span className="relative">{children}</span>
        {iconRight}
      </a>
    );
  }
  return (
    <Link className={cls} {...rest}>
      {iconLeft}
      <span className="relative">{children}</span>
      {iconRight}
    </Link>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Flecha fina que se desplaza al pasar el ratón por el botón. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-4 transition-transform duration-300 group-hover/btn:translate-x-1", className)}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
