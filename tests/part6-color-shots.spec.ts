import { test, type Page } from "@playwright/test";

/* Part 6 verification: logo (header+footer), gold accent + stats label on home,
   and the donate-band ?cta comparison. `shots` project forces reduced motion. */

async function ready(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif");
  });
}

test("home uk gold accent + stats + logo (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await ready(page);
  await page.screenshot({ path: "screenshots/part6-home-1280.png", fullPage: true });
});

test("home uk gold accent (390)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await ready(page);
  await page.screenshot({ path: "screenshots/part6-home-390.png", fullPage: true });
});

for (const cta of ["green", "amber"] as const) {
  test(`donate band ?cta=${cta} (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/?cta=${cta}`, { waitUntil: "networkidle" });
    await ready(page);
    // let the client-side ?cta swap settle before capturing
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/part6-donate-${cta}.png`, fullPage: true });
  });
}
