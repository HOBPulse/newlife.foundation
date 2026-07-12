import { test, type Page } from "@playwright/test";

/* How-to-help layout comparison: strip (default — donate banner + editorial
   hairline strip) and twocol (?help_layout=twocol — donate + team photo left,
   3 cards stacked right). Share options expanded in every shot. Plus the
   dedicated /volunteer and /partner form pages. */

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
  { name: "strip", path: "/how-to-help" },
  { name: "twocol", path: "/how-to-help?help_layout=twocol" },
] as const;

const WIDTHS = [1280, 390] as const;

for (const { name, path } of LAYOUTS) {
  for (const width of WIDTHS) {
    test(`how-to-help layout ${name} uk (${width})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path, { waitUntil: "networkidle" });
      await waitForHeadingFont(page);
      await page.locator('button[aria-controls="share-options"]').click();
      await page.screenshot({
        path: `screenshots/help-layout-${name}-uk-${width}.png`,
        fullPage: true,
      });
    });
  }
}

for (const route of ["volunteer", "partner"] as const) {
  test(`${route} page uk (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    await waitForHeadingFont(page);
    await page.screenshot({
      path: `screenshots/${route}-uk-1280.png`,
      fullPage: true,
    });
  });
}
