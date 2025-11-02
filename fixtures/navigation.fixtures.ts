import { Page, test as base } from "@playwright/test";
import { PageManager } from "@page-manager";
import environment from "@utilities/environment"

export type NavigationFixtures = {
  openHomePage: Page;
};

export const test = base.extend<NavigationFixtures>({
  /* Navigates to the 'Home' page and accepts all cookies. */
  openHomePage: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await pageManager.openHomePage();
    await use(page);
  },
});
