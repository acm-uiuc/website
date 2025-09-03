'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
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

const baseUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL;

const WrappedEvent = () => {
  return (
    <Suspense>
      <Event />
    </Suspense>
  );
};

const Event = () => {
  const eventid = useSearchParams().get('id') || '';
  const [eventDetails, setEventDetails] = useState<Record<string, any>>({});
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);

  // Form State
  const [netid, setNetid] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tabs and Auth State
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
    const url = `${baseUrl}/api/v1/event/details?eventid=${eventid}`;
    axios
      .get(url)
      .then((response) => {
        setEventDetails(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setErrorMessage({
            title: 'Error 404',
            code: 'Event Not Found',
            message: error.response.data.message,
          });
          setEventDetails({
            event_time: 0,
            eventImage: '',
            eventCost: { paid: 999999, others: 999999 },
            eventDetails: '',
            event_id: '404_event',
            tickets_sold: -1,
            event_capacity: -1,
            event_sales_active_utc: -1,
            event_name: 'Event Not Found',
          });
          modalErrorMessage.onOpen();
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
        code: 'Could not issue ticket.',
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
      const url = `${baseUrl}/api/v1/checkout/session?eventid=${eventid}`;
      axios.get(url, { headers: { 'x-uiuc-token': accessToken } })
        .then(response => window.location.replace(response.data))
        .catch(handleApiError);

    } else { // Guest flow
      const url = `${baseUrl}/api/v1/checkout/session?eventid=${eventid}&netid=${netid}`;
      axios.get(url)
        .then(response => window.location.replace(response.data))
        .catch(handleApiError);
    }
  };

  const validateNetId = (value: string) => /^[a-zA-Z]{2}[a-zA-Z-]*(?:[2-9]|[1-9][0-9]{1,2})?$/.test(value);

  const inputNetidStatus = useMemo(() => {
    if (netid === '') return InputStatus.EMPTY;
    return validateNetId(netid) ? InputStatus.VALID : InputStatus.INVALID;
  }, [netid]);

  const inputNetidConfirmStatus = useMemo(() => {
    if (emailConfirm === '') return InputStatus.EMPTY;
    return netid === emailConfirm ? InputStatus.VALID : InputStatus.INVALID;
  }, [netid, emailConfirm]);

  const isFormValidated = useMemo(() => {
    if (selectedTab === 'member') {
      return !!user;
    }
    return inputNetidStatus === InputStatus.VALID && inputNetidConfirmStatus === InputStatus.VALID;
  }, [selectedTab, user, inputNetidStatus, inputNetidConfirmStatus]);

  const isSoldOut = eventDetails['tickets_sold'] >= eventDetails['event_capacity'];

  if (Object.keys(eventDetails).length === 0) {
    if (eventid === '') {
      window.location.replace('../events');
    }
    return <Layout name="Event Signup"></Layout>;
  } else {
    const dateString = new Date(eventDetails['event_time'] * 1000);
    const isRunningOut = eventDetails['tickets_sold'] / eventDetails['event_capacity'] > 0.75;
    return (
      <Layout name={eventDetails['event_name']}>
        <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
          <Card className="max-w-[512px] mx-4 my-auto shrink-0">
            <CardHeader>
              <p className="font-bold">{eventDetails['event_name']} Signup</p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {eventDetails['eventImage'] && <img alt={eventDetails['event_name'] + ' image.'} src={eventDetails['eventImage']} />}
              <p>{eventDetails['eventDetails']}</p>
              <p>
                <b>Date:</b>{' '}
                {dateString.toLocaleString([], {
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour12: true, hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
                })}
              </p>
              <p>
                <b>Cost:</b> ${decimalHelper(eventDetails['eventCost']['paid'])} for ACM members, ${decimalHelper(eventDetails['eventCost']['others'])} for non-members.
              </p>
              {isRunningOut && !isSoldOut && <i>Tickets are running out, order soon!</i>}
              {isSoldOut && <b>This event is sold out.</b>}

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
                        <div className="flex flex-col">
                          <Input isReadOnly disabled label="Email" variant="bordered" value={user.username} />
                          <Button size="sm" variant="light" color="primary" className="self-end" onPress={logoutHandler}>
                            Not you? Log out
                          </Button>
                        </div>
                        <Button color="primary" size="lg" isDisabled={!isFormValidated || isLoading || isSoldOut} onPress={purchaseHandler}>
                          {isLoading ? 'Processing...' : 'Purchase Now'}
                        </Button>
                      </>
                    )}
                  </div>
                </Tab>
                <Tab key="guest" title="Guest Checkout">
                  <div className="flex flex-col gap-4 pb-4">
                    <p style={{ fontSize: '0.9rem' }}>Continue without logging in. You will be charged the non-member price.</p>
                    <Input
                      endContent="@illinois.edu"
                      value={netid} onValueChange={setNetid} label="NetID" variant="bordered"
                      isInvalid={inputNetidStatus === InputStatus.INVALID}
                      color={inputNetidStatus === InputStatus.INVALID ? 'danger' : 'default'}
                      errorMessage={inputNetidStatus === InputStatus.INVALID && 'Confirm NetID'}
                    />
                    <Input
                      endContent="@illinois.edu"
                      value={emailConfirm} onValueChange={setEmailConfirm} label="NetID" variant="bordered"
                      isInvalid={inputNetidConfirmStatus === InputStatus.INVALID}
                      color={inputNetidConfirmStatus === InputStatus.INVALID ? 'danger' : 'default'}
                      errorMessage={inputNetidConfirmStatus === InputStatus.INVALID && 'Emails do not match'}
                    />
                    <Button color="primary" size="lg" isDisabled={!isFormValidated || isLoading || isSoldOut} onPress={purchaseHandler}>
                      {isLoading ? 'Processing...' : 'Purchase Now'}
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
      </Layout>
    );
  }
};

export default WrappedEvent;
