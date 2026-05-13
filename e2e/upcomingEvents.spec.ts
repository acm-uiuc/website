import { test, expect } from '@playwright/test';

const futureDateTime = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setSeconds(0, 0);
  return d.toISOString().replace(/\.\d{3}Z$/, '');
};

test.describe('UpcomingEvents empty state', () => {
  test('shows compact empty banner when no featured events', async ({
    page,
  }) => {
    await page.route('**/api/v1/events**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    );

    await page.goto('/');

    const banner = page.getByText(
      /No featured events right now — check back soon\./i
    );
    await expect(banner).toBeVisible();

    const seeAll = page.getByRole('link', { name: /See all events/i });
    await expect(seeAll).toBeVisible();
    await expect(seeAll).toHaveAttribute('href', '/calendar');
  });

  test('See all events link navigates to /calendar', async ({ page }) => {
    await page.route('**/api/v1/events**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    );

    await page.goto('/');
    await page.getByRole('link', { name: /See all events/i }).click();
    await expect(page).toHaveURL(/\/calendar$/);
  });

  test('renders event cards (not the empty banner) when events are featured', async ({
    page,
  }) => {
    const mockEvent = {
      id: 'evt-e2e-1',
      title: 'E2E Featured Event',
      description: 'A featured event for e2e testing.',
      start: futureDateTime(3),
      end: futureDateTime(3),
      featured: true,
      host: 'ACM',
      location: 'Siebel CS',
    };

    await page.route('**/api/v1/events**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([mockEvent]),
      })
    );

    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'E2E Featured Event' })
    ).toBeVisible();
    await expect(page.getByText(/No featured events right now/i)).toHaveCount(
      0
    );
  });
});
