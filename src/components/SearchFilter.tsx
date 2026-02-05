import { useState, useEffect } from 'preact/hooks';
import { Search, X } from 'lucide-react';
import { setSearchQuery as updateSearchQuery } from '../stores/search';

const SearchFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update the nanostore when debounced query changes
  useEffect(() => {
    updateSearchQuery(debouncedQuery);
  }, [debouncedQuery]);

  return (
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
  );
};

export default SearchFilter;
