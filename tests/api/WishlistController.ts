import { APIRequestContext, expect } from "@playwright/test";
import environment from "@utilities/environment";

export class WishlistController {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private async addRemoveProduct(productId: string) {
    const response = await this.request.post(
      `${environment.BASE_URL}/account-wishlist-add`,
      {
        //Pass payload
        form: { product_id: productId },
      }
    );
    return await response.text();
  }

  /**
   * Add product to wishlist
   */
  async addProduct(productId: string) {
    return await this.addRemoveProduct(productId);
  }

  /**
   * Remove product from wishlist
   */
  async removeProduct(productId: string) {
    return await this.addRemoveProduct(productId);
  }

  /**
   * Check if product is present on wishlist page
   */
  async contains(productId: string): Promise<boolean> {
    const url = `${environment.BASE_URL}/account-wishlist`;
    const response = await this.request.get(url);
    const html = await response.text();

    return html.includes(`Код:`) && html.includes(productId);
  }

  /**
   * Return an existing product_id
   */
  async getProductIdFromPage(url: string): Promise<string> {
    const response = await this.request.get(url);
    const html = await response.text();
    const match = html.match(/Код:\s*<i>(\d+)<\/i>/);

    return match ? match[1] : null;
  }
}
