import { test, type Page } from "@playwright/test";

/* Final shipped states — no lab params: option-4 mobile hero with the
   gel+halo donate CTA (btn 13, no icon), dot-flood secondary, share chips
   on /how-to-help, header donate heart right of the label. */

const MOBILE = { width: 390, height: 844 };

async function openMobile(page: Page, path: string) {
  await page.setViewportSize(MOBILE);
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

test("final: mobile hero", async ({ page }) => {
  await openMobile(page, "/");
  await page.screenshot({ path: "screenshots/final-mobile-hero.png" });
});

test("final: mobile donate CTA pressed (gel settles, halo brightens)", async ({
  page,
}) => {
  await openMobile(page, "/");
  const cta = page.locator(".hero-donate-cta");
  const box = await cta.boundingBox();
  if (!box) throw new Error("donate CTA not found");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(400);
  await cta
    .locator("..")
    .screenshot({ path: "screenshots/final-hero-donate-pressed.png" });
  await page.mouse.up();
});

test("final: mobile secondary pressed (dot flood)", async ({ page }) => {
  await openMobile(page, "/");
  // .first() = the mobile hero copy (the hidden desktop hero has its own)
  const cta = page.locator(".hero-cta-secondary").first();
  const box = await cta.boundingBox();
  if (!box) throw new Error("secondary CTA not found");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(400);
  await cta
    .locator("..")
    .screenshot({ path: "screenshots/final-hero-help-pressed.png" });
  await page.mouse.up();
});

test("final: share chips open on how-to-help", async ({ page }) => {
  await openMobile(page, "/how-to-help");
  const shareBtn = page.locator('button[aria-controls="share-options"]');
  await shareBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await shareBtn.click();
  await page.waitForTimeout(600);
  await shareBtn
    .locator("..")
    .screenshot({ path: "screenshots/final-share-open.png" });
});

test("final: lyonichka story with trip photo", async ({ page }) => {
  await openMobile(page, "/stories/story-3");
  await page.screenshot({
    path: "screenshots/final-story3-photos.png",
    fullPage: true,
  });
});

test("final: desktop header heart right", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("header")
    .screenshot({ path: "screenshots/final-header-heart.png" });
});

test("final: desktop hero CTAs (dot secondary)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page
    .locator(".hero-ctas")
    .screenshot({ path: "screenshots/final-desktop-hero-ctas.png" });
});
