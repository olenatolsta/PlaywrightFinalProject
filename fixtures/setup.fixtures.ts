import { test as base } from '@playwright/test';
import { PageManager } from '@page-manager';

export type SetupFixtures = {
  pageManager: PageManager;
};

/* Instantiates the 'Page Manager'. */
export const test = base.extend<SetupFixtures>({
  pageManager: async ({ page }, use) => {
    const manager = new PageManager(page);
    await use(manager);
  },
});
