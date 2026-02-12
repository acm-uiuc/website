import { test, expect } from '@playwright/test';
import { getOrgsByType, OrgType } from '@acm-uiuc/js-shared';

const sigs = getOrgsByType(OrgType.SIG);
const committees = getOrgsByType(OrgType.COMMITTEE);

const mockOrgs = [
  {
    id: 'S01',
    name: 'TestSIG',
    type: 'sig',
    description: 'A test SIG',
    email: 'test@example.com',
    website: 'https://example.com',
    leads: [
      {
        username: 'loba1',
        name: 'Nikolai Lobachevsky',
        title: 'Lead',
        nonVotingMember: false,
      },
      {
        username: 'euler2',
        name: 'Leonard Euler',
        title: 'Lead',
        nonVotingMember: false,
      },
      { username: 'devktest3', title: 'Treasurer', nonVotingMember: true },
    ],
  },
  {
    id: 'S02',
    name: 'NoLeadsSIG',
    type: 'sig',
    description: 'A SIG with no leads',
    leads: [],
  },
];

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
    await expect(commTab).toHaveAttribute('aria-selected', 'true');
    const count = await visibleCards.count();
    expect(count).toEqual(1);

    // All visible cards should match the search term
    for (let i = 0; i < count; i++) {
      const text = await visibleCards.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('infrastructure committee');
    }
  });
});

test.describe('Organization card flip', () => {
  test('clicking a card flips it to show leads', async ({ page }) => {
    await page.goto('/');

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
  });

  test('clicking the back flips the card back to front', async ({ page }) => {
    await page.goto('/');

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

  test('clicking social links does not flip the card', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('.flip-card').first();
    // Click a link inside the card (stopPropagation should prevent flip)
    const link = card.locator('.flip-card-front a').first();
    await expect(link).toBeVisible();
    await link.click();

    // Card should NOT have flipped
    await expect(card.locator('.flip-card-back')).toBeHidden();
  });

  test('leads without a name fall back to username', async ({ page }) => {
    await page.route('**/api/v1/organizations', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrgs),
      })
    );
    await page.goto('/');
    await expect(
      page.locator('[data-testid="org-grid"]').getByText('TestSIG')
    ).toBeVisible();

    const card = page.locator('.flip-card').first();
    await card.click();
    await page.waitForTimeout(700);

    const backFace = card.locator('.flip-card-back');
    // devktest3 has no name, should show username
    await expect(backFace.getByText('devktest3')).toBeVisible();
    await expect(backFace.getByText('Treasurer')).toBeVisible();
  });

  test('card with no leads shows fallback message', async ({ page }) => {
    await page.route('**/api/v1/organizations', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrgs),
      })
    );
    await page.goto('/');
    await expect(
      page.locator('[data-testid="org-grid"]').getByText('TestSIG')
    ).toBeVisible();

    const card = page.locator('.flip-card').nth(1);
    await card.click();
    await page.waitForTimeout(700);

    await expect(
      card.locator('.flip-card-back').getByText('No leads listed')
    ).toBeVisible();
  });
});
