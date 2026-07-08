import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  // Dev server compiles routes on first hit — allow for that
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3000",
    // Unprefixed routes locale-detect via Accept-Language; browse as a
    // Ukrainian visitor so "/" exercises the uk default, not an /en redirect
    locale: "uk-UA",
  },
  projects: [
    { name: "smoke", testMatch: /smoke\.spec\.ts$/ },
    {
      name: "shots",
      testMatch: /shots\.spec\.ts$/,
      // Reduced motion renders scroll-reveal and map content fully drawn,
      // so full-page captures don't show pre-reveal hidden states
      use: { contextOptions: { reducedMotion: "reduce" } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
