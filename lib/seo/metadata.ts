import type { Metadata } from "next";
import { site } from "@/data/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Ruta absoluta o relativa de una imagen OG específica (si no, se usa la del segmento). */
  image?: string;
  noIndex?: boolean;
  /** Título sin la plantilla «%s · Grabados González Simón». */
  absoluteTitle?: boolean;
};

/** Metadata coherente por página: title, description, canonical, OG y Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const url = path === "/" ? "/" : path;
  // Sin imagen propia se usa la OG general (app/opengraph-image.tsx). Las rutas con
  // opengraph-image propio (ocasiones) la sustituyen automáticamente.
  image ??= "/opengraph-image";
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle ? title : `${title} · ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} · ${site.name}`,
      description,
      images: [image],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
