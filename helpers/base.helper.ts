import { Page, Locator } from '@playwright/test';

export class BaseHelper{
  protected readonly page: Page;
  
  public constructor(page: Page){
    this.page = page;
  }
}