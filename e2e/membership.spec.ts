import { test, expect } from '@playwright/test';

test.describe('Membership Purchase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membership');
  });

  test('Page renders with heading and perks', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Become a Paid Member/i,
    });
    await expect(heading).toBeVisible();

    const perksList = page.getByTestId('membership-perks');
    await expect(perksList).toBeVisible();

    const listItems = perksList.locator('li');
    await expect(listItems).not.toHaveCount(0);
  });

  test('Page provides purchase button which leads to login redirect', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Purchase Membership' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Purchase Membership' }).click();
    await page.waitForURL(
      'https://login.microsoftonline.com/44467e6f-462c-4ea2-823f-7800de5434e3/oauth2/v2.0/authorize?client_id=d64e9c50-d144-4b4a-a315-ad2ed456c37**'
    );
  });
});

test.describe('Membership Check', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membership/check');
  });

  test('Page renders with heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Check Paid Membership');
  });
  test('Page provides check button which leads to login redirect', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Check Membership' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Check Membership' }).click();
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
