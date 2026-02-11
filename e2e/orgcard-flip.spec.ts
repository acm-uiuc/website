import { test, expect } from '@playwright/test';

const mockOrgs = [
  {
    id: 'TEST01',
    name: 'TestSIG',
    type: 'sig',
    description: 'A test SIG',
    email: 'test@example.com',
    website: 'https://example.com',
    leads: [
      {
        username: 'alice1',
        name: 'Alice Smith',
        title: 'Chair',
        nonVotingMember: false,
      },
      {
        username: 'bob2',
        name: 'Bob Jones',
        title: 'Vice Chair',
        nonVotingMember: false,
      },
      { username: 'charlie3', title: 'Treasurer', nonVotingMember: true },
    ],
  },
  {
    id: 'TEST02',
    name: 'NoLeadsSIG',
    type: 'sig',
    description: 'A SIG with no leads',
    leads: [],
  },
];

test.describe('Organization card flip', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/v1/organizations', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrgs),
      })
    );
    await page.goto('/');
    // Wait for mock data to replace SSG data (same pattern as orglist.spec.ts)
    await expect(
      page.locator('[data-testid="org-grid"]').getByText('TestSIG')
    ).toBeVisible();
    expect(
      await page.locator('[data-testid="org-grid"] h3:visible').count()
    ).toBe(2);
  });

  test('clicking a card flips it to show leads', async ({ page }) => {
    const card = page.locator('.flip-card').first();

    // Back face should be hidden before flip
    await expect(card.locator('.flip-card-back')).toBeHidden();

    // Click to flip
    await card.click();
    await page.waitForTimeout(700);

    // Back face should now be visible with lead data
    const backFace = card.locator('.flip-card-back');
    await expect(backFace).toBeVisible();
    await expect(backFace.getByText('Leadership')).toBeVisible();
    await expect(backFace.getByText('Alice Smith')).toBeVisible();
    await expect(backFace.getByText('Chair', { exact: true })).toBeVisible();
    await expect(backFace.getByText('Bob Jones')).toBeVisible();
  });

  test('clicking the back flips the card back to front', async ({ page }) => {
    const card = page.locator('.flip-card').first();

    // Flip to back
    await card.click();
    await page.waitForTimeout(700);
    await expect(card.locator('.flip-card-back')).toBeVisible();

    // Flip back to front
    await card.click();
    await page.waitForTimeout(700);

    await expect(card.locator('.flip-card-front h3')).toBeVisible();
    await expect(card.locator('.flip-card-back')).toBeHidden();
  });

  test('leads without a name fall back to username', async ({ page }) => {
    const card = page.locator('.flip-card').first();
    await card.click();
    await page.waitForTimeout(700);

    const backFace = card.locator('.flip-card-back');
    // charlie3 has no name, should show username
    await expect(backFace.getByText('charlie3')).toBeVisible();
    await expect(backFace.getByText('Treasurer')).toBeVisible();
  });

  test('card with no leads shows fallback message', async ({ page }) => {
    const card = page.locator('.flip-card').nth(1);
    await card.click();
    await page.waitForTimeout(700);

    await expect(
      card.locator('.flip-card-back').getByText('No leads listed')
    ).toBeVisible();
  });

  test('clicking social links does not flip the card', async ({ page }) => {
    const card = page.locator('.flip-card').first();
    // Click a link inside the card (stopPropagation should prevent flip)
    const link = card.locator('.flip-card-front a').first();
    await expect(link).toBeVisible();
    await link.click();

    // Card should NOT have flipped
    await expect(card.locator('.flip-card-back')).toBeHidden();
  });

  test('flip card shows tap to flip back hint', async ({ page }) => {
    const card = page.locator('.flip-card').first();
    await card.click();
    await page.waitForTimeout(700);

    await expect(
      card.locator('.flip-card-back').getByText('Tap to flip back')
    ).toBeVisible();
  });
});
