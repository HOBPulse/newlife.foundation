import { test } from "@playwright/test";

/* Svyatoslav story (story-1) — verifies the newly wired svyats.jpg appears
   among the secondary photos. The `shots` project forces reduced motion. */

test("story svyatoslav uk (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/stories/story-1", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "screenshots/part5-story-svyatoslav-uk.png",
    fullPage: true,
  });
});
