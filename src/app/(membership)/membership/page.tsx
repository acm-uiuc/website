'use client';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
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
} from '@heroui/react';
import { Spinner } from '@heroui/spinner';

import Lottie from 'lottie-react';
import axios from 'axios';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
import { useSearchParams } from 'next/navigation';
import config from '@/config.json';
import { type IPublicClientApplication } from "@azure/msal-browser";
import { getUserAccessToken, initMsalClient } from '@/utils/msal';


interface ErrorCode {
  code?: number | string;
  message: string;
}

enum InputStatus {
  EMPTY,
  INVALID,
  VALID,
}

const baseUrl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
const WrappedPayment = () => {
  return (
    <Suspense>
      <Payment />
    </Suspense>
  );
};
const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const modalAlreadyMember = useDisclosure();
  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const initOnCall = !!useSearchParams().get('initOnCall') || false;
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);

  useEffect(() => {
    (async () => {
      setPca(await initMsalClient());
    })();
  }, [])

  const purchaseHandler = useCallback(async () => {
    setIsLoading(true);
    if (!pca) {
      setErrorMessage({
        code: -1,
        message: "Failed to authenticate NetID."
      });
      modalErrorMessage.onOpen();
      return;
    }
    const accessToken = await getUserAccessToken(pca);
    if (!accessToken) {
      setErrorMessage({
        code: -1,
        message: "Failed to authenticate NetID."
      });
      modalErrorMessage.onOpen();
      return;
    }
    const url = `${baseUrl}/api/v2/membership/checkout`;
    axios
      .get(url, {
        headers: { "Content-Type": "text/plain", 'x-uiuc-token': accessToken }
      })
      .then((response) => {
        window.location.replace(response.data);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 422) {
            const errorObj = error.response.data;
            setErrorMessage({
              code: errorObj.details[0].issue,
              message: errorObj.details[0].description,
            });
            modalErrorMessage.onOpen();
          }
          else if (error.response.status === 403) {
            setErrorMessage({
              code: 409,
              message: 'Could not verify NetID.',
            });
            modalAlreadyMember.onOpen();
          } else if (error.response.status === 400) {
            const errorObj = error.response.data;
            if ((errorObj.message as string).includes("is already a paid member")) {
              setErrorMessage({
                code: 409,
                message: 'The specified user is already a paid member.',
              });
              modalAlreadyMember.onOpen();
            } else {
              setErrorMessage({
                code: errorObj.id,
                message: errorObj.message,
              });
              modalErrorMessage.onOpen();
            }
          } else if (error.response.status === 409) {
            setErrorMessage({
              code: 500,
              message:
                'Internal server error: ' +
                (error.response.data.message || 'could not process request'),
            });
            modalErrorMessage.onOpen();
          }
        }
      });
  }, [modalAlreadyMember, modalErrorMessage]);

  useEffect(() => {
    if (initOnCall) {
      purchaseHandler();
    }
  }, [purchaseHandler, initOnCall]);

  return (
    <Layout>
      <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
        <Card className="max-w-[512px] mx-4 my-auto shrink-0">
          <CardHeader>
            <p className="font-bold">ACM@UIUC Membership</p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <p>
              Becoming a Lifetime <b>Paid Member</b> not only sustains the
              continued growth of our communities but also comes with perks such
              as swipe access, free printing, priority access to our computing
              resources, etc.
            </p>
            <a
              className="text-primary"
              href="https://go.acm.illinois.edu/paid-member-guide"
              target="_blank"
              rel="noopener noreferrer"
            >
              ACM@UIUC Paid Member Guide
            </a>
            <Button
              color="primary"
              size="lg"
              isDisabled={!pca || isLoading}
              onPress={purchaseHandler}
            >
              {isLoading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <a>Loading...</a>
                </>
              ) : (
                `Purchase for ${config.membershipPrice}`
              )}
            </Button>
            <p className="text-sm ml-2">
              Log in with your NetID to purchase a membership.
            </p>
          </CardBody>
        </Card>
        <Modal
          isOpen={modalErrorMessage.isOpen}
          onOpenChange={modalErrorMessage.onOpenChange}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">Checkout Failed</p>
              <p className="text-center">
                Error Code: {errorMessage && errorMessage.code}
              </p>
              <p className="text-center">
                {errorMessage && errorMessage.message}
              </p>
              {errorMessage && errorMessage.code && (
                <p>
                  If you believe that you are recieving this message in error,
                  please contact the{' '}
                  <a href="mailto:infra@acm.illinois.edu">
                    ACM Infrastructure Team
                  </a>{' '}
                  with the error code. Otherwise, feel free to try again.
                </p>
              )}
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
        <Modal
          isOpen={modalAlreadyMember.isOpen}
          onOpenChange={modalAlreadyMember.onOpenChange}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">
                You&apos;re already a Paid Member of ACM@UIUC!
              </p>
              <Lottie
                animationData={successAnimation}
                loop={false}
                style={{ width: '10em' }}
              />
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
};

export default WrappedPayment;
