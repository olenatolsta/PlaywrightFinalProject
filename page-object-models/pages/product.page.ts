import { BaseHelper } from "@helpers/base.helper";
import { expect, Locator, Page } from "@playwright/test";
import { exec } from "child_process";

export class ProductPage extends BaseHelper {
  public readonly actualNumberOfProducts: Locator;
  public readonly showMoreBButton: Locator;

  public constructor(page: Page) {
    super(page);
    this.actualNumberOfProducts = page.locator(
      `form[data-oc-load='https://sota.store/ua/checkout-cart-list']`
    );
    this.showMoreBButton = page
      .locator('[class*="cf-manufacturer"]')
      .locator('a[data-bs-toggle="collapse"]');
    //.filter({ hasText: "Показати ще" });
  }

  /**
   * Gets a locator of a counter showing the number of products added to a cart
   */
  get cartCounter(): Promise<string> {
    return this.page
      .locator(`[id='header-cart']`)
      .locator(`span[class='icon-counter']`)
      .innerText();
  }

  /**
   * Inputs a product name into search field.
   * @param product - product name
   */
  public async searchForProduct(product: string) {
    await this.page.getByPlaceholder("Пошук товарів...").fill(product);
    await this.page
      .locator(`[class^='col-lg-auto']`)
      .getByText("Знайти")
      .click();
  }

  private async ajaxWait(timeout = 5_000) {
    await expect(this.page.locator("html")).not.toHaveClass(
      /cl-filter-loading/,
      { timeout }
    );
    await expect(this.page.locator("html")).not.toHaveClass(
      /cl-popup-loading/,
      { timeout }
    );
  }

  /**
   * Sets price limits in price filter
   * @param minPrice - min product price
   * @param maxPrice - max product price
   */
  public async setPriceLimits(minPrice: number, maxPrice: number) {
    let controlMinPrice = await this.page.locator(`input[name='price[from]']`);
    await controlMinPrice.fill(minPrice.toString());
    let controlMaxPrice = await this.page.locator(`input[name='price[to]']`);
    await controlMaxPrice.focus();
    await this.ajaxWait();
    await controlMaxPrice.fill(maxPrice.toString());
    await controlMinPrice.focus();
    await this.ajaxWait();
  }

  /**
   * Sets category filters for a search key word (product name)
   * @param productName - name of the selected product
   */

  public async setCategoryFilters(productName: string) {
    await this.ajaxWait();
    let categoryControls = await this.page
      .locator(`[class^='cf-table cf-checkbox cat']`, { hasText: productName })
      .locator(`input[type='checkbox']:not(:checked)`);
    const count = await categoryControls.count();
    if (count === 0) {
      return;
    }
    const category = await categoryControls.first();
    if (await category.isVisible()) {
      await category.click();
      await this.ajaxWait();
      await this.setCategoryFilters(productName);
    }
  }

  /**
   * Selects brands
   * @param brands - array of brands to select in the filter
   */
  public async selectBrands(brands: string[]) {
    for (const brand of brands) {
      const cnt = await this.showMoreBButton.count();
      const attr = await this.showMoreBButton.getAttribute("aria-expanded");
      if (cnt === 1 && (attr === null || attr === "false")) {
        await this.showMoreBButton.click();
        await this.ajaxWait();
      }
      let brandLocator = await this.page
        .locator(`[class^='cf-table cf-checkbox man']`, { hasText: brand })
        .locator(`input[type='checkbox']:not(:checked)`);
      if ((await brandLocator.count()) > 0) {
        await brandLocator.first().click();
        await this.ajaxWait();
      }
    }
  }

  /**
   * Changes view from default greed view to list view
   */
  public async changeGreedToListView() {
    await this.page.locator(`button[id='button-list']`).click();
  }

  /**
   * Adds several products to a basket
   * @param numberOfProductsToAdd - the name of products that should be added into a basket
   */
  public async addProductsToCart(numberOfProductsToAdd): Promise<number> {
    const buyButton = await this.page.locator(`button[type='submit']`, {
      hasText: "Купити",
    });
    await expect(buyButton).not.toHaveCount(0);
    let count = await buyButton.count();
    let addedProducts = 0;
    const products = Math.min(numberOfProductsToAdd, count);
    while (addedProducts < products) {
      await this.ajaxWait();
      const purchase = await buyButton.nth(addedProducts);
      await expect(purchase).toBeVisible();
      if (await purchase.isVisible()) {
        await purchase.click();
        await this.ajaxWait();
        const cartClose = this.page
          .locator(`*[role='dialog']`)
          .locator(`button[aria-label='Close this dialog']`);
        if (await cartClose.isVisible()) {
          await cartClose.click();
        }
      }
      addedProducts++;
    }
    return addedProducts;
  }
}
