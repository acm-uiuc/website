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
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
import { useSearchParams } from 'next/navigation';
import { type IPublicClientApplication } from "@azure/msal-browser";
import { getUserAccessToken, initMsalClient } from '@/utils/msal';
import { MembershipPriceString } from '@acm-uiuc/js-shared';
import { membershipApiClient } from '@/utils/api';
import { ResponseError, ValidationError } from '@acm-uiuc/core-client';


interface ErrorCode {
  code?: number | string;
  message: string;
}

enum InputStatus {
  EMPTY,
  INVALID,
  VALID,
}

const baseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;
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
    try {
      const response = await membershipApiClient.apiV2MembershipCheckoutGet({
        xUiucToken: accessToken,
      });
      window.location.replace(response)
    } catch (e) {
      console.error("Error purchasing membership", e)
      if (e instanceof ResponseError) {
        setIsLoading(false);
        const responseJson = await e.response.json() as ValidationError;
        if (responseJson.message.includes("is already a paid member")) {
          modalErrorMessage.onClose();
          modalAlreadyMember.onOpen();
          return;
        }
        setErrorMessage({
          code: responseJson.id ?? 400,
          message: responseJson.message ?? "An error occurred creating your checkout session."
        })
      } else {
        setErrorMessage({
          code: 400,
          message: "An error occurred creating your checkout session."
        })
      }
      modalErrorMessage.onOpen();
    }




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
              Becoming a <b>Lifetime Paid Member</b> not only sustains the
              continued growth of our communities but also comes with perks such
              as swipe access, free printing, priority access to our computing
              resources, etc.
            </p>
            <a
              className="text-primary"
              href="https://acm.gg/paid-member-guide"
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
                `Purchase for ${MembershipPriceString}`
              )}
            </Button>
            <p className="text-sm ml-2">
              Membership is open to all students, staff,
              and faculty at UIUC. By becoming a member,
              you agree to receive email communications
              from us. You may unsubscribe at any time
              by clicking the unsubscribe link in any email.
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
