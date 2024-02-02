'use client';
import React from 'react'
import { useEffect, useMemo, useState} from 'react';
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
  useDisclosure,
  Select,
  SelectItem
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

const baseUrl = process.env.REACT_APP_MERCH_API_BASE_URL ?? 'https://merchapi.acm.illinois.edu';
const baseOverridden = Boolean(process.env.REACT_APP_MERCH_API_BASE_URL);

const MerchItem = () => {
  const itemid = useSearchParams().get('id') || '';
  const [merchList, setMerchList] = useState<Record<string, any>>({});
  const [merchLoaded, setMerchLoaded] = useState(false);

  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [size, setSize] = React.useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const modalErrorMessage = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const errorMessageCloseHandler = () => {
    modalErrorMessage.onClose();
    setErrorMessage(null);
  };

  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/merch/details?itemid=${itemid}`;
    axios.get(url).then(response => {
      setMerchList(response.data);
      setMerchLoaded(true);
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
          setMerchList({
          "member_price": "", 
          "nonmember_price": "",
          "item_image": "", 
          "sizes" : [],
          "item_price": {"paid": 999999, "others": 999999}, "eventDetails": "",
          "item_id": "404_event",
          "total_sold": {},
          "total_avail": {}, 
          "item_sales_active_utc": -1, 
          "item_name": "", 
        });
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
    const url = `${baseUrl}/api/v1/checkout/session?email=${email}&itemid=${itemid}&size=${size}&quantity=${quantity}`;
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
          code: "Merch not availiable.",
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

  const validateEmail = (value: string) => {
    return value.match(/^[A-Z0-9]+@[A-Z0-9]+\.[A-Z0-9]+$/i);
  };

  const changeSize = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSize(e? e.target? e.target.value : "" : "");
  };

  const validateQuantity = (value: string) => {
    return value.match(/^[0-9]+$/i);
  };

  const totalCapacity = () => {
    return Object.values(merchList["total_avail"]).reduce((acc: any, val: any) => acc + val, 0);
  };

  const filterSoldOut = (value: string) => {
    return (!(value in merchList["total_avail"])) || (merchList["total_avail"][value] === 0);
  }

  const inputQuantityStatus = useMemo(() => {
    if (quantity === "") return InputStatus.EMPTY;
    return validateQuantity(quantity) ? InputStatus.VALID : InputStatus.INVALID;
  }, [quantity]);

  const inputEmailStatus = useMemo(() => {
    if (email === "") return InputStatus.EMPTY;
    return validateEmail(email) ? InputStatus.VALID : InputStatus.INVALID;
  }, [email]);

  const inputEmailConfirmStatus = useMemo(() => {
    if (emailConfirm === "") return InputStatus.EMPTY;
    else if (email === emailConfirm) return InputStatus.VALID;
    return InputStatus.INVALID;
  }, [email, emailConfirm]);

  const isFormValidated = useMemo(() => {
    return inputEmailStatus === InputStatus.VALID && inputEmailConfirmStatus === InputStatus.VALID;
  }, [inputEmailStatus, inputEmailConfirmStatus]);

  if (Object.keys(merchList).length === 0) {
    if (itemid === '') {
      window.location.replace("../merch-store");
      return <Layout name="Merch Store"></Layout>;
    }
    return <Layout name="Merch Store"></Layout>;
  } else {
    return ( 
      <Layout name={merchList["item_name"]}>
        <div className="h-screen w-screen absolute top-0 left-0 flex flex-col items-center py-24">
          <Card className="max-w-[512px] mx-4 my-auto shrink-0">
            <CardHeader>
              <p className="font-bold">
                {baseOverridden ? 'DEVELOPMENT MODE - ' : ''}{merchList["item_name"]}
              </p>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {merchList["item_image"] ? (
                <img alt={merchList["item_name"] + " image."} src={merchList["item_image"]} />
              ) : null}

              {merchList["description"] ? (<p>{merchList["description"]}</p>) : null}

              {totalCapacity() as number < 10 ? <p> <b>We are running out, order soon!</b></p>: null}

              <p>
                <b>Cost:</b> ${merchList["item_price"]["paid"]} for paid ACM@UIUC members, ${merchList["item_price"]["others"]} for nonmembers.
              </p>

              <Select
                isRequired={true}
                label="Size"
                placeholder="Select an size"
                selectedKeys={[size]}
                disabledKeys={merchList["sizes"].filter(filterSoldOut)}
                onChange={changeSize}
                >
                {merchList["sizes"].map((val: string) => (
                  <SelectItem key={val} value={val}>
                    {filterSoldOut(val) ? val + " [SOLD OUT]" : val}
                  </SelectItem>
                ))}
              </Select>

              <Input
                value={quantity}
                onValueChange={setQuantity}
                label="Quantity"
                endContent=""
                variant="bordered"
                isInvalid={inputQuantityStatus === InputStatus.INVALID}
                color={inputQuantityStatus === InputStatus.INVALID ? 'danger' : 'default'}
                errorMessage={inputQuantityStatus === InputStatus.INVALID && 'Invalid Quantity'}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                classNames={{
                  input: ["text-base"]
                }}
              />

              <Input
                value={email}
                onValueChange={setEmail}
                label="Email"
                endContent=""
                variant="bordered"
                isInvalid={inputEmailStatus === InputStatus.INVALID}
                color={inputEmailStatus === InputStatus.INVALID ? 'danger' : 'default'}
                errorMessage={inputEmailStatus === InputStatus.INVALID && 'Invalid Email'}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                classNames={{
                  input: ["text-base"]
                }}
              />
              <Input
                value={emailConfirm}
                onValueChange={setEmailConfirm}
                label="Confirm Email"
                endContent=""
                variant="bordered"
                isInvalid={inputEmailConfirmStatus === InputStatus.INVALID}
                color={inputEmailConfirmStatus === InputStatus.INVALID ? 'danger' : 'default'}
                errorMessage={inputEmailConfirmStatus === InputStatus.INVALID && 'Emails do not match'}
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
                isDisabled={(!isFormValidated) || isLoading || totalCapacity() === 0}
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

export default MerchItem;
