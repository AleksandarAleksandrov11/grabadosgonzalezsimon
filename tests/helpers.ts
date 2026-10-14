import type { Page } from "@playwright/test";

/** Acepta las cookies antes de cargar la página (para que el banner no tape nada). */
export async function acceptCookies(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        "ggs-demo:cookies",
        JSON.stringify({ necessary: true, analytics: false, preferences: true, date: "test" }),
      );
    } catch {
      /* noop */
    }
  });
}

/** Recoge errores de consola y de página (ignorando avisos conocidos de terceros). */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource: the server responded with a status of 404/.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}
