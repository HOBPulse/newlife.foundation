import { test } from "@playwright/test";

/* Hero font trial shots (?font=serif&weight=…). The `shots` project forces
   reduced motion. Clips cover the full hero band incl. headline + CTAs. */

const DESKTOP_SHOTS = [
  { name: "font-trial-default", url: "/" },
  { name: "font-trial-serif-700", url: "/?font=serif&weight=700" },
  { name: "font-trial-serif-400", url: "/?font=serif&weight=400" },
] as const;

for (const { name, url } of DESKTOP_SHOTS) {
  test(`hero ${name} (1280)`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(url, { waitUntil: "networkidle" });
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
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: "screenshots/font-trial-serif-700-390.png",
    clip: { x: 0, y: 0, width: 390, height: 844 },
  });
});
