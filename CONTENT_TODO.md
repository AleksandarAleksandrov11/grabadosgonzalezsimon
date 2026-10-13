# Contenido pendiente de confirmar con el cliente

La demo **no inventa datos**. Todo lo que no estaba en la web actual del cliente aparece en pantalla
como placeholder visible (`[Año]`, `+[X] años`, `[Horario — confirmar]`…) o marcado como
«(ejemplo)», y en el código lleva un comentario `TODO:`. Esta es la lista completa para la reunión
con el cliente.

Casi todos los datos del negocio se cambian en **un solo fichero: `data/site.ts`**.

## 1. Datos del negocio

- [ ] **Dirección completa y código postal** del taller. Hoy: «Avda. de Pablo Iglesias, 89, Madrid»
      (se ha corregido la errata «Igleisas» de la web actual) y CP vacío. → `data/site.ts` (`address`).
- [ ] **Coordenadas** del taller para el mapa y el JSON-LD (ahora son aproximadas). → `data/site.ts` (`geo`).
- [ ] **Horario de atención / de recogida**. Hoy: `[Horario — confirmar]` en Contacto, Sobre nosotros y
      checkout. → `data/site.ts` (`hours`).
- [ ] **WhatsApp**: confirmar que el **659 74 62 90** tiene WhatsApp (todos los botones apuntan a
      `wa.me/34659746290`). → `data/site.ts` (`whatsapp`).
- [ ] Confirmar **teléfonos** (659 74 62 90 / 916 00 80 03) y **email** (grabadosgonzalezs@gmail.com).
      ¿Quieren un email con dominio propio?
- [ ] **Redes sociales**: la web actual no tiene. Si existen, añadirlas a `data/site.ts` (`social`).
- [ ] **Dominio definitivo** y si la tienda sustituirá a la web actual (para las redirecciones 301 y
      `NEXT_PUBLIC_SITE_URL`).

## 2. Historia, equipo y cifras

- [ ] **Año de inicio** del oficio y del taller → hitos `[Año]` en `/sobre-nosotros`
      (`app/(marketing)/sobre-nosotros/page.tsx`, `TIMELINE`).
- [ ] **Años de oficio** → `+[X] años` en la home (`components/home/StoryTeaser.tsx`) y en Sobre nosotros.
- [ ] **Piezas grabadas** (cifra aproximada) → `[X]` en la home (`StoryTeaser`).
- [ ] **Nombre del artesano** y cómo quiere presentarse → `[Nombre del artesano]` en Sobre nosotros.
- [ ] **Historia real** (cómo empezó, anécdotas, hitos) para sustituir el texto genérico de los hitos.
- [ ] ¿Primera persona («grabo», «te respondo») o plural («grabamos»)? La web actual usa primera
      persona; la demo mezcla ambas (FAQ y formularios en singular, secciones en plural).

## 3. Fotos e imágenes

- [ ] **Foto del artesano** trabajando (hoy hay un hueco marcado «Foto del artesano — pendiente»).
- [ ] **Fotos del taller** (cabina de chorro de arena, máscaras, piezas terminadas). Hoy la sección
      «El taller» muestra una tarjeta con la dirección.
- [ ] **Fotos reales de cada producto** (mínimo 1 por producto, ideal 3–4 sobre fondo neutro). Se añaden
      en `images` de cada producto en `data/products.ts`; mientras tanto se usan las ilustraciones SVG.
- [ ] **Fotos de trabajos reales** para la galería (bodas, empresas, trofeos…), con permiso.
- [ ] **Permiso para mostrar logotipos de terceros**: la única foto real de trabajo (`vasos-grabados.jpg`)
      muestra los logos **NBA House / BBVA**. Se ve con el logo en la home («Lo que hacemos»), en la
      galería y en la ficha del vaso de tubo; recortada (sin el logo) en la historia de la home y en Sobre
      nosotros. Confirmar que se puede publicar o sustituirla.
- [ ] **Licencia** de la foto «BS-Happy Hour» (`cristaleria-grabada-sobre-mi.jpg`, copa de balón,
      probablemente de catálogo de fabricante) que usa la web actual. Se muestra en la galería.
- [ ] Las fotos de **Pexels** de la web actual no se usan en la demo (no son trabajo del cliente).
- [ ] **Logo**: se ha vectorizado a partir del JPG de la web actual (`public/brand/`). Pedir el
      original vectorial si existe para comparar.

## 4. Catálogo, precios y producción

- [ ] **Precios reales** de los 22 productos y sus variantes (todos los de la demo son orientativos y
      así se indica en la web). → `data/products.ts`.
- [ ] **Medidas, capacidades y zona grabable** reales de cada pieza (ficha técnica de cada producto).
- [ ] **Qué piezas trabajan de verdad** (¿decantador?, ¿jarra de sangría?, ¿trofeos con peana?) y
      cuáles faltan.
