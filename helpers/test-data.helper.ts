import { Page } from "@playwright/test";

export class testDataHelper {
  protected readonly page: Page;
  public constructor(page: Page) {
    this.page = page;
  }
}
/**
 * Generates a unique string of random numbers.
 * @returns {string} Returns a string of random numbers.
 */
export function generateRandomString(): string {
  const time = new Date().getTime();
  const number = Math.floor(Math.random() * 1000);
  return `${time}-${number}`;
}

//description of a product to filter for - TO Delete?
export const productDetails = {
  productName: "смартфон samsung galaxy",
  minPrice: 500,
  maxPrice: 100000,
  brands: ["ACER", "APPLE", "Amazon"],
  numberOfProducts: 6,
};

//User Details are stored in data-helper in order to perform a registration check with invalid data
//It's not desirable to create a lot of fake users for a real commercial web-site
export const userDetails = {
  userName: generateRandomString().concat("Anton"),
  userFamilyName: generateRandomString().concat("Hopko"),
  email: generateRandomString().concat("_email@gmail.com"),
  invalidEmail: "@gmail.com",
  phoneNumber: "+38097546941",
  invalidPhoneNumber: "+480test3123",
  password: "Pfennert469181@!",
  invalidPassword: "Test",
};

//those are already registered users
export const StorageStateUser1 = "playwright/.authentication/user1.json";
export const StorageStateUser2 = "playwright/.authentication/user2.json";
