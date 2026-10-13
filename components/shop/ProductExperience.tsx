"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { BadgeCheck, Clock, PenLine, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { VariantPicker } from "./VariantPicker";
import { VolumePricing } from "./VolumePricing";
import { FavoriteButton } from "./FavoriteButton";
import { Button } from "@/components/ui/Button";
import { Badge, DemoPriceNote, Price } from "@/components/ui/misc";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { site } from "@/data/site";
import { tierFor, unitPriceFor } from "@/lib/commerce/pricing";
import type { Product } from "@/lib/commerce/types";
import {
  findVariant,
  PENDING_DESIGN,
  selectedFromVariant,
  toCartLine,
  variantById,
} from "@/lib/commerce/variant";
import { thumbnail } from "@/lib/engrave/render";
import { captureDesign, designAttributes, useCustomizer } from "@/lib/engrave/store";
import { DEFAULT_DESIGN, type Design } from "@/lib/engrave/types";
import type { StaticEngraving } from "@/components/glassware/Glass";
import { PIECES } from "@/lib/glass/pieces";
import { useCart } from "@/lib/store/cart";
import { toast } from "@/lib/store/toast";
import { useUI } from "@/lib/store/ui";
import { cn, formatPrice } from "@/lib/utils";

const Stage = dynamic(() => import("@/components/customizer/Stage").then((m) => m.Stage), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/5] items-end justify-center rounded-[var(--radius-lg)] bg-ink pb-6 text-[0.75rem] text-stone-400">
      Cargando el personalizador…
    </div>
  ),
});
const Controls = dynamic(() => import("@/components/customizer/Controls").then((m) => m.Controls), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-[var(--radius-lg)] bg-fg/5" />,
});

/** Diseño inicial a partir del grabado de ejemplo del producto. */
function initialDesign(sample?: StaticEngraving): Partial<Design> {
  if (!sample || sample.kind !== "text") return {};
  const [a, b] = sample.lines;
  return {
    line1: a?.text ?? DEFAULT_DESIGN.line1,
    line2: b?.text ?? "",
    font: a?.font ?? DEFAULT_DESIGN.font,
    font2: b?.font ?? a?.font ?? DEFAULT_DESIGN.font2,
    line2Scale: a && b ? Math.max(0.15, Math.min(1.4, b.size / a.size)) : DEFAULT_DESIGN.line2Scale,
    tracking: a?.tracking ?? 0,
  };
}

const noop = () => () => {};

