"use client";

import { useRef, useState } from "react";
import { ImageUp, Loader2, Sparkles } from "lucide-react";
import { DEMO_LOGOS } from "@/components/brand/demo-logos";
import { ACCEPTED_TYPES, ImageError, loadImageFile, loadImageUrl } from "@/lib/engrave/image";
import { useCustomizer } from "@/lib/engrave/store";
import { cn } from "@/lib/utils";

/** Subida de logo/imagen (arrastrar y soltar o botón) + logos de ejemplo. Todo en el navegador. */
export function Uploader({ compact = false }: { compact?: boolean }) {
  const { design, set, bumpImage } = useCustomizer();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoIdx, setDemoIdx] = useState(0);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const src = await loadImageFile(file);
      set({ mode: "image", imageId: src.id, imageName: file.name, threshold: src.defaultThreshold, invert: false, x: 0, y: 0, scale: 1, rotation: 0 });
      bumpImage();
    } catch (e) {
      setError(e instanceof ImageError ? e.message : "No hemos podido procesar la imagen. Prueba con otra.");
    } finally {
      setBusy(false);
    }
  };

  const tryDemo = async () => {
    setError(null);
    setBusy(true);
    const logo = DEMO_LOGOS[demoIdx % DEMO_LOGOS.length];
    try {
      const src = await loadImageUrl(logo.file, `${logo.name} (ejemplo).svg`);
      set({ mode: "image", imageId: src.id, imageName: `${logo.name} (logo de ejemplo)`, threshold: src.defaultThreshold, invert: false, x: 0, y: 0, scale: 1, rotation: 0 });
      bumpImage();
      setDemoIdx((n) => n + 1);
    } catch {
      setError("No se pudo cargar el logo de ejemplo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed px-4 text-center transition-colors",
          compact ? "py-6" : "py-9",
          drag ? "border-fg bg-fg/[0.06]" : "border-line-strong hover:border-fg/60",
        )}
      >
        {busy ? <Loader2 className="size-7 animate-spin" aria-hidden="true" /> : <ImageUp className="size-7" strokeWidth={1.3} aria-hidden="true" />}
        <p className="text-[0.9375rem] font-semibold">
          {busy ? "Procesando tu imagen…" : design.mode === "image" && design.imageName ? design.imageName : "Arrastra aquí tu logo o imagen"}
        </p>
        <p className="text-[0.8125rem] text-fg-subtle">PNG, JPG, SVG o WEBP · máx. 10 MB · no se sube a ningún servidor</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-[0.875rem] font-semibold text-bg"
        >
          {design.mode === "image" && design.imageName ? "Cambiar imagen" : "Elegir archivo"}
        </button>
        <input
          ref={input}
          type="file"
          accept={[...ACCEPTED_TYPES, ".svg"].join(",")}
          className="sr-only"
          aria-label="Subir logo o imagen"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-[var(--radius)] border border-[#b3261e]/30 bg-[#b3261e]/5 px-3 py-2 text-[0.875rem] text-[#b3261e] [.theme-dark_&]:text-[#ffb4ab]">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={tryDemo}
        disabled={busy}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius)] border border-line-strong text-[0.875rem] font-semibold transition-colors hover:border-fg"
      >
        <Sparkles className="size-4" /> Probar con un logo de ejemplo
        <span className="font-normal text-fg-subtle">({DEMO_LOGOS[demoIdx % DEMO_LOGOS.length].name})</span>
      </button>
      {design.mode === "image" && design.imageId ? <MaskControls /> : null}
    </div>
  );
}

function MaskControls() {
  const { design, set, checkpoint } = useCustomizer();
  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-line p-4">
      <div>
        <label htmlFor="threshold" className="flex justify-between text-[0.8125rem] font-semibold">
          Umbral (quitar fondo)
          <span className="font-normal text-fg-subtle tabular-nums">{design.threshold}</span>
        </label>
        <input
          id="threshold"
          type="range"
          min={20}
          max={254}
          value={design.threshold}
          onPointerDown={checkpoint}
          onChange={(e) => set({ threshold: Number(e.target.value) }, { history: false })}
          className="range-input mt-2"
        />
        <p className="mt-1 text-[0.75rem] text-fg-subtle">Súbelo si se pierden detalles; bájalo si aparece el fondo.</p>
      </div>
      <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 text-[0.875rem] font-semibold">
        Invertir (logo en negativo)
        <input type="checkbox" role="switch" checked={design.invert} onChange={(e) => set({ invert: e.target.checked })} className="size-5 accent-[var(--fg)]" />
      </label>
    </div>
  );
}
