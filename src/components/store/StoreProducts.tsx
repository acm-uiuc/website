import { useState } from 'preact/hooks';
import ReactNavbar from '../generic/ReactNavbar';
import type { Product } from '../../types/store';
import { LoadingSpinner } from '../generic/LargeLoadingSpinner';
import { useEffect } from 'react';
import { storeApiClient } from '../../api';
import { handleResponseError } from '../../util';
import ErrorPopup, { useErrorPopup } from '../ErrorPopup';

interface Props {
  currentPath: string;
}

const StoreItemListing = (product: Product) => {
  // Calculate price range across all variants
  const nonMemberPrices = product.variants
    .map((v) => v.nonmemberPriceCents)
    .filter((price): price is number => price !== null && price !== undefined);

  const memberPrices = product.variants
    .map((v) => v.memberPriceCents)
    .filter((price): price is number => price !== null && price !== undefined);

  const minNonMemberPrice =
    nonMemberPrices.length > 0 ? Math.min(...nonMemberPrices) : null;
  const maxNonMemberPrice =
    nonMemberPrices.length > 0 ? Math.max(...nonMemberPrices) : null;

  const minMemberPrice =
    memberPrices.length > 0 ? Math.min(...memberPrices) : null;
  const maxMemberPrice =
    memberPrices.length > 0 ? Math.max(...memberPrices) : null;

  const formatPrice = (min: number, max: number) => {
    if (min === max) return `$${(min / 100).toFixed(2)}`;
    return `$${(min / 100).toFixed(2)} - $${(max / 100).toFixed(2)}`;
  };

  // Calculate total inventory
  const getTotalInventory = () => {
    if (product.inventoryMode === 'PER_PRODUCT') {
      return product.totalInventoryCount ?? null;
    } else if (product.inventoryMode === 'PER_VARIANT') {
      // Sum up inventory across all variants
      const total = product.variants.reduce((sum, variant) => {
        const count = variant.inventoryCount ?? 0;
        return sum + count;
      }, 0);
      return total;
    }
    return null;
  };

  const totalInventory = getTotalInventory();
  const isLowStock =
    totalInventory !== null && totalInventory > 0 && totalInventory < 10;
  const isOutOfStock = totalInventory !== null && totalInventory === 0;

  // Convert Unix timestamps (seconds) to milliseconds for comparison
  const nowMs = Date.now();
  const openAtMs = product.openAt ? product.openAt * 1000 : null;
  const closeAtMs = product.closeAt ? product.closeAt * 1000 : null;

  const isOpen =
    openAtMs && openAtMs <= nowMs && (!closeAtMs || closeAtMs > nowMs);

  return (
    <a
      href={`/store?id=${product.productId}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-navy-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-navy-400"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name || 'Product image'}
            className="h-full w-full object-fit transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-wisteria-100">
            <span className="text-4xl text-navy-300">📦</span>
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {!isOpen && (
            <div className="rounded-full bg-navy-800/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {openAtMs && openAtMs > nowMs ? 'Coming Soon' : 'Closed'}
            </div>
          )}
          {isLowStock && (
            <div className="rounded-full bg-tangerine-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Low Stock
            </div>
          )}
          {isOutOfStock && (
            <div className="rounded-full bg-rose-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Out of Stock
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-semibold text-navy-900 line-clamp-2 group-hover:text-navy-600">
          {product.name}
        </h3>

        {product.description && (
          <p className="mb-3 text-sm text-navy-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Spacer to push pricing to bottom */}
        <div className="flex-1" />

        {/* Pricing */}

        {minMemberPrice !== null && maxMemberPrice !== null && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-rose-600">
              Member Price:
            </span>
            <span className="text-base font-bold text-rose-600">
              {formatPrice(minMemberPrice, maxMemberPrice)}
            </span>
          </div>
        )}
        <div className="mt-auto space-y-1">
          {minNonMemberPrice !== null && maxNonMemberPrice !== null && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-navy-700">
                Nonmember Price:
              </span>
              <span className="text-base font-bold text-navy-700">
                {formatPrice(minNonMemberPrice, maxNonMemberPrice)}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

const StoreProductsInner = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const { error, showError, clearError } = useErrorPopup();
  const baseReturn = <ErrorPopup error={error} onClose={clearError} />;

  useEffect(() => {
    (async () => {
      try {
        const response = await storeApiClient.apiV1StoreProductsGet();
        // Sort by most recently opened (openAt descending)
        const sortedProducts = [...response['products']].sort((a, b) => {
          const aOpenAt = a.openAt || 0;
          const bOpenAt = b.openAt || 0;
          return bOpenAt - aOpenAt;
        });
        setProducts(sortedProducts);
      } catch (e) {
        await handleResponseError(
          e,
          showError,
          500,
          'An error occurred retrieving the store.'
        );
      }
    })();
  }, []);

  if (!products) {
    return (
      <>
        {baseReturn}
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      {baseReturn}
      <div className="w-full max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-navy-900">All Products</h1>

        {products.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-navy-200 bg-surface-050 p-12 text-center">
            <p className="text-lg text-navy-600">
              No products available at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <StoreItemListing key={product.productId} {...product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const StoreProducts = ({ currentPath }: Props) => {
  return (
    <main className="relative flex flex-1 justify-center px-4 py-16 lg:py-24">
      <ReactNavbar
        currentPath={currentPath}
        breadcrumbs={[{ href: '/store', label: 'Store' }]}
      />

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-tangerine-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-navy-100 opacity-50 blur-3xl" />
      </div>

      <StoreProductsInner />
    </main>
  );
};

export default StoreProducts;
