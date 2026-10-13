import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * Configuración de Next.js para la demo de Grabados González Simón.
 *
 * Decisión: NO activamos `cacheComponents`. Toda la tienda es contenido
 * estático (SSG con `generateStaticParams`) y el estado vive en el cliente
 * (carrito, pedidos, favoritos en localStorage). El modelo estático clásico
 * es más simple, se sirve 100 % desde la CDN de Vercel y evita que las rutas
 * se queden montadas en segundo plano (`<Activity>`), lo que complicaría
 * GSAP/Lenis y los canvas animados. Ver README › Decisiones.
 *
 * Las cabeceras de seguridad, la caché larga y los redirects 301 viven en
 * `vercel.json` (fuente única de verdad en producción). En local
 * replicamos las cabeceras básicas para poder probarlas con `next start`.
 */

const withBundleAnalyzer = bundleAnalyzer({
  // Solo aplica a builds con webpack: `pnpm analyze:webpack`.
  // Con Turbopack (por defecto) se usa `pnpm analyze` → `next analyze`.
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withBundleAnalyzer(nextConfig);
