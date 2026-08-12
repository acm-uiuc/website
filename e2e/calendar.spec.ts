import { test, expect, type Page } from '@playwright/test';

/** Midday today, so timezone conversion keeps the event on the visible day. */
const todayAtNoon = () => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.toISOString().replace(/\.\d{3}Z$/, '');
};

const baseEvent = {
  id: 'evt-e2e-calendar',
  title: 'E2E Calendar Event',
  description: 'A calendar event for e2e testing.',
  start: todayAtNoon(),
  end: todayAtNoon(),
  host: 'ACM',
  location: 'Siebel CS',
};

const mockEvents = (page: Page, events: unknown[]) =>
  page.route('**/api/v1/events**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(events),
    })
  );

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

  test('event detail panel shows an RSVP link for rsvpEnabled events', async ({
    page,
  }) => {
    await mockEvents(page, [
      { ...baseEvent, title: 'E2E RSVP Calendar Event', rsvpEnabled: true },
    ]);

    await page.goto('/calendar');
    await page.getByText('E2E RSVP Calendar Event').first().click();

    await expect(page.getByRole('heading', { level: 4 })).toHaveText(
      'E2E RSVP Calendar Event'
    );

    const rsvp = page.getByRole('link', { name: /^RSVP$/ });
    await expect(rsvp).toBeVisible();
    await expect(rsvp).toHaveAttribute('href', 'https://acm.gg/rsvp');
    await expect(rsvp).toHaveAttribute('target', '_blank');
  });

  test('event detail panel omits the RSVP link when rsvpEnabled is false', async ({
    page,
  }) => {
    await mockEvents(page, [
      { ...baseEvent, title: 'E2E No RSVP Calendar Event', rsvpEnabled: false },
    ]);

    await page.goto('/calendar');
    await page.getByText('E2E No RSVP Calendar Event').first().click();

    await expect(page.getByRole('heading', { level: 4 })).toHaveText(
      'E2E No RSVP Calendar Event'
    );
    await expect(page.getByRole('link', { name: /^RSVP$/ })).toHaveCount(0);
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
