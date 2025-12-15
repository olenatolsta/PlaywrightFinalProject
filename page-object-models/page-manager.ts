import {} from "@helpers/test-data.helper";
import { StorageStateUser1 } from "@helpers/test-data.helper";
import { Page } from "@playwright/test";
import environment from "@utilities/environment";
import { ProductPage } from "@pages/product.page";
import { LoginPage } from "@pages/login.page";
import { CartPage } from "@pages/cart.page";
import { AuthorizationPage } from "@pages/authorization.page";
import { ProductDetailsPage } from "@pages/product-details.page";

export class PageManager {
  private readonly page: Page;

  /* Pages */
  private readonly productPage: ProductPage;
  private readonly cartPage: CartPage;
  private readonly authorizationPage: AuthorizationPage;
  private readonly loginPage: LoginPage;
  private readonly productDetailsPage: ProductDetailsPage;

  public constructor(page: Page) {
    this.page = page;

    /* Pages */
    this.productPage = new ProductPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.authorizationPage = new AuthorizationPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.productDetailsPage = new ProductDetailsPage(this.page);
  }

  /**
   * Navigates to the Base URL
   */
  public async openProductsPage() {
    await this.page.goto(`${environment.BASE_URL}`);
  }

  /**
   * Navigates to Authorization page
   */
  public async openAuthorizationPage() {
    await this.page.goto(`${environment.BASE_URL}/account`);
  }

  /**
   * Navigates to Registration page
   */
  public async openAccountRegisterPage() {
    await this.page.goto(`${environment.BASE_URL}/account-register`);
  }

  public async clearState() {
    await this.page.context().clearCookies();
    //await this.page.evaluate(() => localStorage.clear());
    //await this.page.evaluate(() => sessionStorage.clear());
  }

  /**
   * Matches the specified string with the name of a parent section and then clicks and expands it.
   * @param {string} sectionName - Specifies the name of the structure item.
   */

  public async openParentSection(parentSectionName: string) {
    await this.page
      .locator(`[class^="menu-item dropdown"]`)
      .locator(`a[class^="item-link"]`)
      .filter({ hasText: parentSectionName })
      .nth(1)
      .click();
  }

  /**
   * Matches the specified string with the name of a child section and then clicks and expands it.
   * @param {string} childSectionName - Specifies the name of the structure item.
   * @param {boolean} exact - If true, the match is exact; otherwise, it is a partial match.
   */
  public async openChildSection(childSectionName: string) {
    await this.page
      .locator(`a[class^="btn"]`)
      .filter({ hasText: childSectionName })
      .click();
  }

  /* Navigates to Cart page */
  public async openCartPage() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.locator(`[id='header-cart']`).click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async closeCartPage() {
    await this.page.waitForLoadState("domcontentloaded");
    const closePopupButton = this.page
      .locator(`*[role='dialog']`)
      .locator(`button[aria-label='Close this dialog']`);
    await closePopupButton.click();
  }

  /**
   * Navigates to Wishlist
   */
  public async openWishlist() {
    await this.page
      .locator(`[class^="order-last"]`)
      .locator(`[class^="row header-icons"]`)
      .locator(`[class="cl-wishlist dropdown"]`)
      .locator(`i[class^="material-symbols"]`)
      .filter({ hasText: "favorite" })
      .click();
  }

  /**
   * Performs login actions using correct credentials.
   * @param userEmail The email for login.
   * @param password The password for login.
   * @param storageStatePath The path to save the storage state after login.
   */
  public async login(
    userEmail: string,
    password: string,
    storageStatePath: string = StorageStateUser1
  ) {
    /* Perform login steps. */
    await this.page.goto(`${environment.BASE_URL}/login`);
    await this.onLoginPage().userLogin(userEmail, password);

    /* Saves storage state to specified path. */
    await this.page.context().storageState({ path: storageStatePath });
  }

  /**
   * Reloads a page.
   */

  public async reloadPage() {
    await this.page.reload();
  }

  /* Pages */

  public onAuthorizationPage() {
    return this.authorizationPage;
  }
  public onProductPage() {
    return this.productPage;
  }

  public onCartPage() {
    return this.cartPage;
  }

  public onLoginPage() {
    return this.loginPage;
  }

  public onProductDetailsPage() {
    return this.productDetailsPage;
  }
}
