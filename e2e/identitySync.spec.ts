import { test, expect } from '@playwright/test';

test.describe('Identity Sync', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/sync');
  });

  test('Page renders with heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /Sync Identity/i });
    await expect(heading).toContainText('Sync Identity');
    const desc = page.locator('p').first();
    await expect(desc).toContainText(
      'Use this tool to setup your account, or update your ACM account with details from your Illinois NetID.'
    );
  });
  test('Page provides sync button which leads to login redirect', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Sync Identity' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Sync Identity' }).click();
    await page.waitForURL(
      'https://login.microsoftonline.com/44467e6f-462c-4ea2-823f-7800de5434e3/oauth2/v2.0/authorize?client_id=d64e9c50-d144-4b4a-a315-ad2ed456c37**'
    );
  });
  test('Copyright section is visible', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    await expect(
      page.getByText(`© ${currentYear} ACM @ UIUC. All rights reserved.`)
    ).toBeVisible();
  });
});
