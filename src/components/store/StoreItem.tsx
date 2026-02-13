import {
  type ApiV1StoreProductsProductIdGet200Response,
  ResponseError,
} from '@acm-uiuc/core-client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import {
  storeApiClient,
  membershipApiClient,
  genericApiClient,
} from '../../api';
import { handleResponseError } from '../../util';
import { initMsalClient, getUserAccessToken } from '../../authConfig';
import ErrorPopup, { useErrorPopup } from '../ErrorPopup';
import ReactNavbar from '../generic/ReactNavbar';
import { LoadingSpinner } from '../generic/LargeLoadingSpinner';
import AuthActionButton, { type ShowErrorFunction } from '../AuthActionButton';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import type {
  IPublicClientApplication,
  AccountInfo,
} from '@azure/msal-browser';

type Product = ApiV1StoreProductsProductIdGet200Response;
type Variant = Product['variants'][number];

interface Props {
  currentPath: string;
  id: string;
  bannerWhiteSrc?: string;
  bannerBlueSrc?: string;
}

enum CheckoutMode {
  ILLINOIS = 'illinois',
  GUEST = 'guest',
}

const getAllVariantsMemberLists = (
  variants: Variant[] | undefined
): string[] | null => {
  if (!variants || variants.length === 0) return null;
  const firstLists = variants[0].memberLists || [];
  const firstListsSorted = [...firstLists].sort().join(',');
  const allSame = variants.every((v) => {
    const lists = v.memberLists || [];
    return [...lists].sort().join(',') === firstListsSorted;
  });
  if (allSame && firstLists.length > 0) {
    return firstLists;
  }
  return null;
};

const createCacheKey = (lists: string[]): string => {
  return [...lists].sort().join(',');
};

