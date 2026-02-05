import type { ApiV1EventsIdGet200Response } from '@acm-uiuc/core-client';
import { Temporal } from 'temporal-polyfill';

export type Event = ApiV1EventsIdGet200Response;

/**
 * Transforms the dates from Events API into current user timezone.
 * @param events An array of Events from the Core API
 * @returns An array of Events with their time transformed
 */
export const transformEventsApiDates = (events: Event[]): Event[] => {
  const originZone = 'America/Chicago';
  const localZone = Temporal.Now.timeZoneId();

  // Helper to interpret time in Chicago, convert to local, and format
  const toLocal = (dateStr: string) => {
    return Temporal.PlainDateTime.from(dateStr)
      .toZonedDateTime(originZone)
      .withTimeZone(localZone)
      .toPlainDateTime()
      .toString({ smallestUnit: 'second' });
  };

  return events.map((event) => {
    const convertedStart = toLocal(event.start);

    return {
      ...event,
      start: convertedStart,
      // If end exists convert it, otherwise use the converted start
      end: event.end ? toLocal(event.end) : convertedStart,
      repeatEnds: event.repeatEnds ? toLocal(event.repeatEnds) : undefined,
    };
  });
};
