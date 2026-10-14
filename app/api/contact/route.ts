import { NextResponse } from "next/server";
import { contactSchema, quickContactSchema } from "@/lib/validation";

/**
 * Formulario de contacto (DEMO): valida con Zod y responde 200 SIN enviar nada.
 * Acepta el formulario completo de /contacto y el formulario rápido de la home.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON no válido" }, { status: 400 });
  }
  const isQuick = typeof body === "object" && body !== null && !("name" in body);
  const parsed = (isQuick ? quickContactSchema : contactSchema).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  // Envío del mensaje (p. ej. con Resend o el formulario de contacto de Shopify):
  //   await resend.emails.send({ from: "web@…", to: site.email, subject: "Nuevo mensaje web", ... })
  // Variables previstas (opcionales): RESEND_API_KEY, CONTACT_TO_EMAIL (ver .env.example)

  return NextResponse.json({ ok: true, message: "Mensaje recibido." });
}
