import { expect, test, type Page } from "@playwright/test";
import { acceptCookies, collectErrors } from "./helpers";

const FIXTURES = "tests/fixtures";

test.beforeEach(async ({ page }) => {
  await acceptCookies(page);
});

/** Porcentaje de píxeles «grabados» (no transparentes) en el canvas más grande de la página. */
async function engravedRatio(page: Page) {
  return page.evaluate(() => {
    const canvases = [...document.querySelectorAll("canvas")].filter((c) => c.width > 0 && c.height > 0);
    const c = canvases.sort((a, b) => b.width * b.height - a.width * a.height)[0];
    if (!c) return -1;
    const ctx = c.getContext("2d");
    if (!ctx) return -1;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let on = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 24) on++;
    return on / (c.width * c.height);
  });
}

test("compra completa: home → producto → texto → carrito → DEMO10 → checkout → pedido → mis pedidos", async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // a la ficha desde la home
  const productLink = page
    .locator('a[href="/producto/copa-vino-tinto-grabada"]')
    .filter({ hasText: /\S/ })
    .first();
  await productLink.scrollIntoViewIfNeeded();
  await productLink.click();
  await expect(page).toHaveURL(/\/producto\/copa-vino-tinto-grabada/);

  // personalizar con texto
  const line1 = page.getByLabel(/Línea 1/).first();
  await line1.fill("Ana & Luis");
  await page
    .getByRole("button", { name: /Añadir al carrito/ })
    .first()
    .click();

  // el carrito lateral se abre con el diseño como atributo
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText("Ana & Luis", { exact: false })).toBeVisible();
  await drawer.getByRole("link", { name: "Ver carrito completo" }).click();
  await expect(page).toHaveURL(/\/carrito$/);

  // código de descuento
  const main = page.locator("main");
  await main.getByPlaceholder(/Código de descuento/).fill("DEMO10");
  await main.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByText("−1,39 €").first()).toBeVisible();
  await page.getByRole("link", { name: /Tramitar pedido de prueba/ }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByText(/Modo demostración/)).toBeVisible();

  // 1. contacto (primero con errores de validación)
  await page.getByRole("button", { name: /Continuar con el envío/ }).click();
  await expect(page.getByText("Escribe tu email.")).toBeVisible();
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("demo@ejemplo.com");
  await page.getByRole("textbox", { name: "Teléfono", exact: true }).fill("600123456");
  await page.getByRole("button", { name: /Continuar con el envío/ }).click();

  // 2. envío: el CP rellena la provincia; CP incoherente da error
  await page.getByRole("textbox", { name: "Nombre", exact: true }).fill("Ana");
  await page.getByRole("textbox", { name: "Apellidos", exact: true }).fill("García López");
  await page.getByRole("textbox", { name: "Dirección", exact: true }).fill("Calle Mayor 10");
  await page.getByRole("textbox", { name: "Código postal", exact: true }).fill("28013");
  await page.getByRole("textbox", { name: "Ciudad", exact: true }).fill("Madrid");
  await expect(page.getByRole("combobox", { name: "Provincia" })).toHaveValue("Madrid");
  await page.getByText("Envío urgente").click();
  await page.getByRole("button", { name: /^Continuar$/ }).click();

  // 3. personalización y fecha
  await page.getByRole("button", { name: /Continuar al pago/ }).click();
  await expect(page.getByText("Confirma que has revisado los diseños.")).toBeVisible();
  await page.getByLabel(/He revisado los textos/).check();
  await page.getByRole("button", { name: /Continuar al pago/ }).click();

  // 4. pago simulado con la tarjeta de prueba
  await page.getByRole("button", { name: "Rellenar" }).click();
  await page.getByLabel(/Acepto las/).check();
  await page.getByRole("button", { name: /Confirmar pedido de prueba/ }).click();

  // confirmación
  await expect(page).toHaveURL(/\/pedido\/GGS-\d{4}-\d{4}$/, { timeout: 15_000 });
  const orderId = page.url().split("/").pop()!;
  await expect(page.getByRole("heading", { name: "¡Gracias, Ana!" })).toBeVisible();
  await expect(page.getByText("23,31 €").first()).toBeVisible(); // 13,90 − 1,39 + 10,80 (urgente)
  await expect(page.getByText(/····\s*4242/)).toBeVisible();

  // el carrito se ha vaciado y el pedido aparece en «Mis pedidos»
  const cart = await page.evaluate(() => localStorage.getItem("ggs-demo:cart"));
  expect(JSON.parse(cart!).state.lines).toHaveLength(0);
  await page.goto("/mis-pedidos");
  await expect(page.getByText(orderId)).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("checkout con el carrito vacío redirige a la tienda", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/tienda$/);
  await expect(page.getByText("Tu carrito está vacío").first()).toBeVisible();
});

