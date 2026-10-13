# Análisis de la web actual — grabadosgonzalezsimon.com

_Fecha del análisis: octubre de 2026. Descargadas con `curl` las 4 páginas públicas y las 3 legales._

## 1. Resumen

| Aspecto         | Situación actual                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Plataforma      | BaseKit / 123inventatuweb (constructor genérico, plantilla «localBusiness»)                                         |
| Páginas         | Inicio, Sobre mí, Productos, Contacto + Política de privacidad, Política de cookies, Aviso legal                    |
| Tienda          | No existe. Sin precios, sin catálogo, sin carrito                                                                   |
| Conversión      | Un único formulario (email + mensaje) repetido en todas las páginas y un botón «Hablemos»                           |
| Imágenes        | 4 imágenes (1 logo + 3 fotos) y logos de la UE (Kit Digital)                                                        |
| Redes / horario | No aparecen                                                                                                         |
| SEO             | Títulos genéricos («Inicio», «Productos»…), sin datos estructurados, alt texts básicos («Vasos grabados en Madrid») |

## 2. Contenido textual por página

### Inicio (`/`)

- H1: **«Graba tus recuerdos en piezas únicas»**
- Subtítulo: «La técnica perfecta para crear detalles exclusivos en cristal» + CTA «Hablemos».
- Bloque: **«Transforma tus ideas en recuerdos grabados para siempre»** — grabado en cristal de alta calidad con chorro de arena; personaliza vasos, copas, jarrones, metopas y trofeos con iniciales, logotipos, escudos y textos especiales; regalo, reconocimiento o evento especial. Menciona «años de experiencia» (sin cifra).
- «Lo que te ofrezco»: tres pilares
  1. **Personalización única y a medida** (bodas, aniversarios, eventos corporativos, trofeos).
  2. **Amplia gama de productos en cristal** (vasos y copas, jarrones y metopas, placas y trofeos).
  3. **Calidad, precisión y atención al detalle** (trato cercano, asesoramiento).
- **«Piezas únicas creadas con dedicación y cariño»** — «cariño, dedicación y profesionalidad», «atención al detalle meticulosa».
- Formulario «Déjame un mensaje» (email, mensaje, consentimiento comercial, privacidad).
- Bloque de la UE: «Esta web está financiada por la Unión Europea — Next Generation EU».

### Sobre mí (`/sobre-mi`)

- **«Personaliza tus momentos con elegancia»**.
- Profesional dedicado al grabado en cristal mediante chorro de arena; convierte objetos cotidianos en piezas con valor sentimental.
- Lista de lo que graba: iniciales, nombres y fechas · logotipos y escudos corporativos · trofeos y placas · textos y frases.
- **«convirtiendo un simple objeto de cristal en un recuerdo eterno»**.
- Técnica: acabado **limpio, elegante y permanente, sin desgaste con el tiempo**; **profundidad adecuada sin comprometer la integridad del cristal**.

### Productos (`/productos`)

- Vasos y copas (vino, cava, whisky, cerveza) → regalos, hostelería y negocios con su marca, detalles únicos.
- Jarrones grabados → centros de mesa, regalos de empresa o premios, decoración.
- Metopas y placas → trofeos, homenajes, jubilaciones, premios corporativos o deportivos.
- «Crea un recuerdo único».

### Contacto (`/contacto`)

- Dirección: «Avda. de Pablo **Igleisas**, 89 — Madrid» (errata; en el aviso legal aparece correctamente «Avda. Pablo Iglesias, 89»).
- Email: grabadosgonzalezs@gmail.com
- Teléfonos: 659 74 62 90 · 916 00 80 03

### Legales

- **Aviso legal**: titular **TALLA DEL CRISTAL GONZALEZ SIMON SL**, NIF **B10897650**, domicilio Avda. Pablo Iglesias, 89, Madrid. Son datos publicados por el propio cliente; en la demo se reutilizan en las páginas legales con un `TODO` para verificarlos.
- **Cookies**: texto genérico de BaseKit (menciona Google Analytics, YouTube, redes sociales que no se usan).
- **Privacidad**: texto genérico; no menciona RGPD/LOPDGDD actualizados ni plazos de conservación.

## 3. Imágenes encontradas

Todas guardadas en `public/images/original/`.

