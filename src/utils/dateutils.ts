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
 * Moves events that repeat to the next occurrence after the current time
 * Afterwards, filters out events that have already ended and sorts the events by start time
 */
export const getEventsAfter = (
  events: IEvent[],
  now: moment.Moment,
): IEvent[] => {
  const eventsAfterNow = events.map((event) => {
    if (event.repeats && validRepeats.includes(event.repeats)) {
      const start = moment(event.start);
      let repeatEnds;
      try {
        repeatEnds = moment(event.repeatEnds) || maxRenderDistance;
      } catch {
        repeatEnds = maxRenderDistance;
      }
      const end = event.end ? moment(event.end) : null;
      const comparisonEnd = end || moment(event.end).add(1, 'hour'); // used for comparing against repeat as a "fake end time"
      const { increment, unit } = repeatMapping[event.repeats];

      while (start.isBefore(now)) {
        // find the most recent iteration
        if (repeatEnds.isSameOrBefore(comparisonEnd)) {
          // skip
          return null;
        }
        start.add(increment, unit);
        if (end) {
          end.add(increment, unit);
        }
      }
      return {
        ...event,
        start: start.toISOString(),
        end: end ? end.toISOString() : undefined,
      };
    }
    return event;
  });

  const definedEvents = eventsAfterNow.filter((event) => {
    return event !== null;
  });

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
