# Grabados González Simón — tienda online (demo)

Demo de tienda online premium para **Grabados González Simón**, taller de grabado en cristal con chorro
de arena en Madrid. Preparada por AAS Marketing para presentar al cliente.

> **Es una demostración.** No hay pedidos ni cobros reales: el carrito, los pedidos de prueba, los
> favoritos y los diseños se guardan solo en el navegador (`localStorage`). Los precios, plazos y
> envíos son **orientativos de ejemplo** y los datos pendientes aparecen marcados como
> `[pendiente]` en la web (lista completa en [`CONTENT_TODO.md`](./CONTENT_TODO.md)).

## Qué incluye

- **Home** con hero animado de «chorro de arena» que graba la copa, ocasiones, prueba rápida de
  grabado, productos destacados, técnica paso a paso (scroll fijado con GSAP en escritorio), bloque
  para empresas, historia, galería, reseñas de ejemplo, FAQ y contacto.
- **Tienda** con 21 productos + estuche regalo, 7 categorías, filtros (categoría, ocasión, precio,
  personalización, búsqueda) y orden sincronizados con la URL (`/tienda?ocasion=boda&orden=precio-asc`).
- **Ficha de producto** con variantes, precio por volumen, personalizador embebido (texto o logo,
  vista previa en tiempo real), «Completa el set», FAQ y JSON-LD de producto.
- **Estudio de personalización** (`/personaliza`): 6 tipografías, 2 líneas, curvatura, ornamentos,
  plantillas, subida de logo (PNG/JPG/SVG/WEBP; elimina el fondo blanco en el navegador), cara
  delantera/trasera, deshacer/rehacer, «Ver en 8 productos», guardar diseños y compartir por URL.
- **Carrito** (lateral y página) con miniatura del grabado, deshacer al eliminar, envío gratis,
  códigos `DEMO10` / `BODA15`, nota y estuche regalo.
- **Checkout simulado** en 4 pasos con validación (Zod), 52 provincias con CP coherente, recogida en
  taller, envío urgente y pago simulado (tarjeta de prueba, Bizum, transferencia) → pedido
  `GGS-2026-XXXX` con confirmación animada, seguimiento, impresión y **Mis pedidos**.
- **Ocasiones** (10 páginas), **Empresas** (tabla de volumen y presupuesto con vista previa del logo
  grabado), **Sobre nosotros**, **La técnica**, **Contacto** (mapa bajo demanda), **FAQ** con
  buscador, páginas **legales**, **favoritos** y 404 propia («Esta página se ha quedado sin grabar»).
- **SEO**: metadatos por página, JSON-LD (LocalBusiness, Organization, WebSite, Product,
  BreadcrumbList, FAQPage), sitemap, robots, manifest e imágenes Open Graph generadas por producto y
  ocasión.
- Capa de comercio **compatible con Shopify** (`lib/commerce/`) y exportación del catálogo a CSV de
  Shopify ([`SHOPIFY_MIGRATION.md`](./SHOPIFY_MIGRATION.md)).

### Datos de prueba

| Qué                  | Valor                                                                  |
| -------------------- | ---------------------------------------------------------------------- |
| Códigos de descuento | `DEMO10` (−10 % en todo) · `BODA15` (−15 % en productos de boda)       |
| Tarjeta de prueba    | `4242 4242 4242 4242`, cualquier fecha futura y CVC (botón «Rellenar») |
| Logos de ejemplo     | Botón «Probar con un logo de ejemplo» (marcas **ficticias**)           |
| Borrar todo          | `/mis-pedidos` → «Borrar datos de la demo»                             |

## Puesta en marcha

