import { test, type Page } from "@playwright/test";

/* Part 8 — how-to-help (BLM-grid) and privacy pages.
   The `shots` project forces reduced motion, so reveals render final-state. */

async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [1280, 390] as const) {
  test(`how-to-help uk (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/how-to-help", { waitUntil: "networkidle" });
    await waitForHeadingFont(page);
    await page.screenshot({
      path: `screenshots/part8-how-to-help-uk-${width}.png`,
      fullPage: true,
    });
  });
}

test("contact uk (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/contact", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/part8-contact-uk-1280.png",
    fullPage: true,
  });
});

test("privacy uk (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/privacy", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/part8-privacy-uk-1280.png",
    fullPage: true,
  });
});
