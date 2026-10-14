import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Glass } from "@/components/glassware/Glass";
import type { Occasion } from "@/data/occasions";
import { cn } from "@/lib/utils";

/** Tarjeta oscura de ocasión: al pasar el ratón, el grabado aparece sobre el cristal. */
export function OccasionCard({ occasion: o, className }: { occasion: Occasion; className?: string }) {
  return (
    <Link
      href={`/ocasiones/${o.slug}`}
      className={cn(
        "theme-dark group/occ relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-ink p-5 text-fg sm:p-6",
        className,
      )}
      data-cursor="grow"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_55%_35%,rgba(255,255,255,0.08),transparent_70%)]"
      />
      <div className="pointer-events-none absolute inset-x-[10%] top-[4%] bottom-[18%] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover/occ:scale-[1.05]">
        <Glass
          id={o.illustration}
          tone="dark"
          engraving={o.sample}
          engravingClassName="transition-opacity duration-700 [@media(hover:hover)]:opacity-40 [@media(hover:hover)]:group-hover/occ:opacity-100 [@media(hover:hover)]:group-focus-visible/occ:opacity-100"
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />
      <div className="relative">
        <h3 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-[1.05] text-paper">
          {o.title}
        </h3>
        <p className="mt-1.5 text-[0.875rem] text-stone-300">{o.line}</p>
      </div>
      <span className="absolute top-4 right-4 inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-paper transition-[background-color,transform] duration-500 group-hover/occ:rotate-45 group-hover/occ:bg-white/10">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}
