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
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 120_000,
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, //50%
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    /* Setup for authentication. */
    { name: "authentication", testMatch: /authentication.setup.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        /* Single user authentication state by default */
        //storageState: 'playwright/.authentication/user.json',
        headless: false, // opens a visible browser
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        launchOptions: { slowMo: 50 }, // adds slight human-like delay
      },
      dependencies: ["authentication"],
    },
  ],
});
