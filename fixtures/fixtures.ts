import { test as base, expect, Page } from "@playwright/test";
import { PageManager } from "@page-manager";

export type TestFixtures = {
  pageManager: PageManager;
  openBaseUrl: Page;
  openAuthorizationPage: Page;
  openAccountRegisterPage: Page;
};

export const test = base.extend<TestFixtures>({
  // Creates a PageManager once using the Playwright page
  pageManager: async ({ page }, use) => {
    const manager = new PageManager(page);
    await use(manager);
  },

  // Navigates to BASE_URL using PageManager
  openBaseUrl: async ({ pageManager }, use) => {
    // Opens BASE_URL
    await pageManager.openProductsPage();
    // Sends original page to test
    await use((pageManager as any)["page"]);
  },

  // Navigates to Authorization page
  openAuthorizationPage: async ({ pageManager }, use) => {
    // Opens Authorization Page
    await pageManager.openAuthorizationPage();
    // Sends original page to test
    await use((pageManager as any)["page"]);
  },

  // Navigates to Registration page
  openAccountRegisterPage: async ({ pageManager }, use) => {
    // Opens Authorization Page
    await pageManager.openAccountRegisterPage();
    await pageManager.openAccountRegisterPage();
    // Sends original page to test
    await use((pageManager as any)["page"]);
  },
});

// User storage fixtures
export const user1Test = test.extend({
  storageState: "playwright/.authentication/user1.json",
});

export const user2Test = test.extend({
  storageState: "playwright/.authentication/user2.json",
});

export { expect };
