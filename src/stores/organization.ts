import type { ApiV1OrganizationsGet200ResponseInner } from '@acm-uiuc/core-client';
import { organizationApiClient } from '../api';

export type Organization = ApiV1OrganizationsGet200ResponseInner;

interface OrganizationStore {
  data: Organization[];
  error: Error | null;
  initialized: boolean;
}

const store: OrganizationStore = {
  data: [],
  error: null,
  initialized: false,
};

type Listener = (store: OrganizationStore) => void;
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((fn) => fn(store));
}

/**
 * Subscribe to store changes
 */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Get current store state
 */
export function getStore(): OrganizationStore {
  return store;
}

/**
 * Initialize and fetch organization data (call once on page load)
 */
export async function initOrganizations(): Promise<Organization[]> {
  if (store.initialized) {
    return store.data;
  }

  try {
    store.data = await organizationApiClient.apiV1OrganizationsGet();
    store.error = null;
  } catch (error) {
    store.error = error instanceof Error ? error : new Error(String(error));
  }

  store.initialized = true;
  notify();
  return store.data;
}

/**
 * Get organization by ID or name
 */
export function getOrganizationById(id: string): Organization | undefined {
  return store.data.find((org) => org.id === id);
}

/**
 * Get all organizations
 */
export function getOrganizations(): Organization[] {
  return store.data;
}
