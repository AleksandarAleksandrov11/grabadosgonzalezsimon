"use client";

import { useId, useState, type ReactNode } from "react";
import * as m from "motion/react-m";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Crosshair,
  Eye,
  EyeOff,
  Redo2,
  RotateCcw,
  Undo2,
} from "lucide-react";
import { Uploader } from "./Uploader";
import { FONT_CSS, FONT_OPTIONS, type Design } from "@/lib/engrave/types";
import { TEMPLATES } from "@/lib/engrave/templates";
import { BACKGROUNDS } from "@/lib/engrave/render";
import { useCustomizer } from "@/lib/engrave/store";
import { PIECES } from "@/lib/glass/pieces";
import { cn } from "@/lib/utils";

export type ControlTab = "diseno" | "texto" | "plantillas" | "ajustes";

/* -------------------------------- piezas comunes -------------------------------- */

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const checkpoint = useCustomizer((s) => s.checkpoint);
  return (
    <div>
      <label htmlFor={id} className="flex justify-between text-[0.8125rem] font-semibold">
        {label}
        <span className="font-normal text-fg-subtle tabular-nums">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={checkpoint}
        onKeyDown={checkpoint}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input mt-1.5"
      />
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: ReactNode; aria?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="mb-2 text-[0.8125rem] font-semibold">{label}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-[var(--radius)] border border-line-strong p-1">
        {options.map((o) => (
          <label
            key={o.value}
            aria-label={o.aria}
            className={cn(
              "flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[3px] px-2 text-[0.8125rem] font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg",
              value === o.value ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* --------------------------------- paneles --------------------------------- */

function TextPanel({ compact = false }: { compact?: boolean }) {
  const { design, set, glass } = useCustomizer();
  const id = useId();
  const max = PIECES[glass].kind === "panel" ? 36 : 24;
  const fontRow = (which: "font" | "font2", label: string) => (
    <fieldset>
      <legend className="mb-2 text-[0.8125rem] font-semibold">{label}</legend>
      <div
        className={cn(
          compact
            ? "relative -mx-1 scrollbar-none flex gap-1.5 overflow-x-auto px-1 [&>label]:w-[5.5rem] [&>label]:shrink-0"
            : "grid grid-cols-3 gap-1.5",
        )}
      >
        {FONT_OPTIONS.map((f) => (
          <label
            key={f.id}
            className={cn(
              "flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-[var(--radius)] border px-1 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg",
              design[which] === f.id ? "border-fg bg-fg/[0.06]" : "border-line hover:border-fg/50",
            )}
          >
            <input
              type="radio"
              name={`${id}-${which}`}
              className="sr-only"
              checked={design[which] === f.id}
              onChange={() => set({ [which]: f.id } as Partial<Design>)}
            />
            <span
              className="text-[1.15rem] leading-tight"
              style={{ fontFamily: `${FONT_CSS[f.id].family}, serif`, fontWeight: FONT_CSS[f.id].weight }}
            >
              {f.sample}
            </span>
            <span className="mt-0.5 text-[0.625rem] leading-tight text-fg-muted">{f.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor={`${id}-l1`} className="mb-1.5 flex justify-between text-[0.8125rem] font-semibold">
            Línea 1{" "}
            <span className="font-normal text-fg-subtle tabular-nums">
              {design.line1.length}/{max}
            </span>
          </label>
          <input
            id={`${id}-l1`}
            value={design.line1}
            maxLength={max}
            onFocus={() => useCustomizer.getState().checkpoint()}
            onChange={(e) => set({ line1: e.target.value, mode: "text" }, { history: false })}
            placeholder="Nombre, iniciales…"
            className="h-12 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 focus:border-fg focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor={`${id}-l2`} className="mb-1.5 flex justify-between text-[0.8125rem] font-semibold">
            Línea 2 <span className="font-normal text-fg-subtle">(opcional)</span>
          </label>
          <input
            id={`${id}-l2`}
            value={design.line2}
            maxLength={max + 8}
            onFocus={() => useCustomizer.getState().checkpoint()}
            onChange={(e) => set({ line2: e.target.value, mode: "text" }, { history: false })}
            placeholder="Fecha, frase corta…"
            className="h-12 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 focus:border-fg focus:outline-none"
          />
        </div>
      </div>
      {fontRow("font", "Tipografía de la línea 1")}
      {design.line2.trim() ? fontRow("font2", "Tipografía de la línea 2") : null}
      <Slider
        id={`${id}-size`}
        label="Tamaño"
        value={design.size}
        min={0.4}
        max={2.2}
        step={0.02}
        format={(v) => `${Math.round(v * 100)} %`}
        onChange={(v) => set({ size: v }, { history: false })}
      />
      <Advanced compact={compact}>
        {design.line2.trim() ? (
          <Slider
            id={`${id}-l2s`}
            label="Tamaño de la línea 2"
            value={design.line2Scale}
            min={0.15}
            max={1.4}
            step={0.01}
            format={(v) => `${Math.round(v * 100)} %`}
            onChange={(v) => set({ line2Scale: v }, { history: false })}
          />
        ) : null}
        <Slider
          id={`${id}-track`}
          label="Interletraje"
          value={design.tracking}
          min={-0.05}
          max={0.5}
          step={0.01}
          format={(v) => `${Math.round(v * 100)}`}
          onChange={(v) => set({ tracking: v }, { history: false })}
        />
        <Slider
          id={`${id}-curve`}
          label="Curvatura (texto en arco)"
          value={design.curve}
          min={-1}
          max={1}
          step={0.05}
          format={(v) =>
            v === 0 ? "Recto" : v > 0 ? `Arco ↑ ${Math.round(v * 100)}` : `Arco ↓ ${Math.round(-v * 100)}`
          }
          onChange={(v) => set({ curve: Math.abs(v) < 0.04 ? 0 : v }, { history: false })}
        />
        <Segmented
          label="Alineación"
          value={design.align}
          onChange={(align) => set({ align })}
          options={[
            { value: "left", label: <AlignLeft className="size-4" />, aria: "Izquierda" },
            { value: "center", label: <AlignCenter className="size-4" />, aria: "Centrado" },
            { value: "right", label: <AlignRight className="size-4" />, aria: "Derecha" },
          ]}
        />
      </Advanced>
    </div>
  );
}

/** En la versión compacta (ficha de producto) los ajustes finos van plegados. */
function Advanced({ compact, children }: { compact: boolean; children: ReactNode }) {
  if (!compact) return <>{children}</>;
  return (
    <details className="group rounded-[var(--radius)] border border-line">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between px-3 text-[0.8125rem] font-semibold">
        Más ajustes de texto (interletraje, arco, alineación)
        <span className="text-fg-subtle transition-transform group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="space-y-5 px-3 pt-1 pb-4">{children}</div>
    </details>
  );
}

function TemplatesPanel() {
  const { applyTemplate } = useCustomizer();
  return (
    <div>
      <p className="mb-4 text-[0.875rem] text-fg-muted">
        Elige una plantilla y después edita el texto a tu gusto.
      </p>
      <ul className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => applyTemplate(t.id)}
              className="group flex h-full w-full flex-col items-start gap-1 rounded-[var(--radius-lg)] border border-line p-3 text-left transition-colors hover:border-fg"
            >
              <span
                className="w-full truncate rounded-[var(--radius)] bg-ink px-2 py-3 text-center text-[1.05rem] text-paper/85"
                style={{ fontFamily: `${FONT_CSS[t.preset.font ?? "script"].family}, serif` }}
                aria-hidden="true"
              >
                {t.preset.line1}
              </span>
              <span className="mt-1 text-[0.8125rem] font-semibold">{t.name}</span>
              <span className="text-[0.75rem] text-fg-subtle">{t.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsPanel() {
  const { design, set, resetPosition, showGuides, toggleGuides, background, setBackground, glass } =
    useCustomizer();
  const id = useId();
  const twoFaces = PIECES[glass].faces === 2;
  return (
    <div className="space-y-5">
      <Slider
        id={`${id}-scale`}
        label="Escala"
        value={design.scale}
        min={0.2}
        max={2.5}
        step={0.01}
        format={(v) => `${Math.round(v * 100)} %`}
        onChange={(v) => set({ scale: v }, { history: false })}
      />
      <Slider
        id={`${id}-rot`}
        label="Rotación"
        value={design.rotation}
        min={-45}
        max={45}
        step={1}
        format={(v) => `${v}°`}
        onChange={(v) => set({ rotation: v }, { history: false })}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => set({ x: 0, y: 0 })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-line-strong text-[0.8125rem] font-semibold hover:border-fg"
        >
          <Crosshair className="size-4" /> Centrar
        </button>
        <button
          type="button"
          onClick={resetPosition}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-line-strong text-[0.8125rem] font-semibold hover:border-fg"
        >
          <RotateCcw className="size-4" /> Restablecer
        </button>
      </div>
      {twoFaces ? (
        <Segmented
          label="Cara a grabar"
          value={design.face}
          onChange={(face) => set({ face })}
          options={[
            { value: "front", label: "Delantera" },
            { value: "back", label: "Trasera" },
          ]}
        />
      ) : (
        <p className="text-[0.8125rem] text-fg-subtle">Esta pieza se graba por la cara frontal.</p>
      )}
      <fieldset>
        <legend className="mb-2 text-[0.8125rem] font-semibold">Fondo de la vista previa</legend>
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUNDS.map((b) => (
            <label
              key={b.id}
              className="flex cursor-pointer flex-col items-center gap-1.5 text-center text-[0.6875rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-fg"
            >
              <input
                type="radio"
                name={`${id}-bg`}
                className="sr-only"
                checked={background === b.id}
                onChange={() => setBackground(b.id)}
              />
              <span
                className={cn(
                  "block aspect-square w-full rounded-full border-2",
                  background === b.id ? "border-fg" : "border-line",
                )}
                style={{ background: b.css }}
              />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={toggleGuides}
        className="inline-flex min-h-10 items-center gap-2 text-[0.875rem] font-semibold"
      >
        {showGuides ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        {showGuides ? "Ocultar" : "Mostrar"} guías de zona grabable
      </button>
    </div>
  );
}

export function HistoryButtons({ className }: { className?: string }) {
  const { undo, redo, past, future } = useCustomizer();
  return (
    <div className={cn("flex gap-1", className)}>
      <button
        type="button"
        onClick={undo}
        disabled={!past.length}
        className="inline-flex tap items-center justify-center rounded-full border border-line-strong disabled:opacity-35"
        aria-label="Deshacer"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        type="button"
        onClick={redo}
        disabled={!future.length}
        className="inline-flex tap items-center justify-center rounded-full border border-line-strong disabled:opacity-35"
        aria-label="Rehacer"
      >
        <Redo2 className="size-4" />
      </button>
    </div>
  );
}

/* --------------------------------- conjunto -------------------------------- */

const TABS: { id: ControlTab; label: string }[] = [
  { id: "diseno", label: "Diseño" },
  { id: "texto", label: "Texto" },
  { id: "plantillas", label: "Plantillas" },
  { id: "ajustes", label: "Ajustes" },
];

/** Panel de controles con pestañas (en móvil: barra de pestañas cómoda para el pulgar). */
export function Controls({
  compact = false,
  extraTab,
}: {
  compact?: boolean;
  extraTab?: { id: string; label: string; content: ReactNode };
}) {
  const { design, set } = useCustomizer();
  const [tab, setTab] = useState<string>(design.mode === "image" ? "diseno" : "texto");
  const base = useId();
  const tabs = extraTab ? [...TABS, { id: extraTab.id, label: extraTab.label }] : TABS;

  const content: Record<string, ReactNode> = {
    diseno: (
      <div className="space-y-5">
        <Segmented
          label="¿Qué quieres grabar?"
          value={design.mode}
          onChange={(mode) => set({ mode })}
          options={[
            { value: "text", label: "Texto" },
            { value: "image", label: "Logo o imagen" },
          ]}
        />
        {design.mode === "image" ? <Uploader compact={compact} /> : <TextPanel compact={compact} />}
      </div>
    ),
    texto: <TextPanel compact={compact} />,
    plantillas: <TemplatesPanel />,
    ajustes: <SettingsPanel />,
    ...(extraTab ? { [extraTab.id]: extraTab.content } : {}),
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Opciones de personalización"
        className="relative scrollbar-none flex gap-1 overflow-x-auto border-b border-line"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`${base}-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls={`${base}-panel`}
            onClick={() => setTab(t.id)}
            className={cn(
              "relative min-h-12 shrink-0 px-3.5 text-[0.875rem] font-semibold transition-colors",
              tab === t.id ? "text-fg" : "text-fg-subtle hover:text-fg",
            )}
          >
            {t.label}
            {tab === t.id ? (
              <m.span layoutId={`${base}-u`} className="absolute inset-x-2 -bottom-px h-0.5 bg-fg" />
            ) : null}
          </button>
        ))}
      </div>
      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-${tab}`} className="pt-5">
        {content[tab]}
      </div>
    </div>
  );
}
