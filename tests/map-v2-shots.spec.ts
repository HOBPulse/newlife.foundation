import { test } from "@playwright/test";

/* Map v1/v2 comparison shots (task: map v2 corridor tree).
   Static captures inherit the shots project's reducedMotion: "reduce"
   (fully drawn map); the mid-draw capture overrides it below. */

const variants = ["v1", "v2"] as const;
const viewports = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

for (const variant of variants) {
  for (const { width, height } of viewports) {
    test(`map ${variant} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(`/?map=${variant}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // The sticky site header would overlay the element capture
      await page.addStyleTag({ content: "header { visibility: hidden }" });
      const map = page.locator("figure.routes-map");
      await map.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await map.screenshot({ path: `screenshots/map-${variant}-${width}.png` });
    });
  }
}

test.describe(() => {
  // Mid-draw state needs the real entrance animation
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("map v2 mid-draw at 1280px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/?map=v2", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "header { visibility: hidden }" });
    const map = page.locator("figure.routes-map--v2");
    await map.scrollIntoViewIfNeeded();
    // ~40% into the entrance sequence: trunks drawn, branches still growing
    await page.waitForTimeout(1700);
    await map.screenshot({
      path: "screenshots/map-v2-mid-draw-1280.png",
      animations: "allow",
    });
  });
});
