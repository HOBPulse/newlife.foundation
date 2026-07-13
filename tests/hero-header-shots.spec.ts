import { test } from "@playwright/test";

/* Home hero CTAs (Стати поруч + Звернутися по допомогу) and the header
   donate button with its heart icon. */

test("home hero uk (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "screenshots/hero-cta-uk-1280.png" });
});

test("header donate close-up uk", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('header a[href="/donate"]').screenshot({
    path: "screenshots/header-heart-uk.png",
  });
});
