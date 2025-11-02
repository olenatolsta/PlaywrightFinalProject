import { StorageState} from '@helpers/test-data.helper';
import { PageManager } from '@page-manager';
import environment from '@utilities/environment';
import { Browser } from 'playwright';

/**
 * Creates a new page manager for user 1.
 * Also navigates to the base URL.
 * @param browser The browser instance.
 * @returns The page manager for user 1.
 */
export async function CreatePageManagerForUser(browser: Browser): Promise<PageManager> {
  const userPage = await browser.newPage({ storageState: StorageState });
  const userPageManager = new PageManager(userPage);

  await userPage.goto(environment.BASE_URL);

  return userPageManager;
}

/**
 * Creates a new page manager for user 2.
 * Also navigates to the base URL.
 * @param browser The browser instance.
 * @returns The page manager for user 2.

export async function CreatePageManagerForUser2(browser: Browser): Promise<PageManager> {
  const user2Page = await browser.newPage({ storageState: StorageStateUser2 });
  const user2PageManager = new PageManager(user2Page);

  await user2Page.goto(environment.BASE_URL);

  return user2PageManager;
}*/
