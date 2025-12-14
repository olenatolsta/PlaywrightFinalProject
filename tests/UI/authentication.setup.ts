import { test as setup } from "@playwright/test";
import { PageManager } from "@page-manager";
import environment from "@utilities/environment";
import {
  StorageStateUser1,
  StorageStateUser2,
} from "@helpers/test-data.helper";

// The logins need to be performed in the setup phase of the test suite to create the storage state for the users.

setup("authenticate user 1 ", async ({ page }, test) => {
  const manager = new PageManager(page);

  await manager.login(environment.USER_1_EMAIL, environment.USER_1_PASSWORD);
  StorageStateUser1;
});

setup("authenticate user 2 ", async ({ page }) => {
  const manager = new PageManager(page);

  await manager.login(
    environment.USER_2_EMAIL,
    environment.USER_2_PASSWORD,
    StorageStateUser2
  );
});
