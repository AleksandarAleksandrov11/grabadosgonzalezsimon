/** Preguntas frecuentes (página de FAQ, home, ocasiones y empresas). */

export type Faq = { id: string; q: string; a: string; group: FaqGroup; home?: boolean };
export type FaqGroup = "Pedidos" | "Personalización" | "Técnica" | "Envíos" | "Empresas";

export const FAQ_GROUPS: FaqGroup[] = ["Pedidos", "Personalización", "Técnica", "Envíos", "Empresas"];

export const faqs: Faq[] = [
  {
    id: "que-grabar",
    group: "Personalización",
    home: true,
    q: "¿Qué puedo grabar?",
    a: "Iniciales, nombres, fechas, frases, logotipos, escudos y dibujos sobre vasos, copas, jarras, jarrones, metopas, placas y trofeos. Si tienes una idea, cuéntanosla y te decimos cómo quedará mejor.",
  },
  {
    id: "formato-logo",
    group: "Personalización",
    home: true,
    q: "¿Qué formato de logo necesitáis?",
    a: "Lo ideal es un archivo vectorial (SVG, PDF, AI o EPS). Si no lo tienes, una imagen PNG o JPG nítida también sirve: la preparamos para el grabado sin coste y te enviamos la prueba antes de producir.",
  },
  {
    id: "permanente",
    group: "Técnica",
    home: true,
    q: "¿El grabado es permanente?",
    a: "Sí. El chorro de arena esmerila el propio cristal: no es pintura, vinilo ni impresión, así que no se despega ni se borra con el tiempo.",
  },
  {
    id: "ver-diseno",
    group: "Pedidos",
    home: true,
    q: "¿Puedo ver el diseño antes de que lo grabéis?",
    a: "Siempre. Con el personalizador ves una vista previa al momento y, antes de grabar, te enviamos la prueba definitiva para que la apruebes.",
  },
  {
    id: "pedidos-grandes",
    group: "Empresas",
    home: true,
    q: "¿Hacéis pedidos grandes para empresas o eventos?",
    a: "Sí. Trabajamos series para empresas, hostelería, bodas, clubes y asociaciones. Desde 12 unidades se aplica precio por volumen y a partir de 50 preparamos un presupuesto a medida.",
  },
  {
    id: "plazo",
    group: "Pedidos",
    q: "¿Cuánto tarda un pedido?",
    a: "La producción tarda de 5 a 7 días laborables desde que apruebas el diseño. Después, el envío estándar llega en 48 a 72 horas.",
  },
  {
    id: "urgente",
    group: "Pedidos",
    q: "¿Puedo pedir algo con urgencia?",
    a: "Sí. Para encargos urgentes podemos grabar en 48 horas con un suplemento de 15 €. Escríbenos por WhatsApp o llámanos para confirmar la fecha.",
  },
  {
    id: "devoluciones",
    group: "Pedidos",
    q: "¿Puedo devolver un producto personalizado?",
    a: "Al estar hechos a medida, los productos personalizados no admiten devolución. Si llegan rotos o el grabado no coincide con la prueba aprobada, los volvemos a grabar sin coste.",
  },
  {
    id: "lavavajillas",
    group: "Técnica",
    q: "¿Se pueden lavar en lavavajillas?",
    a: "Sí. El grabado resiste el lavavajillas. Para conservar el brillo del cristal durante más tiempo, recomendamos programas de baja temperatura.",
  },
  {
    id: "tecnica",
    group: "Técnica",
    q: "¿Qué es el grabado con chorro de arena?",
    a: "Protegemos el cristal con una máscara que recorta tu diseño y proyectamos arena a presión. La arena esmerila solo las zonas descubiertas y deja un grabado blanco y mate, con la profundidad justa para no debilitar la pieza.",
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
    a: "Sí. Escanea o fotografía la dedicatoria o el dibujo con buena luz y lo adaptamos para el grabado.",
  },
  {
    id: "envios",
    group: "Envíos",
    q: "¿Hacéis envíos a toda España?",
    a: "Sí. En la península el envío es gratis a partir de 60 €. Baleares cuesta 9,90 € y Canarias, Ceuta y Melilla 14,90 €.",
  },
  {
    id: "recogida",
    group: "Envíos",
    q: "¿Puedo recogerlo en el taller?",
    a: "Sí, sin coste. Elige «Recogida en el taller» al hacer el pedido y te avisamos cuando esté listo.",
  },
  {
    id: "embalaje",
    group: "Envíos",
    q: "¿Cómo se protege el cristal en el envío?",
    a: "Cada pieza viaja protegida en un embalaje pensado para cristal. Si llegara dañada, avísanos en 48 horas con una foto y te la reponemos.",
  },
  {
    id: "factura",
    group: "Empresas",
    q: "¿Emitís factura a empresas?",
    a: "Sí. Indica los datos fiscales en el pedido o en la solicitud de presupuesto y recibirás la factura con el IVA desglosado.",
  },
];
