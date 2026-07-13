import { test, expect } from "@playwright/test";

// uk is the default locale and has no URL prefix (see src/i18n/routing.ts)
const locales = [
  { code: "uk", prefix: "" },
  { code: "ru", prefix: "/ru" },
  { code: "en", prefix: "/en" },
];

const pages = [
  "/",
  "/about",
  "/how-we-work",
  "/how-to-help",
  "/stories",
  "/donate",
  "/contact",
  "/volunteer",
  "/partner",
  "/privacy",
];

for (const { code, prefix } of locales) {
  for (const path of pages) {
    const url = path === "/" ? prefix || "/" : prefix + path;
    test(`${code} ${path} returns 200 and renders h1`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      // :visible — the homepage has two CSS-switched h1s (mobile/desktop
      // hero); exactly one is rendered at any viewport
      await expect(page.locator("h1:visible").first()).toBeVisible();
    });
  }
}

test("contact form renders its fields", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("form");
  for (const id of ["#name", "#phone", "#telegram", "#location", "#message"]) {
    await expect(form.locator(id)).toBeVisible();
  }
  await expect(form.locator('input[name="consent"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});

test("how-to-help cards link to the form pages and /donate", async ({
  page,
}) => {
  await page.goto("/how-to-help");
  await expect(
    page.getByRole("link", { name: "Заповнити форму" }),
  ).toHaveAttribute("href", "/volunteer");
  await expect(page.getByRole("link", { name: "Написати нам" })).toHaveAttribute(
    "href",
    "/partner",
  );
  await expect(
    page.locator('main a[href="/donate"], a[href="/donate"]').first(),
  ).toBeVisible();
});

test("volunteer page renders its form", async ({ page }) => {
  await page.goto("/volunteer");
  for (const id of ["#v-name", "#v-contact", "#v-role", "#v-message"]) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('form button[type="submit"]')).toBeVisible();
});

test("volunteer message becomes required when «Інше» is selected", async ({
  page,
}) => {
  await page.goto("/volunteer");
  const message = page.locator("#v-message");
  await expect(message).not.toHaveAttribute("required", "");
  await page.locator("#v-role").selectOption({ label: "Інше" });
  await expect(message).toHaveAttribute("required", "");
  await expect(message).toHaveAttribute("aria-required", "true");
});

test("share options are collapsed behind the share button", async ({
  page,
}) => {
  await page.goto("/how-to-help");
  const shareButton = page.locator('button[aria-controls="share-options"]');
  await expect(page.getByRole("link", { name: "Telegram" })).not.toBeVisible();
  await shareButton.click();
  await expect(shareButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Telegram" })).toBeVisible();
});

test("privacy page renders all policy sections", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("h2")).toHaveCount(9);
});

test("partner page renders its form", async ({ page }) => {
  await page.goto("/partner");
  for (const id of ["#p-org", "#p-email", "#p-message"]) {
    await expect(page.locator(id)).toBeVisible();
  }
  await expect(page.locator('form button[type="submit"]')).toBeVisible();
});
