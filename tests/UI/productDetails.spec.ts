import { test, expect } from "@fixtures/fixtures";
import { createPageManagerForUser2 } from "@pages/login.page";
import environment from "@utilities/environment";

test.describe(`Tests related to product Details`, () => {
  test(
    `OTTest-003 Select first product and check controls inside Detail View`,
    { tag: "@smoke @OTTest-003" },
    async ({ browser }) => {
      const user2PageManager = await createPageManagerForUser2(browser);

      await test.step(`Open child section and a first product in the list`, async () => {
        await user2PageManager.openParentSection(environment.PARENT_SECTION);
        await user2PageManager.openChildSection(environment.CHILD_SECTION);
        await user2PageManager.onProductDetailsPage().openProductDetails();
      });

      await test.step(`Make sure an image gallery is functioning as expected`, async () => {
        await user2PageManager
          .onProductDetailsPage()
          .checkFullScreenImageGallery();
        await user2PageManager
          .onProductDetailsPage()
          .checkRegularScreenImageGallery();
      });

      await test.step(`Make sure each Tab on Product Details screen are visible`, async () => {
        const tabs: string[] = [
          "Опис",
          "Характеристики",
          "Відгуки",
          "Рекомендуємо",
          "Статті",
        ];
        for (const tab of tabs) {
          expect(
            await user2PageManager.onProductDetailsPage().getTab(tab)
          ).toBeVisible();
        }
      });
      await test.step(`Make sure a product can be added and removed to/from Wishlist via Detail View`, async () => {
        await user2PageManager.onProductDetailsPage().addProductToWishListUI();
        await user2PageManager.openWishlist();
        // Make sure the Whishlist is not empty
        const count = await user2PageManager
          .onProductDetailsPage()
          .getWishlistProductsCount();
        await expect(count).toBeGreaterThan(0);
      });
      // Remove all products from Wishliast
      await user2PageManager.onProductDetailsPage().cleanWishlist();
      // Make sure the Wishlist is blank and an appropriate message is displayed
      await expect(
        user2PageManager.onProductDetailsPage().wishlistEmptyMessage
      ).toBeVisible();
    }
  );
});
