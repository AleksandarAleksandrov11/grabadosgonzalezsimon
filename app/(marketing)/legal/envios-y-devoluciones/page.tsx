import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/misc";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Envíos y devoluciones",
  description:
    "Plazos de producción, métodos de envío, recogida en taller y condiciones de devolución de piezas grabadas.",
  path: "/legal/envios-y-devoluciones",
});

export default function EnviosPage() {
  const d = site.demo;
  return (
    <LegalPage
      title="Envíos y devoluciones"
      path="/legal/envios-y-devoluciones"
      lead="Plazos, costes y qué pasa si algo llega mal. Los importes y plazos son de ejemplo hasta que el taller los confirme."
    >
      {/* TODO: confirmar plazos, tarifas y zonas reales con el cliente y revisar con asesor legal */}
      <h2>1. Plazo de producción</h2>
      <p>
        Cada pieza se graba a mano después de que apruebes la prueba del diseño. Plazo orientativo:{" "}
        <strong>{d.productionTime}</strong> <Placeholder>ejemplo</Placeholder>. Para pedidos grandes o fechas
        concretas (bodas, eventos), te confirmamos el plazo antes de producir.
      </p>

      <h2>2. Métodos y costes de envío</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Método</th>
            <th scope="col">Plazo tras la producción</th>
            <th scope="col">Coste</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Envío estándar (península)</td>
            <td>48–72 h</td>
            <td>
              {formatPrice(d.shippingStandard)} · gratis desde {formatPrice(d.freeShippingThreshold)}
            </td>
          </tr>
          <tr>
            <td>Envío urgente (península)</td>
            <td>24 h</td>
            <td>+{formatPrice(d.shippingExpressExtra)} sobre el estándar</td>
          </tr>
          <tr>
            <td>Recogida en el taller (Madrid)</td>
            <td>Te avisamos cuando esté lista</td>
            <td>Gratis</td>
          </tr>
        </tbody>
      </table>
      <p>
        Baleares, Canarias, Ceuta y Melilla: <Placeholder>[consultar tarifas]</Placeholder>. Todos los
        importes son de ejemplo para la demo.
      </p>

      <h2>3. Embalaje y roturas en el transporte</h2>
      <p>
        Embalamos cada pieza con protección para cristal. Si algo llega roto, avísanos en un plazo de{" "}
        <Placeholder>[48 h — confirmar]</Placeholder> con fotos del paquete y de la pieza, y la volvemos a
        grabar sin coste.
      </p>

      <h2>4. Devoluciones</h2>
      <p>
        Las piezas <strong>personalizadas</strong> se fabrican según tus indicaciones, por lo que están
        excluidas del derecho de desistimiento (artículo 103.c del Real Decreto Legislativo 1/2007, Ley
        General para la Defensa de los Consumidores y Usuarios). Por eso te enviamos siempre una prueba del
        diseño antes de grabar.
      </p>
      <p>
        Los productos <strong>sin personalizar</strong> pueden devolverse en un plazo de 14 días naturales
        desde la entrega, en su estado original. Escríbenos a{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>5. Errores de grabado</h2>
      <p>
        Si el grabado no coincide con la prueba que aprobaste, lo repetimos sin coste. Revisa bien nombres,
        fechas y ortografía en la prueba: el grabado es irreversible.
      </p>
    </LegalPage>
  );
}
