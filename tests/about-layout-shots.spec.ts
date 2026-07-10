import { test, type Page } from "@playwright/test";

/* Dev-only About photo layout variants (?layout=a|b). The `shots` project
   forces reduced motion. The variant is applied client-side, so wait until
   the family photo (svyats.jpg) has rendered before capturing. */

async function gotoVariant(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector('img[src*="svyats"]', { state: "visible" });
  await page.evaluate(() => document.fonts.ready);
}

const CASES = [
  { name: "a", w: 1280, h: 900, tag: "1280" },
  { name: "a", w: 390, h: 844, tag: "390" },
  { name: "b", w: 1280, h: 900, tag: "1280" },
  { name: "b", w: 390, h: 844, tag: "390" },
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
