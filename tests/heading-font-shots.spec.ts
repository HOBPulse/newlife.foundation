import { test, type Page } from "@playwright/test";

/* Locked heading font (PT Serif). The `shots` project forces reduced motion,
   so full-page captures render scroll-reveal content visible. */

/** PT Serif is the default now, but next/font swaps it in after load — wait
 *  until the h1 actually computes to the PT Serif family before capturing. */
async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    // "serif" alone would also match Fixel's "sans-serif" fallbacks
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

test("home full scroll (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/heading-font-home-1280.png",
    fullPage: true,
  });
});

test("home full scroll (390)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/heading-font-home-390.png",
    fullPage: true,
  });
});

test("story page (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/stories/story-1", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/heading-font-story-1280.png",
    fullPage: true,
  });
});
