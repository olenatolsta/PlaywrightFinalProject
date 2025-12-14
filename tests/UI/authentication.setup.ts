import { test as setup } from "@playwright/test";
import { PageManager } from "@page-manager";
import environment from "@utilities/environment";
import {
  StorageStateUser1,
  StorageStateUser2,
} from "@helpers/test-data.helper";

setup("Authenticate User 1", async ({ page }) => {
  const manager = new PageManager(page);

  await manager.login(environment.USER_1_EMAIL, environment.USER_1_PASSWORD);
  await page.context().storageState({ path: StorageStateUser1 });
});

setup("Authenticate User 2", async ({ page }) => {
  const manager = new PageManager(page);

  await manager.login(environment.USER_2_EMAIL, environment.USER_2_PASSWORD);
  await page.context().storageState({ path: StorageStateUser2 });
});
