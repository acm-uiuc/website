import { atom } from 'nanostores';

/**
 * Search query store for organization filtering
 */
export const $searchQuery = atom<string>('');

/**
 * Update the search query
 */
export function setSearchQuery(query: string) {
  $searchQuery.set(query);
}

/**
 * Clear the search query
 */
export function clearSearchQuery() {
  $searchQuery.set('');
}
