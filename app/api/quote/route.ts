import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/validation";

/** Solicitud de presupuesto B2B (DEMO): valida y responde 200 sin enviar nada. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON no válido" }, { status: 400 });
  }
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  // TODO: enviar la solicitud real (Resend / app de presupuestos de Shopify / CRM).
  // El logo NO se sube al servidor en la demo: solo viaja su nombre de archivo.

  const ref = `PRES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return NextResponse.json({ ok: true, demo: true, reference: ref });
}
