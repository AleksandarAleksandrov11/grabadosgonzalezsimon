"use client";

import { useId, useState } from "react";
import * as m from "motion/react-m";
import { Glass, type EngraveFont } from "@/components/glassware/Glass";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/misc";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const FONTS: { id: EngraveFont; label: string; family: string }[] = [
  { id: "script", label: "Caligrafía", family: "var(--font-great-vibes)" },
  { id: "classic", label: "Clásica", family: "var(--font-cormorant)" },
  { id: "roman", label: "Romana", family: "var(--font-cinzel)" },
];

/** «Pruébalo aquí mismo»: escribe y míralo grabado al instante en una copa. */
export function QuickEngraver() {
  const [text, setText] = useState("Elena & Pablo");
  const [font, setFont] = useState<EngraveFont>("script");
  const id = useId();
  const value = text.trim() || "Tu nombre";
  const size = font === "roman" ? 0.2 : 0.32;
  const href = `/personaliza?pieza=copa-vino&texto=${encodeURIComponent(value)}&fuente=${font}`;

  return (
    <section
      className="theme-dark grain relative overflow-hidden bg-ink section-y"
      aria-labelledby={`${id}-t`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_70%_50%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="relative z-[2] container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            title={
              <span id={`${id}-t`}>
                Escribe un nombre y míralo <em className="font-light">grabado</em>
              </span>
            }
          />
          <Reveal variant="up" delay={0.1} className="mt-10 max-w-md space-y-6">
            <div>
              <label htmlFor={`${id}-in`} className="mb-2 block text-[0.8125rem] font-semibold text-paper">
                Escribe un nombre o unas iniciales
              </label>
              <input
                id={`${id}-in`}
                value={text}
                maxLength={22}
                onChange={(e) => setText(e.target.value)}
                className="h-14 w-full rounded-[var(--radius)] border border-white/25 bg-white/[0.04] px-4 !text-lg text-paper placeholder:text-stone-500 focus:border-paper focus:outline-none"
                placeholder="Elena & Pablo"
                autoComplete="off"
              />
              <p className="mt-1.5 text-right text-[0.75rem] text-stone-400 tabular-nums">{text.length}/22</p>
            </div>
            <fieldset>
              <legend className="mb-2 text-[0.8125rem] font-semibold text-paper">Tipografía</legend>
              <div className="grid grid-cols-3 gap-2">
                {FONTS.map((f) => (
                  <label
                    key={f.id}
                    className={cn(
                      "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[var(--radius)] border text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-paper",
                      font === f.id
                        ? "border-paper bg-white/[0.07] text-paper"
                        : "border-white/15 text-stone-300 hover:border-white/40",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${id}-font`}
                      value={f.id}
                      checked={font === f.id}
                      onChange={() => setFont(f.id)}
                      className="sr-only"
                    />
                    <span className="text-[1.35rem] leading-none" style={{ fontFamily: f.family }}>
                      Ab
                    </span>
                    <span className="text-[0.6875rem] font-medium tracking-[0.06em]">{f.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <ButtonLink href={href} size="lg" iconRight={<ArrowIcon />} block>
              Abrir el personalizador
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal variant="scale" duration={1.2} className="relative mx-auto w-full max-w-[460px]">
          <div
            aria-hidden="true"
            className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.09),transparent)] blur-2xl"
          />
          <m.div
            key={font}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
            aria-live="polite"
          >
            <Glass
              id="copa-vino"
              tone="dark"
              title={`Vista previa: copa de vino grabada con «${value}»`}
              engraving={{
                kind: "text",
                lines: [{ text: value, font, size, tracking: font === "roman" ? 0.06 : 0 }],
              }}
            />
          </m.div>
        </Reveal>
      </div>
    </section>
  );
}
