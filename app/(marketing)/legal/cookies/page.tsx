import type { Metadata } from "next";
import { CookieSettingsButton } from "@/components/legal/CookieSettingsButton";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Política de cookies",
  description: `Qué cookies y almacenamiento local usa la web de ${site.name} y cómo configurarlos.`,
  path: "/legal/cookies",
});

const ITEMS = [
  { key: "ggs-demo:cart", type: "Técnica", purpose: "Guardar el carrito", duration: "Hasta que lo borres" },
  {
    key: "ggs-demo:orders",
    type: "Técnica",
    purpose: "Pedidos de prueba de la demo",
    duration: "Hasta que lo borres",
  },
  { key: "ggs-demo:favorites", type: "Técnica", purpose: "Tus favoritos", duration: "Hasta que lo borres" },
  {
    key: "ggs-demo:designs",
    type: "Técnica",
    purpose: "Diseños guardados del personalizador",
    duration: "Hasta que lo borres",
  },
  {
    key: "ggs-demo:cookies",
    type: "Técnica",
    purpose: "Recordar tu elección sobre cookies",
    duration: "Hasta que lo borres",
  },
  {
    key: "ggs-demo:checkout",
    type: "Técnica (sesión)",
    purpose: "Progreso del checkout",
    duration: "Al cerrar la pestaña",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      path="/legal/cookies"
      lead="Usamos solo lo imprescindible para que la tienda funcione. Nada de publicidad ni rastreo."
    >
      <h2>1. Qué usamos</h2>
      <p>
        Esta web no instala cookies publicitarias ni analíticas. Para que la tienda funcione utiliza el{" "}
        <strong>almacenamiento local del navegador</strong> (equivalente a cookies técnicas), que no se envía
        a ningún servidor:
      </p>
      <div className="relative -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:px-0">
        <table className="min-w-[34rem]">
          <thead>
            <tr>
              <th scope="col">Clave</th>
              <th scope="col">Tipo</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Duración</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((i) => (
              <tr key={i.key}>
                <td>
                  <code className="text-[0.8125rem]">{i.key}</code>
                </td>
                <td>{i.type}</td>
                <td>{i.purpose}</td>
                <td>{i.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>2. Servicios de terceros</h2>
      <p>
        <strong>Google Maps</strong> solo se carga si pulsas «Cargar mapa» en la página de contacto; a partir
        de ese momento Google puede usar sus propias cookies. Los enlaces a WhatsApp abren el servicio de Meta
        en otra pestaña.
      </p>
      <p>Si en el futuro se añaden analíticas, solo se activarán si las aceptas en el aviso de cookies.</p>

      <h2>3. Cómo configurarlas o borrarlas</h2>
      <p>Puedes cambiar tu elección en cualquier momento:</p>
      <div className="not-prose">
        <CookieSettingsButton />
      </div>
      <p>
        También puedes borrar todos los datos de la demo desde <a href="/mis-pedidos">Mis pedidos</a> o desde
        la configuración de tu navegador.
      </p>
    </LegalPage>
  );
}
