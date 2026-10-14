# Guion de la demo (5 minutos)

Para presentar la tienda a Grabados González Simón. Objetivo: que el cliente **se vea vendiendo
online** y entienda que todo lo que falta son sus datos reales (fotos, precios, plazos).

## Antes de empezar (2 minutos de preparación)

- Abrir la URL de Vercel en el **móvil** (o en el portátil con la vista de móvil) y en el
  ordenador. Empezar por el móvil: la mayoría de sus clientes comprarán desde ahí.
- En `/mis-pedidos` pulsar **«Borrar datos de la demo»** para empezar con el carrito vacío.
- Tener a mano un **logo del cliente o de alguno de sus clientes** (PNG/JPG). Si no, usar el botón
  «Probar con un logo de ejemplo».
- Pestañas preparadas: home, `/personaliza`, `/empresas`.

## 0:00 – 0:40 · La primera impresión (home)

- Dejar que el hero haga su efecto: la arena «graba» la copa.
  > «Esto es lo primero que verá un cliente: su oficio, el chorro de arena, contado en dos segundos.»
- Bajar despacio: ocasiones (bodas, comuniones, empresas…), **«Escribe un nombre y míralo grabado»**
  → escribir el nombre de alguien de la reunión y cambiar de tipografía.
- Señalar la técnica paso a paso (diseño → máscara → arena → acabado):
  > «Explica por qué su grabado no es una pegatina. Es su gran diferencia.»

## 0:40 – 1:40 · Elegir y personalizar (tienda + ficha)

- **Tienda** → filtrar por **Bodas** y ordenar por precio: la URL cambia (se puede compartir).
- Abrir **Copa de vino tinto grabada**:
  - Escribir «Ana & Luis» y la fecha; cambiar tipografía; mostrar cómo se curva sobre el cristal.
  - Enseñar el **precio por volumen** (12 / 24 / 50 unidades) y el aviso «precios orientativos».
- Pulsar **Añadir al carrito**: la pieza «vuela» al carrito y aparece con la **miniatura del
  grabado** y los datos del diseño.
  > «El taller recibe el pedido con el texto, la tipografía y una imagen de cómo lo quiere el cliente.»

## 1:40 – 2:50 · El estudio (el momento «wow»)

- `/personaliza` → pestaña **Diseño → Logo o imagen** → subir el logo (o el de ejemplo).
  - El fondo blanco desaparece solo; ajustar el **umbral** si hace falta.
  - Arrastrar, escalar y rotar el logo sobre la pieza; probar «cara trasera».
- Pulsar **«Ver en todos»**: el mismo logo en **8 piezas** a la vez.
  > «Una empresa ve su marca en vasos, copas, jarras y trofeos en un segundo. Esto vende.»
- Enseñar **Guardar diseño** y **Compartir enlace** (el texto del diseño viaja en la URL; los logos subidos no, porque no salen del navegador).

## 2:50 – 3:50 · Comprar (carrito + checkout simulado)

- Carrito → código **`DEMO10`** → **Tramitar pedido de prueba**.
- Señalar el banner: **«Modo demostración: no se realizará ningún cargo»**.
- Rellenar rápido: email, teléfono, dirección con CP **28013** (la provincia se pone sola), **envío
  urgente** o **recogida en taller**; marcar la revisión del diseño; en pago, botón **«Rellenar»**
  (tarjeta 4242…).
- **Confirmar pedido de prueba** → check animado, número **GGS-2026-XXXX** y seguimiento
  (recibido → revisión del diseño → en grabado → enviado). Abrir **Mis pedidos**.
  > «Con Shopify este paso es el checkout real, con Bizum y tarjeta. El resto se queda igual.»

## 3:50 – 4:30 · Empresas y confianza

- `/empresas`: casos de uso, **tabla de precios por volumen** y el formulario de presupuesto con
  **vista previa del logo grabado**.
- Pasar por **Sobre nosotros**: aquí irán su historia, su foto y la del taller (marcado como pendiente).

## 4:30 – 5:00 · Cierre y siguientes pasos

- Abrir `CONTENT_TODO.md` (o llevarlo impreso):
  > «Todo lo marcado como pendiente lo rellenamos con vosotros: fotos, precios, plazos, horario,
  > vuestra historia. No hemos inventado nada.»
- Proponer la **migración a Shopify** (ver `SHOPIFY_MIGRATION.md`) y una fecha para la sesión de fotos.
- Pregunta de cierre: **«¿Qué pieza queréis que sea la primera en venderse online?»**

## Si algo falla

- Sin conexión: la demo funciona entera en local (`pnpm build && pnpm start`).
- El carrito o los pedidos se ven raros: `/mis-pedidos` → «Borrar datos de la demo» y recargar.
- El logo no se ve bien: subir el **umbral**, activar **invertir** o usar el logo de ejemplo.
- Las animaciones van lentas en un portátil viejo: activar «reducir movimiento» del sistema; la web
  lo respeta y sigue siendo usable.
