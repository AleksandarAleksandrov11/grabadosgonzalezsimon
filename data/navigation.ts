export const mainNav = [
  { label: "Tienda", href: "/tienda", mega: true },
  { label: "Personaliza", href: "/personaliza" },
  { label: "Empresas", href: "/empresas" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const footerNav = {
  Tienda: [
    { label: "Todos los productos", href: "/tienda" },
    { label: "Vasos", href: "/tienda/vasos" },
    { label: "Copas", href: "/tienda/copas" },
    { label: "Jarras y jarrones", href: "/tienda/jarrones" },
    { label: "Trofeos y metopas", href: "/tienda/trofeos" },
    { label: "Personaliza el tuyo", href: "/personaliza" },
  ],
  Ocasiones: [
    { label: "Bodas", href: "/ocasiones/bodas" },
    { label: "Comuniones", href: "/ocasiones/comuniones" },
    { label: "Aniversarios", href: "/ocasiones/aniversarios" },
    { label: "Jubilaciones", href: "/ocasiones/jubilaciones" },
    { label: "Todas las ocasiones", href: "/ocasiones" },
  ],
  Empresa: [
    { label: "Sobre nosotros", href: "/sobre-nosotros" },
    { label: "La técnica", href: "/tecnica" },
    { label: "Para empresas", href: "/empresas" },
    { label: "Hostelería", href: "/ocasiones/hosteleria" },
  ],
  Ayuda: [
    { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
    { label: "Contacto", href: "/contacto" },
    { label: "Mis pedidos (demo)", href: "/mis-pedidos" },
    { label: "Favoritos", href: "/favoritos" },
  ],
  Legal: [
    { label: "Aviso legal", href: "/legal/aviso-legal" },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Cookies", href: "/legal/cookies" },
    { label: "Envíos y devoluciones", href: "/legal/envios-y-devoluciones" },
  ],
} as const;
