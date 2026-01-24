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
import Layout from '../../MembershipLayout';
import successAnimation from '../../success.json';
import { useSearchParams } from 'next/navigation';
import { type IPublicClientApplication } from '@azure/msal-browser';
import { getUserAccessToken, initMsalClient } from '@/utils/msal';
import { syncIdentity } from '@/utils/api';

interface ErrorCode {
  code?: number | string;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
const WrappedSync = () => {
  return (
    <Suspense>
      <Sync />
    </Suspense>
  );
};
const Sync = () => {
  const [isLoading, setIsLoading] = useState(false);

  const modalSynced = useDisclosure();
  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const initOnCall = !!useSearchParams().get('initOnCall') || false;
  const [pca, setPca] = useState<IPublicClientApplication | null>(null);

  useEffect(() => {
    (async () => {
      setPca(await initMsalClient());
    })();
  }, []);

  const syncHandler = useCallback(async () => {
    setIsLoading(true);
    if (!pca) {
      setErrorMessage({
        code: -1,
        message: 'Failed to authenticate NetID.',
      });
      modalErrorMessage.onOpen();
      return;
    }
    const accessToken = await getUserAccessToken(pca);
    if (!accessToken) {
      setErrorMessage({
        code: -1,
        message: 'Failed to authenticate NetID.',
      });
      modalErrorMessage.onOpen();
      return;
    }

    syncIdentity(accessToken, true)
      .then(() => {
        modalSynced.onOpen();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response) {
          setErrorMessage({
            code: error.response.status,
            message: 'Failed to sync identity.',
          });
        }
      });
  }, [modalSynced, modalErrorMessage]);

  useEffect(() => {
    if (initOnCall) {
      syncHandler();
    }
  }, [syncHandler, initOnCall]);

  return (
    <Layout>
      <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
        <Card className="max-w-[512px] mx-4 my-auto shrink-0">
          <CardHeader>
            <p className="font-bold">Sync ACM@UIUC Identity</p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <p>
              Only use this tool if prompted to by the ACM @ UIUC Infrastructure
              Team.
            </p>
            <Button
              color="primary"
              size="lg"
              isDisabled={!pca || isLoading}
              onPress={syncHandler}
            >
              {isLoading ? (
                <>
                  <Spinner color="white" size="sm" />
                  <a>Loading...</a>
                </>
              ) : (
                `Log in to sync identity`
              )}
            </Button>
          </CardBody>
        </Card>
        <Modal
          isOpen={modalErrorMessage.isOpen}
          onOpenChange={modalErrorMessage.onOpenChange}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">Sync Failed</p>
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
          isOpen={modalSynced.isOpen}
          onOpenChange={modalSynced.onOpenChange}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">Identity synced!</p>
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

export default WrappedSync;
