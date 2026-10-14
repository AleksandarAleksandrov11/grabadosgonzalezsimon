# Migración a Shopify

La demo se ha construido para que pasar a Shopify sea **trasladar datos, no rehacer la tienda**:

- Los tipos de `lib/commerce/types.ts` imitan la **Storefront API** (`Product`, `ProductVariant`,
  `Money`, `selectedOptions`, `priceRange`, `seo`, `metafields`).
- Las líneas del carrito llevan `attributes` (`{ key, value }[]`), que son exactamente los **line
  item properties** de Shopify; las claves que empiezan por `_` son privadas, como en Shopify.
- Todo el acceso a datos pasa por `commerce` (`lib/commerce/index.ts`), hoy `localProvider` y
  preparado para `shopifyProvider` (`lib/commerce/shopify-provider.ts`, stub documentado).
- El catálogo ya está exportado: **`shopify/products.csv`** (regenerable con `pnpm shopify:csv`).

Hay dos caminos. La recomendación está al final.

## Ruta A — Tema Online Store 2.0 (Liquid)

Shopify «clásico»: tema con secciones y bloques editables desde el editor de temas.

- Se rehacen las plantillas en Liquid (o se adapta un tema premium tipo _Dawn_/_Prestige_) con el
  diseño de la demo: tokens de color y tipografías, secciones de la home, ocasiones como colecciones.
- El **personalizador** se empaqueta como **Theme App Extension** (bloque de app) o como sección con
  JavaScript propio: el motor de `lib/engrave/` y los SVG de `components/glassware/` son
  independientes de React y se pueden portar a un _web component_.
- Checkout, cuentas de cliente, pedidos, descuentos y envíos: **nativos de Shopify**.

**Ventajas**: el cliente edita textos e imágenes sin desarrollador; ecosistema de apps; coste de
mantenimiento bajo. **Inconvenientes**: hay que reescribir la interfaz en Liquid; las animaciones
avanzadas (GSAP, Motion) son más laboriosas; menos control de rendimiento.

## Ruta B — Headless (Hydrogen o este Next.js + Storefront API)

Se mantiene este front (Next.js en Vercel) o se porta a **Hydrogen** (Remix, en Oxygen) y Shopify
queda como back-office: catálogo, inventario, checkout, pagos, pedidos y clientes.

1. En el admin: **Ajustes → Apps y canales de venta → Desarrollar apps** → crear app con acceso a la
   **Storefront API** (lectura de productos, colecciones, carrito y metafields).
