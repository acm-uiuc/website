import { useStore } from '@nanostores/preact';
import { useEffect, useMemo } from 'preact/hooks';

import type { Organization, OrgType } from '../stores/organization';
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

const orgTypes: OrgType[] = ['sig', 'committee'];

const OrganizationGrid = ({ initialOrgs, images }: Props) => {
  // Subscribe to the nanostores
  const storeOrgs = useStore($sigsAndCommittees);
  const searchQuery = useStore($searchQuery);
  const activeOrgType = useStore($activeOrgType);

  // Use store data if available, otherwise fall back to build-time data
  const sourceData = storeOrgs.length > 0 ? storeOrgs : initialOrgs;

  // Filter each tab's orgs by search query
  const orgsByType = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result: Record<OrgType, Organization[]> = { sig: [], committee: [] };
    for (const type of orgTypes) {
      const byType = sourceData.filter((org) => org.type === type);
      result[type] = query
        ? byType.filter(
            (org) =>
              org.name.toLowerCase().includes(query) ||
              org.description?.toLowerCase().includes(query)
          )
        : byType;
    }
    return result;
  }, [sourceData, searchQuery]);

  // Auto-switch tab when search query changes and current tab has no results
  useEffect(() => {
    const currentType = $activeOrgType.get();
    if (orgsByType[currentType].length > 0 || !searchQuery.trim()) return;

    const otherType = currentType === 'sig' ? 'committee' : 'sig';
    if (orgsByType[otherType].length > 0) {
      setActiveOrgType(otherType);
    }
  }, [orgsByType, searchQuery]);

  return (
    <div className="md:grid" style={{ gridTemplate: '1fr / 1fr' }}>
      {orgTypes.map((type) => {
        const orgs = orgsByType[type];
        const isActive = activeOrgType === type;
        return (
          <div
            key={type}
            className={isActive ? '' : 'hidden'}
            style={{ gridArea: '1 / 1' }}
          >
            {orgs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orgs.map((org, i) => (
                  <OrganizationCard
                    key={org.id}
                    organization={org}
                    imageData={images[org.id]}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="mx-auto mb-4 text-gray-300" size={48} />
                <p className="text-lg font-medium text-gray-700">
                  No results found
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try a different search term or check the other tab.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrganizationGrid;
