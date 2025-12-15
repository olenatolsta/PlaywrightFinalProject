import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "@helpers/base.helper";

export class CartPage extends BaseHelper {
  public readonly actualNumberOfProducts: Locator;
  public readonly closePopupButton: Locator;
  public readonly rows: Locator;

  public constructor(page: Page) {
    super(page);
    this.closePopupButton = page
      .locator(`*[role='dialog']`)
      .locator(`button[aria-label='Close this dialog']`);

    this.rows = page.locator(`form[class='row item']`);
  }

  /**
   *
   * @returns Calculates a number of products in Cart
   */
  public async calculateProductsInCart(): Promise<number> {
    await this.page.waitForTimeout(1000);
    const result = await this.rows.count();
    await this.page.waitForLoadState("domcontentloaded");
    return result;
  }

  /**
   * Removes every second product from Cart
   * @param numberOfProducts - total number of products added to a cart
   * @returns remaining number of products
   */
  public async removeEachSecondProductFromBasket(
    numberOfProducts: number
  ): Promise<number> {
    const n = Math.floor(numberOfProducts / 2);

    for (let i = 0, j = 1; i < n; i++, j++) {
      await this.page.locator(`button[class^='btn btn-delete']`).nth(j).click();
      await this.page.waitForLoadState("domcontentloaded");
    }

    return numberOfProducts - n;
  }

  /**
   * Removes all the products from the cart
   * @param numberOfProducts - total number of products added to a basket
   */
  public async removeAllProductsFromCart(numberOfProducts: number) {
    const n = numberOfProducts;
    for (let i = 0; i < n; i++) {
      await this.page
        .locator(`button[class^='btn btn-delete']`)
        .first()
        .click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }
}
