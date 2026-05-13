import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero renders with heading', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /UIUC's Hub for Everything CS\./i,
    });
    await expect(heading).toBeVisible();
    await expect(page).toHaveTitle('ACM @ UIUC');
  });

  test('Join ACM and Donate buttons are visible', async ({ page }) => {
    await expect(page.locator('#hero-join-btn')).toBeVisible();
    await expect(page.locator('a[href*="acm.gg/donate"]')).toBeVisible();
  });

  test('Join ACM button opens the Join modal', async ({ page }) => {
    // The hero button dispatches a custom event that the navbar listens for
    // after it hydrates. Retry the click until the navbar's listener is
    // registered and the modal actually opens.
    await expect(async () => {
      await page.locator('#hero-join-btn').click();
      await expect(page.getByText('Join ACM @ UIUC')).toBeVisible({
        timeout: 1000,
      });
    }).toPass({ timeout: 10_000 });
  });

  test('Sponsors section has all 5 sponsors', async ({ page }) => {
    await expect(page.getByText('Our Sponsors')).toBeVisible();

    const sponsors = ['stripe', 'capitalone', 'atlassian', 'citadel', 'visa'];
    for (const sponsor of sponsors) {
      await expect(page.locator(`img[src*="${sponsor}"]`)).toBeVisible();
    }
  });
  test('Copyright section is visible', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    await expect(
      page.getByText(`© ${currentYear} ACM @ UIUC. All rights reserved.`)
    ).toBeVisible();
  });
});
