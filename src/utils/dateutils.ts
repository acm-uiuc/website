import { maxRenderDistance } from '@/components/CalendarControls';
import { IEvent } from '@/components/Events/events';
import moment from 'moment-timezone';

export const transformApiDates = (events: IEvent[]): IEvent[] => {
  return events.map((event: IEvent) => {
    return {
      ...event,
      start: moment
        .tz(event.start, 'America/Chicago')
        .tz(moment.tz.guess())
        .format('YYYY-MM-DDTHH:mm:ss'),
      end: event.end
        ? moment
          .tz(event.end, 'America/Chicago')
          .tz(moment.tz.guess())
          .format('YYYY-MM-DDTHH:mm:ss')
        : moment
          .tz(event.start, 'America/Chicago')
          .tz(moment.tz.guess())
          .format('YYYY-MM-DDTHH:mm:ss'),
      repeatEnds: event.repeatEnds
        ? moment
          .tz(event.repeatEnds, 'America/Chicago')
          .tz(moment.tz.guess())
          .format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
    };
  });
};

export const validRepeats = [
  'weekly',
  'biweekly',
  'monthly',
  'semianually',
  'yearly',
] as const;
export type ValidRepeat = (typeof validRepeats)[number];

export type RepeatMappingEntry = {
  increment: number;
  unit: moment.DurationInputArg2;
};
export type RepeatMapping = {
  [k in ValidRepeat]: RepeatMappingEntry;
};
export const repeatMapping: RepeatMapping = {
  weekly: { increment: 1, unit: 'week' },
  biweekly: { increment: 1, unit: 'weeks' },
  monthly: { increment: 1, unit: 'month' },
  semianually: { increment: 6, unit: 'months' },
  yearly: { increment: 1, unit: 'year' },
};

export const getRepeatString = (repeats: ValidRepeat) => {
  switch (repeats) {
    case 'weekly':
      return 'Every week';
    case 'biweekly':
      return 'Biweekly';
    default:
      return '';
  }
};

/**
 * Moves events that repeat to the next valid occurrence after the current time,
 * accounting for excluded dates. Afterwards, it filters out events that have
 * already ended and sorts the remaining events by start time.
 */
export const getEventsAfter = (
  events: IEvent[],
  now: moment.Moment,
): IEvent[] => {
  const eventsAfterNow = events.map((event) => {
    // Check if the event is a valid repeating event
    if (event.repeats && validRepeats.includes(event.repeats)) {
      const start = moment(event.start);
      const end = event.end ? moment(event.end) : null;
      let repeatEnds;

      try {
        // Use the defined repeat end date or a max default
        repeatEnds = moment(event.repeatEnds);
        if (!repeatEnds.isValid()) throw new Error();
      } catch {
        repeatEnds = maxRenderDistance;
      }

      const { increment, unit } = repeatMapping[event.repeats];
      const excludedDates = new Set(
        event.repeatExcludes?.map((date) => moment(date).format('YYYY-MM-DD')) ?? [],
      );

      while (start.isBefore(now) || excludedDates.has(start.format('YYYY-MM-DD'))) {
        start.add(increment, unit);
        if (end) {
          end.add(increment, unit);
        }
      }

      // If the calculated start time is after the event's repeating period ends,
      // then there are no more future occurrences of this event.
      if (start.isAfter(repeatEnds)) {
        return null;
      }

      // Return the updated event with its next valid start and end times
      return {
        ...event,
        start: start.toISOString(),
        end: end ? end.toISOString() : undefined,
      };
    }
    // Return non-repeating events as is
    return event;
  });

  // Filter out null values (from repeating events that have concluded)
  // and events whose end time is in the past.
  const definedEvents = eventsAfterNow.filter((event): event is IEvent => {
    if (event === null) return false;
    const eventEnd = event.end ? moment(event.end) : moment(event.start).add(1, 'hour');
    return eventEnd.isAfter(now);
  });

  // Sort the final list of events chronologically by start time
  const sortedEvents = definedEvents.sort((a, b) => {
    return moment(a.start).unix() - moment(b.start).unix();
  });

  return sortedEvents;
};

export const getEstimatedOccurrencesInYear = (repeats: ValidRepeat): number => {
  switch (repeats) {
    case 'weekly':
      return 52;
    case 'biweekly':
      return 26;
    case 'monthly':
      return 12;
    case 'semianually':
      return 2;
    case 'yearly':
      return 1;
    default:
      return 0;
  }
};

export const howManyUnitInYear = (
  repeatMapping: RepeatMappingEntry,
): number => {
  switch (repeatMapping.unit) {
    case 'day':
    case 'days':
      return 365.25;
    case 'week':
    case 'weeks':
      return 52.143;
    case 'month':
    case 'months':
      return 12;
    case 'year':
    case 'years':
      return 1;
    default:
      return 0;
  }
};
