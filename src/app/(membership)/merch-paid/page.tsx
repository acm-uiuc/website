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

const WrapepdMerchPaid = () => {
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
                You&apos;ve successfully purchased a {merchList['item_name']}!
              </p>
              <Lottie
                animationData={successAnimation}
                loop={false}
                style={{ width: '10em' }}
              />
              <p>You will be notified when your items are ready for pickup.</p>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </Layout>
    );
  }
};

export default WrapepdMerchPaid;
