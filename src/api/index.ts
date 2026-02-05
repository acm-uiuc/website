import {
  Configuration,
  EventsApi,
  OrganizationsApi,
} from '@acm-uiuc/core-client';

const unauthenticatedConfiguration = new Configuration({
  basePath:
    import.meta.env.PUBLIC_CORE_API_BASE_URL || 'https://core.acm.illinois.edu',
});
export const eventsApiClient = new EventsApi(unauthenticatedConfiguration);
export const organizationApiClient = new OrganizationsApi(
  unauthenticatedConfiguration,
);
