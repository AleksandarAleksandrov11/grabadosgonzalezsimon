"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  Download,
  FolderOpen,
  LayoutGrid,
  MessageSquareQuote,
  MoreHorizontal,
  Save,
  Share2,
  ShoppingBag,
} from "lucide-react";
import { Stage } from "./Stage";
import { Controls, HistoryButtons } from "./Controls";
import { MultiProductPreview } from "./MultiProductPreview";
import { MyDesigns } from "./MyDesigns";
import { DesignQuoteForm } from "./DesignQuoteForm";
import { Glass } from "@/components/glassware/Glass";
import { VariantPicker } from "@/components/shop/VariantPicker";
import { Modal } from "@/components/ui/Modal";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { DemoPriceNote } from "@/components/ui/misc";
import type { Product } from "@/lib/commerce/types";
import { findVariant, selectedFromVariant, toCartLine } from "@/lib/commerce/variant";
import { loadImageDataUrl, getSource, makeMask, maskToDataUrl } from "@/lib/engrave/image";
import { thumbnail } from "@/lib/engrave/render";
import {
  captureDesign,
  designAttributes,
  designFromQuery,
  designToQuery,
  useCustomizer,
} from "@/lib/engrave/store";
import { PIECES, type GlassId } from "@/lib/glass/pieces";
import { useCart } from "@/lib/store/cart";
import { useDesigns, type SavedDesign } from "@/lib/store/designs";
import { toast } from "@/lib/store/toast";
import { useUI } from "@/lib/store/ui";
import { cn, formatPrice } from "@/lib/utils";

