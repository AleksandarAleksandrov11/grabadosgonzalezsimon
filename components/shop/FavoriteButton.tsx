"use client";

import * as m from "motion/react-m";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/store/favorites";
import { useHydrated } from "@/lib/store/hydration";
import { toast } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  handle,
  title,
  className,
  variant = "floating",
}: {
  handle: string;
  title: string;
  className?: string;
  variant?: "floating" | "inline";
}) {
  const hydrated = useHydrated((s) => s.hydrated);
  const on = useFavorites((s) => s.handles.includes(handle)) && hydrated;
  const toggle = useFavorites((s) => s.toggle);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Quitar ${title} de favoritos` : `Añadir ${title} a favoritos`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = toggle(handle);
        toast({ title: now ? "Añadido a favoritos" : "Quitado de favoritos", description: title });
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        variant === "floating"
          ? "tap bg-black/30 text-paper backdrop-blur-md hover:bg-black/50"
          : "tap border border-line-strong text-fg hover:border-fg",
        className,
      )}
    >
      <m.span
        key={String(on)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart className={cn("size-[1.1rem]", on && "fill-current")} strokeWidth={1.5} />
      </m.span>
    </button>
  );
}
