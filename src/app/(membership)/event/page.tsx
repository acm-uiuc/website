'use client';
import { useEffect, useMemo, useState } from 'react';
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
  useDisclosure
} from '@nextui-org/react';
import axios from 'axios';
import Layout from '../MembershipLayout';


interface ErrorCode {
  code?: number | string,
  message: string,
  title?: string
}

enum InputStatus {
  EMPTY,
  INVALID,
  VALID
}

const baseUrl = process.env.REACT_APP_TICKETING_BASE_URL ?? 'https://ticketing.acm.illinois.edu';
const baseOverridden = Boolean(process.env.REACT_APP_TICKETING_BASE_URL);

const Event = () => {
  const eventid = useSearchParams().get('id') || '';
  const [paidEventList, setPaidEventList] = useState<Record<string, any>>({});

  const [netId, setNetId] = useState('');
  const [netIdConfirm, setNetIdConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const errorMessageCloseHandler = () => {
    modalErrorMessage.onClose();
    setErrorMessage(null);
  };

  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/event/details?eventid=${eventid}`;
    axios.get(url).then(response => {
      setPaidEventList(response.data);
      modalErrorMessage.onClose();
      setIsLoading(false);
      console.log(response.data);
    }).catch((error) => {
      if (error.response && error.response.status === 404) {
        setTimeout(() => {
          setErrorMessage({
            title: "Error 404",
            code: "This event could not be loaded.",
            message: error.response.data.message
          });
          // set default paid schema so it renders the error page
          setPaidEventList({"event_time": 0, 
          "member_price": "", 
          "eventImage": "", 
          "eventCost": {"paid": 999999, "others": 999999}, "eventDetails": "",
          "event_id": "404_event",
          "tickets_sold": -1,
          "event_capacity": -1, 
          "event_sales_active_utc": -1, 
          "event_name": "", 
          "nonmember_price": ""});
          setIsLoading(false);
          modalErrorMessage.onOpen();
        }, 1000)
      }
    })
  }

  useEffect(() => {
    metaLoader();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchaseHandler = () => {
    setIsLoading(true);
    const url = `${baseUrl}/api/v1/checkout/session?netid=${netId}&eventid=${eventid}`;
    axios.get(url).then(response => {
      window.location.replace(response.data);
    }).catch((error) => {
      if (!error.response) {
        modalErrorMessage.onOpen();
        setIsLoading(false);
        return;
      }
      if (error.response.status === 422) {
        const errorObj = error.response.data;
        setErrorMessage({
          code: errorObj.details[0].issue,
          message: errorObj.details[0].description
        });
      } else if (error.response.status === 400) {
        const errorObj = error.response.data.errors;
        setErrorMessage({
          code: 400,
          message: errorObj[0].msg + ' for ' + errorObj[0].param
        });
      } else if (error.response.status === 404) {
        const errorObj = error.response.data.errors;
        setErrorMessage({
          code: "We could not issue you a ticket.",
          message: error.response.data
        });
      } else {
        setErrorMessage({
          code: 500,
          message: 'Internal server error: ' + error.response.data
        });
      }
      setIsLoading(false);
      modalErrorMessage.onOpen();
    });
  };

  const validateNetId = (value: string) => {
    return value.match(/^[A-Z0-9]+$/i);
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

  if (Object.keys(paidEventList).length === 0) {
    return <Layout name="Event Signup"></Layout>;
  } else {
    const dateString = new Date(paidEventList['event_time'] * 1000)
    const isRunningOut = (paidEventList['tickets_sold']/paidEventList['event_capacity'] > 0.75)
    return ( 
      <Layout name={paidEventList["event_name"]}>
        <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
          <Card className="max-w-[512px] mx-4 my-auto shrink-0">
            <CardHeader>
              <p className="font-bold">
                {baseOverridden ? 'DEVELOPMENT MODE - ' : ''}{paidEventList["event_name"]} Signup
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {paidEventList["eventImage"] ? (
                <img alt={paidEventList["event_name"] + " image."} src={paidEventList["eventImage"]} />
              ) : null}
              <p>
                {paidEventList["eventDetails"]}
              </p>
              <p>
                <b>Date:</b> {dateString.toLocaleString([], {
                  'year': 'numeric',
                  'month': 'long',
                  'day': 'numeric',
                  'hour12': true,
                  'hour': 'numeric',
                  'minute': '2-digit',
                  "timeZoneName": "short"
                })}.
              </p>
              <p>
                <b>Cost:</b> ${paidEventList["eventCost"]["paid"]} for paid ACM@UIUC members, ${paidEventList["eventCost"]["others"]} for all other participants.
              </p>
              <p>{isRunningOut ? <i>Tickets are running out, order soon!</i> : null}</p>
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
                isDisabled={(!isFormValidated) || isLoading}
                onPress={purchaseHandler}
              >
                {isLoading ? 'Verifying information...' : 'Purchase now'}
              </Button>
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
                <p className="text-center text-2xl font-bold">{(errorMessage && errorMessage.title) || 'Verification Failed'}</p>
                <p className="text-center">Error Code: {errorMessage && errorMessage.code}</p>
                <p className="text-center">{errorMessage && errorMessage.message}</p>
                {errorMessage && errorMessage.code && (<p>
                  If you believe you are receiving this message in error, contact the <a href='mailto:infra@acm.illinois.edu'>ACM Infrastructure Team
                  </a> with the error code. Otherwise, feel free to try again.
                </p>)}
              </ModalBody>
              <ModalFooter />
            </ModalContent>
          </Modal>
        </div>
      </Layout>
    );
  }
};

export default Event;
