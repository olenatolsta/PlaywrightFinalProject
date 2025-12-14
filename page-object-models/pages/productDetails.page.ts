import { BaseHelper } from "@helpers/base.helper";
import { Locator, Page } from "@playwright/test";
import { publicDecrypt } from "crypto";

export class ProductDetailsPage extends BaseHelper {
  public readonly catalogSection: Locator;

  public constructor(page: Page) {
    super(page);
    this.catalogSection = page
      .locator(`[class^='menu-item dropdown']`)
      .filter({ hasText: "Смартфони, Телефони" });
  }

  /**
   * Opens a determined catalog section and a first random product details page
   */
  public async openProductDetails() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.locator("h4").locator("a").nth(0).click();
  }

  /**
   * Opens and plays a full screen image gallery on Product Details
   */
  public async checkFullScreenImageGallery() {
    //Opens image gallery
    await this.page.locator(".img-container").nth(0).click();
    //Performs three clicks in order to see the next images
    for (let i = 0; i < 3; i++) {
      await this.page.locator(`button[class*='button--arrow--next']`).click();
      await this.page.waitForLoadState("domcontentloaded");
    }
    //Performs three clicks in order to see the previous images
    for (let i = 0; i < 3; i++) {
      await this.page.locator(`button[class*='button--arrow--prev']`).click();
      await this.page.waitForLoadState("domcontentloaded");
    }
    //Closes the image gallery
    await this.page.locator(`button[class*='button--close']`).click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Opens and plays a regular screen image gallery on Product Details
   */
  public async checkRegularScreenImageGallery() {
    //Performs three clicks in order to see the next images
    for (let i = 0; i < 2; i++) {
      await this.page
        .locator(`[class*="image-additional"]`)
        .locator(`[aria-label="Next slide"]`)
        .click();
    }
    //Performs three clicks in order to see the previous images
    for (let i = 0; i < 2; i++) {
      await this.page
        .locator(`[class*="image-additional"]`)
        .locator(`[aria-label="Previous slide"]`)
        .click();
    }
  }

  /**
   * Matches the specified string with the name of a Tab and then clicks and opens it.
   * @param {string} sectionName - Specifies the name of the structure item.
   */
  public async getTab(tab: string): Promise<Locator> {
    const tabLocator = this.page
      .locator('a[role="tab"]')
      .filter({ hasText: tab });
    return tabLocator;
  }

  /**
   * Adds a Product to Wishlist via UI from Detail View
   */
  public async addProductToWishListUI() {
    await this.page
      .locator(`[class="sticky-top"]`)
      .locator(`button[type="submit"]`)
      .filter({ hasText: `favorite` })
      .click();
  }
}
