"use client";

import { useId, useState } from "react";
import { Sparkles } from "lucide-react";
import { MiniStage } from "@/components/customizer/MiniStage";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { designToQuery } from "@/lib/engrave/share";
import { templateById, type TemplateId } from "@/lib/engrave/templates";
import { DEFAULT_DESIGN, type Design } from "@/lib/engrave/types";
import type { GlassId } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

/** Texto entre comillas angulares de una idea («…»), si lo tiene. */
const quoted = (idea: string) => /«([^»]+)»/.exec(idea)?.[1] ?? null;

/**
 * Mini personalizador de la página de ocasión: parte de la plantilla de la
 * ocasión, deja cambiar las dos líneas y probar las ideas con un clic.
 */
export function OccasionEngraver({
  template,
  glass,
  ideas,
  ideasTitle,
}: {
  template: TemplateId;
  glass: GlassId;
  ideas: string[];
  ideasTitle: string;
}) {
  const preset = templateById(template)?.preset ?? {};
  const [line1, setLine1] = useState(preset.line1 ?? "");
  const [line2, setLine2] = useState(preset.line2 ?? "");
  const id = useId();
  const design: Design = { ...DEFAULT_DESIGN, ...preset, mode: "text", line1, line2 };
  const href = `/personaliza?${designToQuery(design, glass)}`;

  const tryIdea = (idea: string) => {
    const q = quoted(idea);
    if (!q) return;
    const [a, b] = q.split(/\s+[·|]\s+/);
    setLine1(a.slice(0, 28));
    setLine2((b ?? "").slice(0, 34));
  };

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        <h2 id={`${id}-t`} className="font-display text-display-m text-paper">
          {ideasTitle}
        </h2>
        <p className="mt-4 max-w-[48ch] text-stone-300">
          Toca una idea para verla grabada al momento, o escribe la tuya.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-2">
          {ideas.map((idea) => {
            const q = quoted(idea);
            return (
              <li key={idea}>
                {q ? (
                  <button
                    type="button"
                    onClick={() => tryIdea(idea)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-[var(--radius)] border px-4 py-3 text-left text-[0.9375rem] transition-colors",
                      line1 && q.startsWith(line1)
                        ? "border-paper bg-white/[0.06] text-paper"
                        : "border-white/12 text-stone-200 hover:border-white/40",
                    )}
                  >
                    {idea}
                    <Sparkles className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                  </button>
                ) : (
                  <p className="rounded-[var(--radius)] border border-dashed border-white/12 px-4 py-3 text-[0.9375rem] text-stone-300">
                    {idea}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="lg:col-span-6">
        <div className="mx-auto max-w-[460px]">
          <div className="relative rounded-[var(--radius-lg)] bg-[radial-gradient(60%_55%_at_50%_42%,rgba(255,255,255,0.08),transparent_70%)] px-[8%] pt-[4%]">
            <MiniStage glass={glass} design={design} />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[0.8125rem] font-semibold text-paper">Línea 1</span>
              <input
                value={line1}
                maxLength={28}
                onChange={(e) => setLine1(e.target.value)}
                className="h-12 w-full rounded-[var(--radius)] border border-white/25 bg-white/[0.04] px-3 text-paper focus:border-paper focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.8125rem] font-semibold text-paper">Línea 2</span>
              <input
                value={line2}
                maxLength={34}
                onChange={(e) => setLine2(e.target.value)}
                className="h-12 w-full rounded-[var(--radius)] border border-white/25 bg-white/[0.04] px-3 text-paper focus:border-paper focus:outline-none"
              />
            </label>
          </div>
          <ButtonLink href={href} size="lg" block className="mt-4" iconRight={<ArrowIcon />}>
            Seguir en el estudio
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
