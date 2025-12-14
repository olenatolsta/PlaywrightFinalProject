import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "@helpers/base.helper";

export class AuthorizationPage extends BaseHelper {
  public readonly invalidPhoneNumberError: Locator;
  public readonly emailInput: Locator;
  public readonly submitButton: Locator;
  public readonly invalidPasswordError: Locator;
  public readonly invalidNameError: Locator;
  public readonly invalidSenameError: Locator;
  public readonly invalidEmailError: Locator;

  public constructor(page: Page) {
    super(page);

    this.invalidPhoneNumberError = page.getByText("Хибний номер телефону");
    this.emailInput = page.locator(`input[type='email']`);
    this.submitButton = page.locator(`button[type='submit']`);
    this.invalidPasswordError = page.getByText(
      "Пароль має бути від  6 до 40 символів!"
    );
    this.invalidNameError = page.getByText(
      `Ім'я має бути від 1 до 32 символів!`
    );
    this.invalidSenameError = page.getByText(
      `Прізвище має бути від 1 до 32 символів!`
    );
    this.invalidEmailError = page.getByText(`E-Mail введено неправильно!`);
  }

  /**
   * Fills in the fields on Authorization page
   */
  public async fillInRegistrationData(data: {
    firstName: string;
    familyName: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
  }): Promise<void> {
    await this.page.locator("#input-firstname").fill(data.firstName);
    await this.page.getByPlaceholder("Прізвище").fill(data.familyName);

    if (data.email) await this.emailInput.fill(data.email);
    if (data.phoneNumber)
      await this.page.locator(`input[type='tel']`).fill(data.phoneNumber);
    if (data.password)
      await this.page.getByPlaceholder("Пароль").fill(data.password);
  }
}
