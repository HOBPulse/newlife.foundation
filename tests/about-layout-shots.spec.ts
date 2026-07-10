import { test, type Page } from "@playwright/test";

/* Dev-only About photo layout comparison (?layout=w wide full-bleed default,
   ?layout=z staggered). The `shots` project forces reduced motion. The variant
   applies client-side, so wait for the family photo (svyats.jpg) to render. */

async function gotoVariant(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector('img[src*="svyats"]', { state: "visible" });
  await page.evaluate(() => document.fonts.ready);
}

const CASES = [
  { name: "w", w: 1280, h: 900, tag: "1280" },
  { name: "w", w: 390, h: 844, tag: "390" },
  { name: "z", w: 1280, h: 900, tag: "1280" },
  { name: "z", w: 390, h: 844, tag: "390" },
] as const;

for (const { name, w, h, tag } of CASES) {
  test(`about layout=${name} (${tag})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await gotoVariant(page, `/about?layout=${name}`);
    await page.screenshot({
      path: `screenshots/about-layout-${name}-${tag}.png`,
      fullPage: true,
    });
  });
}
