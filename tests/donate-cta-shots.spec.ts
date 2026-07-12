import { test, type Page } from "@playwright/test";

/* Donate CTA in the home amber support band. Full motion (not reduced) so
   the hover lift renders; the heart pulse may land mid-scale in a frame. */
test.use({ contextOptions: { reducedMotion: "no-preference" } });

async function gotoBand(page: Page) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const band = page.locator("section:has(a.donate-cta)");
  await band.scrollIntoViewIfNeeded();
  return band;
}

test("donate band default", async ({ page }) => {
  const band = await gotoBand(page);
  await band.screenshot({ path: "screenshots/donate-cta-default.png" });
});

test("donate band hover", async ({ page }) => {
  const band = await gotoBand(page);
  await page.locator("a.donate-cta").hover();
  await page.waitForTimeout(300); // let the lift transition settle
  await band.screenshot({ path: "screenshots/donate-cta-hover.png" });
});
