import { test } from "@playwright/test";

/* Homepage routes map (corridor tree — the only map, no flag). Static
   captures inherit the shots project's reducedMotion: "reduce" (fully drawn);
   the mid-draw capture overrides it below. */

const viewports = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
];

for (const { width, height } of viewports) {
  test(`homepage map at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // The sticky site header would overlay the element capture
    await page.addStyleTag({ content: "header { visibility: hidden }" });
    const map = page.locator("figure.routes-map--v2");
    await map.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await map.screenshot({ path: `screenshots/map-${width}.png` });
  });
}

test.describe(() => {
  // Mid-draw state needs the real entrance animation
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("homepage map mid-draw at 1280px", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "header { visibility: hidden }" });
    const map = page.locator("figure.routes-map--v2");
    await map.scrollIntoViewIfNeeded();
    // ~40% into the entrance sequence: trunks drawn, branches still growing
    await page.waitForTimeout(1700);
    await map.screenshot({
      path: "screenshots/map-mid-draw-1280.png",
      animations: "allow",
    });
  });
});
