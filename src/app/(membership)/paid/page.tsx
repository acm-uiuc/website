'use client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import Lottie from 'lottie-react';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';

const Paid = () => {
  return (
    <Layout>
      <Modal isOpen={true} onClose={() => window.location.replace('/')}>
        <ModalContent>
          <ModalHeader />
          <ModalBody className="flex flex-col items-center">
            <p className="text-center text-2xl font-bold">
              You&apos;re now a Paid Member of ACM@UIUC!
            </p>
            <Lottie
              animationData={successAnimation}
              loop={false}
              style={{ width: '10em' }}
            />
            <p>
              To get swipe access to the ACM room, please complete{' '}
              <a
                href="https://acm.gg/swipeaccess"
                className="text-blue-500 hover:underline"
              >
                this form
              </a>
              .
            </p>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default Paid;
