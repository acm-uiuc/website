import type { ApiV1OrganizationsGet200ResponseInner } from '@acm-uiuc/core-client';
import { atom, computed } from 'nanostores';

import { organizationApiClient } from '../api';

export type Organization = ApiV1OrganizationsGet200ResponseInner;

// Atoms
export const $organizations = atom<Organization[]>([]);
export const $organizationsError = atom<Error | null>(null);
export const $organizationsInitialized = atom<boolean>(false);

// Tab state
export type OrgType = 'sig' | 'committee';
export const $activeOrgType = atom<OrgType>('sig');

export function setActiveOrgType(type: OrgType) {
  $activeOrgType.set(type);
}

// Computed
export const $sigsAndCommittees = computed($organizations, (orgs) =>
  orgs
    .filter((org) => org.type === 'sig' || org.type === 'committee')
    .sort((a, b) => a.name.localeCompare(b.name))
);

export const $sigs = computed($sigsAndCommittees, (orgs) =>
  orgs.filter((org) => org.type === 'sig')
);

export const $committees = computed($sigsAndCommittees, (orgs) =>
  orgs.filter((org) => org.type === 'committee')
);

export async function initOrganizations(
  initialData?: Organization[]
): Promise<Organization[]> {
  if ($organizationsInitialized.get()) {
    return $organizations.get();
  }

  // If we have initial data from SSR, use it immediately
  if (initialData && initialData.length > 0) {
    $organizations.set(initialData);
  }

  try {
    const data = await organizationApiClient.apiV1OrganizationsGet();
    $organizations.set(data);
    $organizationsError.set(null);
  } catch (error) {
    $organizationsError.set(
      error instanceof Error ? error : new Error(String(error))
    );
  }

  $organizationsInitialized.set(true);
  return $organizations.get();
}

/**
 * Get organization by ID
 */
export function getOrganizationById(id: string): Organization | undefined {
  return $organizations.get().find((org) => org.id === id);
}
