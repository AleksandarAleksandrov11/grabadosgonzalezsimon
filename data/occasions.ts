import type { OccasionTag } from "@/lib/commerce/types";
import type { GlassId } from "@/lib/glass/pieces";
import type { StaticEngraving } from "@/components/glassware/Glass";
import type { TemplateId } from "@/lib/engrave/templates";

export type Occasion = {
  slug: string;
  tag: OccasionTag;
  title: string;
  /** línea emocional corta (tarjetas) */
  line: string;
  /** titular del hero; *palabra* = cursiva */
  heroTitle: string;
  heroLead: string;
  illustration: GlassId;
  sample: StaticEngraving;
  why: { title: string; text: string }[];
  ideasTitle: string;
  ideas: string[];
  template: TemplateId;
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
};

export const occasions: Occasion[] = [
  {
    slug: "bodas",
    tag: "boda",
    title: "Bodas",
    line: "Vuestras iniciales en el primer brindis.",
    heroTitle: "Un brindis que se queda *para siempre*",
    heroLead:
      "Copas de brindis con vuestras iniciales, centros de mesa grabados y detalles para invitados que sí se usan. Grabado a mano en Madrid.",
    illustration: "pack-brindis",
    sample: {
      kind: "text",
      lines: [
        { text: "A & M", font: "script", size: 0.26 },
        { text: "12·06·26", font: "roman", size: 0.07, tracking: 0.1 },
      ],
    },
    why: [
      {
        title: "Se usa en cada aniversario",
        text: "Las copas del brindis vuelven a la mesa año tras año. Grabadas, cuentan vuestra historia sin decir nada.",
      },
      {
        title: "No se borra en el lavavajillas del tiempo",
        text: "El chorro de arena trabaja el propio cristal: no hay pintura ni vinilo que se despegue.",
      },
      {
        title: "Un detalle para invitados con sentido",
        text: "Una copa grabada para cada invitado es un recuerdo útil que se llevan a casa.",
      },
    ],
    ideasTitle: "Ideas de grabado para bodas",
    ideas: [
      "Iniciales entrelazadas + fecha: «A & M · 12.06.2026»",
      "«Para siempre» en caligrafía",
      "Los nombres de los novios: «Elena & Pablo»",
      "Coordenadas del lugar donde os conocisteis",
      "«Sí, quiero» en la copa de cada uno",
      "Monograma con la inicial del apellido de la familia",
    ],
    template: "boda",
    faqs: [
      {
        q: "¿Con cuánta antelación debo encargar las copas de boda?",
        a: "Recomendamos encargarlas con al menos 3–4 semanas de margen para revisar el diseño con calma. [Plazo de ejemplo — confirmar con el taller]",
      },
      {
        q: "¿Podéis grabar copas para todos los invitados?",
        a: "Sí. Tenemos un formato de copas para invitados con precio por unidad y descuentos por volumen a partir de 24 copas.",
      },
      {
        q: "¿Puedo ver el diseño antes de que lo grabéis?",
        a: "Siempre. Antes de grabar te enviamos la prueba del diseño para que la apruebes.",
      },
    ],
    seoTitle: "Copas grabadas para boda con iniciales y fecha",
    seoDescription:
      "Copas grabadas para boda, copas de brindis con iniciales, centros de mesa y detalles para invitados. Grabado en cristal con chorro de arena en Madrid.",
  },
  {
    slug: "comuniones",
    tag: "comunion",
    title: "Comuniones",
    line: "Su nombre y su gran día, en cada vaso.",
    heroTitle: "Su *gran día*, grabado en la mesa",
    heroLead:
      "Vasos y copas con el nombre del protagonista y la fecha de la comunión. Un recuerdo para la familia que dura mucho más que la fiesta.",
    illustration: "pack-vasos",
    sample: {
      kind: "text",
      lines: [
        { text: "Hugo", font: "script", size: 0.34 },
        { text: "1ª COMUNIÓN", font: "thin", size: 0.08, tracking: 0.2 },
      ],
    },
    why: [
      {
        title: "Un recuerdo para cada familia",
        text: "Cada invitado se lleva su vaso grabado: un detalle útil que no termina en un cajón.",
      },
      {
        title: "La mesa más especial",
        text: "Un pack de vasos con su nombre viste la mesa principal del banquete.",
      },
      {
        title: "Hecho a su medida",
        text: "Su nombre, la fecha y un pequeño símbolo: una cruz, una paloma, un cáliz o lo que elijáis.",
      },
    ],
    ideasTitle: "Ideas de grabado para comuniones",
    ideas: [
      "«Hugo · Mi Primera Comunión»",
      "Nombre + fecha + pequeña cruz",
      "«Lucía · 16 de mayo de 2026»",
      "Una paloma con el nombre debajo",
      "Iniciales en monograma infantil",
    ],
    template: "comunion",
    faqs: [
      {
        q: "¿El pack de 12 vasos puede ampliarse?",
        a: "Sí, escríbenos con el número de invitados y te preparamos presupuesto con precio por volumen.",
      },
      {
        q: "¿Podemos combinar vasos y copas para adultos?",
        a: "Claro: vasos para los peques y copas para los adultos con el mismo diseño.",
      },
      {
        q: "¿Los vasos son aptos para niños?",
        a: "Son vasos de cristal estándar; recomendamos el uso supervisado. [VERIFICAR: tipo de cristal y recomendaciones del taller]",
      },
    ],
    seoTitle: "Vasos y copas personalizadas para comunión",
    seoDescription:
      "Vasos y copas personalizadas para comunión con nombre y fecha. Packs para la mesa y recuerdos para invitados. Grabado en cristal en Madrid.",
  },
  {
    slug: "bautizos",
    tag: "bautizo",
    title: "Bautizos",
    line: "Su primer recuerdo, grabado en cristal.",
    heroTitle: "Su *primer* recuerdo de familia",
    heroLead:
      "Detalles grabados con su nombre y la fecha del bautizo: copas para los padrinos, vasos para la mesa y centros con su inicial.",
    illustration: "copa-blanco",
    sample: {
      kind: "text",
      lines: [
        { text: "Martina", font: "script", size: 0.3 },
        { text: "BAUTIZO · 2026", font: "thin", size: 0.07, tracking: 0.2 },
      ],
    },
    why: [
      {
        title: "Para los padrinos",
        text: "Una copa grabada con su nombre y la palabra «Padrino» o «Madrina» es un regalo que se guarda toda la vida.",
      },
      {
        title: "Para cuando crezca",
        text: "Un recuerdo de cristal que podrá tener en sus manos dentro de muchos años.",
      },
      {
        title: "Discreto y elegante",
        text: "El esmerilado blanco combina con cualquier decoración, sin colores que pasen de moda.",
      },
    ],
    ideasTitle: "Ideas de grabado para bautizos",
    ideas: [
      "«Martina · 3 de octubre de 2026»",
      "«Padrino» / «Madrina» con el nombre del bebé",
      "Una inicial grande en caligrafía",
      "Pequeña estrella o paloma con la fecha",
    ],
    template: "comunion",
    faqs: [
      {
        q: "¿Qué regalo recomendáis para los padrinos?",
        a: "Un pack de 2 copas grabadas con «Padrino» y «Madrina» y el nombre del bebé, con estuche regalo.",
      },
      {
        q: "¿Podéis grabar un símbolo religioso?",
        a: "Sí: cruz, paloma, concha o el símbolo que elijáis, integrado en el diseño.",
      },
      {
        q: "¿Hacéis centros de mesa para el bautizo?",
        a: "Sí, con jarrones de boca ancha grabados con la inicial y la fecha.",
      },
    ],
    seoTitle: "Regalos grabados para bautizo",
    seoDescription:
      "Regalos grabados para bautizo: copas para padrinos, vasos con nombre y fecha y centros de mesa. Grabado en cristal artesanal en Madrid.",
  },
  {
    slug: "aniversarios",
    tag: "aniversario",
    title: "Aniversarios",
    line: "Los años juntos, en un brindis.",
    heroTitle: "Años que *merecen* un brindis",
    heroLead:
      "Copas, jarrones y vasos grabados con vuestra fecha, vuestros nombres o esa frase que solo vosotros entendéis.",
    illustration: "jarron-cilindrico",
    sample: {
      kind: "text",
      lines: [
        { text: "Bodas de Plata", font: "classic", size: 0.14, weight: 500 },
        { text: "25 años", font: "script", size: 0.16 },
      ],
    },
    why: [
      {
        title: "Un regalo con historia",
        text: "La fecha en que todo empezó, grabada para siempre en una pieza que se usa.",
      },
      {
        title: "Para los padres o abuelos",
        text: "Bodas de plata, de oro… un jarrón o unas copas grabadas son el centro de la celebración.",
      },
      {
        title: "Personal de verdad",
        text: "Coordenadas, una canción, una frase: grabamos lo que os representa.",
      },
    ],
    ideasTitle: "Ideas de grabado para aniversarios",
    ideas: [
      "«25 años · Bodas de Plata»",
      "«Desde 1998» con vuestras iniciales",
      "Las coordenadas de vuestra primera cita",
      "«Contigo, siempre»",
      "Los nombres y la fecha de la boda",
    ],
    template: "iniciales",
    faqs: [
      {
        q: "¿Qué grabado queda mejor en un jarrón?",
        a: "Frases cortas en caligrafía o un monograma con la fecha. Te enviamos la prueba para que elijas.",
      },
      {
        q: "¿Podéis copiar la letra de una dedicatoria escrita a mano?",
        a: "Sí: escanéala o hazle una foto nítida y la adaptamos para el grabado.",
      },
      { q: "¿Lo enviáis con estuche?", a: "Puedes añadir estuche regalo en la ficha o en el carrito." },
    ],
    seoTitle: "Regalos de aniversario grabados en cristal",
    seoDescription:
      "Regalos de aniversario grabados: copas, jarrones y vasos con vuestros nombres y fecha. Bodas de plata y de oro. Grabado en cristal en Madrid.",
  },
  {
    slug: "regalos",
    tag: "regalo",
    title: "Regalos personalizados",
    line: "El regalo que no se repite.",
    heroTitle: "Un regalo que *nadie más* tiene",
    heroLead:
      "Un vaso con sus iniciales, una jarra con su nombre o un set de whisky con su monograma. Regalos únicos, hechos a mano en Madrid.",
    illustration: "set-whisky",
    sample: { kind: "text", lines: [{ text: "R G", font: "roman", size: 0.3, weight: 600, tracking: 0.1 }] },
    why: [
      {
        title: "Único de verdad",
        text: "No es un regalo de catálogo: es una pieza con su nombre, hecha para esa persona.",
      },
      { title: "Útil y para siempre", text: "Se usa a diario y el grabado no se gasta con el tiempo." },
      { title: "Listo para regalar", text: "Añade estuche y llega preparado para entregar." },
    ],
    ideasTitle: "Ideas de regalos grabados",
    ideas: [
      "Vaso de whisky con sus iniciales para el Día del Padre",
      "Jarra de cerveza con su apodo",
      "Copa de balón con «Salud» y su nombre",
      "Set decantador con monograma",
      "Una frase que solo él o ella entienda",
    ],
    template: "iniciales",
    faqs: [
      {
        q: "¿Cuál es el regalo más pedido?",
        a: "El vaso de whisky tallado con iniciales y el set de decantador con dos vasos.",
      },
      {
        q: "¿Puedo añadir una tarjeta con mensaje?",
        a: "Sí, escríbelo en la nota del pedido y la incluimos. [Confirmar con el taller]",
      },
      {
        q: "¿Envías directamente a la persona que recibe el regalo?",
        a: "Sí, indica su dirección en el envío. [Confirmar política de envíos con el taller]",
      },
    ],
    seoTitle: "Regalos personalizados grabados en cristal",
    seoDescription:
      "Regalos personalizados grabados en cristal: vasos con iniciales, jarras con nombre, sets de whisky y copas. Grabado artesanal en Madrid.",
  },
  {
    slug: "empresas",
    tag: "empresa",
    title: "Empresas y logotipos",
    line: "Tu marca, grabada con detalle.",
    heroTitle: "Tu marca, grabada *con detalle*",
    heroLead:
      "Regalos corporativos, premios a empleados y cristalería con logotipo. Pedidos por volumen con prueba de diseño incluida.",
    illustration: "metopa",
    sample: { kind: "logo", logo: "club", scale: 0.86 },
    why: [
      {
        title: "Logotipos con precisión",
        text: "El chorro de arena reproduce trazos finos, degradados simplificados y textos pequeños con nitidez.",
      },
      {
        title: "Precio por volumen",
        text: "Descuentos automáticos a partir de 12 unidades y presupuesto a medida para grandes series.",
      },
      {
        title: "Prueba antes de producir",
        text: "Te enviamos una maqueta del grabado para validarla antes de empezar.",
      },
    ],
    ideasTitle: "Ideas para empresas",
    ideas: [
      "Regalo de Navidad para clientes con el logo",
      "Premios internos: «Mejor equipo 2026»",
      "Metopas por aniversario de empresa",
      "Kit de bienvenida con vaso grabado",
      "Trofeos para torneos corporativos",
    ],
    template: "escudo",
    faqs: [
      {
        q: "¿Qué formato de logo necesitáis?",
        a: "Lo ideal es vectorial (SVG, PDF, AI o EPS). Si no lo tienes, vale una imagen nítida y la preparamos.",
      },
      { q: "¿Hacéis factura a empresa?", a: "Sí. [Confirmar condiciones de facturación con el taller]" },
      {
        q: "¿A partir de cuántas unidades hay descuento?",
        a: "Desde 12 unidades se aplica −10 %, desde 24 −15 % y para más de 50 preparamos presupuesto.",
      },
    ],
    seoTitle: "Cristalería con logo para empresas y regalos corporativos",
    seoDescription:
      "Cristalería con logo de empresa, regalos corporativos grabados, premios y trofeos de cristal. Precio por volumen. Grabado en Madrid.",
  },
  {
    slug: "hosteleria",
    tag: "hosteleria",
    title: "Hostelería",
    line: "Tu logo en cada servicio.",
    heroTitle: "Tu local, en *cada* brindis",
    heroLead:
      "Vasos, copas y jarras con el logotipo de tu bar, restaurante o bodega. Grabado permanente que aguanta el ritmo del servicio.",
    illustration: "pack-vasos",
    sample: { kind: "logo", logo: "cafe", scale: 0.86 },
    why: [
      {
        title: "Imagen de marca en mesa",
        text: "La cristalería grabada eleva la percepción del local en cada servicio.",
      },
      {
        title: "Aguanta el día a día",
        text: "Al ser grabado, el logo no se despega ni pierde color con los lavados. [VERIFICAR: apto lavavajillas industrial]",
      },
      {
        title: "Reposición sencilla",
        text: "Guardamos tu diseño para que puedas reponer piezas cuando lo necesites.",
      },
    ],
    ideasTitle: "Ideas para hostelería",
    ideas: [
      "Vasos de tubo con el logo para combinados",
      "Copas de vino con el nombre de la bodega",
      "Copas de balón para la carta de gin-tonics",
      "Jarras de agua con el nombre del restaurante",
      "Jarras de cerveza para tu cervecería",
    ],
    template: "escudo",
    faqs: [
      {
        q: "¿Cuál es el pedido mínimo para hostelería?",
        a: "El formato de cristalería con logo parte de 24 piezas, con tramos de descuento por volumen.",
      },
      {
        q: "¿Podéis grabar cristalería que ya tengo?",
        a: "En muchos casos sí. Escríbenos con el modelo y lo valoramos. [Confirmar con el taller]",
      },
      {
        q: "¿Guardáis mi logo para futuros pedidos?",
        a: "Sí, conservamos el diseño para que reponer sea rápido.",
      },
    ],
    seoTitle: "Cristalería con logo para hostelería: vasos y copas grabadas",
    seoDescription:
      "Vasos y copas grabadas con el logo de tu bar o restaurante. Cristalería personalizada para hostelería con precio por volumen en Madrid.",
  },
  {
    slug: "trofeos-y-homenajes",
    tag: "trofeo",
    title: "Trofeos y homenajes",
    line: "Para los que se lo han ganado.",
    heroTitle: "Para los que *se lo han ganado*",
    heroLead:
      "Trofeos de cristal, metopas y placas para torneos, galas, homenajes y reconocimientos. Escudos y textos grabados con el máximo detalle.",
    illustration: "trofeo-llama",
    sample: {
      kind: "text",
      lines: [
        { text: "CAMPEONES", font: "roman", size: 0.1, weight: 600, tracking: 0.08 },
        { text: "2026", font: "classic", size: 0.2, weight: 500 },
      ],
    },
    why: [
      {
        title: "La luz atraviesa el premio",
        text: "Un trofeo de cristal brilla en la vitrina como ningún otro material.",
      },
      {
        title: "Escudos con detalle",
        text: "Grabamos escudos de clubes y logotipos complejos con precisión.",
      },
      {
        title: "Series para torneos",
        text: "Primer, segundo y tercer puesto con el mismo diseño y precio por volumen.",
      },
    ],
    ideasTitle: "Ideas para trofeos y homenajes",
    ideas: [
      "«Campeones 2026» con el escudo del club",
      "«Mejor jugador de la temporada»",
      "«En reconocimiento a su trayectoria»",
      "«Gracias, maestro»",
      "Placa de inauguración con fecha",
    ],
    template: "campeones",
    faqs: [
      {
        q: "¿Podéis hacer una serie de trofeos para un torneo?",
        a: "Sí, con el mismo diseño y textos distintos por puesto. Aplicamos precio por volumen.",
      },
      {
        q: "¿Cuánto texto cabe en una metopa?",
        a: "Depende del tamaño; normalmente un escudo y 3–5 líneas de texto. Te enviamos la maqueta.",
      },
      {
        q: "¿Los trofeos llevan peana?",
        a: "Sí, peana negra incluida. El trofeo de jubilación incluye además estuche.",
      },
    ],
    seoTitle: "Trofeos de cristal personalizados y metopas",
    seoDescription:
      "Trofeos de cristal personalizados, metopas y placas grabadas para torneos, galas y homenajes. Grabado artesanal en Madrid.",
  },
  {
    slug: "jubilaciones",
    tag: "jubilacion",
    title: "Jubilaciones",
    line: "Toda una vida, en cristal.",
    heroTitle: "Toda una vida de trabajo, *en cristal*",
    heroLead:
      "El regalo del equipo para una despedida a la altura: trofeos con estuche, sets de whisky y metopas con dedicatoria.",
    illustration: "trofeo-obelisco",
    sample: {
      kind: "text",
      lines: [
        { text: "Feliz", font: "script", size: 0.14 },
        { text: "jubilación", font: "script", size: 0.14 },
      ],
    },
    why: [
      { title: "Un cierre emocionante", text: "Un objeto que recordará a su equipo cada vez que lo vea." },
      { title: "Con dedicatoria", text: "Su nombre, los años de trayectoria y unas palabras de todos." },
      { title: "Listo para entregar", text: "El trofeo de jubilación incluye estuche de presentación." },
    ],
    ideasTitle: "Ideas de dedicatoria para jubilaciones",
    ideas: [
      "«Feliz jubilación, Antonio · 1989–2026»",
      "«Gracias por tantos años»",
      "«Ahora empieza lo mejor»",
      "«De tu equipo, con cariño»",
    ],
    template: "jubilacion",
    faqs: [
      {
        q: "¿Qué regalo de jubilación recomendáis?",
        a: "El trofeo obelisco con estuche o el set de decantador y vasos grabados.",
      },
      {
        q: "¿Podemos poner los nombres de todo el equipo?",
        a: "En una metopa o placa sí; te proponemos la composición.",
      },
      {
        q: "¿Lo podemos recoger en el taller?",
        a: "Sí, puedes elegir recogida en taller (Madrid) en el checkout.",
      },
    ],
    seoTitle: "Regalos de jubilación grabados en cristal",
    seoDescription:
      "Regalos de jubilación grabados: trofeos de cristal con estuche, metopas con dedicatoria y sets de whisky. Grabado en cristal en Madrid.",
  },
  {
    slug: "navidad",
    tag: "navidad",
    title: "Navidad",
    line: "Brindis con nombre propio.",
    heroTitle: "Esta Navidad, *brinda* con nombre propio",
    heroLead:
      "Copas de cava para las campanadas, sets de regalo y detalles corporativos grabados para clientes y equipos.",
    illustration: "copa-cava",
    sample: {
      kind: "text",
      lines: [
        { text: "Feliz", font: "script", size: 0.16 },
        { text: "2027", font: "roman", size: 0.08, tracking: 0.2 },
      ],
    },
    why: [
      {
        title: "Regalos que no se olvidan",
        text: "Un detalle grabado destaca entre los regalos de cada año.",
      },
      {
        title: "Regalo corporativo con estilo",
        text: "Tu logo en un vaso o una copa para clientes y empleados.",
      },
      {
        title: "Planifícalo con tiempo",
        text: "En Navidad la demanda crece: encarga con antelación. [Plazos de ejemplo]",
      },
    ],
    ideasTitle: "Ideas de grabado para Navidad",
    ideas: [
      "«Feliz 2027» en la copa de las campanadas",
      "Una estrella con el nombre de cada invitado",
      "Logo de empresa + «Felices fiestas»",
      "Iniciales de la familia en el set de whisky",
    ],
    template: "navidad",
    faqs: [
      {
        q: "¿Hasta cuándo puedo encargar para Navidad?",
        a: "Recomendamos encargar antes de principios de diciembre. [Fecha límite de ejemplo — confirmar]",
      },
      { q: "¿Hacéis pedidos de empresa para Navidad?", a: "Sí, con precio por volumen y prueba de diseño." },
      {
        q: "¿Podéis enviar a varias direcciones?",
        a: "Consúltanos para pedidos corporativos con varios destinos.",
      },
    ],
    seoTitle: "Regalos de Navidad grabados en cristal",
    seoDescription:
      "Regalos de Navidad grabados: copas de cava para las campanadas, sets de whisky y regalos de empresa con logo. Grabado en Madrid.",
  },
];

export const occasionBySlug = (slug: string) => occasions.find((o) => o.slug === slug) ?? null;
export const occasionByTag = (tag: string) => occasions.find((o) => o.tag === tag) ?? null;

export { OCCASION_LABEL } from "./occasion-labels";
