import { Fragment, isValidElement, type ReactNode } from "react";

/**
 * Serializador mínimo de elementos React SVG a texto (sin react-dom/server,
 * que Next no permite en las rutas de imágenes). Solo para SVG estáticos sin hooks.
 */
const KEEP_CAMEL = new Set([
  "viewBox",
  "preserveAspectRatio",
  "gradientUnits",
  "gradientTransform",
  "patternUnits",
  "patternContentUnits",
  "patternTransform",
  "stdDeviation",
  "baseFrequency",
  "numOctaves",
  "filterUnits",
  "primitiveUnits",
  "maskUnits",
  "maskContentUnits",
  "clipPathUnits",
  "markerWidth",
  "markerHeight",
  "refX",
  "refY",
  "pathLength",
  "spreadMethod",
  "tableValues",
  "kernelMatrix",
  "startOffset",
  "textLength",
  "lengthAdjust",
  "surfaceScale",
  "specularExponent",
  "specularConstant",
  "diffuseConstant",
  "edgeMode",
  "stitchTiles",
  "xChannelSelector",
  "yChannelSelector",
  "in2",
]);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function attrName(k: string) {
  if (k === "className") return "class";
  if (k === "xlinkHref") return "xlink:href";
  if (KEEP_CAMEL.has(k) || k.startsWith("aria-") || k.startsWith("data-")) return k;
  return k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

function styleString(style: Record<string, string | number>) {
  return Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
    .join(";");
}

export function svgToString(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return esc(String(node));
  if (Array.isArray(node)) return node.map(svgToString).join("");
  if (!isValidElement(node)) return "";
  const { type } = node;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  if (typeof type === "function") return svgToString((type as (p: unknown) => ReactNode)(props));
  if ((type as unknown) === Fragment) return svgToString(props.children);
  if (typeof type !== "string") return "";
  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && k !== "key" && v !== undefined && v !== null && v !== false)
    .filter(([, v]) => typeof v !== "function")
    .map(([k, v]) =>
      k === "style" && typeof v === "object"
        ? `style="${esc(styleString(v as Record<string, string | number>))}"`
        : `${attrName(k)}="${esc(String(v))}"`,
    )
    .join(" ");
  return `<${type}${attrs ? ` ${attrs}` : ""}>${svgToString(props.children)}</${type}>`;
}
