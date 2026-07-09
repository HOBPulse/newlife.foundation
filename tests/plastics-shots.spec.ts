import { test, type Page } from "@playwright/test";

/* Task 9 verification shots for the homepage "plastics" pass.
   The shots project forces reduced motion, so the animated captures below
   override it per-describe; the final block keeps the project default. */

const DIR = "screenshots/plastics";

async function ready(page: Page) {
  await page.evaluate(() => document.fonts.ready);
}

async function scrollAndSettle(page: Page, y: number, ms: number) {
  await page.evaluate((top) => scrollTo(0, top), y);
  await page.waitForTimeout(ms);
}

test.describe("full motion", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("hero at 1440 and 390", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page.waitForTimeout(1400); // watermark fade-in completes
    await page.locator("section").first().screenshot({ path: `${DIR}/hero-1440.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(600);
    await page.locator("section").first().screenshot({ path: `${DIR}/hero-390.png` });
  });

  test("background morph at one boundary, three scroll positions", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const boundary = await page.evaluate(
      () =>
        scrollY +
        document.querySelector('[data-morph="tint"]')!.getBoundingClientRect().top,
    );
    await scrollAndSettle(page, boundary - 800, 1200); // hero dominant — paper
    await page.screenshot({ path: `${DIR}/morph-1-before.png` });
    await scrollAndSettle(page, boundary - 440, 350); // crossing — mid-fade
    await page.screenshot({ path: `${DIR}/morph-2-crossing.png` });
    await scrollAndSettle(page, boundary - 150, 1400); // process dominant — tint
    await page.screenshot({ path: `${DIR}/morph-3-after.png` });
  });

  test("route thread dot at two scroll positions", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const clip = { x: 0, y: 64, width: 160, height: 836 };
    await page.screenshot({ path: `${DIR}/thread-top.png`, clip });
    const mid = await page.evaluate(
      () => (document.documentElement.scrollHeight - innerHeight) * 0.6,
    );
    await scrollAndSettle(page, mid, 500);
    await page.screenshot({ path: `${DIR}/thread-mid.png`, clip });
  });

  test("facts ribbon", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page
      .locator("section.bg-pine")
      .first()
      .screenshot({ path: `${DIR}/facts-ribbon.png` });
  });

  test("stories section with pull-quote at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page
      .locator("section", { has: page.locator("blockquote") })
      .screenshot({ path: `${DIR}/stories-pullquote-1440.png` });
  });

  test("dark footer, reveal and boundary", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const max = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    );
    await scrollAndSettle(page, max - 160, 600);
    await page.screenshot({ path: `${DIR}/footer-reveal-1.png` });
    await scrollAndSettle(page, max - 60, 600);
    await page.screenshot({ path: `${DIR}/footer-reveal-2.png` });
    await scrollAndSettle(page, max, 900);
    await page.locator("footer").screenshot({ path: `${DIR}/footer-1440.png` });
    const boundaryY = await page.evaluate(
      () => document.querySelector("footer")!.getBoundingClientRect().top,
    );
    await page.screenshot({
      path: `${DIR}/footer-cta-boundary.png`,
      clip: { x: 0, y: boundaryY - 140, width: 1440, height: 280 },
    });
  });

  test("dark footer at 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(600);
    await page.locator("footer").screenshot({ path: `${DIR}/footer-390.png` });
  });

  for (const { name, path } of [
    { name: "uk", path: "/" },
    { name: "ru", path: "/ru" },
    { name: "en", path: "/en" },
  ]) {
    test(`homepage top ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path, { waitUntil: "networkidle" });
      await ready(page);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${DIR}/top-${name}-1440.png` });
    });
  }
});

test.describe("reduced motion", () => {
  test("homepage renders complete and static", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page.screenshot({ path: `${DIR}/reduced-motion-top.png` });
    await page.screenshot({
      path: `${DIR}/reduced-motion-full.png`,
      fullPage: true,
    });
  });
});
