import { test, type Page } from "@playwright/test";

/* Heading font trial shots (?font=serif). The `shots` project forces
   reduced motion, so full-page captures render reveal content visible. */

/** Serif applies post-hydration (FontTrial sets a data attr on <html>) —
 *  wait until the headline actually computes to the PT Serif family. */
async function waitForSerif(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    // "serif" alone would also match Fixel's "sans-serif" fallbacks
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

/* Hero-only shots from the first trial — &weight= override still works */
const HERO_SHOTS = [
  { name: "font-trial-default", url: "/", serif: false },
  { name: "font-trial-serif-700", url: "/?font=serif&weight=700", serif: true },
  { name: "font-trial-serif-400", url: "/?font=serif&weight=400", serif: true },
] as const;

for (const { name, url, serif } of HERO_SHOTS) {
  test(`hero ${name} (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(url, { waitUntil: "networkidle" });
    if (serif) await waitForSerif(page);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `screenshots/${name}-1280.png`,
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    });
  });
}

test("hero font-trial-serif-700 (390)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?font=serif&weight=700", { waitUntil: "networkidle" });
  await waitForSerif(page);
  await page.screenshot({
    path: "screenshots/font-trial-serif-700-390.png",
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });
});

/* Site-wide trial: full-scroll home + a story page, serif vs default */
const SITEWIDE_SHOTS = [
  { name: "font-trial-home-serif", url: "/?font=serif", serif: true },
  { name: "font-trial-home-default", url: "/", serif: false },
  {
    name: "font-trial-story-serif",
    url: "/stories/story-1?font=serif",
    serif: true,
  },
  { name: "font-trial-story-default", url: "/stories/story-1", serif: false },
] as const;

for (const { name, url, serif } of SITEWIDE_SHOTS) {
  test(`sitewide ${name} (1280 full)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(url, { waitUntil: "networkidle" });
    if (serif) await waitForSerif(page);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `screenshots/${name}-1280.png`,
      fullPage: true,
    });
  });
}
