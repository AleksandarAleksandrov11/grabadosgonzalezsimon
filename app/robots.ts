import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    // Demo: no indexar (ver NEXT_PUBLIC_INDEXABLE en .env.example)
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/carrito", "/checkout", "/pedido/", "/mis-pedidos", "/favoritos"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
