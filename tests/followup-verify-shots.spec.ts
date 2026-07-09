import { test, expect, type Page } from "@playwright/test";

/* Follow-up verification suite. The `shots` project forces reduced motion,
   so full-motion blocks re-enable it per-describe; the last block keeps the
   project default (reduce). */

const DIR = "screenshots/verify";

const ready = (page: Page) => page.evaluate(() => document.fonts.ready);
const scrollTo = (page: Page, y: number, ms = 400) =>
  page.evaluate((t) => window.scrollTo(0, t), y).then(() => page.waitForTimeout(ms));

const SLOW_VT = `
::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) {
  animation-duration: 2500ms !important;
}`;

test.describe("full motion", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("static band boundaries (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    // Boundary 1: hero (base) → process (tint)
    const p = await page.evaluate(
      () => window.scrollY + document.querySelector(".bg-surface-tint")!.getBoundingClientRect().top,
    );
    await scrollTo(page, p - 300, 500);
    await page.screenshot({ path: `${DIR}/band-boundary-1-base-tint.png` });
    // Boundary 2: process (tint) → stories (base)
    await scrollTo(page, p + 300, 500);
    await page.screenshot({ path: `${DIR}/band-boundary-2-tint-base.png` });
  });

  test("route thread at two scroll positions (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const clip = { x: 0, y: 64, width: 170, height: 836 };
    await scrollTo(page, 200, 400);
    await page.screenshot({ path: `${DIR}/thread-pos1.png`, clip });
    const mid = await page.evaluate(
      () => (document.documentElement.scrollHeight - window.innerHeight) * 0.55,
    );
    await scrollTo(page, mid, 400);
    await page.screenshot({ path: `${DIR}/thread-pos2.png`, clip });
  });

  test("facts ribbon after count-up (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const ribbon = page.locator("section.bg-pine").first();
    await ribbon.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1300);
    const nums = await ribbon.locator("p.tnum").allInnerTexts();
    expect(nums).toEqual(["61", "23", "2019"]);
    await ribbon.screenshot({ path: `${DIR}/facts-ribbon.png` });
  });

  test("cards mid-reveal at boundary (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    // Position process cards just past the viewport bottom so the reveal is
    // caught in progress (partial opacity / offset).
    const cardsTop = await page.evaluate(
      () => window.scrollY + document.querySelector("li.reveal-card")!.getBoundingClientRect().top,
    );
    await scrollTo(page, cardsTop - 780, 250);
    await page.screenshot({ path: `${DIR}/cards-mid-reveal.png` });
  });

  test("CTA, footer, boundary and reveal (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const max = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    await scrollTo(page, max - 170, 500);
    await page.screenshot({ path: `${DIR}/footer-reveal-1.png` });
    await scrollTo(page, max - 70, 500);
    await page.screenshot({ path: `${DIR}/footer-reveal-2.png` });
    await scrollTo(page, max, 700);
    await page.locator("footer").screenshot({ path: `${DIR}/footer-1440.png` });
    const by = await page.evaluate(
      () => document.querySelector("footer")!.getBoundingClientRect().top,
    );
    await page.screenshot({
      path: `${DIR}/cta-footer-boundary.png`,
      clip: { x: 0, y: Math.max(0, by - 150), width: 1440, height: 300 },
    });
  });

  test("CTA and footer at 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${DIR}/cta-footer-390.png` });
  });

  for (const { name, path } of [
    { name: "uk", path: "/" },
    { name: "ru", path: "/ru" },
    { name: "en", path: "/en" },
  ]) {
    test(`homepage top ${name} (1440)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path, { waitUntil: "networkidle" });
      await ready(page);
      await page.waitForTimeout(1300);
      await page.screenshot({ path: `${DIR}/top-${name}.png` });
    });
  }

  test("view-transition morph mid-flight (1440)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.addStyleTag({ content: SLOW_VT });
    await ready(page);
    const link = page.locator('a[href$="/stories/story-1"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${DIR}/vt-morph-mid.png` });
    await page.waitForURL("**/stories/story-1");
  });

  for (const { name, prefix } of [
    { name: "uk", prefix: "" },
    { name: "ru", prefix: "/ru" },
    { name: "en", prefix: "/en" },
  ]) {
    test(`story navigation ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${prefix}/`, { waitUntil: "networkidle" });
      const link = page.locator('a[href$="/stories/story-2"]').first();
      await link.scrollIntoViewIfNeeded();
      await link.click();
      await page.waitForURL(`**${prefix}/stories/story-2`);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});

test.describe("reduced motion", () => {
  test("homepage complete and static", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await ready(page);
    const op = await page
      .locator(".reveal, .reveal-card")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(op.every((o) => o === "1")).toBe(true);
    await page.screenshot({ path: `${DIR}/reduced-top.png` });
    await page.screenshot({ path: `${DIR}/reduced-full.png`, fullPage: true });
    const ribbon = page.locator("section.bg-pine").first();
    await ribbon.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await ribbon.locator("p.tnum").allInnerTexts()).toEqual(["61", "23", "2019"]);
  });

  test("navigation instant under reduced motion", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const link = page.locator('a[href$="/stories/story-3"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForURL("**/stories/story-3");
    await expect(page.locator("h1")).toBeVisible();
  });
});
