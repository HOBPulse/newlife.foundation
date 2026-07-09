import { test, expect } from "@playwright/test";

// Task 6 verification shots: header with the token-driven mark on every
// locale, the footer mark, and favicon route availability.

const locales = [
  { name: "uk", path: "/" },
  { name: "ru", path: "/ru" },
  { name: "en", path: "/en" },
];

const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

for (const { name, path } of locales) {
  for (const { width, height } of viewports) {
    test(`header ${name} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator("header")
        .screenshot({ path: `screenshots/brand-header-${name}-${width}.png` });
    });
  }
}

test("footer mark at 1440px", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("footer")
    .screenshot({ path: "screenshots/brand-footer-1440.png" });
});

test("favicon routes respond 200", async ({ page }) => {
  const ico = await page.request.get("/favicon.ico");
  expect(ico.status()).toBe(200);
  const svg = await page.request.get("/icon.svg");
  expect(svg.status()).toBe(200);
  expect(await svg.text()).toContain("<svg");
});
