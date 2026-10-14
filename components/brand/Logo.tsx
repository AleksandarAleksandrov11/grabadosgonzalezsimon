import { cn } from "@/lib/utils";
import { LOGO_MARK_PATH, LOGO_MARK_VIEWBOX } from "./logo-mark-path";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={LOGO_MARK_VIEWBOX}
      className={cn("h-full w-auto", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      <path fillRule="evenodd" d={LOGO_MARK_PATH} />
    </svg>
  );
}

/**
 * Logotipo completo: marca + wordmark tipográfico (texto real, con la fuente
 * display de la web, para que sea nítido y accesible).
 */
export function Logo({
  className,
  compact = false,
  size = "md",
}: {
  className?: string;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const markH = size === "lg" ? "h-16" : size === "sm" ? "h-9" : "h-11";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className={cn(markH, "shrink-0")} />
      <span className={cn("flex flex-col leading-none", compact && "max-sm:sr-only")}>
        <span
          className={cn(
            "font-display font-medium tracking-[-0.01em] whitespace-nowrap",
            size === "lg" ? "text-[2rem]" : size === "sm" ? "text-[1.2rem]" : "text-[1.4rem]",
          )}
        >
          González Simón
        </span>
        <span
          className={cn(
            "mt-1 font-sans font-semibold tracking-[0.28em] whitespace-nowrap uppercase opacity-80",
            size === "lg" ? "text-[0.7rem]" : "text-[0.56rem]",
          )}
        >
          Grabados en cristal
        </span>
      </span>
    </span>
  );
}
