import { IEvent } from '@/components/Events/events';
import { transformApiDates } from '@/utils/dateutils';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL || '';

export async function fetchUpcomingEvents() {
  try {
    const response = await fetch(`${baseUrl}/api/v1/events?upcomingOnly=true&featuredOnly=true`);
    const rawDates = (await response.json()) as IEvent[];
    return transformApiDates(rawDates);
  } catch (err: any) {
    return [];
  }
}

export const syncIdentity = async (accessToken: string) => {
  // If this fails we don't care its just best effort.
  const url = `${baseUrl}/api/v1/syncIdentity`;
  axios
    .post(url, {}, { headers: { "x-uiuc-token": accessToken } })
    .then(() => {
      console.log("Synced user identity")
    })
    .catch((error) => {
      console.error(`Failed to sync user identity: ${error}`)
    })
};
