'use client';
import { useEffect, useMemo, useState } from 'react';
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
} from '@nextui-org/react';
import {Spinner} from "@nextui-org/spinner";

// import Lottie from 'lottie-react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import axios from 'axios';
import Layout from '../MembershipLayout';
import successAnimation from '../success.json';
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

const baseUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_BASE_URL;
// const walletApiBaseUrl = process.env.NODE_ENV === 'production' 
//   ? 'https://infra-core-api.aws.acmuiuc.org'
//   : 'https://infra-core-api.aws.qa.acmuiuc.org';
const walletApiBaseUrl = 'https://infra-core-api.aws.qa.acmuiuc.org';


const Payment = () => {
  const [netId, setNetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<ErrorCode | null>(null);

  const modalMembershipStatus = useDisclosure();
  const modalErrorMessage = useDisclosure();
  const modalWalletError = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
  const [isPaidMember, setIsPaidMember] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const checkHandler = () => {
    setIsLoading(true);
    const url = `${baseUrl}/api/v1/checkMembership?netId=${netId}`;
    axios.get(url).then(response => {
      setIsPaidMember(response.data.isPaidMember || false);
      setIsLoading(false);
      modalMembershipStatus.onOpen();
    }).catch((error) => {
      setIsLoading(false);
      setErrorMessage({
        code: error?.response?.status || 500,
        message: error?.message || "An unknown error occurred"
      });
      modalErrorMessage.onOpen();
    });
  };

  const handleAddToWallet = async () => {
    setIsWalletLoading(true);
    setWalletError(null);
    
    try {
      await axios.post(`${walletApiBaseUrl}/api/v1/mobileWallet/membership`, null, {
        params: { email: `${netId}@illinois.edu` }
      });
      setIsWalletLoading(false);
    } catch (error: any) {
      setIsWalletLoading(false);
      setWalletError({
        code: error?.response?.status || 500,
        message: error?.response?.status === 403 
          ? "You must be a paid member to add your membership to Apple Wallet"
          : error?.message || "Failed to generate Apple Wallet pass. Please try again later."
      });
      modalWalletError.onOpen();
    }
  };

  const validateNetId = (value: string) => {
    return value.match(/^[A-Z0-9]+$/i) !== null;
  };

  const inputNetIdStatus = useMemo(() => {
    if (netId === "") return InputStatus.EMPTY;
    return validateNetId(netId) ? InputStatus.VALID : InputStatus.INVALID;
  }, [netId]);

  const isFormValidated = useMemo(() => {
    return inputNetIdStatus === InputStatus.VALID;
  }, [inputNetIdStatus]);

  return (
    <Layout name="Check Membership Status">
      <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
        <Card className="max-w-[512px] mx-4 my-auto shrink-0">
          <CardHeader>
            <p className="font-bold">
              Check ACM@UIUC Membership
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <p>
              Enter your NetID here to check if you are an ACM@UIUC Paid Member.
            </p>
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
            <Button
              color="primary"
              size="lg"
              isDisabled={!isFormValidated || isLoading}
              onPress={checkHandler}
            >
              {isLoading ? <><Spinner color='white' size="sm"/><a>Loading...</a></> : "Check Membership Status"}
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
              <p className="text-center text-2xl font-bold">Error Checking Membership Status</p>
              <p className="text-center">Error Code: {errorMessage && errorMessage.code}</p>
              <p className="text-center">{errorMessage && errorMessage.message}</p>
              {errorMessage && errorMessage.code && (<p>
                Please try again. If the error continues, contact the <a href='mailto:infra@acm.illinois.edu'>ACM
                Infra team</a> with the error code.
              </p>)}
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
        <Modal
          isOpen={modalWalletError.isOpen}
          onOpenChange={modalWalletError.onOpenChange}
        >
          <ModalContent>
            <ModalHeader />
            <ModalBody className="flex flex-col items-center">
              <p className="text-center text-2xl font-bold">Error Adding to Apple Wallet</p>
              <p className="text-center">Error Code: {walletError && walletError.code}</p>
              <p className="text-center">{walletError && walletError.message}</p>
              {walletError && walletError.code && (<p>
                Please try again. If the error continues, contact the <a href='mailto:infra@acm.illinois.edu'>ACM
                Infra team</a> with the error code.
              </p>)}
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
        <Modal
          isOpen={modalMembershipStatus.isOpen}
          onOpenChange={modalMembershipStatus.onOpenChange}
        >
          <ModalContent className={isPaidMember ? 'rainbow-background' : ''}>
            <ModalHeader />
            <ModalBody className={isPaidMember ? "flex flex-col items-center white-text" : "flex flex-col items-center"}>
              <p className="text-center text-2xl font-bold">
                {isPaidMember ? "You're a Paid Member of ACM@UIUC!" : "You're not a Paid Member of ACM@UIUC 😔"}
              </p>
              {isPaidMember && <>
                <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
                <a>{netId}@illinois.edu</a>
                <a>{currentTime.toLocaleString()}</a>
                <Button
                  color="secondary"
                  size="lg"
                  isDisabled={isWalletLoading}
                  onPress={handleAddToWallet}
                  className="mt-4"
                >
                  {isWalletLoading ? 
                    <><Spinner color='white' size="sm"/><a>Generating pass...</a></> : 
                    "Add to Apple Wallet"
                  }
                </Button>
                <p className="text-sm mt-2">
                  Check your Illinois email for the Apple Wallet pass after clicking.
                </p>
              </>}
              {!isPaidMember &&
              <>
              <p>Click the link below to purchase an ACM@UIUC membership.</p>
              <Button
                color="primary"
                size="lg"
                onPress={() => {window.location.href = `/membership?netid=${netId}`}}
              >
                Purchase for {config.membershipPrice}
              </Button>
              </>}
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
      </div>
    </Layout>
  );
};

export default Payment;

// 'use client';
// import { useEffect, useMemo, useState } from 'react';
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Divider,
//   Input,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   useDisclosure
// } from '@nextui-org/react';
// import {Spinner} from "@nextui-org/spinner";

// import Lottie from 'lottie-react';
// import axios from 'axios';
// import Layout from '../MembershipLayout';
// import successAnimation from '../success.json';
// import config from '@/config.json'

// interface ErrorCode {
//   code?: number | string,
//   message: string
// }

// enum InputStatus {
//   EMPTY,
//   INVALID,
//   VALID
// }


// const baseUrl = process.env.NEXT_PUBLIC_MEMBERSHIP_BASE_URL;

// const Payment = () => {
//   const [netId, setNetId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const modalMembershipStatus = useDisclosure();
//   const modalErrorMessage = useDisclosure();
//   const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);
//   const [isPaidMember, setIsPaidMember] = useState<boolean | null>(null);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const checkHandler = () => {
//     setIsLoading(true);
//     const url = `${baseUrl}/api/v1/checkMembership?netId=${netId}`;
//     axios.get(url).then(response => {
//       setIsPaidMember(response.data.isPaidMember || false);
//       setIsLoading(false);
//       modalMembershipStatus.onOpen();
//     }).catch((error) => {
//       setIsLoading(false);
//       setErrorMessage({
//         code: error?.response?.status || 500,
//         message: error?.message || "An unknown error occurred"
//       });
//     });
//   };

//   const validateNetId = (value: string) => {
//     return value.match(/^[A-Z0-9]+$/i) !== null;
//   };

//   const inputNetIdStatus = useMemo(() => {
//     if (netId === "") return InputStatus.EMPTY;
//     return validateNetId(netId) ? InputStatus.VALID : InputStatus.INVALID;
//   }, [netId]);

//   const isFormValidated = useMemo(() => {
//     return inputNetIdStatus === InputStatus.VALID;
//   }, [inputNetIdStatus]);

//   return (
//     <Layout name="Check Membership Status">
//       <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
//         <Card className="max-w-[512px] mx-4 my-auto shrink-0">
//           <CardHeader>
//             <p className="font-bold">
//               Check ACM@UIUC Membership
//             </p>
//           </CardHeader>
//           <Divider />
//           <CardBody className="gap-4">
//             <p>
//               Enter your NetID here to check if you are an ACM@UIUC Paid Member.
//             </p>
//             <Input
//               value={netId}
//               onValueChange={setNetId}
//               label="NetID"
//               endContent="@illinois.edu"
//               variant="bordered"
//               isInvalid={inputNetIdStatus === InputStatus.INVALID}
//               color={inputNetIdStatus === InputStatus.INVALID ? 'danger' : 'default'}
//               errorMessage={inputNetIdStatus === InputStatus.INVALID && 'Invalid NetID'}
//               autoCapitalize="none"
//               autoComplete="off"
//               autoCorrect="off"
//               spellCheck="false"
//               classNames={{
//                 input: ["text-base"]
//               }}
//             />
//             <Button
//               color="primary"
//               size="lg"
//               isDisabled={!isFormValidated || isLoading}
//               onPress={checkHandler}
//             >
//               {isLoading ? <><Spinner color='white' size="sm"/><a>Loading...</a></> : "Check Membership Status"}
//             </Button>
//           </CardBody>
//         </Card>
//         <Modal
//           isOpen={modalErrorMessage.isOpen}
//           onOpenChange={modalErrorMessage.onOpenChange}
//         >
//           <ModalContent className={isPaidMember ? 'rainbow-background' : ''}>
//             <ModalHeader />
//             <ModalBody className="flex flex-col items-center">
//               <p className="text-center text-2xl font-bold">Error Checking Membership Status</p>
//               <p className="text-center">Error Code: {errorMessage && errorMessage.code}</p>
//               <p className="text-center">{errorMessage && errorMessage.message}</p>
//               {errorMessage && errorMessage.code && (<p>
//                 Please try again. If the error continues, contact the <a href='mailto:infra@acm.illinois.edu'>ACM
//                 Infra team</a> with the error code.
//               </p>)}
//             </ModalBody>
//             <ModalFooter />
//           </ModalContent>
//         </Modal>
//         <Modal
//           isOpen={modalMembershipStatus.isOpen}
//           onOpenChange={modalMembershipStatus.onOpenChange}
//         >
//           <ModalContent className={isPaidMember ? 'rainbow-background' : ''}>
//             <ModalHeader />
//             <ModalBody className={isPaidMember ? "flex flex-col items-center white-text" : "flex flex-col items-center"}>
//               <p className="text-center text-2xl font-bold">
//                 {isPaidMember ? "You're a Paid Member of ACM@UIUC!" : "You're not a Paid Member of ACM@UIUC 😔"}
//               </p>
//               {isPaidMember && <>
//                 <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
//                 <a>{netId}@illinois.edu</a>
//                 <a>{currentTime.toLocaleString()}</a>
//               </>}
//               {!isPaidMember &&
//               <>
//               <p>Click the link below to purchase an ACM@UIUC membership.</p>
//               <Button
//                 color="primary"
//                 size="lg"
//                 onPress={() => {window.location.href = `/membership?netid=${netId}`}}
//               >
//                 Purchase for {config.membershipPrice}
//               </Button>
//               </>}
//             </ModalBody>
//             <ModalFooter />
//           </ModalContent>
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default Payment;