/** Estudio de personalización completo (/personaliza). */
export function Studio({ products }: { products: Product[] }) {
  const { glass, productHandle, design, setGlass } = useCustomizer();
  const add = useCart((s) => s.add);
  const saveDesign = useDesigns((s) => s.save);
  const [multi, setMulti] = useState(false);
  const [mine, setMine] = useState(false);
  const [quote, setQuote] = useState<{ preview: string | null } | null>(null);
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, string> | null>(null);
  const idBase = useId();

  const product =
    products.find((p) => p.handle === productHandle) ??
    products.find((p) => p.metafields.personalization.engraveOn === glass) ??
    products[0];
  const sel = selected && product ? selected : selectedFromVariant(product.variants[0]);
  const variant = findVariant(product, sel);

  // estado inicial desde la URL (?producto=, ?pieza=, ?texto=, ?fuente=, enlace compartido)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const byHandle = products.find((p) => p.handle === sp.get("producto"));
    const pieza = sp.get("pieza") as GlassId | null;
    const byPiece =
      pieza && PIECES[pieza] ? products.find((p) => p.metafields.personalization.engraveOn === pieza) : null;
    const prod =
      byHandle ?? byPiece ?? products.find((p) => p.handle === "copa-vino-tinto-grabada") ?? products[0];
    const g = byHandle
      ? prod.metafields.personalization.engraveOn
      : pieza && PIECES[pieza]
        ? pieza
        : prod.metafields.personalization.engraveOn;
    useCustomizer
      .getState()
      .init({ glass: g, productHandle: prod.handle, design: designFromQuery(sp), background: "negro" });
  }, [products]);

  // atajos de teclado: deshacer / rehacer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) useCustomizer.getState().redo();
        else useCustomizer.getState().undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const choose = (p: Product) => {
    setGlass(p.metafields.personalization.engraveOn, p.handle);
    setSelected(null);
    setMulti(false);
    toast({
      title: `Pieza: ${p.title}`,
      description: "El diseño se mantiene. Ajusta la posición si lo necesitas.",
    });
  };

  const addToCart = async () => {
    setBusy("cart");
    try {
      const c = await captureDesign({ width: 480, watermark: false });
      const preview = c ? thumbnail(c, 320) : undefined;
      add(
        toCartLine(
          product,
          variant,
          designAttributes(useCustomizer.getState().design, PIECES[glass].label),
          preview,
        ),
        product.metafields.minQuantity ?? 1,
      );
      toast({ title: "Añadido al carrito con tu diseño", description: product.title });
      useUI.getState().setCartOpen(true);
    } finally {
      setBusy(null);
    }
  };

  const download = async () => {
    setBusy("download");
    try {
      const c = await captureDesign({ width: 1200, watermark: true });
      if (!c) return;
      c.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `vista-previa-${glass}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, "image/png");
      toast({ title: "Vista previa descargada", description: "PNG con marca de agua «Vista previa»." });
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    setBusy("save");
    try {
      const d = useCustomizer.getState().design;
      const c = await captureDesign({ width: 360, watermark: false });
      let imageData: string | undefined;
      if (d.mode === "image") {
        const src = getSource(d.imageId);
        if (src) imageData = maskToDataUrl(makeMask(src, d.threshold, d.invert));
      }
      saveDesign({
        name:
          d.mode === "image"
            ? (d.imageName ?? "Logo")
            : [d.line1, d.line2].filter(Boolean).join(" · ") || "Diseño",
        design: d,
        glass,
        productHandle: product.handle,
        preview: c ? thumbnail(c, 220, 25_000) : "",
        imageData,
      });
      toast({ title: "Diseño guardado", description: "Lo tienes en «Mis diseños» (en este navegador)." });
    } finally {
      setBusy(null);
    }
  };

  const load = async (s: SavedDesign) => {
    let patch = s.design;
    if (s.design.mode === "image" && s.imageData) {
      const src = await loadImageDataUrl(s.imageData, s.design.imageName ?? "logo", `saved:${s.id}`);
      patch = { ...s.design, imageId: src.id, threshold: 200, invert: false };
    }
    useCustomizer.getState().init({ glass: s.glass, productHandle: s.productHandle, design: patch });
    useCustomizer.getState().bumpImage();
    setMine(false);
    toast({ title: "Diseño cargado", description: s.name });
  };

  const share = async () => {
    const url = `${window.location.origin}/personaliza?${designToQuery(useCustomizer.getState().design, glass)}`;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches)
        await navigator.share({ title: "Mi diseño grabado", url });
      else await navigator.clipboard.writeText(url);
      toast({
        title: "Enlace copiado",
        description:
          design.mode === "image"
            ? "Ojo: la imagen subida no viaja en el enlace (no la subimos a ningún servidor)."
            : "Quien lo abra verá tu diseño.",
      });
    } catch {
      toast({ title: "No se pudo copiar", description: url, tone: "error" });
    }
  };

  const openQuote = async () => {
    const c = await captureDesign({ width: 480, watermark: true });
    setQuote({ preview: c ? thumbnail(c, 400, 80_000) : null });
  };

  const summary = designAttributes(design, PIECES[glass].label)
    .filter((a) => !a.key.startsWith("_"))
    .map((a) => `· ${a.key}: ${a.value}`)
    .join("\n");

  const productTab = {
    id: "producto",
    label: "Producto",
    content: (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setMulti(true)}
          className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-ink p-4 text-left text-paper"
        >
          <span>
            <span className="block font-semibold">Ver mi diseño en todos los productos</span>
            <span className="text-[0.8125rem] text-stone-300">Compara en 8 piezas a la vez</span>
          </span>
          <LayoutGrid className="size-5 shrink-0" />
        </button>
        <fieldset>
          <legend className="mb-3 text-[0.8125rem] font-semibold">Pieza</legend>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {products.map((p) => {
              const on = p.handle === product.handle;
              return (
                <li key={p.handle}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(p)}
                    className={cn(
                      "flex w-full flex-col items-center gap-1 rounded-[var(--radius)] border p-1.5 text-center transition-colors",
                      on ? "border-fg bg-fg/[0.05]" : "border-line hover:border-fg/50",
                    )}
                  >
                    <span className="theme-dark block w-full rounded-[3px] bg-ink">
                      <Glass id={p.metafields.illustration} tone="dark" />
                    </span>
                    <span className="line-clamp-2 text-[0.6875rem] leading-tight font-medium">{p.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <VariantPicker
          product={product}
          selected={sel}
          onChange={(n, v) => setSelected({ ...sel, [n]: v })}
          idBase={idBase}
        />
      </div>
    ),
  };

  const secondaryActions = [
    { id: "download", label: "Descargar vista previa", icon: Download, onClick: download },
    { id: "save", label: "Guardar diseño", icon: Save, onClick: save },
    { id: "mine", label: "Mis diseños", icon: FolderOpen, onClick: () => setMine(true) },
    { id: "quote", label: "Pedir presupuesto", icon: MessageSquareQuote, onClick: openQuote },
    {
      id: "share",
      label: "Compartir enlace",
      icon: Share2,
      onClick: share,
      title:
        design.mode === "image"
          ? "Una imagen subida no se puede compartir por enlace: solo viaja la configuración de texto y posición."
          : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
      {/* lienzo */}
      <div className="sticky top-0 z-20 -mx-[var(--gutter)] self-start bg-paper/95 px-[var(--gutter)] pt-2 pb-3 backdrop-blur lg:top-[calc(var(--header-h)+1rem)] lg:col-span-7 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div>
          <div className="mx-auto w-[min(100%,calc(44svh*0.8))] lg:w-full">
            <Stage label={`Vista previa del grabado en ${PIECES[glass].label.toLowerCase()}`} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <HistoryButtons />
            <p className="hidden text-[0.75rem] text-fg-subtle sm:block">
              Arrastra para mover · pellizca o usa + / − · flechas del teclado
            </p>
            <button
              type="button"
              onClick={() => setMulti(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fg px-4 text-[0.8125rem] font-semibold transition-colors hover:bg-fg hover:text-bg"
            >
              <LayoutGrid className="size-4" /> Ver en todos
            </button>
          </div>
        </div>
      </div>

      {/* controles */}
      <div className="pb-28 lg:col-span-5 lg:pb-0">
        <div className="flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-4">
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold tracking-[0.1em] text-fg-subtle uppercase">
              Pieza seleccionada
            </p>
            <Link
              href={`/producto/${product.handle}`}
              className="mt-1 block truncate font-semibold hover:underline"
            >
              {product.title}
            </Link>
            <p className="text-[0.875rem] text-fg-muted">
              {variant.title !== "Default Title" ? `${variant.title} · ` : ""}
              <span className="font-semibold text-fg">{formatPrice(variant.price.amount)}</span>
              {product.metafields.minQuantity ? ` /ud · mín. ${product.metafields.minQuantity}` : ""}
            </p>
            <DemoPriceNote className="mt-1" />
          </div>
        </div>
        <div className="mt-6">
          <Controls extraTab={productTab} />
        </div>

        {/* acciones (escritorio) */}
        <div className="mt-8 hidden space-y-3 lg:block">
          <Button
            size="lg"
            block
            onClick={addToCart}
            loading={busy === "cart"}
            iconLeft={<ShoppingBag className="size-4" />}
          >
            Añadir al carrito con este diseño
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {secondaryActions.map((a) => (
              <Button
                key={a.id}
                variant="outline"
                size="sm"
                onClick={a.onClick}
                loading={busy === a.id}
                iconLeft={<a.icon className="size-4" />}
                title={a.title}
              >
                {a.label}
              </Button>
            ))}
          </div>
          {design.mode === "image" ? (
            <p className="text-[0.75rem] text-fg-subtle">
              Compartir enlace: la imagen subida no viaja en el enlace porque no la subimos a ningún servidor.
            </p>
          ) : null}
        </div>
      </div>

      {/* barra de acciones (móvil) */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 safe-bottom backdrop-blur-xl lg:hidden"
        data-floating
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMore(true)}
            className="inline-flex tap shrink-0 items-center justify-center rounded-[var(--radius)] border border-line-strong"
            aria-label="Más acciones"
          >
            <MoreHorizontal className="size-5" />
          </button>
          <Button
            className="flex-1"
            onClick={addToCart}
            loading={busy === "cart"}
            iconLeft={<ShoppingBag className="size-4" />}
          >
            Añadir · {formatPrice(variant.price.amount)}
          </Button>
        </div>
      </div>

      <Modal open={multi} onClose={() => setMulti(false)} title="Tu diseño en todos los productos" size="xl">
        <MultiProductPreview products={products} onChoose={choose} />
      </Modal>
      <Modal open={mine} onClose={() => setMine(false)} title="Mis diseños" size="lg">
        <div className="px-5 pb-6">
          <MyDesigns onLoad={load} />
        </div>
      </Modal>
      <Modal
        open={Boolean(quote)}
        onClose={() => setQuote(null)}
        title="Pedir presupuesto con este diseño"
        size="lg"
      >
        {quote ? (
          <DesignQuoteForm
            preview={quote.preview}
            summary={`${product.title}\n${summary}`}
            onDone={() => setQuote(null)}
          />
        ) : null}
      </Modal>
      <Drawer
        open={more}
        onClose={() => setMore(false)}
        title="Más acciones"
        side="bottom"
        mobileHeight="auto"
      >
        <ul className="grid grid-cols-1 gap-2 px-5 py-4">
          <li>
            <button
              type="button"
              onClick={() => {
                setMore(false);
                setMulti(true);
              }}
              className="flex min-h-12 w-full items-center gap-3 rounded-[var(--radius)] px-2 text-left font-semibold hover:bg-fg/5"
            >
              <LayoutGrid className="size-5" /> Ver en todos los productos
            </button>
          </li>
          {secondaryActions.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  setMore(false);
                  a.onClick();
                }}
                className="flex min-h-12 w-full items-center gap-3 rounded-[var(--radius)] px-2 text-left font-semibold hover:bg-fg/5"
              >
                <a.icon className="size-5" /> {a.label}
              </button>
              {a.title ? <p className="pl-10 text-[0.75rem] text-fg-subtle">{a.title}</p> : null}
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  );
}
