import { test, expect } from "@playwright/test";
import { WishlistController } from "@api/WishlistController";

test("Add and remove product to/from the wishlist", async ({ request }) => {
  const wishlist = new WishlistController(request);
  const productId = await wishlist.getProductIdFromPage(
    "https://sota.store/ua/planshety-noutbuki-pk/orgtechnika/orgtechnika-printer"
  );

  // Add and make sure the product is added to WishList
  await wishlist.addProduct(productId.toString());
  expect(await wishlist.contains(productId.toString())).toBeTruthy();

  // Remove and make sure the product is removed from WishList
  await wishlist.removeProduct(productId.toString());
  expect(await wishlist.contains(productId.toString())).toBeFalsy();
});
