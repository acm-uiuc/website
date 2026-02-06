import {
  Configuration,
  EventsApi,
  MembershipApi,
  MobileWalletApi,
  OrganizationsApi,
} from '@acm-uiuc/core-client';

const coreProdUrl = 'https://core.acm.illinois.edu';

export const eventsApiClient = new EventsApi(
  new Configuration({
    basePath:
      import.meta.env.PUBLIC_CORE_API_EVENTS_BASE_URL ||
      import.meta.env.PUBLIC_CORE_API_BASE_URL ||
      coreProdUrl,
  }),
);

export const organizationApiClient = new OrganizationsApi(
  new Configuration({
    basePath:
      import.meta.env.PUBLIC_CORE_API_ORG_BASE_URL ||
      import.meta.env.PUBLIC_CORE_API_BASE_URL ||
      coreProdUrl,
  }),
);

export const membershipApiClient = new MembershipApi(
  new Configuration({
    basePath: import.meta.env.PUBLIC_CORE_API_BASE_URL || coreProdUrl,
  }),
);

export const mobileWalletApiClient = new MobileWalletApi(
  new Configuration({
    basePath: import.meta.env.PUBLIC_CORE_API_BASE_URL || coreProdUrl,
  }),
);
