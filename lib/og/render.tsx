import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { GlassMarkup, type StaticEngraving } from "@/components/glassware/Glass";
import { LOGO_MARK_PATH, LOGO_MARK_VIEWBOX } from "@/components/brand/logo-mark-path";
import { site } from "@/data/site";
import { PIECES, type GlassId } from "@/lib/glass/pieces";
import { svgToString } from "./svg-string";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

async function fonts() {
  const [serif, serifItalic, sans] = await Promise.all([
    font("CormorantGaramond-Medium.ttf"),
    font("CormorantGaramond-MediumItalic.ttf"),
    font("Manrope-SemiBold.ttf"),
  ]);
  return [
    { name: "Cormorant", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Cormorant", data: serifItalic, weight: 500 as const, style: "italic" as const },
    { name: "Manrope", data: sans, weight: 600 as const, style: "normal" as const },
  ];
}

/** SVG de la pieza (sin grabados de texto: el SVG embebido no tiene acceso a las fuentes). */
function glassDataUri(id: GlassId, engraving?: StaticEngraving) {
  const markup = svgToString(
    GlassMarkup({
      uid: "og",
      id,
      tone: "dark",
      engraving: engraving?.kind === "logo" ? engraving : undefined,
    }),
  ).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" ');
  return `data:image/svg+xml;base64,${Buffer.from(markup).toString("base64")}`;
}

type OgInput = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  foot?: string;
  glass: GlassId;
  engraving?: StaticEngraving;
};

/** Imagen Open Graph común: titular a la izquierda, pieza grabada a la derecha. */
export async function ogImage({ eyebrow, title, subtitle, foot, glass, engraving }: OgInput) {
  const W = 430;
  const H = (W * 500) / 400;
  const zone = PIECES[glass].zone;
  const textLine = engraving?.kind === "text" && zone.w > 0 ? engraving.lines[0] : null;
  const long = title.length > 46;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "radial-gradient(60% 80% at 78% 45%, #262624 0%, #0a0a0a 70%)",
        color: "#fafaf7",
        fontFamily: "Manrope",
        padding: "64px 72px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg viewBox={LOGO_MARK_VIEWBOX} width={34} height={68}>
            <path d={LOGO_MARK_PATH} fill="#fafaf7" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Cormorant", fontSize: 30, lineHeight: 1 }}>{site.shortName}</span>
            <span style={{ fontSize: 12, letterSpacing: 5, color: "#a8a29e", marginTop: 6 }}>
              GRABADOS EN CRISTAL
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <span style={{ fontSize: 16, letterSpacing: 4, color: "#cfc8bb", textTransform: "uppercase" }}>
            {eyebrow}
          </span>
          <span
            style={{
              fontFamily: "Cormorant",
              fontSize: long ? 60 : 74,
              lineHeight: 1.02,
              marginTop: 18,
              letterSpacing: -1,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontSize: 22, lineHeight: 1.4, color: "#d6d3d1", marginTop: 22, maxWidth: 580 }}>
              {subtitle}
            </span>
          ) : null}
        </div>
        <span style={{ fontSize: 16, color: "#a8a29e" }}>
          {foot ?? "Grabado artesanal con chorro de arena · Madrid"}
        </span>
      </div>
      <div style={{ display: "flex", position: "relative", width: W, height: H, marginTop: -40 }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={glassDataUri(glass, engraving)} width={W} height={H} />
        {textLine ? (
          <div
            style={{
              position: "absolute",
              left: (zone.x / 400) * W,
              top: (zone.y / 500) * H,
              width: (zone.w / 400) * W,
              height: (zone.h / 500) * H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontFamily: "Cormorant",
              fontStyle: textLine.font === "script" || textLine.font === "pinyon" ? "italic" : "normal",
              fontSize: Math.min(64, Math.max(22, textLine.size * W * 0.42)),
              color: "rgba(255,255,255,0.78)",
              letterSpacing: (textLine.tracking ?? 0) * 20,
            }}
          >
            {textLine.text}
          </div>
        ) : null}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts() },
  );
}
