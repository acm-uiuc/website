'use client';
import React, { Suspense } from 'react';
import { useEffect, useMemo, useState } from 'react';
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
import axios from 'axios';
import Layout from '../MembershipLayout';
import { IPublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { getUserAccessToken, initMsalClient } from '@/utils/msal';
import { syncIdentity } from '@/utils/api';
import { Turnstile } from '@marsidev/react-turnstile';
import { transformApiResponse } from '../merch-store/transform';

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

enum InputStatus {
  EMPTY,
  INVALID,
  VALID,
}

const coreBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

if (!turnstileSiteKey) {
  throw new Error("Turnstile site key missing.")
}

const WrappedMerchItem = () => {
  return (
    <Suspense>
      <MerchItem />
    </Suspense>
  );
};

const MerchItem = () => {
  const itemid = useSearchParams().get('id') || '';
  const [merchList, setMerchList] = useState<Record<string, any>>({});
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);
  const [token, setToken] = React.useState<string>()

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

  // State for Illinois email detection
  const [pendingPurchase, setPendingPurchase] = useState(false);

  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const clearTurnstileToken = () => setToken(undefined);
  const turnstileWidget = (id: string) => <Turnstile
    id={id}
    siteKey={turnstileSiteKey}
    onSuccess={setToken}
    onExpire={clearTurnstileToken}
    onError={clearTurnstileToken}
  />;

  useEffect(() => {
    (async () => {
      metaLoader();
      const pcaInstance = await initMsalClient();
      setPca(pcaInstance);
      const account = pcaInstance.getActiveAccount();
      setUser(account);

      // Check membership status if user is already logged in
      if (account) {
        try {
          const accessToken = await getUserAccessToken(pcaInstance);
          if (accessToken) {
            const url = `${coreBaseUrl}/api/v1/membership`;
            const response = await axios.get(url, { headers: { 'x-uiuc-token': accessToken } });
            setIsPaidMember(response.data.isPaidMember || false);
          }
        } catch (error) {
          console.error('Failed to check membership status:', error);
          setIsPaidMember(false);
        }
      }
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
      window.location.replace("/merch-store")
    }
  };
  const getMaxQuantity = (variantId: string) => {
    if (!variantId || !merchList.total_avail) return 0;
    const available = Math.min(merchList.total_avail[variantId] || 0, 10);
    if (merchList.limit_per_person > 0) {
      return Math.min(available, merchList.limit_per_person);
    }
    return available;
  };
  const metaLoader = async () => {
    const url = `${coreBaseUrl}/api/v1/store/products/${itemid}`;
    axios
      .get(url)
      .then((response) => {
        const transformed = transformApiResponse({ products: [response.data] })[0];
        if (response.data['verifiedIdentityRequired']) {
          setForceIllinoisLogin(true);
        }
        setMerchList(transformed);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setTimeout(() => {
            setErrorMessage({
              title: "Error retrieving product",
              code: 404,
              message: error.response.data.message,
            });
            setMerchList({ failed: true });
            setIsLoading(false);
            modalErrorMessage.onOpen();
          }, 1000);
        }
      });
  };

  const handleApiError = (error: any) => {
    if (!error.response) {
      setErrorMessage({ code: 500, message: 'Network error. Please try again.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }
    const { status, data } = error.response;
    setErrorMessage({
      code: data.id || status,
      message: data.message || 'An error occurred and your request could not be processed.',
    });
    setIsLoading(false);
    modalErrorMessage.onOpen();
  };

  const checkMembershipStatus = async () => {
    if (!pca) return;

    try {
      const accessToken = await getUserAccessToken(pca);
      if (!accessToken) return;

      const url = `${coreBaseUrl}/api/v1/membership`;
      const response = await axios.get(url, { headers: { 'x-uiuc-token': accessToken } });
      setIsPaidMember(response.data.isPaidMember || false);
    } catch (error) {
      // Silently fail - if we can't check membership, we'll use non-member pricing
      console.error('Failed to check membership status:', error);
      setIsPaidMember(false);
    }
  };

  const loginHandler = async () => {
    setIsLoading(true);
    if (!pca) {
      setErrorMessage({ code: 403, message: 'Authentication service is not initialized.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }
    try {
      await getUserAccessToken(pca);
      const account = pca.getActiveAccount();
      setUser(account);

      // Check membership status after login
      await checkMembershipStatus();

      // Note: If pendingPurchase is true, the useEffect will automatically trigger the purchase
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
    await pca.clearCache();
    await pca.setActiveAccount(null);
  };

  const completePurchase = async () => {
    if (!pca) {
      setErrorMessage({ code: 403, message: 'Authentication service is not initialized.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    if (!token) {
      setErrorMessage({ code: 400, message: 'Please complete the security verification.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    const accessToken = await getUserAccessToken(pca);
    if (!accessToken) {
      setErrorMessage({ code: 403, message: 'Failed to retrieve authentication token.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    await syncIdentity(accessToken);

    const url = `${coreBaseUrl}/api/v1/store/checkout`;
    axios.post(url, {
      items: [
        { productId: itemid, variantId: size, quantity: parseInt(quantity, 10) }
      ],
      successRedirPath: `/merch-paid?id=${itemid}`,
      cancelRedirPath: `/merch?id=${itemid}`
    }, {
      headers: {
        'x-uiuc-token': accessToken,
        'x-turnstile-response': token,
      }
    })
      .then(response => window.location.replace(response.data['checkoutUrl']))
      .catch(handleApiError);
  };

  const purchaseHandler = async () => {
    setIsLoading(true);

    if (!token) {
      setErrorMessage({ code: 400, message: 'Please complete the security verification.' });
      modalErrorMessage.onOpen();
      setIsLoading(false);
      return;
    }

    if (selectedTab === 'illinois') {
      if (!pca || !user) {
        setErrorMessage({ code: 403, message: 'You must be logged in to purchase with Illinois Checkout.' });
        modalErrorMessage.onOpen();
        setIsLoading(false);
        return;
      }
      await completePurchase();
    } else { // Guest flow
      // Non-Illinois email, use guest checkout
      const url = `${coreBaseUrl}/api/v1/store/checkout`;
      axios.post(url, {
        items: [
          { productId: itemid, variantId: size, quantity: parseInt(quantity, 10) }
        ],
        successRedirPath: `/merch-paid?id=${itemid}`,
        cancelRedirPath: `/merch?id=${itemid}`,
        email
      }, {
        headers: {
          'x-turnstile-response': token,
        }
      })
        .then(response => window.location.replace(response.data['checkoutUrl']))
        .catch(handleApiError);
    }
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const changeSize = (e: { target: { value: React.SetStateAction<string> } }) => setSize(e.target.value);
  const validateQuantity = (value: string) => {
    const num = parseInt(value);
    if (Number.isNaN(num) || num <= 0) return false;
    const maxQty = getMaxQuantity(size);
    if (maxQty > 0 && num > maxQty) return false;
    return true;
  };
  const totalCapacity = () => Object.values(merchList.total_avail || {}).reduce((acc: any, val: any) => acc + val, 0);
  const filterSoldOut = (variantId: string) =>
    !(variantId in merchList.total_avail) || merchList.total_avail[variantId] === 0;

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
    if (selectedTab === 'guest' && isIllinoisEmail && inputEmailStatus === InputStatus.VALID && inputEmailConfirmStatus === InputStatus.VALID) {
      setSelectedTab('illinois');
    }
  }, [selectedTab, isIllinoisEmail, inputEmailStatus, inputEmailConfirmStatus]);

  const isFormValidated = useMemo(() => {
    const commonFieldsValid = size !== '' && inputQuantityStatus === InputStatus.VALID;
    if (!commonFieldsValid) return false;

    if (selectedTab === 'illinois') {
      return !!user;
    }
    return inputEmailStatus === InputStatus.VALID && inputEmailConfirmStatus === InputStatus.VALID;
  }, [size, inputQuantityStatus, selectedTab, user, inputEmailStatus, inputEmailConfirmStatus]);
  const modal = <Modal
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
        <p className="text-center">
          {errorMessage && errorMessage.message}
        </p>
        {errorMessage && errorMessage.code && (
          <p>
            If you believe you are receiving this message in error, contact the{' '}
            <a href="mailto:infra@acm.illinois.edu">ACM Infrastructure Team</a>{' '}
            with the error code.
          </p>
        )}
      </ModalBody>
      <ModalFooter />
    </ModalContent>
  </Modal>
  const totalPrice = useMemo(() => {
    const q = parseInt(quantity);
    if (!merchList.item_price || isNaN(q) || q <= 0) {
      return '...';
    }
    // Use member pricing if in Illinois checkout AND user is a paid member
    const pricePerItem = (selectedTab === 'illinois' && isPaidMember)
      ? merchList.item_price.paid
      : merchList.item_price.others;
    return decimalHelper(pricePerItem * q);
  }, [quantity, selectedTab, merchList.item_price, isPaidMember]);
  if (Object.keys(merchList).length === 0) {
    if (itemid === '' && typeof window !== "undefined") {
      window.location.replace('../merch-store');
      return <Layout name="Merch Store"></Layout>;
    }
    return <Layout name="Merch Store"></Layout>;
  } else if (Object.keys(merchList).length === 1) {
    return <Layout name="Merch Store">
      <>{modal}</>
    </Layout>;

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
                {merchList['item_image'] && <img alt={merchList['item_name'] + ' image.'} src={merchList['item_image']} />}
                {merchList['description'] && <p style={{ whiteSpace: 'pre-line' }}>{merchList['description']}</p>}
                {((totalCapacity() as number) < 10 && (totalCapacity() as number) > 0) && <p><b>We are running out, order soon!</b></p>}
                {((totalCapacity() as number) == 0) && <p><b>All variants are sold out!</b></p>}
                <p>
                  <b>Cost:</b> ${decimalHelper(merchList['item_price']['paid'])} for members, ${decimalHelper(merchList['item_price']['others'])} for non-members.
                </p>
                {merchList['limit_per_person'] > 0 && <i>Limit {merchList['limit_per_person']} per person.</i>}

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
                          <p style={{ fontSize: '0.9rem' }}>Log in with your Illinois NetID. Your membership status will be validated at checkout.</p>
                          <Button color="primary" onPress={loginHandler} isLoading={isLoading && !user}>
                            Login with Illinois NetID
                          </Button>
                        </>
                      ) : (
                        <>
                          {isPaidMember === null ? (
                            <p style={{ fontSize: '0.9rem' }}>Checking membership status...</p>
                          ) : isPaidMember ? (
                            <p style={{ fontSize: '0.9rem', color: '#00a86b' }}>
                              <b>Paid Member</b> - You qualify for member pricing!
                            </p>
                          ) : (
                            <p style={{ fontSize: '0.9rem', color: '#ff9500' }}>
                              <b>Not a Paid Member</b> - Non-member pricing will apply.
                            </p>
                          )}
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
                              ?.filter((v: { id: string; name: string }) => filterSoldOut(v.id))
                              .map((v: { id: string; name: string }) => v.id)}
                            onChange={changeSize}
                          >
                            {merchList['variants']?.map((v: { id: string; name: string }) => (
                              <SelectItem key={v.id} textValue={v.name}>
                                {filterSoldOut(v.id) ? v.name + ' [SOLD OUT]' : v.name}
                              </SelectItem>
                            ))}
                          </Select>
                          <Input
                            value={quantity} onValueChange={setQuantity} label="Quantity" variant="bordered"
                            isInvalid={inputQuantityStatus === InputStatus.INVALID}
                            color={inputQuantityStatus === InputStatus.INVALID ? 'danger' : 'default'}
                            errorMessage={inputQuantityStatus === InputStatus.INVALID && `Invalid Quantity (max ${getMaxQuantity(size)})`}
                          />
                          {turnstileWidget('wid1')}
                          <Button
                            color="primary" size="lg"
                            isDisabled={!isFormValidated || isLoading || totalCapacity() === 0}
                            onPress={purchaseHandler}
                            isLoading={isLoading}
                          >
                            {isLoading ? 'Processing...' : `Purchase for $${totalPrice}`}
                          </Button>
                        </>
                      )}
                    </div>
                  </Tab>
                  {!forceIllinoisLogin &&
                    <Tab key="guest" title="Guest Checkout">
                      <div className="flex flex-col gap-4 pb-4">
                        <p style={{ fontSize: '0.9rem' }}>Continue without logging in. You will be charged the non-member price.</p>
                        <Input
                          value={email} onValueChange={setEmail} label="Email" variant="bordered"
                          isInvalid={inputEmailStatus === InputStatus.INVALID}
                          color={inputEmailStatus === InputStatus.INVALID ? 'danger' : 'default'}
                          errorMessage={inputEmailStatus === InputStatus.INVALID && 'Invalid Email'}
                        />
                        <Input
                          value={emailConfirm} onValueChange={setEmailConfirm} label="Confirm Email" variant="bordered"
                          isInvalid={inputEmailConfirmStatus === InputStatus.INVALID}
                          color={inputEmailConfirmStatus === InputStatus.INVALID ? 'danger' : 'default'}
                          errorMessage={inputEmailConfirmStatus === InputStatus.INVALID && 'Emails do not match'}
                        />
                        <Divider />
                        <Select
                          isRequired
                          label={merchList['variant_friendly_name'] || 'Size'}
                          placeholder="Select one"
                          selectedKeys={[size]}
                          disabledKeys={merchList['sizes'].filter(filterSoldOut)}
                          onChange={changeSize}
                        >
                          {merchList['sizes'].map((val: string) => (
                            <SelectItem key={val} textValue={val}>
                              {filterSoldOut(val) ? val + ' [SOLD OUT]' : val}
                            </SelectItem>
                          ))}
                        </Select>
                        <Input
                          value={quantity} onValueChange={setQuantity} label="Quantity" variant="bordered"
                          isInvalid={inputQuantityStatus === InputStatus.INVALID}
                          color={inputQuantityStatus === InputStatus.INVALID ? 'danger' : 'default'}
                          errorMessage={inputQuantityStatus === InputStatus.INVALID && `Invalid Quantity (max ${getMaxQuantity(size)})`}
                          description={size ? `Max: ${getMaxQuantity(size)}` : undefined}
                        />
                        {turnstileWidget('wid2')}
                        <Button
                          color="primary" size="lg"
                          isDisabled={!isFormValidated || isLoading || totalCapacity() === 0}
                          onPress={purchaseHandler}
                          isLoading={isLoading}
                        >
                          {isLoading ? 'Processing...' : `Purchase for $${totalPrice}`}
                        </Button>
                      </div>
                    </Tab>
                  }
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </Layout >
        {modal}
      </>
    );
  }
};

export default WrappedMerchItem;
