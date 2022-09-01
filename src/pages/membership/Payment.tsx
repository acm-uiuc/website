import React, { useState } from 'react';
import Layout from './Layout';
import { Button, Card, Container, Input, Modal, Spacer, Text } from '@nextui-org/react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import successAnimation from './success.json';
import Lottie from 'lottie-react';
import axios from 'axios';

interface ErrorCode {
  code?: number | string,
  message: string
}

interface HelperReturnType {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  text: string
}

const Payment = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const [netId, setNetId] = useState('');
  const [netIdConfirm, setNetIdConfirm] = useState('');
  const [validated, setValidated] = useState(false);

  const closeHandler = () => {
    setModalVisible(false);
  };

  const errorMessageCloseHandler = () => {
    setErrorMessageVisible(false);
    setErrorMessage(null);
  };

  const purchaseHandler = () => {
    setModalVisible(true);
  };

  const validateNetId = (value: string) => {
    return value.match(/^[A-Z0-9]+$/i);
  };

  const netidHelper = React.useMemo((): HelperReturnType => {
    if (!netId)
      return {
        text: '',
        color: 'default'
      };
    const isValid = validateNetId(netId);
    if (isValid && validateNetId(netIdConfirm) && netId === netIdConfirm) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    return {
      text: isValid ? '' : 'Enter a valid NetId',
      color: isValid ? 'success' : 'error'
    };
  }, [netId, netIdConfirm]);

  const netidConfirmHelper = React.useMemo((): HelperReturnType => {
    if (!netIdConfirm)
      return {
        text: '',
        color: 'default'
      };
    const isValid = validateNetId(netIdConfirm);
    if (isValid && validateNetId(netId) && netId === netIdConfirm) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    return {
      text: isValid ? (netId === netIdConfirm ? '' : 'Your NetIDs did not match') : 'Enter a valid NetId',
      color: (isValid && netId === netIdConfirm) ? 'success' : 'error'
    };
  }, [netIdConfirm, netId]);

  return (
    <Layout>
      <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card css={{ margin: '2em' }}>
          <Card.Header>
            <Text b>
              ACM Membership
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            <Text>
              Becoming a <Text b>Paid Member</Text> not only sustains the continued growth of our communities but also
              comes with perks such as swipe access, free printing, priority access to our computing resources, etc.
            </Text>
            <Spacer />
            <Input
              color={netidHelper.color}
              helperColor={netidHelper.color}
              helperText={netidHelper.text}
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              placeholder='NetID'
              labelRight='@illinois.edu'
              bordered />
            <Spacer />
            <Input
              color={netidConfirmHelper.color}
              helperColor={netidConfirmHelper.color}
              helperText={netidConfirmHelper.text}
              value={netIdConfirm}
              onChange={(e) => setNetIdConfirm(e.target.value)}
              placeholder='Confirm NetID'
              labelRight='@illinois.edu'
              bordered />
            <Spacer />
            <Button disabled={!validated} onPress={purchaseHandler}>Purchase for $20.00</Button>
          </Card.Body>
        </Card>
        <Modal aria-labelledby='payment-title' onClose={closeHandler} open={modalVisible} closeButton>
          <Modal.Header>
            <Text h4 id='payment-title'>Become a Paid Member</Text>
          </Modal.Header>
          <Modal.Body>
            <PayPalScriptProvider
              options={{ 'client-id': 'AeFhv1JIJ40uthOz37P201fUDw7rYfl-nHEDm4JOyP-abcaodBjtYm3DycUaNIXsQawOf4h3ibAUk5dO' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return axios.post('https://api.acm.illinois.edu/orders', {
                    netid: netId
                  }, {
                    validateStatus: (status) => status < 400
                  })
                    .then((res) => {
                      console.log(res.data);
                      return res.data.id;
                    })
                    .catch((error) => {
                      if (error.response) {
                        if (error.response.status === 422) {
                          const errorObj = error.response.data;
                          setModalVisible(false);
                          setErrorMessage({
                            code: errorObj.details[0].issue,
                            message: errorObj.details[0].description
                          });
                          setErrorMessageVisible(true);
                        } else if (error.response.status === 400) {
                          const errorObj = error.response.data.errors;
                          setModalVisible(false);
                          setErrorMessage({
                            code: 400,
                            message: errorObj[0].msg + ' for ' + errorObj[0].param
                          });
                          setErrorMessageVisible(true);
                        } else {
                          setModalVisible(false);
                          setErrorMessage({
                            code: 500,
                            message: 'Internal server error: ' + error.response.data
                          });
                          setErrorMessageVisible(true);
                        }
                      }
                    });
                }}
                onApprove={(data, actions) => {
                  return axios.post(`https://api.acm.illinois.edu/orders/${data.orderID}/capture`, {}, {
                    validateStatus: (status) => status < 400
                  })
                    .then((res) => {
                      setModalVisible(false);
                      setConfirmationVisible(true);
                    })
                    .catch((error) => {
                      if (error.response) {
                        if (error.response.status === 422) {
                          const errorObj = error.response.data;
                          setModalVisible(false);
                          setErrorMessage({
                            code: errorObj.details[0].issue,
                            message: errorObj.details[0].description
                          });
                          setErrorMessageVisible(true);
                        } else if (error.response.status === 400) {
                          const errorObj = error.response.data.errors;
                          setModalVisible(false);
                          setErrorMessage({
                            code: 400,
                            message: errorObj[0].msg + ' for ' + errorObj[0].param
                          });
                          setErrorMessageVisible(true);
                        } else {
                          setModalVisible(false);
                          setErrorMessage({
                            code: 500,
                            message: 'Internal server error: ' + error.response.data
                          });
                          setErrorMessageVisible(true);
                        }
                      }
                    });
                }}
              />
            </PayPalScriptProvider>
          </Modal.Body>
        </Modal>
        <Modal aria-labelledby='error-title' open={errorMessageVisible} onClose={errorMessageCloseHandler} closeButton>
          <Modal.Header>
            <Text h4 id='error-title'>Payment Failed</Text>
          </Modal.Header>
          <Modal.Body>
            <Text b>Error Code: {errorMessage && errorMessage.code}</Text>
            <Text>{errorMessage && errorMessage.message}</Text>
          </Modal.Body>
          <Card.Divider/>
          <Modal.Footer>
            {errorMessage && errorMessage.code && (<Text>
              If you believe that your payment has gone through, contact <a href='mailto:evanmm3@illinois.edu'>Evan
              Matthews</a> with the error code. Otherwise, feel free to try again.
            </Text>)}
          </Modal.Footer>
        </Modal>
        <Modal aria-labelledby='success-title' open={confirmationVisible} onClose={() => setConfirmationVisible(false)}
               closeButton>
          <Modal.Header>
            <Text h4 id='success-title'>You're now a Paid Member of ACM!</Text>
          </Modal.Header>
          <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Payment;