Requisitos: **Node.js 20.9 o superior** (recomendado 24, ver `.nvmrc`) y **pnpm** (`corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

| Script                                         | Para qué                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Desarrollo (Turbopack)                                                            |
| `pnpm build` / `pnpm start`                    | Build de producción y servidor local                                              |
| `pnpm lint` · `pnpm typecheck` · `pnpm format` | ESLint · TypeScript estricto · Prettier                                           |
| `pnpm test:e2e`                                | Tests E2E con Playwright (móvil y escritorio) sobre la build (`pnpm build` antes) |
| `pnpm screenshots`                             | Capturas de 20 rutas a 390 / 768 / 1440 px en `screenshots/`                      |
| `pnpm analyze`                                 | Análisis de bundle de Turbopack (`.next/diagnostics/analyze`)                     |
| `pnpm shopify:csv`                             | Regenera `shopify/products.csv` desde `data/products.ts`                          |

> Playwright: `pnpm exec playwright install chromium` la primera vez. Si ya tienes un Chromium,
> puedes usarlo con `PW_CHROMIUM_PATH=/ruta/a/chrome pnpm test:e2e`.

## Despliegue en Vercel (paso a paso)

No hace falta ninguna variable de entorno.

1. Sube el repositorio a GitHub (ya lo está) y entra en [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository** → elige `grabadosgonzalezsimon`.
3. Vercel detecta **Next.js** automáticamente: deja _Build Command_, _Output Directory_ e _Install
   Command_ por defecto (usa `pnpm` por el `pnpm-lock.yaml`).
4. Pulsa **Deploy**. En 1–2 minutos tendrás la URL `https://<proyecto>.vercel.app`.
5. (Opcional) En **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = URL pública definitiva (canonical, sitemap y Open Graph). Si no se
     define se usa `https://grabadosgonzalezsimon.vercel.app`.
   - `NEXT_PUBLIC_INDEXABLE` = `true` **solo** cuando la web sea la oficial. Por defecto la demo
     no se indexa (`robots.txt` bloquea y `<meta robots="noindex">`) para no competir con la web
     actual del cliente.
     Tras cambiar variables, **Redeploy**.
6. (Al publicar) **Settings → Domains** → añade el dominio del cliente y sigue las instrucciones
   DNS. Las redirecciones 301 de las URLs antiguas (`/sobre-mi`, `/productos`,
   `/política-privacidad`, `/política-cookies`, `/aviso-legal`) ya están en `vercel.json`.

`vercel.json` también define cabeceras de seguridad (CSP, HSTS, `X-Frame-Options`, `Permissions-Policy`)
y caché larga para los estáticos.

## Estructura

```
app/
  (marketing)/        home, ocasiones, empresas, sobre-nosotros, tecnica, contacto, FAQ, legal
  (shop)/             tienda, tienda/[categoria], producto/[handle], personaliza, carrito,
                      checkout, pedido/[id], mis-pedidos, favoritos
  api/contact|quote/  Route Handlers: validan con Zod y responden 200 sin enviar nada (demo)
  og/                 imágenes Open Graph por producto y ocasión (next/og, generadas en el build)
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx not-found.tsx
components/
  brand/ glassware/   logo vectorizado del cliente y sistema SVG paramétrico de cristalería
  customizer/         estudio de personalización (canvas)
  cart/ checkout/ orders/ shop/ home/ occasions/ forms/ layout/ legal/ motion/ ui/ seo/
data/                 site.ts (datos del negocio, ÚNICA fuente), products, collections,
                      occasions, faqs, testimonials, navigation
lib/
  commerce/           tipos tipo Shopify, provider local, stub de Shopify, precios, descuentos
  engrave/            motor de grabado: render en canvas, imágenes/máscaras, plantillas, fuentes
  glass/              geometría y piezas (perfiles, zonas grabables)
  store/              Zustand (carrito, pedidos, favoritos, diseños) con persistencia segura
  seo/ og/            metadatos, JSON-LD e imágenes OG
  validation.ts       esquemas Zod (contacto, presupuesto, checkout)
tests/                Playwright: e2e.spec.ts y screenshots.spec.ts (+ fixtures de logos)
shopify/products.csv  catálogo listo para importar en Shopify
scripts/              generate-shopify-csv.mjs
docs/                 análisis de la web actual y guion de la demo
```

## Decisiones técnicas

- **Next.js 16 (App Router, Turbopack) + React 19 + TypeScript estricto + Tailwind 4.** Todas las
  páginas son estáticas (SSG con `generateStaticParams` y `dynamicParams = false`); solo
  `/pedido/[id]` y las API son dinámicas. No se usa `cacheComponents` porque no hay datos remotos.
- **Datos del negocio centralizados** en `data/site.ts`. Nada de datos inventados: año, años de
  oficio, piezas grabadas, nombre del artesano, horario o CP aparecen como placeholders visibles y
  con `TODO:` en el código.
- **Comercio desacoplado** (`lib/commerce`): tipos que imitan la Storefront API de Shopify
  (`Product`, `ProductVariant`, `Money`, `metafields`, `CartLine.attributes` = line item
  properties). Migrar = cambiar el provider.
- **Estado en cliente** con Zustand + `persist` y `skipHydration` (el servidor siempre pinta el
  estado vacío y se rehidrata tras montar → sin errores de hidratación). `localStorage` envuelto
  para tolerar cuota llena o modo privado; sincronización entre pestañas.
- **Sin fotos de stock**: la cristalería es un **sistema SVG paramétrico** propio (perfiles con
  splines, elipses en perspectiva, reflejos que siguen la curvatura y capa delantera/trasera para
  que el grabado quede «dentro» del cristal). Las únicas fotos son las del cliente.
- **Personalizador en canvas**: diseño plano → deformación cilíndrica → textura esmerilada → recorte
  a la zona grabable. Los logos se procesan en el navegador (alfa o distancia al color de fondo +
  umbral) y nunca se suben a un servidor. Las miniaturas del carrito se comprimen (≤ 60 KB).
- **Animación con criterio**: Motion (`LazyMotion` + `m`), GSAP/ScrollTrigger solo donde aporta
  (carga dinámica), Lenis solo en escritorio y todo respeta `prefers-reduced-motion`. Las
  animaciones de entrada del primer pantallazo son CSS (no esperan a la hidratación).
- **Móvil primero**: probado a 390 px como dispositivo real; los tests de capturas fallan si
  alguna página es más ancha que la pantalla.
- **Formularios** con React Hook Form + Zod (mismos esquemas en cliente y servidor). El formulario
  rápido usa reglas nativas para no cargar Zod en todas las páginas.
- **Accesibilidad**: navegación por teclado, foco visible, trampas de foco en modales, `aria-live`
  en carrito y formularios, contraste AA, saltar al contenido, textos alternativos.
- **Privacidad**: sin analíticas ni cookies de terceros; Google Maps solo se carga al pulsar.

## Verificación

- `pnpm build`, `pnpm lint` y `pnpm typecheck` sin errores ni avisos.
- **E2E (Playwright, móvil 390 px y escritorio 1440 px): 14 tests superados** — compra completa
  home → producto → texto → carrito → `DEMO10` → checkout → pedido `GGS-…` → Mis pedidos (con
  comprobación del total), checkout con carrito vacío, logo **PNG transparente** y **JPG con fondo
  blanco** en el personalizador (se graba el logo y se descarta el fondo), filtros en la URL, 404 y
  presupuesto de empresa. Las redirecciones de `vercel.json` se prueban contra un despliegue
  (`PLAYWRIGHT_BASE_URL=https://….vercel.app pnpm test:e2e`).
- **Capturas: 60 superadas** (20 rutas × 390/768/1440 px) sin errores de consola ni desbordamiento
  horizontal, y revisadas visualmente.

### Rendimiento (Lighthouse 12, móvil simulado, build de producción)

| Página                                       | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP   | LCP   | TBT    | CLS  |
| -------------------------------------------- | ----------- | ------------- | ---------------- | --- | ----- | ----- | ------ | ---- |
| Home `/`                                     | 81          | 100           | 100              | 100 | 2,3 s | 4,4 s | 120 ms | 0    |
| Tienda `/tienda`                             | 87          | 100           | 100              | 100 | 2,0 s | 3,6 s | 150 ms | 0,03 |
| Producto `/producto/copa-vino-tinto-grabada` | 88          | 100           | 100              | 100 | 1,8 s | 3,6 s | 90 ms  | 0    |

Medido con `NEXT_PUBLIC_INDEXABLE=true` (con la demo no indexable el SEO baja por el `noindex`
intencionado) y servidor local con gzip; Vercel sirve Brotli y CDN, así que en producción el HTML
pesa menos. El LCP observado sin limitación es de ~0,2 s (es el texto del hero, pintado en el primer
frame); el LCP simulado lo penaliza el JavaScript que se descarga antes.

Optimizaciones aplicadas: trazados SVG compactados (−34 % de HTML en la home), payload de
tarjetas sin descripciones largas, overlays (carrito, búsqueda, vista rápida) y lienzo del hero en
chunks diferidos, fuentes de grabado sin `preload`, Zod fuera del bundle común.

JavaScript inicial (gzip, de `pnpm analyze`): ~215 KB compartidos; 216–274 KB por ruta (la más
pesada, `/checkout` y `/empresas`, por los formularios).

Próximos pasos si se quiere subir más: sustituir las ilustraciones SVG por fotos optimizadas cuando
existan (menos HTML), y renderizar en cliente las piezas que quedan por debajo del pliegue.

## Documentación

- [`CONTENT_TODO.md`](./CONTENT_TODO.md) — todo lo que hay que confirmar o pedir al cliente.
- [`SHOPIFY_MIGRATION.md`](./SHOPIFY_MIGRATION.md) — cómo pasar a Shopify (tema OS 2.0 o headless).
- [`docs/guion-demo.md`](./docs/guion-demo.md) — guion para presentar la demo en 5 minutos.
- [`docs/analisis-web-actual.md`](./docs/analisis-web-actual.md) — análisis de la web actual.
