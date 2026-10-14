import type { MetadataRoute } from "next";
import { categories } from "@/data/collections";
import { occasions } from "@/data/occasions";
import { site } from "@/data/site";
import { allProducts } from "@/lib/commerce/local-provider";

/** Sitemap de las páginas indexables (sin carrito, checkout ni páginas de cuenta). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: url(path), lastModified: now, changeFrequency, priority });

  return [
    page("/", 1, "weekly"),
    page("/tienda", 0.9, "weekly"),
    page("/personaliza", 0.9),
    ...categories.map((c) => page(`/tienda/${c.handle}`, 0.8, "weekly")),
    ...allProducts().map((p) => page(`/producto/${p.handle}`, 0.8, "weekly")),
    page("/ocasiones", 0.7),
    ...occasions.map((o) => page(`/ocasiones/${o.slug}`, 0.7)),
    page("/empresas", 0.8),
    page("/sobre-nosotros", 0.6),
    page("/tecnica", 0.6),
    page("/contacto", 0.6),
    page("/preguntas-frecuentes", 0.5),
    page("/legal/aviso-legal", 0.2, "yearly"),
    page("/legal/privacidad", 0.2, "yearly"),
    page("/legal/cookies", 0.2, "yearly"),
    page("/legal/envios-y-devoluciones", 0.3, "yearly"),
  ];
}
