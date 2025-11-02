import { Page, Locator } from '@playwright/test';

export const StorageState = 'playwright/.authentication/storageState.json';

export class testDataHelper{
  protected readonly page: Page;
  public constructor(page: Page){
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

export const productDetails = {
  productName: 'планшет',
  minPrice: 500,
  maxPrice: 100000,
  brands: ['ACER', 'APPLE', 'Amazon'],
  numberOfProducts: 6,
}
