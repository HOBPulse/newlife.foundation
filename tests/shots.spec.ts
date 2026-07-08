import { test } from "@playwright/test";

const pages = [
  { name: "home", path: "/" },
  { name: "how-we-work", path: "/how-we-work" },
  { name: "contact", path: "/contact" },
  { name: "partner", path: "/partner" },
];

const viewports = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

for (const { name, path } of pages) {
  for (const { width, height } of viewports) {
    test(`${name} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `screenshots/${name}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