- [ ] **Recargo por grabar dos caras** (demo: +3 €) y **estuche regalo** (demo: +4,90 €).
- [ ] **Tramos de precio por volumen** (demo: −10 % desde 12 uds., −15 % desde 24, presupuesto desde 50)
      → `lib/commerce/pricing.ts` (`STANDARD_TIERS`).
- [ ] **Pedido mínimo** de los packs de empresa/hostelería.
- [ ] **Plazo de producción** (demo: «5–7 días laborables (ejemplo)») → `data/site.ts`
      (`demo.productionTime`) y `data/products.ts` (`PRODUCTION`).
- [ ] **Política de urgencias** (¿se aceptan encargos urgentes?, ¿con recargo?).
- [ ] **Antelación recomendada** para bodas, comuniones y Navidad (las FAQ de ocasiones dicen
      «[Plazo de ejemplo — confirmar]»).
- [ ] **Códigos de descuento** reales (la demo usa `DEMO10` y `BODA15`).

## 5. Técnica y cuidados

- [ ] **¿Apto para lavavajillas?** Aparece como `[VERIFICAR: ¿apto lavavajillas?]` en la ficha de
      producto y en las FAQ; también para lavavajillas industrial (hostelería).
- [ ] **Tipo de cristal** de los vasos de comunión/infantiles y recomendaciones de uso.
- [ ] Confirmar que se puede grabar **letra manuscrita / dibujos** y en **ambas caras**.
- [ ] Formatos de logo aceptados y si cobran la **preparación/vectorización** del logo.
- [ ] ¿Envían **prueba de diseño** antes de grabar siempre? (la demo lo promete en varios sitios).
- [ ] ¿Hacen **muestra física** para pedidos grandes de empresa? (en `/empresas`, «[Confirmar condiciones]»).

## 6. Envíos y devoluciones

- [ ] **Tarifas y plazos de envío** reales (demo: estándar 5,90 €, gratis desde 60 €, urgente +4,90 €,
      48–72 h / 24 h). → `data/site.ts` (`demo`) y `lib/commerce/pricing.ts`.
- [ ] **Zonas**: Baleares, Canarias, Ceuta y Melilla (hoy «[consultar tarifas]»). ¿Envíos fuera de España?
- [ ] **Recogida en taller**: ¿se ofrece?, ¿en qué horario?
- [ ] **Plazo para comunicar roturas** en el transporte (hoy «[48 h — confirmar]»).
- [ ] **Condiciones de devolución** (TODO legal): personalizados excluidos del desistimiento (art. 103.c
      TRLGDCU) y 14 días para no personalizados. Revisar con su asesoría.

## 7. Reseñas y confianza

- [ ] **Reseñas reales** (p. ej. de Google Business Profile) con permiso. Las actuales llevan la
      etiqueta «Reseña de ejemplo» y nombres genéricos. → `data/testimonials.ts`.
- [ ] Valoración media real para el JSON-LD (hoy la ficha muestra «4,9 · valoración de ejemplo» y
      **no** se publica en datos estructurados).
- [ ] **Clientes de empresa** que se puedan citar (la demo solo usa logos ficticios: «Bodega
      Ejemplo», «Club Deportivo Demo», «Café Muestra»).

## 8. Legal

- [ ] **Razón social y NIF** (`TALLA DEL CRISTAL GONZALEZ SIMON SL`, `B10897650`): tomados del aviso
      legal actual, verificar. → `data/site.ts`.
- [ ] **Datos registrales** (Registro Mercantil) → `[Registro Mercantil — confirmar]` en el aviso legal.
- [ ] **Proveedores** que tratan datos (hosting, pasarela de pago, transporte, email) para la política
      de privacidad (`[lista de proveedores — confirmar]`).
- [ ] Revisión completa de **aviso legal, privacidad, cookies y envíos/devoluciones** por un asesor
      (todas las páginas legales llevan el aviso «Texto de demostración»).
- [ ] **Facturación a empresas**: confirmar que emiten factura con IVA desglosado (FAQ de empresas).

## 9. Kit Digital / Unión Europea

- [ ] Confirmar con el **manual de publicidad del Kit Digital** si los logos deben ir **a color**
      (la demo usa la versión monocroma de la web actual, en el pie de página) y el texto exacto.

## 10. Lanzamiento

- [ ] Decidir **pasarela de pago** y plataforma definitiva (ver `SHOPIFY_MIGRATION.md`).
- [ ] Envío real de formularios de **contacto** y **presupuesto** (`app/api/contact`, `app/api/quote`:
      hoy validan y responden sin enviar nada).
- [ ] Activar la indexación solo en el dominio final: `NEXT_PUBLIC_INDEXABLE=true`.
- [ ] Alta en **Google Business Profile** / Search Console y envío del sitemap.
- [ ] Quitar las marcas de demo (aviso de la barra superior, banner del checkout, «DEMO DE
      PRESENTACIÓN» del pie) cuando haya pedidos reales.
