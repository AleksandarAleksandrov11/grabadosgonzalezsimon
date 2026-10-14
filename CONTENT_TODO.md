# Contenido pendiente de confirmar con el cliente

Para que la demo se vea como una tienda terminada, los datos que no estaban en la web actual del
cliente se han **rellenado con valores verosímiles**. No hay placeholders ni avisos de «ejemplo» en
pantalla. Esta lista recoge todo lo inventado o supuesto, para repasarlo en la reunión con el
cliente antes de publicar.

Casi todos los datos del negocio se cambian en **un solo fichero: `data/site.ts`**.

## 1. Datos del negocio

- [ ] **Dirección y código postal**: «Avda. de Pablo Iglesias, 89, 28039 Madrid» (CP supuesto; se ha
      corregido la errata «Igleisas» de la web actual). → `data/site.ts` (`address`).
- [ ] **Coordenadas** del taller para el mapa y el JSON-LD (aproximadas). → `data/site.ts` (`geo`).
- [ ] **Horario**: «Lunes a viernes, de 9:30 a 14:00 y de 16:30 a 19:30» (inventado). → `hours`.
- [ ] **WhatsApp**: confirmar que el **659 74 62 90** tiene WhatsApp (todos los botones apuntan a
      `wa.me/34659746290`). → `whatsapp`.
- [ ] Confirmar **teléfonos** (659 74 62 90 / 916 00 80 03) y **email** (grabadosgonzalezs@gmail.com).
      ¿Quieren un email con dominio propio?
- [ ] **Redes sociales**: la web actual no tiene. Si existen, añadirlas a `social`.
- [ ] **Dominio definitivo** y si la tienda sustituirá a la web actual (redirecciones 301 y
      `NEXT_PUBLIC_SITE_URL`).

## 2. Historia y cifras

- [ ] **Desde 1993**, **30 años de oficio** y **25.000 piezas grabadas**: cifras inventadas.
      → `data/site.ts` (`facts`).
- [ ] **Hitos** de Sobre nosotros (1993 primeros grabados, 2004 taller de Pablo Iglesias, 2015
      empresas y clubes, 2026 tienda online): inventados. → `app/(marketing)/sobre-nosotros/page.tsx`
      (`TIMELINE`).
- [ ] La web habla en **plural** («grabamos», «te enviamos»). La web actual usa primera persona;
      confirmar cómo quiere presentarse y si quiere aparecer con nombre propio.

## 3. Fotos e imágenes

- [ ] **Fotos del taller y del equipo** (cabina de chorro de arena, máscaras, piezas terminadas).
- [ ] **Fotos de cada producto** (ideal 3 o 4 sobre fondo neutro). Se añaden en `images` de cada
      producto en `data/products.ts`; mientras tanto se usan las ilustraciones SVG.
- [ ] **Fotos de trabajos** para la galería (bodas, empresas, trofeos), con permiso.
- [ ] **Permiso para mostrar logotipos de terceros**: la única foto real de trabajo
      (`vasos-grabados.jpg`) muestra los logos **NBA House / BBVA**. Aparece en la home, en la galería
      y en la ficha del vaso de tubo. Confirmar que se puede publicar o sustituirla.
- [ ] Fotos de ambiente de la web actual (`hero-cristaleria-madrid.jpg` en la home y
      `libreria-media-pexels-11110961.jpg` en Sobre nosotros, de Pexels): confirmar licencia o
      sustituirlas por fotos propias del taller.
- [ ] **Licencia** de la foto de la copa de balón (`cristaleria-grabada-sobre-mi.jpg`, probablemente
      de catálogo de fabricante).
- [ ] **Logo**: vectorizado a partir del JPG de la web actual (`public/brand/`). Pedir el original
      vectorial si existe.

## 4. Catálogo, precios y producción

- [ ] **Precios** de los 22 productos y sus variantes (inventados). → `data/products.ts`.
- [ ] **Medidas y capacidades** de cada pieza (aproximadas).
- [ ] **Qué piezas trabajan de verdad** (¿decantador?, ¿jarra de sangría?, ¿trofeos con peana?).
- [ ] **Recargo por dos caras** (+3 €) y **estuche regalo** (+4,90 €).
- [ ] **Tramos por volumen** (−10 % desde 12 uds., −15 % desde 24, presupuesto desde 50)
      → `lib/commerce/pricing.ts` (`STANDARD_TIERS`).
