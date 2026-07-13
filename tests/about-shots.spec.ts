import { test, type Page } from "@playwright/test";

/* About ("Pro Nas") page — Part 5 content pass. The `shots` project forces
   reduced motion, so the reveal CTA renders in its final state. */

async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

const LOCALES = [
  { name: "uk", path: "/about" },
  { name: "ru", path: "/ru/about" },
  { name: "en", path: "/en/about" },
] as const;

const WIDTHS = [1280, 390] as const;

for (const { name, path } of LOCALES) {
  for (const width of WIDTHS) {
    test(`about ${name} (${width})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path, { waitUntil: "networkidle" });
      await waitForHeadingFont(page);
      await page.screenshot({
        path: `screenshots/about-${name}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
