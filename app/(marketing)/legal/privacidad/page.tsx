import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/misc";
import { fullAddress, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad",
  description: `Cómo trata ${site.name} tus datos personales: responsable, finalidades, plazos y derechos (RGPD y LOPDGDD).`,
  path: "/legal/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      path="/legal/privacidad"
      lead="Qué datos tratamos, para qué y cómo ejercer tus derechos, conforme al RGPD (UE 2016/679) y la LOPDGDD (LO 3/2018)."
    >
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Responsable:</strong> {site.legalName} (NIF {site.taxId})
        </li>
        <li>
          <strong>Dirección:</strong> {fullAddress()}
        </li>
        <li>
          <strong>Contacto:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
      </ul>

      <h2>2. Esta demo no envía tus datos</h2>
      <p>
        En la versión de demostración, los formularios se validan pero <strong>no se envían</strong>: el
        carrito, los pedidos de prueba, los favoritos y los diseños se guardan solo en tu navegador
        (localStorage) y puedes borrarlos desde <a href="/mis-pedidos">Mis pedidos</a>. Los logos que subes al
        personalizador se procesan en tu dispositivo y no se suben a ningún servidor.
      </p>

      <h2>3. Finalidades y legitimación (web definitiva)</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Finalidad</th>
            <th scope="col">Base legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responder consultas y presupuestos</td>
            <td>Consentimiento y medidas precontractuales</td>
          </tr>
          <tr>
            <td>Gestionar pedidos, envíos y facturación</td>
            <td>Ejecución del contrato y obligaciones legales</td>
          </tr>
          <tr>
            <td>Enviar novedades e ideas de regalo</td>
            <td>Consentimiento (puedes retirarlo cuando quieras)</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Conservación</h2>
      <p>
        Los datos se conservan mientras dure la relación y, después, durante los plazos legales (por ejemplo,
        obligaciones fiscales). Los datos de comunicaciones comerciales, hasta que retires el consentimiento.
      </p>

      <h2>5. Destinatarios</h2>
      <p>
        No se ceden datos a terceros salvo obligación legal. Pueden acceder a ellos proveedores necesarios
        para prestar el servicio (alojamiento web, pasarela de pago, transporte, email), con contrato de
        encargo de tratamiento: <Placeholder>[lista de proveedores — confirmar]</Placeholder>.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento
        y portabilidad escribiendo a <a href={`mailto:${site.email}`}>{site.email}</a>, indicando el derecho
        que ejerces. Si consideras que no se han atendido correctamente, puedes reclamar ante la Agencia
        Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          aepd.es
        </a>
        ).
      </p>
    </LegalPage>
  );
}
