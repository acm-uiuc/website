'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/react";
import Lottie from 'lottie-react';
import axios from 'axios';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
const WrappedEventPaid = () => {
  return (
    <Suspense>
      <EventPaid />
    </Suspense>
  )
}
const EventPaid = () => {
  const eventid = useSearchParams().get('id') || '';
  const [paidEventList, setPaidEventList] = useState<Record<string, any>>({});

  const baseUrl = process.env.NEXT_PUBLIC_TICKETING_BASE_URL;

  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/event/details?eventid=${eventid}`;
    axios.get(url).then(response => {
      setPaidEventList(response.data);
    })
  }

  useEffect(() => {
    metaLoader();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (Object.keys(paidEventList).length === 0) {
    return <Layout name="Event Signup"></Layout>;
  } else {
    return (
      <Layout name={paidEventList['event_name']}>
        <Modal
          isOpen={true}
          onClose={() => window.location.replace("/")}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">
                You&apos;ve successfully registered for {paidEventList['event_name']}!
              </p>
              <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
              <p>
                Your ticket has been sent to your Illinois email.
              </p>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </Layout>
    );
  }
};

export default WrappedEventPaid;
