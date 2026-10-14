"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { TECHNIQUE_STEPS, TechniqueVisual } from "@/components/technique/TechniqueVisual";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * «La técnica»: en escritorio, sección fijada con GSAP ScrollTrigger (carga
 * dinámica) que avanza los 4 pasos con el scroll. En móvil o con movimiento
 * reducido, stepper vertical sin pin.
 */
export function TechniquePinned({ link = true }: { link?: boolean }) {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const pinned = desktop && !reduce;
  return pinned ? <PinnedDesktop link={link} /> : <Stepper link={link} />;
}

function Heading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2
        id="tecnica-title"
        className="max-w-[16ch] font-display text-display-m tracking-[-0.015em] text-paper"
      >
        Chorro de arena: <em className="font-light">luz</em> dentro del cristal
      </h2>
    </div>
  );
}

function PinnedDesktop({ link }: { link: boolean }) {
  // React es dueño del <div> exterior; GSAP solo fija (y envuelve) la <section> interior.
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);
      (window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section.current,
          start: "top top",
          end: "+=" + window.innerHeight * 3,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          snap: { snapTo: [0, 1 / 3, 2 / 3, 1], duration: { min: 0.2, max: 0.5 }, ease: "power2.inOut" },
          onUpdate: (self) => {
            setProgress(self.progress);
            setStep(Math.min(3, Math.round(self.progress * 3)));
          },
        });
      }, section);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div className="relative bg-ink">
      <section
        ref={section}
        className="theme-dark grain relative h-[100svh] overflow-hidden bg-ink"
        aria-labelledby="tecnica-title"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_70%_50%,rgba(255,255,255,0.07),transparent_70%)]"
        />
        <div className="relative z-[2] container-x grid h-full grid-cols-12 items-center gap-10 pt-[var(--header-h)]">
          <div className="col-span-5">
            <Heading />
            <ol className="relative mt-12 space-y-1 border-l border-white/10" aria-label="Pasos del grabado">
              <span
                aria-hidden="true"
                className="absolute top-0 -left-px w-px bg-paper transition-[height] duration-200"
                style={{ height: `${Math.max(6, progress * 100)}%` }}
              />
              {TECHNIQUE_STEPS.map((s, i) => (
                <li key={s.title} aria-current={step === i ? "step" : undefined} className="pl-8">
                  <div
                    className={cn(
                      "py-4 transition-opacity duration-500",
                      step === i ? "opacity-100" : "opacity-40",
                    )}
                  >
                    <p className="flex items-baseline gap-3">
                      <span className="font-display text-lg text-stone-400 italic">0{i + 1}</span>
                      <span className="font-display text-[1.9rem] leading-none text-paper">{s.title}</span>
                    </p>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)]",
                        step === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <p className="overflow-hidden text-[0.98rem] leading-relaxed text-stone-300">
                        <span className="block pt-3 font-semibold text-paper">{s.lead}.</span> {s.text}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            {link ? (
              <Link
                href="/tecnica"
                className="group/btn mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-paper"
              >
                <span className="link-underline">Descubre la técnica en detalle</span> <ArrowIcon />
              </Link>
            ) : null}
          </div>
          <div className="col-span-6 col-start-7">
            <div className="relative mx-auto max-w-[540px]">
              <TechniqueVisual step={step} />
              <p
                className="absolute top-6 right-0 font-display text-[7rem] leading-none text-white/[0.05] tabular-nums"
                aria-hidden="true"
              >
                0{step + 1}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stepper({ link }: { link: boolean }) {
  return (
    <section
      className="theme-dark grain relative overflow-hidden bg-ink section-y"
      aria-labelledby="tecnica-title"
    >
      <div className="relative z-[2] container-x">
        <Heading />
        <ol className="mt-12 space-y-14">
          {TECHNIQUE_STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal variant="up" className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
                <TechniqueVisual step={i} className="mx-auto w-full max-w-[240px] sm:max-w-[300px]" />
                <div>
                  <p className="flex items-baseline gap-3">
                    <span className="font-display text-lg text-stone-400 italic">0{i + 1}</span>
                    <span className="font-display text-[2rem] leading-none text-paper">{s.title}</span>
                  </p>
                  <p className="mt-3 font-semibold text-paper">{s.lead}.</p>
                  <p className="mt-1 leading-relaxed text-stone-300">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        {link ? (
          <Link
            href="/tecnica"
            className="group/btn mt-12 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-paper"
          >
            <span className="link-underline">Descubre la técnica en detalle</span> <ArrowIcon />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
