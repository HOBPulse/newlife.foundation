import { test, expect } from "@playwright/test";

// Throwaway — verifies BOTH PayPal SDKs coexist on one page load (the core
// technical risk): flip one-time → monthly → one-time, each button renders its
// iframe, no namespace clash, no console error from PayPal.
test("both PayPal SDKs coexist across tab flips", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto("/donate");
  await page.locator("#give").scrollIntoViewIfNeeded();

  // One-time tab (default) renders a hosted-button iframe
  await expect(
    page.locator("#paypal-hosted-container iframe").first(),
  ).toBeVisible({ timeout: 20_000 });

  // Switch to monthly → subscription buttons iframe renders
  await page.getByRole("tab", { name: /щомісяця/i }).click();
  await expect(
    page.locator("#paypal-subscription-container iframe").first(),
  ).toBeVisible({ timeout: 20_000 });

  // Back to one-time → hosted button re-renders (fresh mount, cached SDK)
  await page.getByRole("tab", { name: /разово/i }).click();
  await expect(
    page.locator("#paypal-hosted-container iframe").first(),
  ).toBeVisible({ timeout: 20_000 });

  // Both SDK scripts present under distinct namespaces, window.paypal untouched
  const ns = await page.evaluate(() => ({
    oneTime: typeof (window as Record<string, unknown>).paypalOneTime,
    sub: typeof (window as Record<string, unknown>).paypalSub,
    shared: typeof (window as Record<string, unknown>).paypal,
    scripts: document.querySelectorAll("script[data-namespace]").length,
  }));
  expect(ns.oneTime).toBe("object");
  expect(ns.sub).toBe("object");
  expect(ns.scripts).toBe(2);

  const paypalErrors = errors.filter((e) => /paypal/i.test(e));
  expect(paypalErrors, paypalErrors.join("\n")).toHaveLength(0);
});
