import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { fullAddress, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Aviso legal",
  description: `Aviso legal de ${site.name}: titular, datos de contacto y condiciones de uso de la web.`,
  path: "/legal/aviso-legal",
});

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" path="/legal/aviso-legal">
      <h2>1. Titular de la web</h2>
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
      </p>
      <ul>
        <li>
          <strong>Titular:</strong> {site.legalName}
        </li>
        <li>
          <strong>NIF:</strong> {site.taxId}
        </li>
        <li>
          <strong>Domicilio:</strong> {fullAddress()}
        </li>
        <li>
          <strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>
          <strong>Teléfono:</strong> {site.phones.mobile.display} · {site.phones.landline.display}
        </li>
        <li>
          <strong>Registro:</strong> inscrita en el Registro Mercantil de Madrid
        </li>
      </ul>

      <h2>2. Objeto y condiciones de uso</h2>
      <p>
        Esta web informa sobre los servicios de grabado en cristal con chorro de arena y permite configurar y
        encargar productos personalizados. El acceso es gratuito e implica la aceptación de este aviso legal.
        El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades
        ilícitas.
      </p>

      <h2>3. Propiedad intelectual e industrial</h2>
      <p>
        Los textos, el diseño, las ilustraciones y el código de esta web pertenecen a su titular o se usan con
        licencia. Los logotipos de ejemplo del personalizador se usan solo para mostrar el resultado del
        grabado. Las marcas de terceros que puedan aparecer en fotografías de trabajos reales pertenecen a sus
        respectivos titulares.
      </p>
      <p>
        Al subir un logotipo o una imagen para personalizar una pieza, el usuario declara que tiene derecho a
        utilizarlo.
      </p>

      <h2>4. Responsabilidad</h2>
      <p>
        El titular no se hace responsable de los daños derivados del uso de la web ni de interrupciones del
        servicio ajenas a su control. Las vistas previas del personalizador son orientativas: el resultado
        final puede variar ligeramente según la pieza, y siempre se envía una prueba antes de grabar.
      </p>

      <h2>5. Enlaces</h2>
      <p>
        La web puede incluir enlaces a sitios de terceros (por ejemplo, Google Maps o WhatsApp). El titular no
        se responsabiliza de sus contenidos ni de sus políticas.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se
        someten a los juzgados y tribunales que correspondan conforme a la normativa de consumidores.
      </p>
    </LegalPage>
  );
}
