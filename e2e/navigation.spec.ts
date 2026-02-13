import { test, expect } from '@playwright/test';

const internalPages = [
  { href: '/about', heading: /About/i },
  { href: '/calendar', heading: /Calendar/i },
  { href: '/store', heading: /All Products/i },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navbar has logo and all nav links', async ({ page }) => {
    await expect(page.locator('a[href="/"] img[alt="ACM @ UIUC"]')).toHaveCount(
      2
    );

    const navLinks = [
      { name: 'About', href: '/about' },
      { name: 'Calendar', href: '/calendar' },
      { name: 'Store', href: '/store' },
      { name: 'Resources', href: '/resources' },
    ];

    for (const link of navLinks) {
      await expect(page.locator(`nav a[href="${link.href}"]`)).toBeVisible();
    }

    await expect(page.locator('nav a[href*="illinoiscs.wiki"]')).toBeVisible();
  });

  for (const p of internalPages) {
    test(`Internal nav link navigates to ${p.href}`, async ({ page }) => {
      await page.goto('/');
      await page.locator(`nav a[href="${p.href}"]`).click();
      await expect(page).toHaveURL(new RegExp(p.href));
      await expect(
        page.getByRole('heading', { name: p.heading }).first()
      ).toBeVisible();
    });
  }

  test('Join Now button opens Join modal', async ({ page }) => {
    await page.getByRole('button', { name: /Join Now/i }).click();
    await expect(page.getByText('Join ACM @ UIUC')).toBeVisible();
  });
});
