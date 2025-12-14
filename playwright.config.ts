import { defineConfig, devices } from "@playwright/test";
import * as tsconfigPaths from "tsconfig-paths";
import tsconfig from "./tsconfig.json";
import { config as dotenvConfig } from "dotenv";

// Register TS path aliases for Playwright runtime
tsconfigPaths.register({
  baseUrl: "./",
  paths: tsconfig.compilerOptions.paths,
});

dotenvConfig({
  path: `./.env`,
  override: true,
});

/**
 * Done using https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 120_000,
  testDir: "./tests",
  /* Do not run all the tests in parallel */
  fullyParallel: false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, //50%
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    headless: false,
  },

  /* Configure project for major browsers */
  projects: [
    /* Setup for authentication. */
    { name: "authentication", testMatch: /authentication.setup.ts/ },

    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        /* Single user authentication state by default */
        storageState: "playwright/.authentication/user1.json",
        launchOptions: { slowMo: 50 }, // adds a slight human-like delay
      },
      dependencies: ["authentication"],
    },
  ],
});