for (const [file, label] of [
  ["logo-transparente.png", "PNG transparente"],
  ["logo-fondo-blanco.jpg", "JPG con fondo blanco"],
] as const) {
  test(`personalizador: logo ${label}`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/personaliza");
    await page.getByRole("tab", { name: "Diseño" }).first().click();
    await page.getByText("Logo o imagen", { exact: true }).first().click();
    await page.getByLabel("Subir logo o imagen").setInputFiles(`${FIXTURES}/${file}`);
    await expect(page.getByText(file).first()).toBeVisible();
    await expect(page.getByLabel(/Umbral/)).toBeVisible();
    await page.waitForTimeout(800);

    // se graba el logo y el fondo se descarta: ni vacío ni la zona entera esmerilada
    const ratio = await engravedRatio(page);
    expect(ratio).toBeGreaterThan(0.005);
    expect(ratio).toBeLessThan(0.6);

    // escritorio: «Añadir al carrito con este diseño»; móvil: barra fija «Añadir · precio»
    await page
      .getByRole("button", { name: /^Añadir( al carrito con este diseño| ·)/ })
      .filter({ visible: true })
      .first()
      .click();
    const drawer = page.getByRole("dialog");
    await expect(drawer.getByText(file)).toBeVisible();
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("la tienda filtra por ocasión y orden en la URL", async ({ page }) => {
  await page.goto("/tienda?ocasion=boda&orden=precio-asc");
  const cards = page.locator("article");
  await expect(cards.first()).toBeVisible();
  const prices = await cards.evaluateAll((els) =>
    els
      .map((e) => /(\d+,\d{2})\s*€/.exec(e.textContent ?? "")?.[1])
      .filter(Boolean)
      .map((p) => Number(p!.replace(",", "."))),
  );
  expect(prices.length).toBeGreaterThan(2);
  expect([...prices].sort((a, b) => a - b)).toEqual(prices);
});

test("página 404 personalizada", async ({ page }) => {
  const res = await page.goto("/esta-pagina-no-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /sin grabar/ })).toBeVisible();
});

test("formulario de presupuesto de empresa con logo", async ({ page }) => {
  await page.goto("/empresas?producto=vaso-tubo-grabado&cantidad=60#presupuesto");
  await expect(page.getByRole("combobox", { name: "Producto" })).toHaveValue("vaso-tubo-grabado");
  await expect(page.getByRole("spinbutton", { name: "Cantidad" })).toHaveValue("60");
  await page.getByLabel("Subir logo de la empresa").setInputFiles(`${FIXTURES}/logo-transparente.png`);
  await page.getByRole("textbox", { name: "Empresa", exact: true }).fill("Bar Demo SL");
  await page.getByRole("textbox", { name: "Persona de contacto", exact: true }).fill("Laura Pérez");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("laura@ejemplo.com");
  await page.locator('input[name="privacy"]').check();
  await page.getByRole("button", { name: "Solicitar presupuesto" }).click();
  await expect(page.getByText("¡Solicitud recibida!")).toBeVisible();
  await expect(page.getByText(/PRES-\d{4}-\d{4}/)).toBeVisible();
});

// Las redirecciones 301 viven en vercel.json: solo se pueden probar contra un despliegue de Vercel.
test("redirecciones de las URLs antiguas (solo en Vercel)", async ({ request, baseURL }) => {
  test.skip(!baseURL?.includes("vercel.app"), "Requiere PLAYWRIGHT_BASE_URL de un despliegue en Vercel");
  for (const [from, to] of [
    ["/sobre-mi", "/sobre-nosotros"],
    ["/productos", "/tienda"],
    ["/pol%C3%ADtica-privacidad", "/legal/privacidad"],
    ["/aviso-legal", "/legal/aviso-legal"],
  ]) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(308);
    expect(res.headers().location, from).toContain(to);
  }
});
