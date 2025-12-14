import { test, expect } from "@fixtures/fixtures";
import environment from "@utilities/environment";

test.describe(`Tests related to product Details`, () => {
  test(
    `OTTest-003 Select first product and check controls inside Detail View`,
    { tag: "@smoke @OTTest-003" },
    async ({ pageManager, openBaseUrl }) => {
      await openBaseUrl;

      await test.step(`Open child section and a first product in the list`, async () => {
        await pageManager.openParentSection(environment.PARENT_SECTION);
        await pageManager.openChildSection(environment.CHILD_SECTION);
        await pageManager.onProductDetailsPage().openProductDetails();
      });

      await test.step(`Make sure an image gallery is functioning as expected`, async () => {
        await pageManager.onProductDetailsPage().checkFullScreenImageGallery();
        await pageManager
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
            await pageManager.onProductDetailsPage().getTab(tab)
          ).toBeVisible();
        }
      });
      await test.step(`Make sure a product can be added and removed to/from Wishlist via Detail View`, async () => {
        await pageManager.onProductDetailsPage().addProductToWishListUI();
        await pageManager.openWishlist();
        // Make sure the Whishlist is not empty
        const count = await pageManager
          .onProductDetailsPage()
          .getWishlistProductsCount();
        await expect(count).toBeGreaterThan(0);
      });
      // Remove all products from Wishliast
      await pageManager.onProductDetailsPage().cleanWishlist();
      // Make sure the Wishlist is blank and an appropriate message is displayed
      await expect(
        pageManager.onProductDetailsPage().wishlistEmptyMessage
      ).toBeVisible();
    }
  );
});
