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
  useDisclosure
} from "@heroui/react";
import { Spinner } from "@heroui/spinner";

import Lottie from 'lottie-react';
import axios from 'axios';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
import { useSearchParams } from 'next/navigation';
import config from '@/config.json'

interface ErrorCode {
  code?: number | string,
  message: string
}

enum InputStatus {
  EMPTY,
  INVALID,
  VALID
}


const baseUrl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
const WrappedPayment = () => {
  return (
    <Suspense>
      <Payment />
    </Suspense>
  )
}
const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const modalAlreadyMember = useDisclosure();
  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const prefilledNetId = useSearchParams().get('netid') || '';
  const [netId, setNetId] = useState(prefilledNetId);
  const [netIdConfirm, setNetIdConfirm] = useState(prefilledNetId);
  const purchaseHandler = useCallback(() => {
    setIsLoading(true);
    const url = `${baseUrl}/api/v1/membership/checkout/${netId}`;
    axios.get(url).then(response => {
      window.location.replace(response.data);
    }).catch((error) => {
      setIsLoading(false);
      if (error.response) {
        if (error.response.status === 422) {
          const errorObj = error.response.data;
          setErrorMessage({
            code: errorObj.details[0].issue,
            message: errorObj.details[0].description
          });
          modalErrorMessage.onOpen();
        } else if (error.response.status === 400) {
          const errorObj = error.response.data;
          if (errorObj.message === `${netId} is already a paid member!`) {
            setErrorMessage({
              code: 409,
              message: "The specified user is already a paid member."
            });
            modalAlreadyMember.onOpen();
          } else {
            setErrorMessage({
              code: errorObj.id,
              message: errorObj.message
            });
            modalErrorMessage.onOpen();
          }
        } else if (error.response.status === 409) {
          setErrorMessage({
            code: 500,
            message: 'Internal server error: ' + (error.response.data.message || "could not process request")
          });
          modalErrorMessage.onOpen();
        }
      }
    });
  }, [netId, modalAlreadyMember, modalErrorMessage]);

  useEffect(() => {
    if (prefilledNetId != '') {
      purchaseHandler();
    }
  }, [purchaseHandler, prefilledNetId])

  const validateNetId = (value: string) => {
    return value.match(/^[A-Z0-9]+$/i) !== null;
  };

  const inputNetIdStatus = useMemo(() => {
    if (netId === "") return InputStatus.EMPTY;
    return validateNetId(netId) ? InputStatus.VALID : InputStatus.INVALID;
  }, [netId]);

  const inputNetIdConfirmStatus = useMemo(() => {
    if (netIdConfirm === "") return InputStatus.EMPTY;
    else if (netId === netIdConfirm) return InputStatus.VALID;
    return InputStatus.INVALID;
  }, [netId, netIdConfirm]);

  const isFormValidated = useMemo(() => {
    return inputNetIdStatus === InputStatus.VALID && inputNetIdConfirmStatus === InputStatus.VALID;
  }, [inputNetIdStatus, inputNetIdConfirmStatus]);
  return (
    <Layout>
      <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
        <Card className="max-w-[512px] mx-4 my-auto shrink-0">
          <CardHeader>
            <p className="font-bold">
              ACM@UIUC Membership
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <p>
              Becoming a Lifetime <b>Paid Member</b> not only sustains the continued growth of our communities but also
              comes with perks such as swipe access, free printing, priority access to our computing resources, etc.
            </p>
            <a className="text-primary" href="https://go.acm.illinois.edu/paid-member-guide" target="_blank" rel="noopener noreferrer">
              ACM@UIUC Paid Member Guide
            </a>
            <Input
              value={netId}
              onValueChange={setNetId}
              label="NetID"
              endContent="@illinois.edu"
              variant="bordered"
              isInvalid={inputNetIdStatus === InputStatus.INVALID}
              color={inputNetIdStatus === InputStatus.INVALID ? 'danger' : 'default'}
              errorMessage={inputNetIdStatus === InputStatus.INVALID && 'Invalid NetID'}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              classNames={{
                input: ["text-base"]
              }}
            />
            <Input
              value={netIdConfirm}
              onValueChange={setNetIdConfirm}
              label="Confirm NetID"
              endContent="@illinois.edu"
              variant="bordered"
              isInvalid={inputNetIdConfirmStatus === InputStatus.INVALID}
              color={inputNetIdConfirmStatus === InputStatus.INVALID ? 'danger' : 'default'}
              errorMessage={inputNetIdConfirmStatus === InputStatus.INVALID && 'NetIDs do not match'}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              classNames={{
                input: ["text-base"]
              }}
            />
            <Button
              color="primary"
              size="lg"
              isDisabled={!isFormValidated || isLoading}
              onPress={purchaseHandler}
            >
              {isLoading ? <><Spinner color='white' size="sm" /><a>Loading...</a></> : `Purchase for ${config.membershipPrice}`}
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
              <p className="text-center text-2xl font-bold">Checkout Failed</p>
              <p className="text-center">Error Code: {errorMessage && errorMessage.code}</p>
              <p className="text-center">{errorMessage && errorMessage.message}</p>
              {errorMessage && errorMessage.code && (<p>
                If you believe that you are recieving this message in error, please contact the <a href='mailto:infra@acm.illinois.edu'>ACM
                  Infrastructure Team</a> with the error code. Otherwise, feel free to try again.
              </p>)}
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
              <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
};

export default WrappedPayment;
