'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import Lottie from 'lottie-react';
import axios from 'axios';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
import { transformApiResponse } from '../merch-store/transform';

const WrappedMerchPaid = () => {
  return (
    <Suspense>
      <MerchPaid />
    </Suspense>
  );
};

const MerchPaid = () => {
  const itemid = useSearchParams().get('id') || '';
  const [merchList, setMerchList] = useState<Record<string, any>>({});

  const coreBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;

  const metaLoader = async () => {
    const url = `${coreBaseUrl}/api/v1/store/products/${itemid}`;
    axios.get(url).then((response) => {
      setMerchList(transformApiResponse({ products: [response.data] })[0]);
    });
  };

  useEffect(() => {
    metaLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Object.keys(merchList).length === 0) {
    return <Layout name="Merch Store"></Layout>;
  } else {
    return (
      <Layout name={merchList['item_name']}>
        <Modal isOpen={true} onClose={() => window.location.replace('/')}>
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">
                Thanks for your order!
              </p>
              <Lottie
                animationData={successAnimation}
                loop={false}
                style={{ width: '10em' }}
              />
              <p className="text-center">
                We&apos;ve received your order for a {merchList['item_name']}.
                You&apos;ll receive an email shortly with your order status and
                next steps.
              </p>
              <p className="mt-4 text-center text-xs text-gray-500">
                Don&apos;t see our email? Check your spam folder and make sure
                mail from <span className="font-medium">sales@acm.illinois.edu</span> isn&apos;t blocked.
              </p>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </Layout>
    );
  }
};

export default WrappedMerchPaid;
