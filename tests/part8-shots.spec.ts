import { test, type Page } from "@playwright/test";

/* Part 8 — how-to-help (BLM-grid + Web3Forms forms) and privacy pages.
   The `shots` project forces reduced motion, so reveals render final-state. */

async function waitForHeadingFont(page: Page) {
  await page.waitForFunction(() => {
    const h = document.querySelector("h1");
    return (
      h && getComputedStyle(h).fontFamily.toLowerCase().includes("pt serif")
    );
  });
  await page.evaluate(() => document.fonts.ready);
}

for (const width of [1280, 390] as const) {
  test(`how-to-help uk (${width})`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/how-to-help", { waitUntil: "networkidle" });
    await waitForHeadingFont(page);
    await page.screenshot({
      path: `screenshots/part8-how-to-help-uk-${width}.png`,
      fullPage: true,
    });
  });
}

test("how-to-help uk volunteer form success state (mocked)", async ({
  page,
}) => {
  // Mock Web3Forms so no real submission leaves the machine.
  await page.route("**/api.web3forms.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/how-to-help", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);

  await page.locator("#v-name").fill("Тест");
  await page.locator("#v-contact").fill("test@example.com");
  await page.locator("#v-role").selectOption({ label: "Водій" });
  await page.locator('#volunteer button[type="submit"]').click();
  await page.locator('#volunteer [role="status"]').waitFor();

  await page.locator("#volunteer").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "screenshots/part8-how-to-help-uk-success.png",
    fullPage: true,
  });
});

test("privacy uk (1280)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/privacy", { waitUntil: "networkidle" });
  await waitForHeadingFont(page);
  await page.screenshot({
    path: "screenshots/part8-privacy-uk-1280.png",
    fullPage: true,
  });
});