2. Variables en Vercel: `SHOPIFY_STORE_DOMAIN` y `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (ver `.env.example`).
3. Implementar `toProduct()` en `lib/commerce/shopify-provider.ts` (convertir `amount` de string a
   número, `optionValues` → `values`, parsear los metafields JSON) y las consultas de colecciones.
4. Cambiar en `lib/commerce/index.ts`: `export const commerce = shopifyProvider;` y que las páginas
   lean de `commerce` (hoy algunas usan las funciones síncronas del provider local:
   `allProducts`, `getProductSync`).
5. **Carrito**: sustituir el store Zustand por el carrito de Shopify (`cartCreate`, `cartLinesAdd`,
   `cartLinesUpdate`, `cartLinesRemove`, `cartDiscountCodesUpdate`) guardando solo el `cartId` en
   `localStorage`. Los `attributes` de cada línea se envían tal cual.
6. **Checkout**: el botón «Tramitar pedido» redirige a `cart.checkoutUrl` (checkout nativo de Shopify,
   con Shopify Payments / Bizum / Redsys según configuración). Se elimina el checkout simulado y
   `/pedido/[id]`; «Mis pedidos» pasa a **Customer Account API**.
7. Revalidación: ISR (`next: { revalidate }`) o webhooks de Shopify a un Route Handler que llame a
   `revalidateTag`.

**Ventajas**: se conserva el 100 % del diseño, las animaciones y el rendimiento; la demo se convierte
en la tienda real. **Inconvenientes**: requiere desarrollador para cambios de diseño; dos
plataformas (Vercel + Shopify).

## Correspondencia demo → Shopify

| Demo                                                                | Shopify                                                                                      | Notas                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `data/products.ts` (`Product`)                                      | Productos                                                                                    | Importar `shopify/products.csv` (se crean como **borrador**).              |
| Variantes y `options` (Modelo, Grabado una/dos caras, Estuche…)     | Variantes y opciones                                                                         | Máx. 3 opciones por producto (la demo ya lo respeta).                      |
| `variant.sku` (`GGS-…`)                                             | SKU                                                                                          | Generados en la demo; sustituir si el taller usa otros.                    |
| `compareAtPrice`                                                    | Precio de comparación                                                                        | Hoy solo en el pack de copas de brindis.                                   |
| `tags` (ocasiones + categoría)                                      | Etiquetas                                                                                    | Las ocasiones (`boda`, `comunion`…) alimentan colecciones automáticas.     |
| `data/collections.ts` (categorías)                                  | Colecciones automáticas por `custom.category` o tipo                                         | Vasos, Copas, Jarras, Jarrones, Metopas y placas, Trofeos, Packs.          |
| `data/occasions.ts`                                                 | Colecciones automáticas por etiqueta + página/plantilla                                      | Textos, ideas y FAQ → metaobjeto «Ocasión».                                |
| `metafields.*`                                                      | Metafields `custom.*`                                                                        | Ver tabla siguiente.                                                       |
| Imágenes (`images`)                                                 | Medios del producto                                                                          | La demo usa ilustraciones SVG; subir fotos reales.                         |
| `seo.title` / `seo.description`                                     | SEO del producto                                                                             | Incluidos en el CSV.                                                       |
| `CartLine.attributes`                                               | Line item properties                                                                         | `Texto`, `Tipografía`, `Posición`… visibles; `_design` privado.            |
| Miniatura del grabado (`preview`)                                   | Imagen subida + URL en una propiedad                                                         | Ver «Personalización» más abajo.                                           |
| `BIENVENIDA10`, `BODA15`                                            | Descuentos (códigos)                                                                         | `BODA15`: aplicar a la colección de bodas.                                 |
| `STANDARD_TIERS` (precio por volumen)                               | Descuentos por cantidad (Shopify Plus B2B / app de _quantity breaks_ / función de descuento) | También como metafield para mostrarlo en la ficha.                         |
| Envío estándar 5,90 €, gratis desde 60 €, urgente +4,90 €, recogida | Ajustes → Envío y entrega (tarifas y recogida local)                                         | Importes de ejemplo: confirmar.                                            |
| Checkout simulado (4 pasos)                                         | Checkout nativo                                                                              | Campos «Fecha deseada» y «Nota» → atributos del carrito / nota del pedido. |
| `/mis-pedidos`, `/pedido/[id]`                                      | Cuentas de cliente y estado del pedido                                                       | —                                                                          |
| Favoritos (localStorage)                                            | App de wishlist o se mantiene en local                                                       | —                                                                          |
| Formulario de contacto (`/api/contact`)                             | Formulario de contacto de Shopify o app                                                      | —                                                                          |
| Presupuesto empresas (`/api/quote`)                                 | Shopify B2B (Plus) o app de presupuestos / formulario                                        | El logo puede subirse con una app de archivos.                             |
| Páginas legales                                                     | Ajustes → Políticas + páginas                                                                | Textos pendientes de revisión legal.                                       |
| Redirecciones (`vercel.json`)                                       | Navegación → Redirecciones de URL                                                            | Solo si el dominio pasa a Shopify.                                         |
| JSON-LD, sitemap, robots                                            | Los genera el tema / Hydrogen                                                                | En headless se mantienen los de la demo.                                   |

### Definiciones de metafields de producto (Ajustes → Datos personalizados → Productos)

Crear **antes** de importar el CSV (las columnas del CSV usan estos nombres):

| Nombre             | Namespace y clave         | Tipo                                                                                |
| ------------------ | ------------------------- | ----------------------------------------------------------------------------------- |
| Frase corta        | `custom.tagline`          | Texto de una línea                                                                  |
| Distintivo         | `custom.badge`            | Texto de una línea (lista: Más vendido, Ideal bodas, Para empresas, Nuevo)          |
| Categoría          | `custom.category`         | Texto de una línea                                                                  |
| Ilustración        | `custom.illustration`     | Texto de una línea (solo headless: id de la pieza SVG)                              |
| Cantidad mínima    | `custom.min_quantity`     | Número entero                                                                       |
| Personalización    | `custom.personalization`  | JSON (`types`, `maxChars`, `maxLines`, `faces`, `engraveOn`)                        |
| Precio por volumen | `custom.volume_pricing`   | JSON (lista de tramos `{min, max, discount, quote}`)                                |
| Ficha técnica      | `custom.technical`        | JSON (material, medidas, capacidad, zona grabable, plazo, peso)                     |
| Completa el set    | `custom.complete_the_set` | Texto de una línea (handles separados por comas) o lista de referencias a productos |

### Importar el catálogo

1. Revisar precios y medidas en `data/products.ts` (ver `CONTENT_TODO.md`) y ejecutar `pnpm shopify:csv`.
2. Shopify admin → **Productos → Importar** → subir `shopify/products.csv`.
3. Los productos entran como **borrador**: subir fotos, revisar y publicar.
4. Ajustes → Impuestos: «Todos los precios incluyen impuestos» (los precios de la demo llevan IVA).
5. Pesos (`Variant Grams`) a 0: rellenar para calcular tarifas de envío por peso.

## Personalización (lo más importante)

- **Datos del grabado**: se guardan como line item properties al añadir al carrito (`Diseño`,
  `Texto`, `Tipografía`, `Curvatura`, `Posición`, `Escala`, `Rotación`, `Cara`, `Pieza` y
  `_design` con el JSON completo para poder reproducirlo en el taller).
- **Logo subido y vista previa**: un line item property no puede llevar una imagen. Opciones:
  1. **Headless**: subir el archivo y la miniatura con _staged uploads_ (Admin API, desde un Route
     Handler) a **Shopify Files** o a un almacenamiento propio (p. ej. Vercel Blob) y guardar la URL
     en las propiedades `Logo` y `_preview`.
  2. **Tema OS 2.0**: una app de personalización/subida de archivos que ya resuelve esto, o la
     extensión propia del personalizador con su backend.
- El taller ve todo en el pedido: propiedades visibles en el admin y en el email de confirmación.

## Recomendación

**Ruta B (headless con este proyecto + Shopify como back-office)** si se quiere conservar la
experiencia de la demo (personalizador en tiempo real, animaciones, rendimiento) — es la que mejor
vende el producto artesanal. La **Ruta A** tiene sentido si la prioridad es que el cliente edite todo
solo y el presupuesto de mantenimiento es mínimo; en ese caso, portar primero el personalizador como
bloque de app y adaptar un tema premium.

Orden sugerido para cualquiera de las dos: datos reales (CONTENT_TODO) → catálogo en Shopify (CSV) →
envíos, impuestos y pagos → personalización con subida de archivos → páginas y SEO → pruebas de
pedido reales → dominio y redirecciones.
