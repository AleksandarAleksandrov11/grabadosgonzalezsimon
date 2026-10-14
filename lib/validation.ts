import { z } from "zod";

/** Esquemas compartidos cliente/servidor. Mensajes en español. */

const email = z.string().trim().min(1, "Escribe tu email.").email("Ese email no parece válido.");
const phoneES = z
  .string()
  .trim()
  .regex(
    /^(\+34\s?)?[6789]\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$|^(\+34\s?)?[6789]\d{8}$/,
    "Escribe un teléfono español válido (9 dígitos).",
  );
const optionalPhone = z.union([z.literal(""), phoneES]);
const privacy = z.boolean().refine((v) => v === true, "Debes aceptar la política de privacidad.");

export const quickContactSchema = z.object({
  email,
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(2000, "Máximo 2000 caracteres."),
  privacy,
  marketing: z.boolean().optional(),
});
export type QuickContact = z.infer<typeof quickContactSchema>;

export const CONTACT_REASONS = ["Pedido particular", "Boda o evento", "Empresa", "Otro"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre."),
  email,
  phone: optionalPhone,
  reason: z.enum(CONTACT_REASONS, { message: "Elige un motivo." }),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres).")
    .max(3000, "Máximo 3000 caracteres."),
  attachmentName: z.string().optional(),
  privacy,
  marketing: z.boolean().optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  company: z.string().trim().min(2, "Escribe el nombre de la empresa."),
  cif: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || /^[A-HJ-NP-SUVW]\d{7}[0-9A-J]$/.test(v), "El CIF no tiene un formato válido.")
    .optional(),
  contact: z.string().trim().min(2, "Escribe la persona de contacto."),
  email,
  phone: optionalPhone,
  product: z.string().min(1, "Elige un producto de interés."),
  quantity: z.coerce
    .number({ message: "Indica una cantidad." })
    .int("Indica un número entero.")
    .min(12, "Para presupuestos de empresa, mínimo 12 unidades."),
  date: z.string().optional(),
  logoName: z.string().optional(),
  message: z.string().trim().max(3000, "Máximo 3000 caracteres.").optional(),
  privacy,
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const PROVINCES = [
  "A Coruña",
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ceuta",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Girona",
  "Granada",
  "Guadalajara",
  "Gipuzkoa",
  "Huelva",
  "Huesca",
  "Illes Balears",
  "Jaén",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lleida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Melilla",
  "Murcia",
  "Navarra",
  "Ourense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Bizkaia",
  "Zamora",
  "Zaragoza",
] as const;

/** Prefijos de CP (2 primeros dígitos) por provincia, para validar coherencia. */
export const PROVINCE_CP: Record<(typeof PROVINCES)[number], string> = {
  "A Coruña": "15",
  Álava: "01",
  Albacete: "02",
  Alicante: "03",
  Almería: "04",
  Asturias: "33",
  Ávila: "05",
  Badajoz: "06",
  Barcelona: "08",
  Burgos: "09",
  Cáceres: "10",
  Cádiz: "11",
  Cantabria: "39",
  Castellón: "12",
  Ceuta: "51",
  "Ciudad Real": "13",
  Córdoba: "14",
  Cuenca: "16",
  Girona: "17",
  Granada: "18",
  Guadalajara: "19",
  Gipuzkoa: "20",
  Huelva: "21",
  Huesca: "22",
  "Illes Balears": "07",
  Jaén: "23",
  "La Rioja": "26",
  "Las Palmas": "35",
  León: "24",
  Lleida: "25",
  Lugo: "27",
  Madrid: "28",
  Málaga: "29",
  Melilla: "52",
  Murcia: "30",
  Navarra: "31",
  Ourense: "32",
  Palencia: "34",
  Pontevedra: "36",
  Salamanca: "37",
  "Santa Cruz de Tenerife": "38",
  Segovia: "40",
  Sevilla: "41",
  Soria: "42",
  Tarragona: "43",
  Teruel: "44",
  Toledo: "45",
  Valencia: "46",
  Valladolid: "47",
  Bizkaia: "48",
  Zamora: "49",
  Zaragoza: "50",
};

