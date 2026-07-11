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
  "/partner",
  "/privacy",
];

for (const { code, prefix } of locales) {
  for (const path of pages) {
    const url = path === "/" ? prefix || "/" : prefix + path;
    test(`${code} ${path} returns 200 and renders h1`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
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

test("how-to-help volunteer + partnership forms render their fields", async ({
  page,
}) => {
  await page.goto("/how-to-help");
  const volunteer = page.locator("#volunteer form");
  for (const id of ["#v-name", "#v-contact", "#v-role", "#v-message"]) {
    await expect(volunteer.locator(id)).toBeVisible();
  }
  await expect(volunteer.locator('button[type="submit"]')).toBeVisible();

  const partnership = page.locator("#partnership form");
  for (const id of ["#p-org", "#p-email", "#p-message"]) {
    await expect(partnership.locator(id)).toBeVisible();
  }
  await expect(partnership.locator('button[type="submit"]')).toBeVisible();
});

test("volunteer message becomes required when «Інше» is selected", async ({
  page,
}) => {
  await page.goto("/how-to-help");
  const message = page.locator("#v-message");
  await expect(message).not.toHaveAttribute("required", "");
  await page.locator("#v-role").selectOption({ label: "Інше" });
  await expect(message).toHaveAttribute("required", "");
  await expect(message).toHaveAttribute("aria-required", "true");
});

test("privacy page renders all policy sections", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("h2")).toHaveCount(7);
});

test("partner form renders its fields", async ({ page }) => {
  await page.goto("/partner");
  const form = page.locator("form");
  for (const id of [
    "#name",
    "#phone",
    "#telegram",
    "#organization",
    "#message",
  ]) {
    await expect(form.locator(id)).toBeVisible();
  }
  await expect(form.locator('input[name="consent"]')).toBeVisible();
  await expect(form.locator('button[type="submit"]')).toBeVisible();
});
