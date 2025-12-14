import { Page, Locator } from "@playwright/test";

export class BaseHelper {
  protected readonly page: Page;
  public readonly wishlistProductNumber: Locator;
  public readonly wishlistEmptyMessage: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.wishlistProductNumber = page
      .locator(`[class="cl-wishlist dropdown"]`)
      .locator(`span[class="icon-counter"]`);
    this.wishlistEmptyMessage = page.getByText(
      `Додайте товари до списку бажань`
    );
  }

  /**
   * Gets a number of products added to Wishlist
   */
  public async getWishlistProductsCount(): Promise<number> {
    await this.page.waitForLoadState("domcontentloaded");
    const text = await this.wishlistProductNumber.innerText();
    return Number(text);
  }

  /**
   * Removes all products from Wishlist
   */
  public async cleanWishlist() {
    await this.page.getByRole("link", { name: /Видалити всі/ }).click();
  }
}
