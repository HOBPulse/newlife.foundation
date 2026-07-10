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

for (const { name, path } of LOCALES) {
  test(`about ${name} (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(path, { waitUntil: "networkidle" });
    await waitForHeadingFont(page);
    await page.screenshot({
      path: `screenshots/about-${name}-1280.png`,
      fullPage: true,
    });
  });
}
