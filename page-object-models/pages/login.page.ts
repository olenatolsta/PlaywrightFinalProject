import { Locator, Page } from '@playwright/test';
import {
  StorageStateUser1,
  StorageStateUser2,
} from '@helpers/test-data.helper';
import { BaseHelper } from '@helpers/base.helper';
import { Browser } from 'playwright';
import { PageManager } from '@page-manager';
import environment from '@utilities/environment';

export class LoginPage extends BaseHelper {
  public readonly generalLoginButton: Locator;
  public readonly generalLoggedInIcon: Locator;
  private readonly emailLoginButton: Locator;
  private readonly loginSubmitButton: Locator;
  private readonly logoutButton: Locator;

  public constructor(page: Page) {
    super(page);

    this.emailLoginButton = page
      .locator(`[class='login-content']`)
      .getByRole('button', { name: 'Увійти через пошту' });
    this.loginSubmitButton = page
      .locator(`[id='account-login']`)
      .filter({ hasText: 'Увійти' });
  }

  /**
   * Performs login actions via email.
   * @param {string} username - Specifies users email.
   * @param {string} password - Specifies password.
   */
  public async userLogin(username: string, password: string) {
    if (await this.emailLoginButton.isVisible()) {
      await this.emailLoginButton.click();
    }
    await this.page
      .locator(`[class='login-content']`)
      .locator(`input[id='input-email']`)
      .fill(username);
    await this.page
      .locator(`[class='login-content']`)
      .locator(`input[id='input-password']`)
      .fill(password);
    await this.loginSubmitButton.click();
  }

  public async userLogout(username: string) {
    const accountIcon = this.page
      .locator(`a[class='icon tooltipstered']`)
      .filter({ hasText: username.split(/[@.]/)[0] });
    if (await accountIcon.isVisible()) {
      await accountIcon.click();
    }
    await this.page.locator(`a[class='btn btn-pink']`).filter({ hasText: 'Вийти з облікового запису' }).click();
  }
}

/**
 * Creates a new page manager for user 1.
 * Also navigates to the base URL.
 * @param browser The browser instance.
 * @returns The page manager for user 1.
 */
export async function createPageManagerForUser1(
  browser: Browser
): Promise<PageManager> {
  const user1Page = await browser.newPage({ storageState: StorageStateUser1 });
  const user1PageManager = new PageManager(user1Page);

  await user1Page.goto(environment.BASE_URL);

  return user1PageManager;
}

/**
 * Creates a new page manager for user 2.
 * Also navigates to the base URL.
 * @param browser The browser instance.
 * @returns The page manager for user 2.
 */
export async function createPageManagerForUser2(
  browser: Browser
): Promise<PageManager> {
  const user2Page = await browser.newPage({ storageState: StorageStateUser2 });
  const user2PageManager = new PageManager(user2Page);

  await user2Page.goto(environment.BASE_URL);

  return user2PageManager;
}
