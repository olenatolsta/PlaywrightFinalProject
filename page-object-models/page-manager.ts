import {} from "@helpers/test-data.helper";
import { StorageState } from "@helpers/test-data.helper";
import { Page } from "@playwright/test";
import environment from "@utilities/environment";
import { HomePage } from "@pages/home.page";
import { LoginPage } from "@pages/login.page";
import { CartPage } from "@pages/cart.page";

export class PageManager {
  private readonly page: Page;

  /* Pages */
  private readonly homePage: HomePage;
  private readonly cartPage: CartPage;

  public constructor(page: Page) {
    this.page = page;

    /* Pages */
    this.homePage = new HomePage(this.page);
    this.cartPage = new CartPage(this.page);
  }

  /**
   * Navigates to the Base URL
   */
  public async openHomePage() {
    await this.page.goto(`${environment.BASE_URL}`);
  }

  /**
   * Performs login actions using correct credentials.
   * @param userName The username for login.
   * @param password The password for login.
   * @param storageStatePath The path to save the storage state after login.
   */
  public async login(
    userName: string,
    password: string,
    storageStatePath: string = StorageState
  ) {
    /* Perform login steps. */
    await this.page.goto(`${environment.BASE_URL}/Login`);
    //await this.onLoginPage().ioIdentityLogin(userName, password);

    /* Saves storage state to specified path. */
    //await this.page.context().storageState({ path: storageStatePath });
  }

  /**
   * Reloads a page.
   */

  public async reloadPage() {
    await this.page.reload();
  }

  public async closePage() {
    await this.page.close();
  }

  /* Pages */
  public onHomePage() {
    return this.homePage;
  }

  public onCartPage() {
    return this.cartPage;
  }
}