export function ProductExperience({ product }: { product: Product }) {
  const mf = product.metafields;
  const canPersonalize = mf.personalization.types.length > 0;
  const router = useRouter();
  const idBase = useId();
  const add = useCart((s) => s.add);
  const flyToCart = useUI((s) => s.flyToCart);
  const glass = mf.personalization.engraveOn;
  const touched = useCustomizer((s) => s.touched);

  // variante inicial desde ?variant= (sin efectos: estado externo)
  const urlVariant = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("variant"),
    () => null,
  );
  const [chosen, setChosen] = useState<Record<string, string> | null>(null);
  const selected = chosen ?? selectedFromVariant(variantById(product, urlVariant) ?? product.variants[0]);
  const variant = findVariant(product, selected);
  const [qty, setQty] = useState(mf.minQuantity ?? 1);
  const [personalize, setPersonalize] = useState(canPersonalize);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // inicializar el personalizador con la pieza del producto
  useEffect(() => {
    if (!canPersonalize) return;
    useCustomizer.getState().init({
      glass,
      productHandle: product.handle,
      design: initialDesign(mf.sampleEngraving),
      background: "negro",
    });
    useCustomizer.setState({ touched: false });
  }, [canPersonalize, glass, product.handle, mf.sampleEngraving]);

  const onOption = (name: string, value: string) => {
    const next = { ...selected, [name]: value };
    setChosen(next);
    const v = findVariant(product, next);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", v.id.split("-").pop()!);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  const unit = unitPriceFor(variant.price.amount, mf.volumePricing, qty);
  const tier = tierFor(mf.volumePricing, qty);
  const needsQuote = Boolean(tier?.quote);

  const addToCart = async (buyNow = false) => {
    setAdding(true);
    try {
      let attributes = PENDING_DESIGN;
      let preview: string | undefined;
      if (canPersonalize && personalize) {
        const c = await captureDesign({ width: 480, watermark: false });
        if (c) preview = thumbnail(c, 320);
        attributes = designAttributes(useCustomizer.getState().design, PIECES[glass].label);
      }
      add(toCartLine(product, variant, attributes, preview), qty);
      if (buyNow) {
        toast({
          title: "Añadido al carrito",
          description: `${product.title}${qty > 1 ? ` · ${qty} uds.` : ""}`,
        });
        router.push("/checkout");
        return;
      }
      const r = stageRef.current?.getBoundingClientRect();
      if (r)
        flyToCart({
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          image: preview
            ? `<img src="${preview}" alt="" style="width:100%;height:100%;object-fit:cover" />`
            : undefined,
        });
      else useUI.getState().setCartOpen(true);
    } finally {
      setAdding(false);
    }
  };

  // barra sticky en móvil cuando el botón principal sale de la vista
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    document.documentElement.style.setProperty("--float-offset", showSticky && mobile ? "76px" : "0px");
    return () => document.documentElement.style.setProperty("--float-offset", "0px");
  }, [showSticky]);

  const live = canPersonalize ? (
    <div ref={stageRef}>
      <Stage label={`Vista previa del grabado en ${PIECES[glass].label.toLowerCase()}`} />
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
      {/* galería */}
      <div
        className={cn(
          "self-start lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:col-span-7",
          editing &&
            "max-lg:sticky max-lg:top-0 max-lg:z-20 max-lg:-mx-[var(--gutter)] max-lg:border-b max-lg:border-line max-lg:bg-paper max-lg:px-[var(--gutter)] max-lg:py-2 max-lg:[&_.gallery-arrows]:hidden max-lg:[&_.gallery-thumbs]:hidden",
        )}
      >
        <div>
          <div className={cn(editing && "max-lg:mx-auto max-lg:w-[52vw]")}>
            {canPersonalize ? (
              <ProductGallery product={product} live={live} />
            ) : (
              <ProductGallery product={product} />
            )}
          </div>
          {editing ? (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="mx-auto mt-2 block rounded-full bg-fg px-4 py-1.5 text-[0.75rem] font-semibold text-bg lg:hidden"
            >
              Listo
            </button>
          ) : null}
        </div>
      </div>

      {/* caja de compra */}
      <div className="lg:col-span-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {mf.badge ? <Badge tone="solid">{mf.badge}</Badge> : null}
              <span className="text-[0.75rem] font-semibold tracking-[0.12em] text-fg-subtle uppercase">
                {product.productType}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.1rem,1.6rem+1.8vw,3.25rem)] leading-[1.02] tracking-[-0.015em]">
              {product.title}
            </h1>
          </div>
          <FavoriteButton
            handle={product.handle}
            title={product.title}
            variant="inline"
            className="mt-1 shrink-0"
          />
        </div>
        <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-fg-muted">
          <span className="flex text-fg" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star key={k} className="size-3.5 fill-current" strokeWidth={0} />
            ))}
          </span>
          4,9 <span className="text-fg-subtle">· valoración de ejemplo</span>
        </p>
        <p className="mt-5 text-lead text-fg-muted">{product.description}</p>

        <div className="mt-6 border-t border-line pt-6">
          <div aria-live="polite">
            <Price amount={unit} compareAt={variant.compareAtPrice?.amount} size="lg" />
            <p className="mt-1 text-[0.8125rem] text-fg-subtle">
              {mf.minQuantity ? `Precio por unidad · mínimo ${mf.minQuantity} uds. · ` : ""}IVA incluido
              {qty > 1 ? (
                <>
                  {" "}
                  · Total {qty} uds.: <strong className="text-fg">{formatPrice(unit * qty)}</strong>
                </>
              ) : null}
            </p>
          </div>
          <DemoPriceNote className="mt-2" />
        </div>

        <div className="mt-7">
          <VariantPicker product={product} selected={selected} onChange={onOption} idBase={idBase} />
        </div>

        {mf.volumePricing ? (
          <VolumePricing
            tiers={mf.volumePricing}
            base={variant.price.amount}
            quantity={qty}
            className="mt-7"
          />
        ) : null}

        {canPersonalize ? (
          <section
            id="personalizar"
            aria-labelledby={`${idBase}-pers`}
            className="mt-8 scroll-mt-28 rounded-[var(--radius-lg)] border border-line bg-surface p-4 sm:p-5"
            onFocusCapture={() => setEditing(true)}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id={`${idBase}-pers`} className="flex items-center gap-2 font-display text-2xl">
                <PenLine className="size-5" strokeWidth={1.4} /> Personalízalo
              </h2>
              <label className="flex cursor-pointer items-center gap-2 text-[0.8125rem] font-semibold">
                <input
                  type="checkbox"
                  role="switch"
                  checked={personalize}
                  onChange={(e) => setPersonalize(e.target.checked)}
                  className="size-4 accent-[var(--fg)]"
                />
                Con diseño
              </label>
            </div>
            {personalize ? (
              <>
                <p className="mt-1 text-[0.8125rem] text-fg-subtle">
                  Lo ves al momento en la imagen.{" "}
                  {touched ? "" : "Empieza escribiendo tu texto o sube tu logo."}
                </p>
                <div className="mt-3">
                  <Controls compact />
                </div>
                <Link
                  href={`/personaliza?producto=${product.handle}`}
                  className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold underline-offset-4 hover:underline"
                >
                  <Sparkles className="size-4" /> Abrir el estudio de personalización
                </Link>
              </>
            ) : (
              <p className="mt-2 text-[0.875rem] text-fg-muted">
                Sin problema: añádelo y te contactamos para preparar el diseño contigo antes de grabar.
              </p>
            )}
          </section>
        ) : null}

        <div ref={buyRef} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuantityStepper value={qty} onChange={setQty} min={mf.minQuantity ?? 1} />
          {needsQuote ? (
            <Button
              size="lg"
              className="flex-1"
              onClick={() => router.push(`/empresas?producto=${product.handle}&cantidad=${qty}#presupuesto`)}
            >
              Pedir presupuesto ({qty} uds.)
            </Button>
          ) : (
            <Button size="lg" className="flex-1" loading={adding} onClick={() => addToCart(false)}>
              Añadir al carrito · {formatPrice(unit * qty)}
            </Button>
          )}
        </div>
        {!needsQuote ? (
          <Button
            variant="outline"
            size="lg"
            block
            className="mt-3"
            onClick={() => addToCart(true)}
            disabled={adding}
          >
            Comprar ahora
          </Button>
        ) : null}

        <ul className="mt-8 grid grid-cols-1 gap-3 rounded-[var(--radius-lg)] bg-surface-2 p-5 text-[0.875rem]">
          <li className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} /> Producción en{" "}
            {mf.technical.productionTime}
          </li>
          <li className="flex gap-3">
            <Truck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} /> Envío gratis desde{" "}
            {formatPrice(site.demo.freeShippingThreshold)} (demo) o recogida en el taller
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} /> Grabado permanente: no se
            borra ni se despega
          </li>
          <li className="flex gap-3">
            <BadgeCheck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} /> Revisamos tu diseño contigo
            antes de grabar
          </li>
        </ul>
      </div>

      {/* barra sticky móvil */}
      <div
        className={cn(
          "theme-light fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 safe-bottom backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-out)] lg:hidden",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        data-floating
        aria-hidden={!showSticky}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.8125rem] font-semibold">{product.title}</p>
            <p className="text-[0.9375rem] font-semibold tabular-nums">{formatPrice(unit * qty)}</p>
          </div>
          <Button
            tabIndex={showSticky ? 0 : -1}
            onClick={() => (needsQuote ? router.push("/empresas#presupuesto") : addToCart(false))}
            loading={adding}
          >
            {needsQuote ? "Presupuesto" : "Añadir"}
          </Button>
        </div>
      </div>
    </div>
  );
}
