import { user1Test as test, expect } from "@fixtures/fixtures";
import * as Data from "@helpers/test-data.helper";

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
      async ({ pageManager, openBaseUrl }) => {
        await openBaseUrl;

        await test.step(`Search for a ${productName} and set price limits`, async () => {
          //Setup price limits, categories, brands, change greed to list view
          //Search for a specific product
          await pageManager.onProductPage().searchForProduct(productName);
          //Set price limits
          await pageManager
            .onProductPage()
            .setPriceLimits(
              Data.productDetails.minPrice,
              Data.productDetails.maxPrice
            );
        });

        await test.step(`Select a ${category} and change greed to list view`, async () => {
          await pageManager.onProductPage().setCategoryFilters(productName);
          //Select brands in the filter
          await pageManager.onProductPage().selectBrands(brands);
          //Change Greed view to List view
          await pageManager.onProductPage().changeGreedToListView();
        });

        await test.step(`Add several products into a cart`, async () => {
          await pageManager.openCartPage();
          const currentCount = await pageManager
            .onCartPage()
            .calculateProductsInCart();
          await pageManager.closeCartPage();
          const added = await pageManager
            .onProductPage()
            .addProductsToCart(Data.productDetails.numberOfProducts);
          const expectedCount = currentCount + added;
          //Make sure the number of products corresponds the number next to the cart
          await pageManager.reloadPage();
          const countedProducts = await pageManager.onProductPage().cartCounter;
          await expect(countedProducts).toBe(String(expectedCount));
          //await pageManager.onCartPage().closePopupButton.click();
        });

        await test.step(`Remove every second product from the cart`, async () => {
          await pageManager.openCartPage();
          const productsNumber = await Data.productDetails.numberOfProducts;
          const productsAfterDelete = await pageManager
            .onCartPage()
            .removeEachSecondProductFromBasket(productsNumber);
          //Make sure the expected number of products is removed from the cart
          await expect(
            pageManager.onProductPage().actualNumberOfProducts
          ).toHaveCount(productsAfterDelete);
          await pageManager.closeCartPage();
        });

        await test.step(`Remove all products from the cart`, async () => {
          await pageManager.openCartPage();
          let remainingProducts = await pageManager
            .onCartPage()
            .calculateProductsInCart();
          await pageManager
            .onCartPage()
            .removeAllProductsFromCart(remainingProducts);
          await pageManager.closeCartPage();
          //Make sure all the products are removed from the basket
          await expect(
            pageManager.onProductPage().actualNumberOfProducts
          ).toHaveCount(0);
        });
      }
    );
  }
});
