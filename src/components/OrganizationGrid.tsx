import { useStore } from '@nanostores/preact';
import { useEffect, useMemo } from 'preact/hooks';

import type { Organization } from '../stores/organization';
import {
  $activeOrgType,
  $sigsAndCommittees,
  setActiveOrgType,
} from '../stores/organization';
import { $searchQuery } from '../stores/search';
import OrganizationCard from './OrganizationCard';
import { Search } from 'lucide-react';

interface ImageData {
  src: string;
  width: number;
  height: number;
}

interface Props {
  initialOrgs: Organization[];
  images: Record<string, ImageData>;
}

const OrganizationGrid = ({ initialOrgs, images }: Props) => {
  // Subscribe to the nanostores
  const storeOrgs = useStore($sigsAndCommittees);
  const searchQuery = useStore($searchQuery);
  const activeOrgType = useStore($activeOrgType);

  // Use store data if available, otherwise fall back to initial SSR data
  const sourceData = storeOrgs.length > 0 ? storeOrgs : initialOrgs;

  // Filter by active tab type, then by search query
  const filteredOrgs = useMemo(() => {
    const byType = sourceData.filter((org) => org.type === activeOrgType);

    if (!searchQuery.trim()) {
      return byType;
    }

    const query = searchQuery.toLowerCase();
    return byType.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query)
    );
  }, [sourceData, searchQuery, activeOrgType]);

  // Auto-switch tab when search has no results here but does in the other tab
  useEffect(() => {
    if (filteredOrgs.length > 0 || !searchQuery.trim()) return;

    const otherType = activeOrgType === 'sig' ? 'committee' : 'sig';
    const query = searchQuery.toLowerCase();
    const otherHasResults = sourceData.some(
      (org) =>
        org.type === otherType &&
        (org.name.toLowerCase().includes(query) ||
          org.description?.toLowerCase().includes(query))
    );

    if (otherHasResults) {
      setActiveOrgType(otherType);
    }
  }, [filteredOrgs, searchQuery, activeOrgType, sourceData]);

  return (
    <>
      {filteredOrgs.length > 0 ? (
        <div
          key={activeOrgType}
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredOrgs.map((org, i) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              imageData={images[org.id]}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div class="text-center py-16">
          <Search className="mx-auto mb-4 text-gray-300" size={48} />
          <p class="text-lg font-medium text-gray-700">No results found</p>
          <p class="text-sm text-gray-500 mt-1">
            Try a different search term or check the other tab.
          </p>
        </div>
      )}
    </>
  );
};

export default OrganizationGrid;
