import { test, type Page } from "@playwright/test";

/* How-to-help layout comparison: A (default — donate full-width on top,
   3 cards in a row) vs split (?help_layout=split — donate left, 3 stacked
   right). Volunteer accordion + share options expanded in every shot. */

async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

const LAYOUTS = [
  { name: "a", path: "/how-to-help" },
  { name: "split", path: "/how-to-help?help_layout=split" },
] as const;

const WIDTHS = [1280, 390] as const;

for (const { name, path } of LAYOUTS) {
  for (const width of WIDTHS) {
    test(`how-to-help layout ${name} uk (${width})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path, { waitUntil: "networkidle" });
      await waitForHeadingFont(page);
      await page.locator('#volunteer button[aria-controls]').click();
      await page.locator('button[aria-controls="share-options"]').click();
      await page.screenshot({
        path: `screenshots/help-layout-${name}-uk-${width}.png`,
        fullPage: true,
      });
    });
  }
}
