import { test, expect } from '@playwright/test';

test.describe('Calendar page', () => {
  test('page loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/calendar');
    await expect(
      page.getByRole('heading', { name: /Calendar/i })
    ).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('calendar grid container renders', async ({ page }) => {
    await page.goto('/calendar');
    await expect(page.locator('.rbc-calendar')).toBeVisible();
  });

  test('navigation controls are present', async ({ page }) => {
    await page.goto('/calendar');

    // View switcher dropdown
    await expect(page.locator('select').first()).toBeVisible();

    // Back/forward navigation buttons (chevron icons)
    const navButtons = page.locator('button:has(svg[class*="lucide"])');
    expect(await navButtons.count()).toBeGreaterThanOrEqual(2);
  });
});
