import { test, expect } from "@fixtures/fixtures";
import * as Data from "@helpers/test-data.helper";
import { PageManager } from "@page-manager";
import { createPageManagerForUser1 } from "@pages/login.page";

/*An example of parametrized test*/
/* 'Configuration' test are executed sequentially to prevent errors in added number of products. */
test.describe.configure({ mode: "serial" });
test.describe(`Filtering product, adding and removing products from cart`, () => {
  const testConfigs = [
    {
      productName: "планшет",
      category: "Планшети",
      brands: ["ACER", "APPLE", "Amazon"],
    },
    {
      productName: "смартфон",
      category: "Смартфони, Телефони",
      brands: ["Apple", "ASUS"],
    },
    { productName: "ноутбук", category: "Ноутбуки", brands: ["Asus"] },
  ];
  for (const { productName, category, brands } of testConfigs) {
    test(
      `OTTest-002 Setup filters and add ${productName} into a basket`,
      { tag: "@smoke @OTTest-002" },
      async ({ browser }) => {
        const user1PageManager = await createPageManagerForUser1(browser);
        await test.step(`Search for a ${productName} and set price limits`, async () => {
          //Setup price limits, categories, brands, change greed to list view
          //Search for a specific product
          await user1PageManager.onProductPage().searchForProduct(productName);
          //Set price limits
          await user1PageManager
            .onProductPage()
            .setPriceLimits(
              Data.productDetails.minPrice,
              Data.productDetails.maxPrice
            );
        });

        await test.step(`Select a ${category} and change greed to list view`, async () => {
          await user1PageManager
            .onProductPage()
            .setCategoryFilters(productName);
          //Select brands in the filter
          //await new Promise((resolve) => setTimeout(resolve, 1000));
          await user1PageManager.onProductPage().selectBrands(brands);
          //Change Greed view to List view
          //await new Promise((resolve) => setTimeout(resolve, 1000));
          await user1PageManager.onProductPage().changeGreedToListView();
        });

        await test.step(`Add several products into a cart`, async () => {
          await user1PageManager.openCartPage();
          const currentCount = await user1PageManager
            .onCartPage()
            .calculateProductsInCart();
          const added = await user1PageManager
            .onProductPage()
            .addProductsToCart(Data.productDetails.numberOfProducts);
          const expectedCount = currentCount + added;
          //Make sure the number of products corresponds the number next to the cart
          await user1PageManager.reloadPage();
          const countedProducts =
            await user1PageManager.onProductPage().cartCounter;
          await expect(countedProducts).toBe(String(expectedCount));
          //await user1PageManager.onCartPage().closePopupButton.click();
        });

        await test.step(`Remove every second product from the cart`, async () => {
          await user1PageManager.openCartPage();
          const productsNumber = await Data.productDetails.numberOfProducts;
          const productsAfterDelete = await user1PageManager
            .onCartPage()
            .removeEachSecondProductFromBasket(productsNumber);
          //Make sure the expected number of products is removed from the cart
          await expect(
            user1PageManager.onProductPage().actualNumberOfProducts
          ).toHaveCount(productsAfterDelete);
        });

        await test.step(`Remove all products from the cart`, async () => {
          let remainingProducts = await user1PageManager
            .onCartPage()
            .calculateProductsInCart();
          await user1PageManager
            .onCartPage()
            .removeAllProductsFromCart(remainingProducts);
          //Make sure all the products are removed from the basket
          await expect(
            user1PageManager.onProductPage().actualNumberOfProducts
          ).toHaveCount(0);
        });
      }
    );
  }
});
