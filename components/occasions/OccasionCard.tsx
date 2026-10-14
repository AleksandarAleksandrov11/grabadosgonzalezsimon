import Link from "next/link";
import { Glass } from "@/components/glassware/Glass";
import type { Occasion } from "@/data/occasions";
import { cn } from "@/lib/utils";

/** Tarjeta de ocasión: pieza grabada sobre fondo oscuro y el nombre debajo. */
export function OccasionCard({ occasion: o, className }: { occasion: Occasion; className?: string }) {
  return (
    <Link href={`/ocasiones/${o.slug}`} className={cn("group/occ block", className)} data-cursor="grow">
      <div className="theme-dark relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-ink">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_40%,rgba(255,255,255,0.08),transparent_70%)]"
        />
        <div className="pointer-events-none absolute inset-x-[14%] top-[8%] bottom-[6%] transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover/occ:scale-[1.04]">
          <Glass id={o.illustration} tone="dark" engraving={o.sample} className="h-full w-full" />
        </div>
      </div>
      <h3 className="mt-5 font-display text-[1.75rem] leading-tight">
        <span className="link-underline">{o.title}</span>
      </h3>
    </Link>
  );
}
