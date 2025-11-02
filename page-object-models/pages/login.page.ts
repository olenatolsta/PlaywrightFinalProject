import { Locator, Page } from '@playwright/test';
import { BaseHelper } from '@helpers/base.helper';

export class LoginPage extends BaseHelper {
  private readonly ioIdentityToggle: Locator;

  private readonly loginButton: Locator;

  private readonly skipCheckbox: Locator;

  public constructor(page: Page) {
    super(page);
    this.ioIdentityToggle = page.getByText('Use io.Identity Login');
    this.loginButton = page.locator('#ButtonLogin, #IOLoginButton');
    this.skipCheckbox = page.locator('input#SkipCheckbox');
  }

  /**
   * Performs login actions using ioIdentity.
   * @param {string} username - Specifies users email.
   * @param {string} password - Specifies password.
   */
  public async userLogin(username: string, password: string) {
    if (await this.ioIdentityToggle.isVisible()) {
      await this.ioIdentityToggle.click();
    }
    await this.page.locator('input[id="email"]').fill(username);
    await this.page.locator('input[id="password"]').fill(password);
    await this.loginButton.click();
  }

  /**
   * Selects specified 'Tenant' and 'Language' on the 'Welcome Screen' and then proceeds with logging in.
   * @param {string} tenant - Specifies the 'Tenant' to be selected.
   * @param {string} language - Specifies the 'Language' to be selected.
   */
  public async welcomeScreenLogin(tenant: string, language: string, skipWelcomeScreen = true) {
    await this.page.locator('#MandatorDropDown').selectOption(tenant);
    await this.page.locator('#LanguageDropDown').selectOption(language);
    const isChecked = await this.skipCheckbox.isChecked();
    if (skipWelcomeScreen && isChecked) {
      await this.page.getByLabel('Skip this screen').uncheck();
    }
    await this.loginButton.click();
  }
}
