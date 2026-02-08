import { test, expect } from '@playwright/test';
import { getOrgsByType, OrgType } from '@acm-uiuc/js-shared';

const sigs = getOrgsByType(OrgType.SIG);
const committees = getOrgsByType(OrgType.COMMITTEE);

test.describe('Org list pre-compilation', () => {
  test('SSG cards visible while API is pending', async ({ page }) => {
    // Hold the API request open so it never resolves
    let fulfill!: (
      route: Parameters<Parameters<typeof page.route>[1]>[0]
    ) => void;
    await page.route('**/api/v1/organizations', (route) => {
      fulfill = () => route.abort();
    });
    await page.goto('/');

    // SSG cards should be visible immediately (before API responds)
    const cards = page.locator('[data-testid="org-grid"] h3:visible');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(sigs.length);

    for (const org of sigs) {
      await expect(
        page.locator('[data-testid="org-grid"]').getByText(org.name)
      ).toBeAttached();
    }

    // Clean up the dangling request
    fulfill?.({} as never);
  });

  test('API response replaces SSG data', async ({ page }) => {
    const mockName = 'TestSIG-E2E';

    await page.route('**/api/v1/organizations', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'S01',
            name: mockName,
            type: 'sig',
            description: 'A test SIG for e2e',
          },
        ]),
      })
    );
    await page.goto('/');

    // After hydration, the grid should show only the mocked org
    await expect(
      page.locator('[data-testid="org-grid"]').getByText(mockName)
    ).toBeVisible();
    expect(
      await page.locator('[data-testid="org-grid"] h3:visible').count()
    ).toBe(1);
  });

  test('Our Groups heading is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Our Groups')).toBeVisible();
  });

  test('SIGs tab shows correct count', async ({ page }) => {
    await page.goto('/');

    const sigTab = page.getByRole('button', { name: /SIGs/i });
    await expect(sigTab).toBeVisible();
    const sigText = await sigTab.textContent();
    const match = sigText?.match(/(\d+)/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBe(sigs.length);
  });

  test('SIGs tab renders correct number of cards', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('[data-testid="org-grid"] h3:visible');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(sigs.length);
  });

  test('Committees tab shows correct count', async ({ page }) => {
    await page.goto('/');

    const committeesTab = page.getByRole('button', {
      name: /Committees/i,
    });
    await expect(committeesTab).toBeVisible();
    const text = await committeesTab.textContent();
    const match = text?.match(/(\d+)/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBe(committees.length);
  });

  test('Committees tab renders correct number of cards', async ({ page }) => {
    await page.goto('/');

    const committeesTab = page.getByRole('button', {
      name: /Committees/i,
    });
    await committeesTab.click();

    const cards = page.locator('[data-testid="org-grid"] h3:visible');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(committees.length);
  });

  test('search filter works', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('What are you looking for?');
    await searchInput.fill('SIGPwny');

    // Wait for debounce (200ms) + rendering
    await page.waitForTimeout(500);

    const visibleCards = page.locator('[data-testid="org-grid"] h3:visible');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    // All visible cards should match the search term
    for (let i = 0; i < count; i++) {
      const text = await visibleCards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('sigpwny');
    }
  });
  test('search filter switches the active tab', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('What are you looking for?');
    await searchInput.fill('Infrastructure');

    // Wait for debounce (200ms) + rendering
    await page.waitForTimeout(500);

    const visibleCards = page.locator('[data-testid="org-grid"] h3:visible');

    const commTab = page.getByRole('button', { name: /Committees/i });
    await expect(commTab).toHaveClass(/bg-navy-900/);
    const count = await visibleCards.count();
    expect(count).toEqual(1);

    // All visible cards should match the search term
    for (let i = 0; i < count; i++) {
      const text = await visibleCards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('infrastructure committee');
    }
  });
});
