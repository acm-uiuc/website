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

const feedLink = (page: Page) =>
  page.getByRole('link', { name: /^https:\/\/ical\.acm\.illinois\.edu/ });

const openCalendarModal = async (page: Page) => {
  const heading = page.getByRole('heading', { name: /^Subscribe to/ });
  await expect(async () => {
    if (!(await heading.isVisible())) {
      await page.getByTestId('add-to-calendar').click();
    }
    await expect(heading).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
};

test.describe('Calendar subscribe button', () => {
  test('subscribes to every event when no host is filtered', async ({
    page,
  }) => {
    await mockEvents(page, [baseEvent]);
    await page.goto('/calendar');

    await expect(page.getByTestId('add-to-calendar')).toHaveText(
      /Add All Events to Calendar/
    );
    await openCalendarModal(page);

    await expect(
      page.getByRole('heading', { name: 'Subscribe to our calendar' })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Subscribe by SIG or committee/ })
    ).toHaveCount(0);
    await expect(feedLink(page)).toHaveAttribute(
      'href',
      'https://ical.acm.illinois.edu/'
    );
  });

  test('subscribes to only the filtered host', async ({ page }) => {
    await mockEvents(page, [{ ...baseEvent, host: 'SIGPwny' }]);
    await page.goto('/calendar?host=SIGPwny');

    await expect(page.getByTestId('add-to-calendar')).toHaveText(
      /Add SIGPwny to Calendar/
    );
    await openCalendarModal(page);

    await expect(
      page.getByRole('heading', { name: 'Subscribe to SIGPwny events' })
    ).toBeVisible();
    await expect(feedLink(page)).toHaveAttribute(
      'href',
      'https://ical.acm.illinois.edu/SIGPwny'
    );
    await expect(
      page.getByRole('link', { name: /Google Calendar/ })
    ).toHaveAttribute(
      'href',
      /cid=http%3A%2F%2Fical\.acm\.illinois\.edu%2FSIGPwny/
    );
  });

  test('percent-encodes host names containing spaces and pipes', async ({
    page,
  }) => {
    await mockEvents(page, [
      { ...baseEvent, host: 'Reflections | Projections' },
    ]);
    await page.goto(
      `/calendar?host=${encodeURIComponent('Reflections | Projections')}`
    );

    await openCalendarModal(page);
    await expect(feedLink(page)).toHaveAttribute(
      'href',
      'https://ical.acm.illinois.edu/Reflections%20%7C%20Projections'
    );
  });

  test('updates the feed when the host filter changes', async ({ page }) => {
    await mockEvents(page, [baseEvent]);
    await page.goto('/calendar');

    await expect(page.getByTestId('add-to-calendar')).toHaveText(
      /Add All Events to Calendar/
    );

    await page.getByRole('combobox').nth(1).selectOption('SIGCHI');

    await expect(page.getByTestId('add-to-calendar')).toHaveText(
      /Add SIGCHI to Calendar/
    );
    await openCalendarModal(page);
    await expect(feedLink(page)).toHaveAttribute(
      'href',
      'https://ical.acm.illinois.edu/SIGCHI'
    );
  });
});

test.describe('Homepage calendar modal', () => {
  test('offers the major-events feed and points to /calendar for the rest', async ({
    page,
  }) => {
    await page.goto('/');
    await openCalendarModal(page);

    await expect(feedLink(page)).toHaveAttribute(
      'href',
      'https://ical.acm.illinois.edu/ACM'
    );

    const sigLink = page.getByRole('link', {
      name: /Subscribe by SIG or committee/,
    });
    await expect(sigLink).toBeVisible();
    await expect(sigLink).toHaveAttribute('href', '/calendar');
  });
});
