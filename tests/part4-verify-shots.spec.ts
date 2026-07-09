import { test, expect } from "@playwright/test";

/* Part 4 verification shots. The `shots` project forces reduced motion, so
   the rail renders as its fully-drawn static fallback (good for comparing
   the three variants). */

for (const variant of ["curve", "dots", "off"] as const) {
  test(`homepage rail=${variant} at 1280`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(`/?rail=${variant}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `screenshots/part4-rail-${variant}.png`, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  });
}

test("mobile header menu open (390)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("button", { name: /Меню|Menu/ }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: "screenshots/part4-mobile-menu.png", clip: { x: 0, y: 0, width: 390, height: 440 } });
});

test("stories second row hovered (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/stories", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const rows = page.locator(".story-hover-row");
  await rows.nth(1).hover();
  await page.waitForTimeout(300);
  const ops = await page.locator(".story-hover-photo").evaluateAll((els) => els.map((e) => +getComputedStyle(e).opacity));
  expect(ops[1]).toBeGreaterThan(0.9);
  await page.screenshot({ path: "screenshots/part4-stories-hover.png", clip: { x: 0, y: 100, width: 1280, height: 460 } });
});