const StoreItem = ({
  id,
  currentPath,
  bannerWhiteSrc,
  bannerBlueSrc,
}: Props) => {
  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );
  const [productInfo, setProductInfo] = useState<Product>();
  const [selectedVariantId, setSelectedVariantId] = useState(
    urlParams.get('variant') ?? ''
  );
  const [quantity, setQuantity] = useState(urlParams.get('quantity') ?? '1');
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>(
    CheckoutMode.ILLINOIS
  );
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>();

  // MSAL state
  const [pca, setPca] = useState<IPublicClientApplication>();
  const [user, setUser] = useState<AccountInfo | null>(null);

  // Membership state
  const [isPaidMember, setIsPaidMember] = useState<boolean | undefined>(
    undefined
  );
  const [membershipPreloaded, setMembershipPreloaded] = useState(false);
  const activeMembershipKeyRef = useRef<string | null>(null);
  const membershipCache = useRef<Map<string, boolean>>(new Map());

  const turnstileRef = useRef<TurnstileInstance>(null);
  const { error, showError, clearError } = useErrorPopup();

  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY!;

  // Initialize MSAL
  useEffect(() => {
    initMsalClient()
      .then((instance) => {
        setPca(instance);
        const account =
          instance.getActiveAccount() || instance.getAllAccounts()[0] || null;
        setUser(account);
      })
      .catch(console.error);
  }, []);

  // If there is only one variant, select it by default.
  useEffect(() => {
    if (!selectedVariantId && productInfo?.variants.length === 1) {
      setSelectedVariantId(productInfo.variants[0].variantId ?? '');
    }
  }, [productInfo]);

  // Check membership status with specific lists (with caching)
  const checkMembershipStatus = useCallback(
    async (lists: string[] | null) => {
      if (!pca || !user) return;
      if (!lists || lists.length === 0) {
        activeMembershipKeyRef.current = null;
        setIsPaidMember(false);
        return;
      }
      const cacheKey = createCacheKey(lists);
      activeMembershipKeyRef.current = cacheKey;
      if (membershipCache.current.has(cacheKey)) {
        setIsPaidMember(membershipCache.current.get(cacheKey)!);
        return;
      }
      setIsPaidMember(undefined);

      try {
        const accessToken = await getUserAccessToken(pca);
        if (!accessToken) {
          if (activeMembershipKeyRef.current === cacheKey) {
            setIsPaidMember(false);
            activeMembershipKeyRef.current = null;
          }
          return;
        }
        const response = await membershipApiClient.apiV1MembershipGet({
          lists,
          xUiucToken: accessToken,
        });
        const result = response.isPaidMember || false;
        if (activeMembershipKeyRef.current === cacheKey) {
          membershipCache.current.set(cacheKey, result);
          setIsPaidMember(result);
          activeMembershipKeyRef.current = null;
        }
      } catch (error) {
        console.error('Failed to check membership status:', error);
        if (activeMembershipKeyRef.current === cacheKey) {
          setIsPaidMember(false);
          activeMembershipKeyRef.current = null;
        }
      }
    },
    [pca, user]
  );

  useEffect(() => {
    (async () => {
      try {
        if (!turnstileSiteKey) {
          throw new Error('Could not find Turnstile site key.');
        }
        const productData = await storeApiClient.apiV1StoreProductsProductIdGet(
          { productId: id }
        );
        setProductInfo(productData);
        document.title = `${productData.name} | ACM @ UIUC`;
      } catch (e) {
        await handleResponseError(
          e,
          showError,
          404,
          'Failed to retrieve product.'
        );
      }
    })();
  }, [id]);

  // Pre-populate membership cache for all variants at load time
  useEffect(() => {
    if (!productInfo || !pca || !user || membershipPreloaded) return;
    const variants = productInfo.variants;
    if (!variants || variants.length === 0) {
      setMembershipPreloaded(true);
      return;
    }
    // Collect unique member list combinations
    const uniqueLists = new Map<string, string[]>();
    for (const variant of variants) {
      const lists = variant.memberLists;
      if (lists && lists.length > 0) {
        const key = createCacheKey(lists);
        if (!uniqueLists.has(key)) {
          uniqueLists.set(key, lists);
        }
      }
    }
    if (uniqueLists.size === 0) {
      setMembershipPreloaded(true);
      return;
    }
    (async () => {
      try {
        const accessToken = await getUserAccessToken(pca);
        if (!accessToken) {
          setMembershipPreloaded(true);
          return;
        }
        await Promise.all(
          Array.from(uniqueLists.entries()).map(async ([key, lists]) => {
            if (membershipCache.current.has(key)) return;
            try {
              const response = await membershipApiClient.apiV1MembershipGet({
                lists,
                xUiucToken: accessToken,
              });
              membershipCache.current.set(key, response.isPaidMember || false);
            } catch {
              membershipCache.current.set(key, false);
            }
          })
        );
      } catch {
        // Token failure — cache stays empty, will check on demand
      }
      setMembershipPreloaded(true);
    })();
  }, [productInfo, pca, user, membershipPreloaded]);

  // Determine which member lists to check
  const commonMemberLists = useMemo(
    () => getAllVariantsMemberLists(productInfo?.variants),
    [productInfo?.variants]
  );

  const activeMemberLists = useMemo(() => {
    if (selectedVariantId && productInfo?.variants) {
      const variant = productInfo.variants.find(
        (v) => v.variantId === selectedVariantId
      );
      return variant?.memberLists || null;
    }
    return commonMemberLists;
  }, [selectedVariantId, productInfo?.variants, commonMemberLists]);

  // Check membership when user or active lists change
  useEffect(() => {
    if (user && activeMemberLists) {
      checkMembershipStatus(activeMemberLists);
    } else if (!user) {
      setIsPaidMember(undefined);
    }
  }, [user, activeMemberLists, checkMembershipStatus]);

  // Handle login for price reveal
  const handleLoginForPricing = async () => {
    if (!pca) return;
    try {
      const returnPath = `/store?id=${id}${selectedVariantId ? `&variant=${encodeURIComponent(selectedVariantId)}` : ''}${quantity !== '1' ? `&quantity=${encodeURIComponent(quantity)}` : ''}`;
      const accessToken = await getUserAccessToken(pca, returnPath);
      if (accessToken) {
        const account =
          pca.getActiveAccount() || pca.getAllAccounts()[0] || null;
        setUser(account);
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  // Calculate total inventory
  const getTotalInventory = useCallback(() => {
    if (!productInfo) return null;

    if (productInfo.inventoryMode === 'PER_PRODUCT') {
      return productInfo.totalInventoryCount ?? null;
    } else if (productInfo.inventoryMode === 'PER_VARIANT') {
      const total = productInfo.variants.reduce((sum, variant) => {
        const count = variant.inventoryCount ?? 0;
        return sum + count;
      }, 0);
      return total;
    }
    return null;
  }, [productInfo]);

  const totalInventory = getTotalInventory();
  const isLowStock =
    totalInventory !== null && totalInventory > 0 && totalInventory < 10;
  const isOutOfStock = totalInventory !== null && totalInventory === 0;

  // Get selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !productInfo?.variants) return null;
    return (
      productInfo.variants.find((v) => v.variantId === selectedVariantId) ||
      null
    );
  }, [selectedVariantId, productInfo?.variants]);

  // Price summary across all variants (shown in product info card)
  const priceDisplay = useMemo(() => {
    const variants = productInfo?.variants;
    if (!variants || variants.length === 0) return null;

    const nonMemberPrices = variants
      .map((v) => v.nonmemberPriceCents)
      .filter((p): p is number => p !== null && p !== undefined);
    const memberPrices = variants
      .map((v) => v.memberPriceCents)
      .filter((p): p is number => p !== null && p !== undefined);

    const formatRange = (min: number, max: number) =>
      min === max
        ? `$${(min / 100).toFixed(2)}`
        : `$${(min / 100).toFixed(2)} – $${(max / 100).toFixed(2)}`;

    return {
      nonMember:
        nonMemberPrices.length > 0
          ? formatRange(
              Math.min(...nonMemberPrices),
              Math.max(...nonMemberPrices)
            )
          : null,
      member:
        memberPrices.length > 0
          ? formatRange(Math.min(...memberPrices), Math.max(...memberPrices))
          : null,
    };
  }, [productInfo?.variants]);

  // Whether the user qualifies for member pricing (all variants if none selected)
  const isMemberForAllVariants = useMemo(() => {
    if (!membershipPreloaded || !user || !productInfo?.variants) return false;
    return productInfo.variants.every((v) => {
      const lists = v.memberLists;
      if (!lists || lists.length === 0) return false;
      const cacheKey = createCacheKey(lists);
      return membershipCache.current.get(cacheKey) === true;
    });
  }, [membershipPreloaded, user, productInfo?.variants]);

  const showMemberPricing =
    checkoutMode === CheckoutMode.ILLINOIS &&
    (selectedVariantId ? isPaidMember === true : isMemberForAllVariants);

  // Get max quantity for selected variant
  const getMaxQuantity = useCallback(() => {
    if (!selectedVariant || !productInfo) return Infinity;

    let available = 0;
    if (productInfo.inventoryMode === 'PER_VARIANT') {
      available = selectedVariant.inventoryCount ?? 0;
    } else if (productInfo.inventoryMode === 'PER_PRODUCT') {
      available = productInfo.totalInventoryCount ?? 0;
    }

    if (
      available === 0 &&
      productInfo.inventoryMode === 'PER_PRODUCT' &&
      productInfo.totalInventoryCount === null
    ) {
      available = 999;
    }

    const maxFromLimit = productInfo.limitConfiguration?.maxQuantity ?? 999;
    return Math.min(available, maxFromLimit, 10);
  }, [selectedVariant, productInfo]);

  // Calculate price
  const calculatePrice = useCallback(
    (isMember: boolean) => {
      if (!selectedVariant) return null;

      const pricePerItem = isMember
        ? selectedVariant.memberPriceCents
        : selectedVariant.nonmemberPriceCents;

      if (pricePerItem === null || pricePerItem === undefined) return null;

      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty <= 0) return null;

      return (pricePerItem * qty) / 100;
    },
    [selectedVariant, quantity]
  );

  const memberPrice = calculatePrice(true);
  const nonMemberPrice = calculatePrice(false);

  // Calculate savings
  const savings = useMemo(() => {
    if (memberPrice === null || nonMemberPrice === null) return null;
    const diff = nonMemberPrice - memberPrice;
    return diff > 0 ? diff : null;
  }, [memberPrice, nonMemberPrice]);

  // Validation
  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const isEmailConfirmValid = useMemo(() => {
    return email === emailConfirm;
  }, [email, emailConfirm]);

  const isQuantityValid = useMemo(() => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return false;
    const max = getMaxQuantity();
    return qty <= max;
  }, [quantity, getMaxQuantity]);

  const isFormValid = useMemo(() => {
    if (!selectedVariantId || !isQuantityValid) return false;

    if (checkoutMode === CheckoutMode.GUEST) {
      return isEmailValid && isEmailConfirmValid;
    }

    return true;
  }, [
    selectedVariantId,
    isQuantityValid,
    checkoutMode,
    isEmailValid,
    isEmailConfirmValid,
  ]);

  // NetID Checkout action (used by AuthActionButton)
  const handleIllinoisCheckout = async (
    accessToken: string,
    showError: ShowErrorFunction
  ) => {
    if (!turnstileToken) {
      showError(400, 'Please complete the security verification.');
      return;
    }
    try {
      const syncIfRequired = async () => {
        const syncIsRequired =
          await genericApiClient.apiV1SyncIdentityIsRequiredGet({
            xUiucToken: accessToken,
          });
        if (syncIsRequired.syncRequired) {
          await genericApiClient.apiV1SyncIdentityPost({
            xUiucToken: accessToken,
          });
        }
      };
      const syncPromise = syncIfRequired();

      const checkoutResponse = await storeApiClient.apiV1StoreCheckoutPost({
        xTurnstileResponse: turnstileToken,
        xUiucToken: accessToken,
        apiV1StoreCheckoutPostRequest: {
          items: [
            {
              productId: id,
              variantId: selectedVariantId,
              quantity: parseInt(quantity, 10),
            },
          ],
          successRedirPath: `/store/paid`,
          cancelRedirPath: `/store?id=${id}`,
        },
      });
      await syncPromise;
      window.location.replace(checkoutResponse['checkoutUrl']);
    } catch (e) {
      if (e instanceof ResponseError) {
        const response = await e.response.json();
        showError(
          response.id || e.response.status,
          response.message ||
            'An error occurred and your request could not be processed.'
        );
      } else {
        showError(
          400,
          'An error occurred and your request could not be processed.'
        );
      }
    }
  };

  // Guest checkout handler
  const handleGuestCheckout = async () => {
    setIsLoading(true);

    if (!turnstileToken) {
      showError(400, 'Please complete the security verification.');
      setIsLoading(false);
      return;
    }

    try {
      const checkoutResponse = await storeApiClient.apiV1StoreCheckoutPost({
        xTurnstileResponse: turnstileToken,
        apiV1StoreCheckoutPostRequest: {
          items: [
            {
              productId: id,
              variantId: selectedVariantId,
              quantity: parseInt(quantity, 10),
            },
          ],
          successRedirPath: `/store/paid`,
          cancelRedirPath: `/store?id=${id}`,
          email,
        },
      });
      window.location.replace(checkoutResponse['checkoutUrl']);
    } catch (e) {
      if (e instanceof ResponseError) {
        const response = await e.response.json();
        showError(
          response.id || e.response.status,
          response.message ||
            'An error occurred and your request could not be processed.'
        );
      } else {
        showError(
          400,
          'An error occurred and your request could not be processed.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const baseReturn = (
    <ErrorPopup
      error={error}
      onClose={() => {
        clearError();
        window.location.href = '/store';
      }}
    />
  );

  if (!productInfo || (user && !membershipPreloaded)) {
    return (
      <main className="relative flex flex-1 justify-center px-4 mt-20 py-8 lg:mt-24 lg:py-12">
        <ReactNavbar
          currentPath={currentPath}
          breadcrumbs={[{ href: '/store', label: 'Store' }]}
          bannerWhiteSrc={bannerWhiteSrc}
          bannerBlueSrc={bannerBlueSrc}
        />

        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-tangerine-100 opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-navy-100 opacity-50 blur-3xl" />
        </div>

        {baseReturn}
        <LoadingSpinner />
      </main>
    );
  }

  const nowMs = Date.now();
  const openAtMs = productInfo.openAt ? productInfo.openAt * 1000 : null;
  const closeAtMs = productInfo.closeAt ? productInfo.closeAt * 1000 : null;
  const isOpen =
    openAtMs && openAtMs <= nowMs && (!closeAtMs || closeAtMs > nowMs);

  // Determine if we should show the "sign in to see pricing" prompt
  // Show it when: NetID Checkout mode, user not logged in, and there are member lists
  const hasMemberPricing =
    activeMemberLists !== null && activeMemberLists.length > 0;
  const showSignInForPricing =
    checkoutMode === CheckoutMode.ILLINOIS && !user && hasMemberPricing;

  return (
    <main className="relative flex flex-1 justify-center px-4 mt-20 py-8 lg:mt-24 lg:py-12">
      <ReactNavbar
        currentPath={currentPath}
        breadcrumbs={[
          { href: '/store', label: 'Store' },
          { href: `/store?id=${id}`, label: productInfo.name || 'Product' },
        ]}
        bannerWhiteSrc={bannerWhiteSrc}
        bannerBlueSrc={bannerBlueSrc}
      />

      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-tangerine-100 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-navy-100 opacity-50 blur-3xl" />
      </div>

      {baseReturn}

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column - Product image and info */}
          <div className="space-y-6">
            {/* Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-100 shadow-lg">
              {productInfo.imageUrl ? (
                <img
                  src={productInfo.imageUrl}
                  alt={productInfo.name || 'Product image'}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-wisteria-100">
                  <span className="text-6xl text-navy-300">📦</span>
                </div>
              )}

              {/* Status badges */}
              {(!isOpen || isLowStock || isOutOfStock) && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {!isOpen && (
                    <div className="rounded-full bg-navy-800/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      {openAtMs && openAtMs > nowMs ? 'Coming Soon' : 'Closed'}
                    </div>
                  )}
                  {isLowStock && (
                    <div className="rounded-full bg-tangerine-600/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      Low Stock
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="rounded-full bg-rose-600/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      Out of Stock
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product info card */}
            <div className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
              <h1 className="mb-4 text-3xl font-bold text-navy-900">
                {productInfo.name}
              </h1>

              {productInfo.description && (
                <p className="whitespace-pre-line text-navy-700">
                  {productInfo.description}
                </p>
              )}

              {/* Pricing summary */}
              {priceDisplay &&
                (priceDisplay.member || priceDisplay.nonMember) && (
                  <div className="mt-6 space-y-2 rounded-lg bg-surface-050 p-4">
                    {priceDisplay.member && (
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium text-navy-600">
                          Member Price:
                        </span>
                        <span className="text-xl font-bold text-navy-600">
                          {priceDisplay.member}
                        </span>
                      </div>
                    )}
                    {priceDisplay.nonMember && (
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`text-sm font-medium ${showMemberPricing ? 'text-gray-300 line-through' : 'text-tangerine-900'}`}
                        >
                          {priceDisplay.member ? 'Non-Member Price:' : 'Price:'}
                        </span>
                        <span
                          className={`text-xl font-bold ${showMemberPricing ? 'text-gray-300 line-through' : 'text-tangerine-900'}`}
                        >
                          {priceDisplay.nonMember}
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Right column - Purchase form */}
          <div className="rounded-xl border border-navy-200 bg-white p-6 shadow-lg lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-6 text-xl font-bold text-navy-900">
              Purchase Options
            </h2>
            {isOutOfStock && (
              <p className="text-gray-500">
                This item is out of stock. Please check back later!
              </p>
            )}
            {/* Checkout mode tabs */}
            {!isOutOfStock && (
              <>
                <div className="mb-6 flex gap-2 rounded-lg bg-surface-100 p-1">
                  <button
                    onClick={() => setCheckoutMode(CheckoutMode.ILLINOIS)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      checkoutMode === CheckoutMode.ILLINOIS
                        ? 'bg-white text-navy-900 shadow-sm'
                        : 'text-navy-600 hover:text-navy-900'
                    }`}
                  >
                    NetID Checkout
                  </button>
                  {!productInfo.verifiedIdentityRequired && (
                    <button
                      onClick={() => setCheckoutMode(CheckoutMode.GUEST)}
                      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        checkoutMode === CheckoutMode.GUEST
                          ? 'bg-white text-navy-900 shadow-sm'
                          : 'text-navy-600 hover:text-navy-900'
                      }`}
                    >
                      Guest Checkout
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Guest email fields */}
                  {checkoutMode === CheckoutMode.GUEST && (
                    <>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-navy-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail((e.target as HTMLInputElement).value)
                          }
                          className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                            email && !isEmailValid
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-navy-200 focus:border-navy-500'
                          }`}
                          placeholder="your@email.com"
                        />
                        {email && !isEmailValid && (
                          <p className="mt-1 text-xs text-rose-600">
                            Invalid email
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-navy-700">
                          Confirm Email
                        </label>
                        <input
                          type="email"
                          value={emailConfirm}
                          onChange={(e) =>
                            setEmailConfirm(
                              (e.target as HTMLInputElement).value
                            )
                          }
                          className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                            emailConfirm && !isEmailConfirmValid
                              ? 'border-rose-500 focus:border-rose-600'
                              : 'border-navy-200 focus:border-navy-500'
                          }`}
                          placeholder="your@email.com"
                        />
                        {emailConfirm && !isEmailConfirmValid && (
                          <p className="mt-1 text-xs text-rose-600">
                            Emails do not match
                          </p>
                        )}
                      </div>

                      <div className="border-t border-navy-200 pt-4" />
                    </>
                  )}

                  {/* Variant selection */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy-700">
                      {productInfo.variantFriendlyName}
                    </label>
                    <select
                      value={selectedVariantId}
                      onChange={(e) => {
                        const val = (e.target as HTMLSelectElement).value;
                        if (val !== '') {
                          setSelectedVariantId(val);
                          // Reset membership to loading if this variant's lists aren't cached yet
                          if (user && checkoutMode === CheckoutMode.ILLINOIS) {
                            const variant = productInfo.variants.find(
                              (v) => v.variantId === val
                            );
                            const lists = variant?.memberLists;
                            if (lists && lists.length > 0) {
                              const cacheKey = createCacheKey(lists);
                              if (!membershipCache.current.has(cacheKey)) {
                                setIsPaidMember(undefined);
                              }
                            }
                          }
                        }
                      }}
                      className="w-full rounded-lg border border-navy-200 px-3 py-2 outline-none transition-colors focus:border-navy-500"
                    >
                      <option value="" disabled hidden>
                        Select {productInfo.variantFriendlyName}
                      </option>
                      {productInfo.variants.map((variant) => {
                        const isSoldOut =
                          (productInfo.inventoryMode === 'PER_VARIANT' &&
                            (variant.inventoryCount ?? 0) === 0) ||
                          (productInfo.inventoryMode === 'PER_PRODUCT' &&
                            productInfo.totalInventoryCount === 0);

                        return (
                          <option
                            key={variant.variantId}
                            value={variant.variantId ?? ''}
                            disabled={isSoldOut}
                          >
                            {variant.name} {isSoldOut ? '[SOLD OUT]' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-navy-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={getMaxQuantity()}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity((e.target as HTMLInputElement).value)
                      }
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                        quantity && !isQuantityValid
                          ? 'border-rose-500 focus:border-rose-600'
                          : 'border-navy-200 focus:border-navy-500'
                      }`}
                    />
                    {selectedVariantId !== '' && (
                      <p className="mt-1 text-xs text-navy-600">
                        Max: {getMaxQuantity()}
                      </p>
                    )}
                    {quantity &&
                      !isQuantityValid &&
                      selectedVariantId !== '' && (
                        <p className="mt-1 text-xs text-rose-600">
                          Invalid quantity (max {getMaxQuantity()})
                        </p>
                      )}
                  </div>

                  {/* Total price */}
                  {selectedVariant &&
                    isQuantityValid &&
                    checkoutMode === CheckoutMode.ILLINOIS &&
                    user &&
                    isPaidMember === undefined && (
                      <div className="rounded-lg bg-surface-050 p-4 flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-rose-600" />
                      </div>
                    )}
                  {selectedVariant &&
                    isQuantityValid &&
                    (checkoutMode === CheckoutMode.GUEST ||
                      isPaidMember !== undefined) &&
                    (checkoutMode === CheckoutMode.GUEST || user) && (
                      <div className="rounded-lg bg-surface-050 p-4">
                        <div className="mb-2 flex items-baseline justify-between">
                          <span className="text-sm font-medium text-navy-700">
                            Total:
                          </span>
                          <span className="text-2xl font-bold text-navy-900">
                            $
                            {checkoutMode === CheckoutMode.ILLINOIS &&
                            isPaidMember &&
                            memberPrice !== null
                              ? memberPrice.toFixed(2)
                              : (nonMemberPrice?.toFixed(2) ?? '0.00')}
                          </span>
                        </div>
                        {checkoutMode === CheckoutMode.ILLINOIS &&
                          isPaidMember &&
                          memberPrice !== null &&
                          nonMemberPrice !== null &&
                          savings !== null &&
                          selectedVariant.memberLists.includes('acmpaid') && (
                            <p className="text-xs text-green-600 font-medium">
                              You save ${savings.toFixed(2)} with your
                              membership!
                            </p>
                          )}
                        {checkoutMode === CheckoutMode.ILLINOIS &&
                          isPaidMember === false &&
                          memberPrice !== null &&
                          nonMemberPrice !== null &&
                          nonMemberPrice > memberPrice &&
                          selectedVariant.memberLists.includes('acmpaid') && (
                            <p className="text-xs text-navy-600">
                              ACM paid members pay ${memberPrice.toFixed(2)} —
                              save ${(nonMemberPrice - memberPrice).toFixed(2)}
                            </p>
                          )}
                      </div>
                    )}

                  {/* Sign in prompt in form area */}
                  {selectedVariant &&
                    isQuantityValid &&
                    showSignInForPricing && (
                      <div className="rounded-lg border border-dashed border-navy-300 bg-surface-050 p-4 text-center">
                        <p className="mb-2 text-sm text-navy-700">
                          Sign in to see your price
                        </p>
                        <button
                          onClick={handleLoginForPricing}
                          className="rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-800"
                        >
                          Sign in with your NetID
                        </button>
                      </div>
                    )}

                  <div className="w-full">
                    <Turnstile
                      ref={turnstileRef}
                      id={id}
                      siteKey={turnstileSiteKey}
                      onSuccess={setTurnstileToken}
                      onExpire={() => {
                        setTurnstileToken(undefined);
                        turnstileRef.current?.reset();
                      }}
                      onError={() => {
                        setTurnstileToken(undefined);
                        turnstileRef.current?.reset();
                      }}
                      options={{
                        size: 'flexible',
                        theme: 'light',
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Purchase button */}
                  {isFormValid &&
                    !showSignInForPricing &&
                    (checkoutMode === CheckoutMode.GUEST ||
                      isPaidMember !== undefined) &&
                    (checkoutMode === CheckoutMode.ILLINOIS ? (
                      <AuthActionButton
                        icon={ShoppingCart}
                        defaultText={`Purchase for $${isPaidMember && memberPrice !== null ? memberPrice.toFixed(2) : (nonMemberPrice?.toFixed(2) ?? '0.00')}`}
                        workingText="Processing..."
                        onAction={handleIllinoisCheckout}
                        returnPath={`/store?id=${id}&variant=${encodeURIComponent(selectedVariantId)}&quantity=${encodeURIComponent(quantity)}&authButtonClick`}
                      />
                    ) : (
                      <button
                        onClick={handleGuestCheckout}
                        disabled={!isFormValid || isLoading || isOutOfStock}
                        className="w-full whitespace-nowrap rounded-lg bg-tangerine-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-tangerine-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading
                          ? 'Processing...'
                          : `Purchase for $${nonMemberPrice?.toFixed(2) ?? '0.00'}`}
                      </button>
                    ))}
                  {productInfo.limitConfiguration &&
                    productInfo.limitConfiguration.maxQuantity > 0 && (
                      <p className="text-center text-xs text-navy-600">
                        Limit {productInfo.limitConfiguration.maxQuantity} per{' '}
                        {productInfo.limitConfiguration.limitType ===
                        'PER_PRODUCT'
                          ? 'product'
                          : productInfo.variantFriendlyName.toLowerCase()}
                      </p>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StoreItem;