export const contactStepSchema = z.object({
  email,
  phone: phoneES,
  newsletter: z.boolean().optional(),
});

export const shippingStepSchema = z
  .object({
    method: z.enum(["estandar", "urgente", "recogida"]),
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    address: z.string().trim(),
    address2: z.string().trim().optional(),
    postalCode: z.string().trim(),
    city: z.string().trim(),
    province: z.string(),
    country: z.literal("España"),
  })
  .superRefine((v, ctx) => {
    const need = (k: keyof typeof v, msg: string, min = 2) => {
      const val = String(v[k] ?? "");
      if (val.trim().length < min) ctx.addIssue({ code: "custom", path: [k], message: msg });
    };
    need("firstName", "Escribe tu nombre.");
    need("lastName", "Escribe tus apellidos.");
    if (v.method === "recogida") return;
    need("address", "Escribe la dirección de entrega.", 5);
    need("city", "Escribe la ciudad.");
    if (!/^\d{5}$/.test(v.postalCode))
      ctx.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: "El código postal debe tener 5 dígitos.",
      });
    else {
      const n = Number(v.postalCode.slice(0, 2));
      if (n < 1 || n > 52)
        ctx.addIssue({
          code: "custom",
          path: ["postalCode"],
          message: "Ese código postal no existe en España.",
        });
    }
    if (!PROVINCES.includes(v.province as (typeof PROVINCES)[number]))
      ctx.addIssue({ code: "custom", path: ["province"], message: "Elige una provincia." });
    else if (
      /^\d{5}$/.test(v.postalCode) &&
      PROVINCE_CP[v.province as (typeof PROVINCES)[number]] !== v.postalCode.slice(0, 2)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["postalCode"],
        message: `El CP no corresponde a ${v.province}.`,
      });
    }
  });

export const detailsStepSchema = z.object({
  desiredDate: z.string().optional(),
  note: z.string().max(1000, "Máximo 1000 caracteres.").optional(),
  confirmDesigns: z.boolean().refine((v) => v, "Confirma que has revisado los diseños."),
});

export function luhn(num: string) {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

export const paymentStepSchema = z
  .object({
    method: z.enum(["tarjeta", "bizum", "transferencia"]),
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    bizumPhone: z.string().optional(),
    terms: z.boolean().refine((v) => v, "Debes aceptar las condiciones y la política de privacidad."),
  })
  .superRefine((v, ctx) => {
    if (v.method === "tarjeta") {
      if (!v.cardName || v.cardName.trim().length < 3)
        ctx.addIssue({ code: "custom", path: ["cardName"], message: "Escribe el nombre del titular." });
      if (!v.cardNumber || !luhn(v.cardNumber))
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Número de tarjeta no válido.",
        });
      const m = /^(\d{2})\s?\/\s?(\d{2})$/.exec(v.cardExpiry ?? "");
      if (!m) ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Formato MM/AA." });
      else {
        const mm = Number(m[1]);
        const yy = 2000 + Number(m[2]);
        const now = new Date();
        const exp = new Date(yy, mm, 0, 23, 59);
        if (mm < 1 || mm > 12)
          ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Mes no válido." });
        else if (exp < now)
          ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "La tarjeta está caducada." });
      }
      if (!/^\d{3,4}$/.test(v.cardCvc ?? ""))
        ctx.addIssue({ code: "custom", path: ["cardCvc"], message: "3 o 4 dígitos." });
    }
    if (v.method === "bizum" && !phoneES.safeParse(v.bizumPhone ?? "").success) {
      ctx.addIssue({ code: "custom", path: ["bizumPhone"], message: "Escribe el móvil asociado a Bizum." });
    }
  });
