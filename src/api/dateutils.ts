import { Temporal } from 'temporal-polyfill';

import type { Event } from '../types/events';

export const validRepeats = ['weekly', 'biweekly'] as const;
export type ValidRepeat = (typeof validRepeats)[number];

type RepeatEntry = { increment: number; unit: 'weeks' };
const repeatMapping: Record<ValidRepeat, RepeatEntry> = {
  weekly: { increment: 1, unit: 'weeks' },
  biweekly: { increment: 2, unit: 'weeks' },
};

export const maxRenderDistance = Temporal.Now.plainDateISO().add({ years: 1 });

/**
 * Expands a repeating event into individual occurrences up to maxRenderDistance.
 * Returns Date-based objects for react-big-calendar compatibility.
 */
export function createRecurringEvents(
  event: Event
): Array<Event & { _start: Date; _end: Date }> {
  const repeat = event.repeats as ValidRepeat | undefined;
  if (!repeat || !validRepeats.includes(repeat)) {
    const start = new Date(event.start);
    const end = event.end ? new Date(event.end) : start;
    return [{ ...event, _start: start, _end: end }];
  }

  const entry = repeatMapping[repeat];
  const results: Array<Event & { _start: Date; _end: Date }> = [];

  let startDt = Temporal.PlainDateTime.from(event.start);
  const duration = event.end
    ? startDt.until(Temporal.PlainDateTime.from(event.end))
    : Temporal.Duration.from({ hours: 1 });

  const repeatEnd = event.repeatEnds
    ? Temporal.PlainDateTime.from(event.repeatEnds)
    : Temporal.PlainDateTime.from(`${maxRenderDistance.toString()}T23:59:59`);

  const excludedDates = new Set(
    event.repeatExcludes?.map((d) => {
      const s = typeof d === 'string' ? d : (d as Date).toISOString();
      return s.slice(0, 10);
    }) ?? []
  );

  while (
    Temporal.PlainDate.compare(startDt.toPlainDate(), maxRenderDistance) <= 0
  ) {
    if (Temporal.PlainDateTime.compare(startDt, repeatEnd) > 0) {
      break;
    }

    if (!excludedDates.has(startDt.toPlainDate().toString())) {
      const endDt = startDt.add(duration);
      results.push({
        ...event,
        _start: new Date(startDt.toString()),
        _end: new Date(endDt.toString()),
      });
    }

    startDt = startDt.add({ weeks: entry.increment });
  }

  return results;
}
