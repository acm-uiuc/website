import { IEvent } from '@/components/Events/events';
import { transformApiDates } from '@/utils/dateutils';

const baseurl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL || '';

export async function fetchUpcomingEvents() {
  try {
    const response = await fetch(`${baseurl}/api/v1/events?upcomingOnly=true`);
    const rawDates = (await response.json()) as IEvent[];
    return transformApiDates(rawDates);
  } catch (err: any) {
    return [];
  }
}
