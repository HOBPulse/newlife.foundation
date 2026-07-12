import { test, type Page } from "@playwright/test";

/* How-to-help photo placement comparison: A (default, below intro) vs
   B (?help_photo=mid, between grid and forms). Owner picks one. */

async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

const VARIANTS = [
  { name: "a-top", path: "/how-to-help" },
  { name: "b-mid", path: "/how-to-help?help_photo=mid" },
] as const;

for (const { name, path } of VARIANTS) {
  test(`how-to-help photo ${name} uk (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(path, { waitUntil: "networkidle" });
    await waitForHeadingFont(page);
    await page.screenshot({
      path: `screenshots/help-photo-${name}-uk-1280.png`,
      fullPage: true,
    });
  });
}
