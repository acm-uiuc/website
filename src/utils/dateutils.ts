import { IEvent } from "@/components/Events/events";
import moment from "moment-timezone";

export const transformApiDates = (events: IEvent[]): IEvent[] => {
  return events.map((event: IEvent) => {
    return {
      ...event,
      start: moment.tz(event.start, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss"),
      end: event.end ? moment.tz(event.end, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss") : moment.tz(event.start, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss"),
      repeatEnds: event.repeatEnds ? moment.tz(event.repeatEnds, "America/Chicago").tz(moment.tz.guess()).format("YYYY-MM-DDTHH:mm:ss") : undefined
      }
    });
}

export const validRepeats = ['weekly', 'biweekly', 'monthly', 'semianually', 'yearly'] as const;
export type ValidRepeat = typeof validRepeats[number];

export type RepeatMappingEntry = {increment: number, unit: moment.DurationInputArg2};
export type RepeatMapping = {
  [k in ValidRepeat]: RepeatMappingEntry
}
export const repeatMapping: RepeatMapping = {
  'weekly': {increment: 1, unit: 'week'},
  'biweekly': {increment: 1, unit: 'weeks'},
  'monthly': {increment: 1, unit: 'month'},
  'semianually': {increment: 6, unit: 'months'},
  'yearly': {increment: 1, unit: 'year'},
}

export const getRepeatString = (repeats: ValidRepeat) => {
  switch (repeats) {
    case 'weekly':
      return 'Every week';
    case 'biweekly':
      return 'Biweekly';
    default:
      return '';
  }
}

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
}

export const howManyUnitInYear = (repeatMapping: RepeatMappingEntry): number => {
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
}