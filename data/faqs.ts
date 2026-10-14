/**
 * Preguntas frecuentes. Las respuestas con [VERIFICAR] o «(ejemplo)» son
 * placeholders a confirmar con el cliente (ver CONTENT_TODO.md).
 */

export type Faq = { id: string; q: string; a: string; group: FaqGroup; home?: boolean };
export type FaqGroup = "Pedidos" | "Personalización" | "Técnica" | "Envíos" | "Empresas";

export const FAQ_GROUPS: FaqGroup[] = ["Pedidos", "Personalización", "Técnica", "Envíos", "Empresas"];

export const faqs: Faq[] = [
  {
    id: "que-grabar",
    group: "Personalización",
    home: true,
    q: "¿Qué puedo grabar?",
    a: "Casi cualquier cosa: iniciales, nombres, fechas, frases, logotipos, escudos y dibujos. Grabo vasos, copas, jarras, jarrones, metopas, placas y trofeos. Si tienes una idea, cuéntamela y te digo cómo quedará mejor.",
  },
  {
    id: "formato-logo",
    group: "Personalización",
    home: true,
    q: "¿Qué formato de logo necesitáis?",
    a: "Lo ideal es un archivo vectorial (SVG, PDF, AI o EPS). Si no lo tienes, una imagen PNG o JPG nítida también sirve: la preparo para el grabado y te envío la prueba antes de producir.",
  },
  {
    id: "permanente",
    group: "Técnica",
    home: true,
    q: "¿El grabado es permanente?",
    a: "Sí. El chorro de arena esmerila el propio cristal: no es pintura, vinilo ni impresión, así que no se despega ni se borra con el tiempo. El acabado es limpio, elegante y permanente.",
  },
  {
    id: "ver-diseno",
    group: "Pedidos",
    home: true,
    q: "¿Puedo ver el diseño antes de que lo grabéis?",
    a: "Siempre. Con el personalizador ves una vista previa al momento y, antes de grabar, te envío la prueba definitiva para que la apruebes.",
  },
  {
    id: "pedidos-grandes",
    group: "Empresas",
    home: true,
    q: "¿Hacéis pedidos grandes para empresas o eventos?",
    a: "Sí. Trabajo series para empresas, hostelería, bodas, clubes y asociaciones. A partir de 12 unidades se aplica precio por volumen y para grandes cantidades preparo un presupuesto a medida.",
  },
  {
    id: "plazo",
    group: "Pedidos",
    q: "¿Cuánto tarda un pedido?",
    a: "Como referencia, la producción es de 5–7 días laborables tras aprobar el diseño, más el envío. [Plazo de ejemplo — confirmar con el taller]",
  },
  {
    id: "urgente",
    group: "Pedidos",
    q: "¿Puedo pedir algo con urgencia?",
    a: "Escríbeme por WhatsApp o teléfono contándome la fecha y haré lo posible por llegar. [Política de urgencias a confirmar]",
  },
  {
    id: "devoluciones",
    group: "Pedidos",
    q: "¿Puedo devolver un producto personalizado?",
    a: "Los productos personalizados se fabrican a medida y no admiten devolución salvo defecto o rotura en el transporte. [TODO legal: revisar condiciones con el cliente]",
  },
  {
    id: "lavavajillas",
    group: "Técnica",
    q: "¿Se pueden lavar en lavavajillas?",
    a: "[VERIFICAR: ¿apto lavavajillas?] Mientras lo confirmamos, recomendamos lavado a mano con agua tibia y jabón neutro para conservar el brillo del cristal.",
  },
  {
    id: "tecnica",
    group: "Técnica",
    q: "¿Qué es el grabado con chorro de arena?",
    a: "Es una técnica artesanal: protegemos el cristal con una máscara que recorta tu diseño y proyectamos arena a presión. La arena esmerila solo las zonas descubiertas, creando un grabado blanco mate con mucho detalle y la profundidad justa para no comprometer la pieza.",
  },
  {
    id: "dos-caras",
    group: "Personalización",
    q: "¿Se puede grabar por las dos caras?",
    a: "En vasos, copas y jarrones sí: elige «Dos caras» en la ficha. Puedes poner, por ejemplo, las iniciales delante y la fecha detrás.",
  },
  {
    id: "letra-mano",
    group: "Personalización",
    q: "¿Podéis grabar una letra manuscrita o un dibujo?",
    a: "Sí. Escanea o fotografía la dedicatoria o el dibujo con buena luz y lo adapto para el grabado.",
  },
  {
    id: "envios",
    group: "Envíos",
    q: "¿Hacéis envíos a toda España?",
    a: "Sí, a toda la península. Envío gratis a partir de 60 € (ejemplo). Baleares, Canarias, Ceuta y Melilla: consultar. [Condiciones de envío a confirmar]",
  },
  {
    id: "recogida",
    group: "Envíos",
    q: "¿Puedo recogerlo en el taller?",
    a: "Sí, en el checkout puedes elegir «Recogida en taller (Madrid)» sin coste. Te aviso cuando esté listo.",
  },
  {
    id: "embalaje",
    group: "Envíos",
    q: "¿Cómo se protege el cristal en el envío?",
    a: "Cada pieza viaja protegida individualmente en un embalaje pensado para cristal. Si llegara dañada, te la repongo. [Confirmar con el taller]",
  },
  {
    id: "factura",
    group: "Empresas",
    q: "¿Emitís factura a empresas?",
    a: "Sí, indica los datos fiscales en el pedido o en la solicitud de presupuesto. [Confirmar condiciones con el taller]",
  },
];
