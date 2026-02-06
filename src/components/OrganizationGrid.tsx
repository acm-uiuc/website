import { useStore } from '@nanostores/preact';
import { $sigsAndCommittees } from '../stores/organization';
import { $searchQuery } from '../stores/search';
import type { Organization } from '../stores/organization';
import { useMemo } from 'preact/hooks';
import OrganizationCard from './OrganizationCard';

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

  // Use store data if available, otherwise fall back to initial SSR data
  const sourceData = storeOrgs.length > 0 ? storeOrgs : initialOrgs;

  // Filter based on search query from the nanostore
  const filteredOrgs = useMemo(() => {
    if (!searchQuery.trim()) {
      return sourceData;
    }

    const query = searchQuery.toLowerCase();
    return sourceData.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query),
    );
  }, [sourceData, searchQuery]);

  return (
    <>
      {filteredOrgs.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrgs.map((org) => (
            <OrganizationCard
              key={org.id}
              organization={org}
              imageData={images[org.id]}
            />
          ))}
        </div>
      ) : (
        <div class="text-center py-12">
          <p class="text-lg font-medium text-gray-700">
            No organizations found.
          </p>
        </div>
      )}
    </>
  );
};

export default OrganizationGrid;
