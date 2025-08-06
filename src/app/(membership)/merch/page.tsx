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

const baseUrl = process.env.NEXT_PUBLIC_MERCH_API_BASE_URL;

const WrapepdMerchItem = () => {
  return (
    <Suspense>
      <MerchItem />
    </Suspense>
  );
};

const MerchItem = () => {
  const itemid = useSearchParams().get('id') || '';
  const [merchList, setMerchList] = useState<Record<string, any>>({});
  const [merchLoaded, setMerchLoaded] = useState(false);
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [size, setSize] = React.useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New states for tabs and user authentication
  const [selectedTab, setSelectedTab] = useState('member');
  const [user, setUser] = useState<AccountInfo | null>(null);

  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  useEffect(() => {
    (async () => {
      metaLoader();
      const pcaInstance = await initMsalClient();
      setPca(pcaInstance);
      const account = pcaInstance.getActiveAccount();
      setUser(account);
    })();
  }, []);

  const errorMessageCloseHandler = () => {
    modalErrorMessage.onClose();
    setErrorMessage(null);
  };

  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/merch/details?itemid=${itemid}`;
    axios
      .get(url)
      .then((response) => {
        setMerchList(response.data);
        setMerchLoaded(true);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setTimeout(() => {
            setErrorMessage({
              title: 'Error 404',
              code: 'This event could not be loaded.',
              message: error.response.data.message,
            });
            setMerchList({
              member_price: '',
              nonmember_price: '',
              item_image: '',
              sizes: [],
              item_price: { paid: 999999, others: 999999 },
              eventDetails: '',
              item_id: '404_event',
              total_sold: {},
              total_avail: {},
              limit_per_person: -1,
              item_sales_active_utc: -1,
              item_name: '',
            });
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
    if (status === 422) {
      setErrorMessage({
        code: data.details[0].issue,
        message: data.details[0].description,
      });
    } else if (status === 400) {
      setErrorMessage({
        code: 400,
        message: `${data.errors[0].msg} for ${data.errors[0].param}`,
      });
    } else if (status === 404) {
      setErrorMessage({
        code: 'Merch not available.',
        message: data.message || data,
      });
    } else {
      setErrorMessage({
        code: status,
        message: `Internal server error: ${data.message || 'could not process request'}`,
      });
    }
    setIsLoading(false);
    modalErrorMessage.onOpen();
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
    } catch (err) {
      setErrorMessage({ code: 403, message: 'Failed to authenticate NetID.' });
      modalErrorMessage.onOpen();
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async () => {
    if (!pca) return;
    setUser(null);
    await pca.clearCache();
    await pca.setActiveAccount(null);
  };

  const purchaseHandler = async () => {
    setIsLoading(true);

    if (selectedTab === 'member') {
      if (!pca || !user) {
        setErrorMessage({ code: 403, message: 'You must be logged in to purchase as a member.' });
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
      const url = `${baseUrl}/api/v1/checkout/session?itemid=${itemid}&size=${size}&quantity=${quantity}`;
      axios.get(url, { headers: { 'x-uiuc-token': accessToken } })
        .then(response => window.location.replace(response.data))
        .catch(handleApiError);

    } else { // Guest flow
      const url = `${baseUrl}/api/v1/checkout/session?itemid=${itemid}&size=${size}&quantity=${quantity}&email=${email}`;
      axios.get(url) // No auth token needed
        .then(response => window.location.replace(response.data))
        .catch(handleApiError);
    }
  };

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const changeSize = (e: { target: { value: React.SetStateAction<string> } }) => setSize(e.target.value);
  const validateQuantity = (value: string) => {
    const num = parseInt(value);
    if (Number.isNaN(num) || num <= 0) return false;
    if (merchList.limit_per_person > 0 && num > merchList.limit_per_person) return false;
    return true;
  };
  const totalCapacity = () => Object.values(merchList.total_avail || {}).reduce((acc: any, val: any) => acc + val, 0);
  const filterSoldOut = (value: string) => !(value in merchList.total_avail) || merchList.total_avail[value] === 0;

  const inputQuantityStatus = useMemo(() => {
    if (quantity === '') return InputStatus.EMPTY;
    return validateQuantity(quantity) ? InputStatus.VALID : InputStatus.INVALID;
  }, [quantity, merchList.limit_per_person]);

  const inputEmailStatus = useMemo(() => {
    if (email === '') return InputStatus.EMPTY;
    return validateEmail(email) ? InputStatus.VALID : InputStatus.INVALID;
  }, [email]);

  const inputEmailConfirmStatus = useMemo(() => {
    if (emailConfirm === '') return InputStatus.EMPTY;
    return email === emailConfirm ? InputStatus.VALID : InputStatus.INVALID;
  }, [email, emailConfirm]);

  const isFormValidated = useMemo(() => {
    const commonFieldsValid = size !== '' && inputQuantityStatus === InputStatus.VALID;
    if (!commonFieldsValid) return false;

    if (selectedTab === 'member') {
      return !!user;
    }
    return inputEmailStatus === InputStatus.VALID && inputEmailConfirmStatus === InputStatus.VALID;
  }, [size, inputQuantityStatus, selectedTab, user, inputEmailStatus, inputEmailConfirmStatus]);

  const totalPrice = useMemo(() => {
    const q = parseInt(quantity);
    if (!merchList.item_price || isNaN(q) || q <= 0) {
      return '...';
    }
    const pricePerItem = selectedTab === 'member'
      ? merchList.item_price.paid
      : merchList.item_price.others;
    return decimalHelper(pricePerItem * q);
  }, [quantity, selectedTab, merchList.item_price]);

  if (Object.keys(merchList).length === 0) {
    if (itemid === '') {
      window.location.replace('../merch-store');
      return <Layout name="Merch Store"></Layout>;
    }
    return <Layout name="Merch Store"></Layout>;
  } else {
    return (
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
              {(totalCapacity() as number) < 10 && <p><b>We are running out, order soon!</b></p>}
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
                <Tab key="member" title="Member Checkout">
                  <div className="flex flex-col gap-4 pb-4">
                    {!user ? (
                      <>
                        <p style={{ fontSize: '0.9rem' }}>Log in with your Illinois NetID to apply your member discount.</p>
                        <Button color="primary" onPress={loginHandler} isLoading={isLoading && !user}>
                          Login with Illinois NetID
                        </Button>
                      </>
                    ) : (
                      <>
                        <p style={{ fontSize: '0.9rem' }}>Your membership status will be validated at checkout.</p>
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
                          errorMessage={inputQuantityStatus === InputStatus.INVALID && 'Invalid Quantity'}
                        />
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
                      errorMessage={inputQuantityStatus === InputStatus.INVALID && 'Invalid Quantity'}
                    />
                    <Button
                      color="primary" size="lg"
                      isDisabled={!isFormValidated || isLoading || totalCapacity() === 0}
                      onPress={purchaseHandler}
                    >
                      {isLoading ? 'Processing...' : `Purchase for $${totalPrice}`}
                    </Button>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

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
        </div>
      </Layout >
    );
  }
};

export default WrapepdMerchItem;
