import { IEvent } from '@/components/Events/events';
import { transformApiDates } from '@/utils/dateutils';
import { Configuration, EventsApi, GenericApi, MembershipApi, StoreApi } from '@acm-uiuc/core-client';

export const coreApiBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? "https://core.acm.illinois.edu"
const baseConfig = { basePath: coreApiBaseUrl }
export const eventsApiClient = new EventsApi(new Configuration(baseConfig));
export const membershipApiClient = new MembershipApi(new Configuration(baseConfig));
export const storeApiClient = new StoreApi(new Configuration(baseConfig));
export const genericApiClient = new GenericApi(new Configuration(baseConfig));

export async function fetchUpcomingEvents() {
  try {
    const rawDates = await eventsApiClient.apiV1EventsGet({ upcomingOnly: true });
    return transformApiDates(rawDates);
  } catch (err: any) {
    console.error("Failed to fetch upcoming events", err)
    return [];
  }
}

export const syncIdentity = async (
  accessToken: string,
  force: boolean = false,
) => {
  // If this fails we don't care its just best effort.
  if (!force) {
    const syncRequired = await checkIfSyncNeeded(accessToken);
    if (!syncRequired) {
      return;
    }
  }
  try {
    await genericApiClient.apiV1SyncIdentityPost({ xUiucToken: accessToken });
    console.log("Synced user identity");
  } catch (error) {
    console.error(`Failed to sync user identity: ${error}`);

  }
};

export const checkIfSyncNeeded = async (
  accessToken: string,
): Promise<boolean> => {
  const response = await genericApiClient.apiV1SyncIdentityIsRequiredGet({ xUiucToken: accessToken });
  return response.syncRequired ?? true;
};
