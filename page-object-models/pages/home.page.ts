import { BaseHelper } from "@helpers/base.helper";
import { Locator, Page } from "@playwright/test";
import environment from "@utilities/environment";

export class HomePage extends BaseHelper {
  public readonly actualNumberOfProducts: Locator;

  public constructor(page: Page) {
    super(page);
    this.actualNumberOfProducts = page.locator(
      'form[data-oc-load="https://sota.store/ua/checkout-cart-list"]'
    );
  }

  /**
   * Gets a locator of a counter showing the number of products added to a cart
   */
  get cartCounter(): Locator {
    return this.page
      .locator('[id="header-cart"]')
      .locator('span[class="icon-counter"]');
  }

  /**
   * Inputs a product name into search field.
   * @param product - product name
   */
  public async searchForProduct(product: string) {
    await this.page.getByPlaceholder("Пошук товарів...").fill(product);
    await this.page
      .locator('[class^="col-lg-auto"]')
      .getByText("Знайти")
      .click();
  }

  /**
   * Sets price limits in price filter
   * @param minPrice - min product price
   * @param maxPrice - max product price
   */
  public async setPriceLimits(minPrice: number, maxPrice: number) {
    let controlMinPrice = await this.page.locator('input[name="price[from]"]');
    await controlMinPrice.fill(minPrice.toString());
    let controlMaxPrice = await this.page.locator('input[name="price[to]"]');
    await controlMaxPrice.focus();
    await this.page.waitForLoadState("domcontentloaded");
    await controlMaxPrice.fill(maxPrice.toString());
    await controlMinPrice.focus();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Sets category filters for a search key word (product name)
   * @param productName - name of the selected product
   */

  public async setCategoryFilters(productName: string) {
    let categoryControls = await this.page
      .locator('[class="cf-table cf-checkbox cat "]', { hasText: productName })
      .locator('input[type="checkbox"]');

    const count = await categoryControls.count();

    if (count === 0) {
      await console.log("No related category controls found");
      return;
    }

    await console.log(`Found ${count} category controls`);

    const category = await categoryControls.nth(0);
    if (await category.isVisible()) {
      await category.click({ force: true });
      await console.log(`Clicked control`);
      await this.page.waitForLoadState("domcontentloaded");
      // Used recursion instead of loop to make sure locators array is always fresh after page re-rendering
      await this.setCategoryFilters(productName);
    } else {
      await console.log(`Category control not visible`);
    }
  }

  /**
   * Selects brands
   * @param brands - array of brands to select in the filter
   */
  public async selectBrands(brands: string[]) {
    for (const brand of brands) {
      let brandLocator = await this.page
        .locator('[class="cf-table cf-checkbox man "]', { hasText: brand })
        .locator('input[type="checkbox"]');
      //await this.page.locator('[class*="cf-manufacturer"]').locator('.more').click();
      await brandLocator.click();
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  /**
   * Changes view from default greed view to list view
   */
  public async changeGreedToListView() {
    await this.page.locator('button[id="button-list"]').click();
  }

  /**
   * Adds several products to a basket
   * @param numberOfProductsToAdd - the name of products that should be added into a basket
   */
  public async addProductsToBasket(numberOfProductsToAdd) {
    const buyButton = await this.page.locator('button[type="submit"]', {
      hasText: "Купити",
    });
    const closePopupButton = this.page
      .locator('*[role="dialog"]')
      .locator('button[aria-label="Close this dialog"]');

    let count = await buyButton.count();

    if (count === 0) {
      await console.log("No products selected");
      return;
    }

    let addedProducts = 0;
    while (addedProducts < numberOfProductsToAdd) {
      const purchase = await buyButton.nth(addedProducts);
      if (await purchase.isVisible()) {
        await purchase.click({ force: true });
        await console.log(`Clicked control`);
        await this.page.waitForLoadState("domcontentloaded");
        await closePopupButton.click();
        await this.page.waitForLoadState("domcontentloaded");
      } else {
        await console.log(`Buy button is not visible`);
      }
      addedProducts++;
    }
  }

  /**
   * Navigates to and opens a basket
   */
  public async navigateToBasket() {
    await this.page.locator('[id="header-cart"]').click();
  }

  /**
   * Remove every second product from a basket
   * @param numberOfProducts - total number of products added to a basket
   * @returns remaining number of products
   */
  public async removeEachSecondProductFromBasket(
    numberOfProducts: number
  ): Promise<number> {
    const n = Math.floor(numberOfProducts / 2);

    for (let i = 0, j = 1; i < n; i++, j++) {
      await this.page.locator('button[class^="btn btn-delete"]').nth(j).click();
      await this.page.waitForLoadState("domcontentloaded");
    }

    return numberOfProducts - n;
  }
}