- [ ] **Pedido mínimo** de los packs de empresa y hostelería (24 piezas).
- [ ] **Plazo de producción**: «5 a 7 días laborables». → `data/site.ts` (`shop.productionTime`) y
      `data/products.ts` (`PRODUCTION`).
- [ ] **Urgencias**: la FAQ dice «48 horas con un suplemento de 15 €».
- [ ] **Códigos de descuento**: `BIENVENIDA10` (−10 %) y `BODA15` (−15 % en bodas).
      → `lib/commerce/discounts.ts`.

## 5. Técnica y cuidados

- [ ] **Lavavajillas**: la web dice que el grabado es apto para lavavajillas (también industrial en
      hostelería). Confirmar.
- [ ] Tipo de cristal de los vasos de comunión e infantiles.
- [ ] Confirmar que se puede grabar **letra manuscrita, dibujos** y en **ambas caras**.
- [ ] Formatos de logo aceptados y si cobran la preparación o vectorización del logo.
- [ ] La web promete **prueba del diseño antes de grabar** en todos los pedidos.

## 6. Envíos y devoluciones

- [ ] **Tarifas y plazos**: estándar 5,90 € (48 a 72 h), gratis desde 60 €, urgente +4,90 € (24 h),
      recogida en el taller gratis. → `data/site.ts` (`shop`) y `lib/commerce/pricing.ts`.
- [ ] **Islas y Ceuta/Melilla**: Baleares 9,90 € (3 a 5 días); Canarias, Ceuta y Melilla 14,90 €
      (5 a 8 días). ¿Envíos fuera de España?
- [ ] **Roturas**: avisar en 48 horas.
- [ ] **Devoluciones**: personalizados excluidos del desistimiento (art. 103.c TRLGDCU) y 14 días para
      no personalizados. Revisar con su asesoría.

## 7. Reseñas y clientes

- [ ] **Reseñas**: las tres de la home (Laura M., Javier R., Equipo de Administración) y las demás de
      `data/testimonials.ts` son inventadas. Sustituir por reseñas reales (p. ej. Google) con permiso.
- [ ] **Clientes de empresa**: los logos del personalizador y de la sección de empresas son marcas
      **ficticias** (Bodega Valdecruz, Club Deportivo Alameda, Café Lumbre).
      → `components/brand/demo-logos.tsx` y `public/images/logos/`.

## 8. Legal

- [ ] **Razón social y NIF** (`TALLA DEL CRISTAL GONZALEZ SIMON SL`, `B10897650`): tomados del aviso
      legal actual, verificar. → `data/site.ts`.
- [ ] **Datos registrales**: el aviso legal dice «inscrita en el Registro Mercantil de Madrid»; añadir
      tomo, folio y hoja.
- [ ] **Proveedores** de la política de privacidad (Vercel, banco, transporte): confirmar.
- [ ] Revisión completa de aviso legal, privacidad, cookies y envíos por un asesor.
- [ ] **Facturación a empresas** con IVA desglosado (FAQ de empresas).

## 9. Kit Digital / Unión Europea

- [ ] Confirmar con el **manual de publicidad del Kit Digital** si los logos deben ir a color (la demo
      usa la versión monocroma de la web actual, al pie de la página) y el texto exacto.

## 10. Lanzamiento

- [ ] Decidir **pasarela de pago** y plataforma definitiva (ver `SHOPIFY_MIGRATION.md`). Hoy el pago
      es de prueba y el checkout lo indica en el último paso.
- [ ] Envío real de formularios de **contacto**, **presupuesto** y **newsletter** (`app/api/contact`,
      `app/api/quote`: hoy validan y responden sin enviar nada).
- [ ] Activar la indexación solo en el dominio final: `NEXT_PUBLIC_INDEXABLE=true`.
- [ ] Alta en **Google Business Profile** y Search Console, y envío del sitemap.
