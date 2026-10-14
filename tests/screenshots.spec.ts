import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { acceptCookies, collectErrors } from "./helpers";

/**
 * Capturas de página completa de todas las rutas en 390 / 768 / 1440 px
 * (`pnpm screenshots`). Se guardan en screenshots/<ancho>/ y además comprueban
 * que no hay errores de consola ni scroll horizontal.
 */
const ROUTES: [string, string][] = [
  ["home", "/"],
  ["tienda", "/tienda"],
  ["categoria-copas", "/tienda/copas"],
  ["producto", "/producto/copa-vino-tinto-grabada"],
  ["personaliza", "/personaliza"],
  ["ocasiones", "/ocasiones"],
  ["ocasion-bodas", "/ocasiones/bodas"],
  ["empresas", "/empresas"],
  ["sobre-nosotros", "/sobre-nosotros"],
  ["tecnica", "/tecnica"],
  ["contacto", "/contacto"],
  ["faq", "/preguntas-frecuentes"],
  ["carrito", "/carrito"],
  ["mis-pedidos", "/mis-pedidos"],
  ["favoritos", "/favoritos"],
  ["legal-aviso", "/legal/aviso-legal"],
  ["legal-privacidad", "/legal/privacidad"],
  ["legal-cookies", "/legal/cookies"],
  ["legal-envios", "/legal/envios-y-devoluciones"],
  ["404", "/no-existe"],
];
const WIDTHS = [390, 768, 1440];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({
      viewport: { width, height: width < 600 ? 844 : 900 },
      isMobile: width < 600,
      hasTouch: width < 600,
    });
    for (const [name, path] of ROUTES) {
      test(name, async ({ page }) => {
        await acceptCookies(page);
        const errors = collectErrors(page);
        await page.goto(path, { waitUntil: "networkidle" });
        // recorrer la página para disparar las animaciones al entrar en pantalla
        const total = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < total; y += 500) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y);
          await page.waitForTimeout(120);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(600);
        // en móvil un elemento demasiado ancho no da scroll: amplía el viewport de layout
        // (la página se ve «alejada»), así que se compara con el ancho configurado
        const layoutWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(layoutWidth, "scroll horizontal / página más ancha que la pantalla").toBeLessThanOrEqual(
          width + 1,
        );
        mkdirSync(`screenshots/${width}`, { recursive: true });
        await page.screenshot({ path: `screenshots/${width}/${name}.png`, fullPage: true });
        expect(errors, errors.join("\n")).toEqual([]);
      });
    }
  });
}
