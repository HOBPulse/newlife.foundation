import { test, type Page } from "@playwright/test";

/* Mobile polish (task.md): hero focal crop + stories swipe carousel
   (shipped option B) on the homepage and /stories. 390px viewport. */

const MOBILE = { width: 390, height: 844 };

async function openMobile(page: Page, path: string) {
  await page.setViewportSize(MOBILE);
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

function homeStoriesSection(page: Page) {
  return page.locator("section", { has: page.locator(".stories-track") });
}

async function swipeToSecondCard(page: Page) {
  await page.evaluate(() => {
    const track = document.querySelector(".stories-track");
    if (track) {
      track.scrollLeft = (track.scrollWidth - track.clientWidth) / 2;
    }
  });
  await page.waitForTimeout(400);
}

test("home stories carousel", async ({ page }) => {
  await openMobile(page, "/");
  const section = homeStoriesSection(page);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await section.screenshot({
    path: "screenshots/mobile-home-stories-carousel.png",
  });
});

test("home stories carousel — swiped to 2nd card", async ({ page }) => {
  await openMobile(page, "/");
  const section = homeStoriesSection(page);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await swipeToSecondCard(page);
  await section.screenshot({
    path: "screenshots/mobile-home-stories-carousel-swiped.png",
  });
});

test("stories page carousel (viewport)", async ({ page }) => {
  await openMobile(page, "/stories");
  await page.locator(".stories-track").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "screenshots/mobile-stories-page-carousel.png",
  });
});
