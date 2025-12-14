import { test, expect } from "@fixtures/fixtures";
import * as Data from "@helpers/test-data.helper";
import playwrightConfig from "playwright.config";

test(
  `OTTest-001 Authorize a new user on registration screen`,
  { tag: "@smoke @OTTest-001" },
  async ({ pageManager }) => {
    const info = test.info();
    //if (info.project.name != "no-auth") return; // for Debug;
    await pageManager.clearState();
    await pageManager.openAccountRegisterPage();

    await test.step(`Fill in incorrect email`, async () => {
      await pageManager.onAuthorizationPage().fillInRegistrationData({
        firstName: Data.userDetails.userName,
        familyName: Data.userDetails.userFamilyName,
        email: Data.userDetails.invalidEmail,
      });

      await pageManager.onAuthorizationPage().submitButton.click();
      //Make sure the error message appear for 'E-Mail' field
      await expect(
        pageManager.onAuthorizationPage().emailInput
      ).toHaveJSProperty(
        "validationMessage",
        `Please enter a part followed by '@'. '@gmail.com' is incomplete.`
      );
      await pageManager.reloadPage();
    });

    await test.step(`Fill in incorrect phone number`, async () => {
      await pageManager.onAuthorizationPage().fillInRegistrationData({
        firstName: Data.userDetails.userName,
        familyName: Data.userDetails.userFamilyName,
        email: Data.userDetails.email,
        phoneNumber: Data.userDetails.invalidPhoneNumber,
      });

      await pageManager.onAuthorizationPage().submitButton.click();
      await expect(
        pageManager.onAuthorizationPage().invalidPhoneNumberError
      ).toBeVisible();
      await pageManager.reloadPage();
    });

    await test.step(`Fill in incorrect password`, async () => {
      await pageManager.onAuthorizationPage().fillInRegistrationData({
        firstName: Data.userDetails.userName,
        familyName: Data.userDetails.userFamilyName,
        password: Data.userDetails.invalidPassword,
      });
      await pageManager.onAuthorizationPage().submitButton.click();
      await expect(
        pageManager.onAuthorizationPage().invalidPasswordError
      ).toBeVisible();
      await pageManager.reloadPage();
    });

    await test.step(`Submit registration with blank fields`, async () => {
      await pageManager.onAuthorizationPage().submitButton.click();
      await expect(
        pageManager.onAuthorizationPage().invalidNameError
      ).toBeVisible();
      await expect(
        pageManager.onAuthorizationPage().invalidSenameError
      ).toBeVisible();
      await expect(
        pageManager.onAuthorizationPage().invalidEmailError
      ).toBeVisible();
      await expect(
        pageManager.onAuthorizationPage().invalidPasswordError
      ).toBeVisible();
    });
  }
);
