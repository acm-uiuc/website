import { useState, useEffect } from 'preact/hooks';
import { getStore, subscribe } from '../stores/organization';
import OrganizationCard from './OrganizationCard';
import { Search, X } from 'lucide-react';

const OrganizationList = () => {
  const [store, setStore] = useState(getStore());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const unsubscribe = subscribe(setStore);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  console.log('OrganizationList render:', {
    initialized: store.initialized,
    orgCount: store.data.length,
  });

  const organizations = [...store.data]
    .filter((org) => org.type === 'sig' || org.type === 'committee')
    .filter((org) => {
      if (!debouncedQuery.trim()) return true;
      const query = debouncedQuery.toLowerCase();
      return (
        org.name.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section class="bg-gray-50 py-16 lg:py-20">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="text-center mb-2">
          <h2 class="text-navy-900 text-3xl font-bold sm:text-4xl">
            Our SIGs & Committees
          </h2>
          <p class="text-navy-600 mt-2 text-lg">
            Explore the groups that make our community vibrant and active.
          </p>
        </div>

        <div class="max-w-2xl mx-auto mb-8">
          <div class="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {!store.initialized ? (
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                class="animate-pulse rounded-xl border border-gray-200 bg-white p-6"
              >
                <div class="flex flex-col items-center text-center">
                  <div class="h-24 w-24 rounded-full bg-gray-200 mb-4"></div>
                  <div class="h-6 w-3/4 rounded bg-gray-200 mb-3"></div>
                  <div class="h-4 w-full rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : organizations.length > 0 ? (
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
        ) : (
          <div class="text-center py-12">
            <p class="text-lg font-medium text-gray-700">
              No organizations found.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrganizationList;
