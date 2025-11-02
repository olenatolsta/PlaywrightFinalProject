import { test as setup } from '@playwright/test';
import { PageManager } from '@page-manager';
import environment from '@utilities/environment';

// The logins need to be performed in the setup phase of the test suite to create the storage state for the users.

setup('authenticate user wrong', async ({ page }) => {
  const manager = new PageManager(page);

  await manager.login(environment.USER_NAME, environment.PASSWORD_CORRECT);
});

