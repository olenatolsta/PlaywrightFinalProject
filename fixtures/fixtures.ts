// fixtures/fixtures.ts
import { test as base, expect, Page } from '@playwright/test';
import environment from '@utilities/environment';
import { PageManager } from '@page-manager';

// --- types ---
export type TestFixtures = {
  openBaseUrl: Page;
  pageManager: PageManager;
};

// --- define extended test ---
export const test = base.extend<TestFixtures>({
  openBaseUrl: [
    async ({ page }, use) => {
      await page.goto(environment.BASE_URL);
      await use(page);
    },
    { auto: true },
  ],

  pageManager: async ({ page }, use) => {
    const manager = new PageManager(page);
    await use(manager);
  },
});

export { expect };
