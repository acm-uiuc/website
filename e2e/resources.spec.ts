import { test, expect } from '@playwright/test';

const expectedSections = ['ACM Paid Member Guide', 'CS Cares', 'Feedback'];
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
  for (const heading of expectedSections) {
    test(`${heading} section is present`, async ({ page }) => {
      const header = page.getByRole('heading', { name: heading });
      expect(header).toContainText(heading);
    });
  }
  test('Copyright section is visible', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    await expect(
      page.getByText(`© ${currentYear} ACM @ UIUC. All rights reserved.`)
    ).toBeVisible();
  });
});
