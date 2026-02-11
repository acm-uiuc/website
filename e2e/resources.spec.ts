import { test, expect } from '@playwright/test';

test.describe('Resources', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('resources/');
  });

  test('Heading renders with description', async ({ page }) => {
    const heading = page.getByTestId('content-title');
    const description = page.getByTestId('content-description');
    await expect(heading).toContainText('Resources');
    await expect(description).toContainText(
      'Learn about resources provided to ACM @ UIUC members'
    );
  });

  test('Copyright section is visible', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    await expect(
      page.getByText(`© ${currentYear} ACM @ UIUC. All rights reserved.`)
    ).toBeVisible();
  });
});
