import { BaseHelper } from "@helpers/base.helper";
import { Locator, Page } from "@playwright/test";

export class ProductPage extends BaseHelper {
  public readonly actualNumberOfProducts: Locator;

  public constructor(page: Page) {
    super(page);
    this.actualNumberOfProducts = page.locator(
      `form[data-oc-load='https://sota.store/ua/checkout-cart-list']`
    );
    //TODO expect on actual number of added products
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
    await this.page.waitForLoadState("domcontentloaded");
    let categoryControls = await this.page
      .locator(`[class='cf-table cf-checkbox cat ']`, { hasText: productName })
      .locator(`input[type='checkbox']:not(:checked)`);
    const count = await categoryControls.count();
    if (count === 0) {
      return;
    }
    const category = await categoryControls.first();
    if (await category.isVisible()) {
      await category.click({ force: true });
      // Used recursion instead of loop to make sure locators array is always fresh after page re-rendering
      await this.setCategoryFilters(productName);
    }
  }

  /**
   * Selects brands
   * @param brands - array of brands to select in the filter
   */
  public async selectBrands(brands: string[]) {
    for (const brand of brands) {
      let brandLocator = await this.page
        .locator(`[class='cf-table cf-checkbox man ']`, { hasText: brand })
        .locator(`input[type='checkbox']:not(:checked)`);
      await brandLocator.click();
      await this.page.waitForLoadState("domcontentloaded");
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
    const closePopupButton = this.page
      .locator(`*[role='dialog']`)
      .locator(`button[aria-label='Close this dialog']`);
    let count = await buyButton.count();
    if (count === 0) {
      return;
    }
    let addedProducts = 0;
    const products = Math.min(numberOfProductsToAdd, count);
    while (addedProducts < products) {
      const purchase = await buyButton.nth(addedProducts);
      if (await purchase.isVisible()) {
        await purchase.click({ force: true });
        await this.page.waitForLoadState("domcontentloaded");
        await closePopupButton.click();
        await this.page.waitForLoadState("domcontentloaded");
      }
      addedProducts++;
    }
    return addedProducts;
  }
}