| Archivo local                                                   | Origen (nombre en la librería de BaseKit)      | Uso actual                  | Observaciones                                                                                                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logo-grabados-gonzalez-simon.jpg` (1011×1250)                  | `Grabados Gonzalez Simon (Logo)_page-0001.jpg` | Cabecera                    | Copa flauta cuyo tallo atraviesa una «G» serif. Exportado de PDF, sin vector. **Recreado en SVG** (`public/brand/`).                                                 |
| `vasos-grabados.jpg` (2448×3264)                                | `20140822_192701.jpg`                          | Inicio                      | **Única foto real de trabajo del cliente**: vaso de tubo grabado, fotografiado en el taller (se ven la arena y la maquinaria). Lleva logos de terceros (NBA / BBVA). |
| `hero-cristaleria-madrid.jpg` (2560×3840)                       | `pexels-photo-6794877.jpeg`                    | Inicio                      | **Foto de stock (Pexels)**: copa de cristal prensado sobre fondo beige. No es trabajo del cliente. Licencia Pexels (uso libre).                                      |
| `cristaleria-grabada-sobre-mi.jpg` (945×1484)                   | `BS-Happy Hour-80.jpg`                         | Sobre mí                    | Foto de catálogo de fabricante (copa de balón sobre blanco). Probablemente la pieza en blanco que graba. **Licencia por confirmar.**                                 |
| `libreria-media-pexels-11110961.jpg` (2560×1707)                | `pexels-photo-11110961.jpeg`                   | No se usa en ninguna página | Stock de Pexels en la librería de medios. No se usa en la demo.                                                                                                      |
| `favicon-original.ico`                                          | favicon de BaseKit                             | Favicon                     | Versión reducida del logo.                                                                                                                                           |
| `eu-logo-next-generation.png` / `eu-logo-plan-recuperacion.png` | Set global de BaseKit                          | Bloque UE                   | Ya vienen en **monocromo negro** sobre transparente.                                                                                                                 |

Los widgets ocultos de la plantilla referencian `default_image-2.jpg` / `default_image-3.jpg` de BaseKit (imágenes de relleno); no se descargan porque no son del cliente.

### Conclusiones visuales

- El **estilo real** de su grabado (foto del vaso de tubo): esmerilado blanco, mate, homogéneo, bordes nítidos y mucho detalle en logos complejos. Es exactamente el efecto que replica el personalizador.
- El **logo** es negro sobre blanco, serif clásica y silueta de copa flauta: refuerza la dirección «blanco y negro, elegante, artesanal».
- **Hay una sola foto propia.** El catálogo y el personalizador se ilustran con un sistema SVG propio de cristalería; las fotos se usan donde más aportan (taller, sobre nosotros, galería). Es prioritario pedir fotos reales al cliente (ver `CONTENT_TODO.md`).

## 4. Oportunidades detectadas

1. **Venta online 24/7**: hoy no hay forma de comprar ni de saber precios. Una tienda con precios orientativos y personalizador reduce las idas y vueltas por email.
2. **Captación B2B**: hostelería, empresas, clubes y asociaciones aparecen en sus textos pero no tienen un camino propio ni presupuesto por volumen.
3. **SEO local**: títulos genéricos, sin `LocalBusiness`, sin páginas por ocasión (bodas, comuniones…) que son búsquedas con mucha intención.
4. **Confianza**: no hay reseñas, ni proceso explicado, ni plazos. La técnica (su gran diferencial frente al vinilo/impresión) apenas se explica.
5. **Móvil**: plantilla genérica; los textos largos sin jerarquía penalizan en el teléfono.
6. **Legal**: textos genéricos de plantilla (cookies de servicios que no se usan). Revisión recomendada.

## 5. URLs antiguas → nuevas (redirects 301 en `vercel.json`)

| Antigua                                                                        | Nueva                |
| ------------------------------------------------------------------------------ | -------------------- |
| `/sobre-mi`                                                                    | `/sobre-nosotros`    |
| `/productos`                                                                   | `/tienda`            |
| `/política-privacidad` (y `/pol%C3%ADtica-privacidad`, `/politica-privacidad`) | `/legal/privacidad`  |
| `/política-cookies` (y variantes)                                              | `/legal/cookies`     |
| `/aviso-legal`                                                                 | `/legal/aviso-legal` |
