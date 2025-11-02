import { PageManager } from '@page-manager';
import { Page, test as base } from '@playwright/test';
import environment from '@utilities/environment';

export type TestFixtures = {
  openBaseUrl: Page;
};

export const test = base.extend<TestFixtures>({
  /* Opens the base URL, this fixture will be run for all tests */
  openBaseUrl: [
    async ({ page }, use) => {
      await page.goto(environment.BASE_URL);
      await use(page);
    },
    { auto: true },
  ],
});
