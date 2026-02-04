'use client';
import React, { Suspense } from 'react';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from '@heroui/react';
import Layout from '../../MembershipLayout';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { getUserAccessToken, initMsalClient } from '@/utils/msal';
import { membershipApiClient, storeApiClient, syncIdentity } from '@/utils/api';
import { Turnstile } from '@marsidev/react-turnstile';
import { transformApiProduct, transformApiResponse } from '../transform';
import {
  ApiV1StoreProductsGet200Response,
  ResponseError,
} from '@acm-uiuc/core-client';
import pluralize from 'pluralize';

const decimalHelper = (num: number) => {
  if (Number.isInteger(num)) {
    return num;
  } else {
    return num.toFixed(2);
  }
};

interface ErrorCode {
  code?: number | string;
  message: string;
  title?: string;
}

interface Variant {
  id: string;
  name: string;
  memberLists?: string[];
}

enum InputStatus {
  EMPTY,
  INVALID,
  VALID,
}

const coreBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

if (!turnstileSiteKey) {
  throw new Error('Turnstile site key missing.');
}

const WrappedMerchItem = () => {
  return (
    <Suspense>
      <MerchItem />
    </Suspense>
  );
};

// Helper to check if all variants have the same memberLists
const getAllVariantsMemberLists = (
  variants: Variant[] | undefined,
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

// Helper to create a cache key from lists
const createCacheKey = (lists: string[]): string => {
  return [...lists].sort().join(',');
};

const MerchItem = () => {
  const itemid = useSearchParams().get('id') || '';
  const [merchList, setMerchList] = useState<Record<string, any>>({});
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);
  const [token, setToken] = React.useState<string>();

  // Form State
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [size, setSize] = React.useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New states for tabs and user authentication
  const [selectedTab, setSelectedTab] = useState('illinois');
  const [forceIllinoisLogin, setForceIllinoisLogin] = useState<boolean>(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [isPaidMember, setIsPaidMember] = useState<boolean | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  // Cache for membership status checks: Map<cacheKey, isPaidMember>
  const membershipCache = useRef<Map<string, boolean>>(new Map());

  // Track the active membership check to guard against stale async responses
  const activeMembershipKeyRef = useRef<string | null>(null);

  // State for Illinois email detection
  const [pendingPurchase, setPendingPurchase] = useState(false);

  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const clearTurnstileToken = () => setToken(undefined);
  const turnstileWidget = (id: string) => (
    <Turnstile
      id={id}
      siteKey={turnstileSiteKey}
      onSuccess={setToken}
      onExpire={clearTurnstileToken}
      onError={clearTurnstileToken}
    />
  );

  // Get the selected variant object
  const selectedVariant = useMemo(() => {
    if (!size || !merchList.variants) return null;
    return merchList.variants.find((v: Variant) => v.id === size) || null;
  }, [size, merchList.variants]);

  // Get memberLists for the selected variant, or common lists if all variants share the same lists
  const activeMemberLists = useMemo(() => {
    if (
      selectedVariant?.memberLists &&
      selectedVariant.memberLists.length > 0
    ) {
      return selectedVariant.memberLists;
    }
    // If no variant selected, check if all variants have the same memberLists
    return getAllVariantsMemberLists(merchList.variants);
  }, [selectedVariant, merchList.variants]);

  // Check membership status with specific lists (with caching)
  const checkMembershipStatus = useCallback(
    async (lists: string[] | null) => {
      if (!pca || !user) return;

      // If no lists to check, user doesn't qualify for member pricing
      if (!lists || lists.length === 0) {
        activeMembershipKeyRef.current = null;
        setIsPaidMember(false);
        return;
      }

      const cacheKey = createCacheKey(lists);

      // Set active key and reset state for new check
      activeMembershipKeyRef.current = cacheKey;
      setIsPaidMember(null);

      // Check cache first
      if (membershipCache.current.has(cacheKey)) {
        setIsPaidMember(membershipCache.current.get(cacheKey)!);
        return;
      }

      setIsCheckingMembership(true);
      try {
        const accessToken = await getUserAccessToken(pca);
        if (!accessToken) {
          // Only apply if this is still the active check
          if (activeMembershipKeyRef.current === cacheKey) {
            setIsPaidMember(false);
            activeMembershipKeyRef.current = null;
            setIsCheckingMembership(false);
          }
          return;
        }

        const response = await membershipApiClient.apiV1MembershipGet({
          lists,
          xUiucToken: accessToken,
        });
        const result = response.isPaidMember || false;

        // Only apply result if this is still the active check (ignore stale responses)
        if (activeMembershipKeyRef.current === cacheKey) {
          membershipCache.current.set(cacheKey, result);
          setIsPaidMember(result);
          activeMembershipKeyRef.current = null;
          setIsCheckingMembership(false);
        }
      } catch (error) {
        console.error('Failed to check membership status:', error);
        // Only apply if this is still the active check
        if (activeMembershipKeyRef.current === cacheKey) {
          setIsPaidMember(false);
          activeMembershipKeyRef.current = null;
          setIsCheckingMembership(false);
        }
      }
    },
    [pca, user],
  );

  // Re-check membership when activeMemberLists changes (variant selection or initial load)
  useEffect(() => {
    if (user && activeMemberLists !== null) {
      checkMembershipStatus(activeMemberLists);
    } else if (user && activeMemberLists === null) {
      // No variant selected and variants have different memberLists - reset membership status
      activeMembershipKeyRef.current = null;
      setIsPaidMember(null);
    }
  }, [user, activeMemberLists, checkMembershipStatus]);

  useEffect(() => {
    (async () => {
      metaLoader();
      const pcaInstance = await initMsalClient();
      setPca(pcaInstance);
      const account = pcaInstance.getActiveAccount();
      setUser(account);
      // Note: membership check will be triggered by the activeMemberLists useEffect
    })();
  }, []);

  // Auto-trigger purchase when user logs in with pending purchase
  useEffect(() => {
    if (user && pendingPurchase && !isLoading) {
      setPendingPurchase(false);
      purchaseHandler();
    }
  }, [user, pendingPurchase, isLoading]);

  const errorMessageCloseHandler = () => {
    modalErrorMessage.onClose();
    setErrorMessage(null);
    if (Object.keys(merchList).length === 1) {
      window.location.replace('/store');
    }
  };

  const getMaxQuantity = (variantId: string) => {
    if (!variantId || !merchList.total_avail) return 0;
    const baseAvailable =
      merchList.total_avail[variantId] ?? merchList.total_avail.total ?? 0;
    const available = Math.min(baseAvailable, 10);
    if (merchList.limit_per_person > 0) {
      return Math.min(available, merchList.limit_per_person);
    }
    return available;
  };
  type Product = ApiV1StoreProductsGet200Response['products'][number];

  const metaLoader = async () => {
    try {
      const itemData = await storeApiClient.apiV1StoreProductsProductIdGet({
        productId: itemid,
      });
      const transformed = transformApiProduct(itemData);
      if (itemData['verifiedIdentityRequired']) {
        setForceIllinoisLogin(true);
      }
      setMerchList(transformed);
      setIsLoading(false);
    } catch (e) {
      window.location.href = '/store';
    }
  };

  const handleApiError = async (error: any) => {
    if (!error.response) {
      setErrorMessage({
        code: 500,
        message: 'Network error. Please try again.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }
    if (error instanceof ResponseError) {
      const response = await error.response.json();
      setErrorMessage({
        code: response.id || error.response.status,
        message:
          response.message ||
          'An error occurred and your request could not be processed.',
      });
    } else {
      setErrorMessage({
        code: 400,
        message: 'An error occurred and your request could not be processed.',
      });
    }

    setIsLoading(false);
    modalErrorMessage.onOpen();
  };

  const loginHandler = async () => {
    setIsLoading(true);
    if (!pca) {
      setErrorMessage({
        code: 403,
        message: 'Authentication service is not initialized.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }
    try {
      await getUserAccessToken(pca);
      const account = pca.getActiveAccount();
      setUser(account);
      // Clear cache and active membership key on new login since it's a potentially different user
      membershipCache.current.clear();
      activeMembershipKeyRef.current = null;
      // Note: membership check will be triggered by the activeMemberLists useEffect
    } catch (err) {
      setErrorMessage({ code: 403, message: 'Failed to authenticate NetID.' });
      modalErrorMessage.onOpen();
      setPendingPurchase(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async () => {
    if (!pca) return;
    setUser(null);
    setIsPaidMember(null);
    // Clear cache and active membership key on logout
    membershipCache.current.clear();
    activeMembershipKeyRef.current = null;
    await pca.clearCache();
    await pca.setActiveAccount(null);
  };

  const completePurchase = async () => {
    if (!pca) {
      setErrorMessage({
        code: 403,
        message: 'Authentication service is not initialized.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    if (!token) {
      setErrorMessage({
        code: 400,
        message: 'Please complete the security verification.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    const accessToken = await getUserAccessToken(pca);
    if (!accessToken) {
      setErrorMessage({
        code: 403,
        message: 'Failed to retrieve authentication token.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    await syncIdentity(accessToken);
    try {
      const checkoutResponse = await storeApiClient.apiV1StoreCheckoutPost({
        xTurnstileResponse: token,
        xUiucToken: accessToken,
        apiV1StoreCheckoutPostRequest: {
          items: [
            {
              productId: itemid,
              variantId: size,
              quantity: parseInt(quantity, 10),
            },
          ],
          successRedirPath: `/store/paid`,
          cancelRedirPath: `/store/item?id=${itemid}`,
        },
      });
      window.location.replace(checkoutResponse['checkoutUrl']);
    } catch (e) {
      handleApiError(e);
    }
  };

  const purchaseHandler = async () => {
    setIsLoading(true);

    if (!token) {
      setErrorMessage({
        code: 400,
        message: 'Please complete the security verification.',
      });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    if (selectedTab === 'illinois') {
      if (!pca || !user) {
        setErrorMessage({
          code: 403,
          message: 'You must be logged in to purchase with Illinois Checkout.',
        });
        modalErrorMessage.onOpen();
        setIsLoading(false);
        return;
      }
      await completePurchase();
    } else {
      // Guest flow
      try {
        const checkoutResponse = await storeApiClient.apiV1StoreCheckoutPost({
          xTurnstileResponse: token,
          apiV1StoreCheckoutPostRequest: {
            items: [
              {
                productId: itemid,
                variantId: size,
                quantity: parseInt(quantity, 10),
              },
            ],
            successRedirPath: `/store/paid`,
            cancelRedirPath: `/store/item?id=${itemid}`,
            email,
          },
        });
        window.location.replace(checkoutResponse['checkoutUrl']);
      } catch (e) {
        handleApiError(e);
      }
    }
  };

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const changeSize = (e: { target: { value: React.SetStateAction<string> } }) =>
    setSize(e.target.value);
  const validateQuantity = (value: string) => {
    const num = parseInt(value);
    if (Number.isNaN(num) || num <= 0) return false;
    const maxQty = getMaxQuantity(size);
    if (maxQty === 0) return false;
    if (num > maxQty) return false;
    return true;
  };
  const totalCapacity = () =>
    Object.values(merchList.total_avail || {}).reduce(
      (acc: any, val: any) => acc + val,
      0,
    );
  const filterSoldOut = (variantId: string) =>
    !(variantId in merchList.total_avail) ||
    merchList.total_avail[variantId] === 0;

  const inputQuantityStatus = useMemo(() => {
    if (quantity === '') return InputStatus.EMPTY;
    return validateQuantity(quantity) ? InputStatus.VALID : InputStatus.INVALID;
  }, [quantity, merchList.limit_per_person, size]);

  const inputEmailStatus = useMemo(() => {
    if (email === '') return InputStatus.EMPTY;
    return validateEmail(email) ? InputStatus.VALID : InputStatus.INVALID;
  }, [email]);

  const inputEmailConfirmStatus = useMemo(() => {
    if (emailConfirm === '') return InputStatus.EMPTY;
    return email === emailConfirm ? InputStatus.VALID : InputStatus.INVALID;
  }, [email, emailConfirm]);

  const isIllinoisEmail = useMemo(() => {
    return email.toLowerCase().endsWith('@illinois.edu');
  }, [email]);

  // Auto-switch to Illinois Checkout when Illinois email is confirmed
  useEffect(() => {
    if (
      selectedTab === 'guest' &&
      isIllinoisEmail &&
      inputEmailStatus === InputStatus.VALID &&
      inputEmailConfirmStatus === InputStatus.VALID
    ) {
      setSelectedTab('illinois');
    }
  }, [selectedTab, isIllinoisEmail, inputEmailStatus, inputEmailConfirmStatus]);

  const isFormValidated = useMemo(() => {
    const commonFieldsValid =
      size !== '' && inputQuantityStatus === InputStatus.VALID;
    if (!commonFieldsValid) return false;

    if (selectedTab === 'illinois') {
      return !!user;
    }
    return (
      inputEmailStatus === InputStatus.VALID &&
      inputEmailConfirmStatus === InputStatus.VALID
    );
  }, [
    size,
    inputQuantityStatus,
    selectedTab,
    user,
    inputEmailStatus,
    inputEmailConfirmStatus,
  ]);

  // Determine if we should show membership status (only when we can check it)
  const shouldShowMembershipStatus = useMemo(() => {
    return activeMemberLists !== null;
  }, [activeMemberLists]);

  const modal = (
    <Modal
      isOpen={modalErrorMessage.isOpen}
      onClose={errorMessageCloseHandler}
      onOpenChange={modalErrorMessage.onOpenChange}
    >
      <ModalContent>
        <ModalHeader />
        <ModalBody className="flex flex-col items-center">
          <p className="text-center text-2xl font-bold">
            {(errorMessage && errorMessage.title) || 'Verification Failed'}
          </p>
          <p className="text-center">
            Error Code: {errorMessage && errorMessage.code}
          </p>
          <p className="text-center">{errorMessage && errorMessage.message}</p>
          {errorMessage && errorMessage.code && (
            <p>
              If you believe you are receiving this message in error, contact
              the{' '}
              <a href="mailto:infra@acm.illinois.edu">
                ACM Infrastructure Team
              </a>{' '}
              with the error code.
            </p>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );

  const totalPrice = useMemo(() => {
    const q = parseInt(quantity);
    if (!merchList.item_price || isNaN(q) || q <= 0) {
      return '...';
    }
    // Use member pricing if in Illinois checkout AND user is a paid member AND we have membership lists to check
    const pricePerItem =
      selectedTab === 'illinois' && isPaidMember && shouldShowMembershipStatus
        ? merchList.item_price.paid
        : merchList.item_price.others;
    return decimalHelper(pricePerItem * q);
  }, [
    quantity,
    selectedTab,
    merchList.item_price,
    isPaidMember,
    shouldShowMembershipStatus,
  ]);

  // Render membership status message
  const renderMembershipStatus = () => {
    if (!shouldShowMembershipStatus) {
      return (
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Select a variant to check member pricing eligibility.
        </p>
      );
    }

    if (isCheckingMembership || isPaidMember === null) {
      return (
        <p style={{ fontSize: '0.9rem' }}>Checking membership status...</p>
      );
    }

    if (isPaidMember) {
      return (
        <p style={{ fontSize: '0.9rem', color: '#00a86b' }}>
          <b>Paid Member</b> - You qualify for member pricing!
        </p>
      );
    }

    return (
      <p style={{ fontSize: '0.9rem', color: '#ff9500' }}>
        <b>Not a Paid Member</b> - Non-member pricing will apply.
      </p>
    );
  };

  if (Object.keys(merchList).length === 0) {
    if (itemid === '' && typeof window !== 'undefined') {
      if (itemid === '' && typeof window !== 'undefined') {
        window.location.replace('/store');
        return <Layout name="Store"></Layout>;
      }
    }
    return <Layout name="Store"></Layout>;
  } else if (Object.keys(merchList).length === 1) {
    return (
      <Layout name="Store">
        <>{modal}</>
      </Layout>
    );
  } else {
    return (
      <>
        <Layout name={merchList['item_name']}>
          <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
            <Card className="max-w-[512px] mx-4 my-auto shrink-0">
              <CardHeader>
                <p className="font-bold">{merchList['item_name']}</p>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                {merchList['item_image'] && (
                  <img
                    alt={merchList['item_name'] + ' image.'}
                    src={merchList['item_image']}
                  />
                )}
                {merchList['description'] && (
                  <p style={{ whiteSpace: 'pre-line' }}>
                    {merchList['description']}
                  </p>
                )}
                {(totalCapacity() as number) < 10 &&
                  (totalCapacity() as number) > 0 && (
                    <p>
                      <b>We are running out, order soon!</b>
                    </p>
                  )}
                {(totalCapacity() as number) == 0 && (
                  <p>
                    <b>
                      All{' '}
                      {pluralize(
                        merchList['variant_friendly_name'] || 'Size',
                      ).toLowerCase()}{' '}
                      are sold out!
                    </b>
                  </p>
                )}
                <p>
                  <b>Cost:</b> ${decimalHelper(merchList['item_price']['paid'])}{' '}
                  for members, $
                  {decimalHelper(merchList['item_price']['others'])} for
                  non-members.
                </p>
                {merchList['limit_per_person'] > 0 && (
                  <i>Limit {merchList['limit_per_person']} per person.</i>
                )}

                <Tabs
                  fullWidth
                  aria-label="Purchase options"
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                >
                  <Tab key="illinois" title="Illinois Checkout">
                    <div className="flex flex-col gap-4 pb-4">
                      {!user ? (
                        <>
                          <p style={{ fontSize: '0.9rem' }}>
                            Log in with your Illinois NetID. Your membership
                            status will be validated at checkout.
                          </p>
                          <Button
                            color="primary"
                            onPress={loginHandler}
                            isLoading={isLoading && !user}
                          >
                            Login with Illinois NetID
                          </Button>
                        </>
                      ) : (
                        <>
                          {renderMembershipStatus()}
                          <div className="flex flex-col">
                            <Input
                              isReadOnly
                              disabled={true}
                              label="Email"
                              variant="bordered"
                              value={user.username}
                            />
                            <Button
                              size="sm"
                              variant="light"
                              color="primary"
                              className="self-end"
                              onPress={logoutHandler}
                            >
                              Not you? Log out
                            </Button>
                          </div>
                          <Divider />
                          <Select
                            isRequired
                            label={merchList['variant_friendly_name'] || 'Size'}
                            placeholder="Select one"
                            selectedKeys={[size]}
                            disabledKeys={merchList['variants']
                              ?.filter((v: Variant) => filterSoldOut(v.id))
                              .map((v: Variant) => v.id)}
                            onChange={changeSize}
                          >
                            {merchList['variants']?.map((v: Variant) => (
                              <SelectItem key={v.id} textValue={v.name}>
                                {filterSoldOut(v.id)
                                  ? v.name + ' [SOLD OUT]'
                                  : v.name}
                              </SelectItem>
                            ))}
                          </Select>
                          <Input
                            value={quantity}
                            onValueChange={setQuantity}
                            label="Quantity"
                            variant="bordered"
                            isInvalid={
                              inputQuantityStatus === InputStatus.INVALID
                            }
                            color={
                              inputQuantityStatus === InputStatus.INVALID
                                ? 'danger'
                                : 'default'
                            }
                            errorMessage={
                              inputQuantityStatus === InputStatus.INVALID &&
                              `Invalid Quantity (max ${getMaxQuantity(size)})`
                            }
                          />
                          {turnstileWidget('wid1')}
                          <Button
                            color="primary"
                            size="lg"
                            isDisabled={
                              !isFormValidated ||
                              isLoading ||
                              totalCapacity() === 0 ||
                              isPaidMember === null
                            }
                            onPress={purchaseHandler}
                            isLoading={isLoading}
                          >
                            {isPaidMember === null
                              ? 'Checking membership...'
                              : isLoading
                                ? 'Processing...'
                                : `Purchase for $${totalPrice}`}
                          </Button>
                        </>
                      )}
                    </div>
                  </Tab>
                  {!forceIllinoisLogin && (
                    <Tab key="guest" title="Guest Checkout">
                      <div className="flex flex-col gap-4 pb-4">
                        <p style={{ fontSize: '0.9rem' }}>
                          Continue without logging in. You will be charged the
                          non-member price.
                        </p>
                        <Input
                          value={email}
                          onValueChange={setEmail}
                          label="Email"
                          variant="bordered"
                          isInvalid={inputEmailStatus === InputStatus.INVALID}
                          color={
                            inputEmailStatus === InputStatus.INVALID
                              ? 'danger'
                              : 'default'
                          }
                          errorMessage={
                            inputEmailStatus === InputStatus.INVALID &&
                            'Invalid Email'
                          }
                        />
                        <Input
                          value={emailConfirm}
                          onValueChange={setEmailConfirm}
                          label="Confirm Email"
                          variant="bordered"
                          isInvalid={
                            inputEmailConfirmStatus === InputStatus.INVALID
                          }
                          color={
                            inputEmailConfirmStatus === InputStatus.INVALID
                              ? 'danger'
                              : 'default'
                          }
                          errorMessage={
                            inputEmailConfirmStatus === InputStatus.INVALID &&
                            'Emails do not match'
                          }
                        />
                        <Divider />
                        <Select
                          isRequired
                          label={merchList['variant_friendly_name'] || 'Size'}
                          placeholder="Select one"
                          selectedKeys={[size]}
                          disabledKeys={merchList['variants']
                            ?.filter((v: Variant) => filterSoldOut(v.id))
                            .map((v: Variant) => v.id)}
                          onChange={changeSize}
                        >
                          {merchList['variants']?.map((v: Variant) => (
                            <SelectItem key={v.id} textValue={v.name}>
                              {filterSoldOut(v.id)
                                ? v.name + ' [SOLD OUT]'
                                : v.name}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          value={quantity}
                          onValueChange={setQuantity}
                          label="Quantity"
                          variant="bordered"
                          isInvalid={
                            inputQuantityStatus === InputStatus.INVALID
                          }
                          color={
                            inputQuantityStatus === InputStatus.INVALID
                              ? 'danger'
                              : 'default'
                          }
                          errorMessage={
                            inputQuantityStatus === InputStatus.INVALID &&
                            `Invalid Quantity (max ${getMaxQuantity(size)})`
                          }
                          description={
                            size ? `Max: ${getMaxQuantity(size)}` : undefined
                          }
                        />
                        {turnstileWidget('wid2')}
                        <Button
                          color="primary"
                          size="lg"
                          isDisabled={
                            !isFormValidated ||
                            isLoading ||
                            totalCapacity() === 0
                          }
                          onPress={purchaseHandler}
                          isLoading={isLoading}
                        >
                          {isLoading
                            ? 'Processing...'
                            : `Purchase for $${totalPrice}`}
                        </Button>
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </Layout>
        {modal}
      </>
    );
  }
};

export default WrappedMerchItem;
