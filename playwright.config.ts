import { defineConfig, devices } from "@playwright/test";

/**
 * Tests E2E y capturas. Por defecto levanta la build de producción en el puerto 3100
 * (ejecuta antes `pnpm build`). Para probar un despliegue: PLAYWRIGHT_BASE_URL=https://…
 * Si el Chromium de Playwright no está instalado, usa PW_CHROMIUM_PATH=/ruta/a/chrome.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "es-ES",
    timezoneId: "Europe/Madrid",
    trace: "retain-on-failure",
    launchOptions: { executablePath },
  },
  projects: [
    {
      name: "movil",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
        launchOptions: { executablePath },
      },
      testIgnore: /screenshots\.spec\.ts/,
    },
    {
      name: "escritorio",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        launchOptions: { executablePath },
      },
      testIgnore: /screenshots\.spec\.ts/,
    },
    {
      name: "capturas",
      use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } },
      testMatch: /screenshots\.spec\.ts/,
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm start --port 3100",
        url: "http://localhost:3100",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
