import { Locator, Page } from "@playwright/test";
import { BaseHelper } from "@helpers/base.helper";

export class CartPage extends BaseHelper {
    public constructor(page: Page) {
    super(page);
  }
}