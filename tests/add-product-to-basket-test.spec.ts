import { test, expect } from "@fixtures/fixtures";
import * as Data from "@helpers/test-data.helper";
import environment from "@utilities/environment";
import { PageManager } from "@page-manager";


test.describe(`Tests related to filling in the basket with random products and removing some products from it`, () => {
  test(
    `OTTest-001 Setup filters and add several products into a basket`,
    { tag: "@smoke @OTTest-001" },
    async ({ pageManager }) => {
      await pageManager.openHomePage();

      await test.step(`Setup price limits, categories, brands, change greed to list view`, async () => {
        //Search for a specific product
        await pageManager
          .onHomePage()
          .searchForProduct(Data.productDetails.productName);
        //Set price limits
        await pageManager
          .onHomePage()
          .setPriceLimits(
            Data.productDetails.minPrice,
            Data.productDetails.maxPrice
          );
        //Select categories in the filter
        await pageManager
          .onHomePage()
          .setCategoryFilters(Data.productDetails.productName);
        //Select brands in the filter
        await pageManager.onHomePage().selectBrands(Data.productDetails.brands);
        //Change Greed view to List view
        await pageManager.onHomePage().changeGreedToListView();
      });
      await test.step(`Add several products into a basket`, async () => {
        await pageManager
          .onHomePage()
          .addProductsToBasket(Data.productDetails.numberOfProducts);
        //Make sure the number of products corresponds the number next to a cart
        await expect(pageManager.onHomePage().cartCounter).toHaveText(
          String(Data.productDetails.numberOfProducts)
        );
        await pageManager.onHomePage().navigateToBasket();
        //Make sure the expected number of products is added to the basket
        await expect(
          pageManager.onHomePage().actualNumberOfProducts
        ).toHaveCount(Data.productDetails.numberOfProducts);
      });
      await test.step(`Remove every second product from the basket`, async () => {
        let remainingProducts = await pageManager
          .onHomePage()
          .removeEachSecondProductFromBasket(
            Data.productDetails.numberOfProducts
          );
        //Make sure the expected number of products is removed from the basket
        await expect(
          pageManager.onHomePage().actualNumberOfProducts
        ).toHaveCount(remainingProducts);
      });
    }
  );
});
