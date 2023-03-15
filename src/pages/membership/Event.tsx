import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { Button, Card, Container, Input, Modal, Spacer, Text } from '@nextui-org/react';
import successAnimation from './success.json';
import Lottie from 'lottie-react';
import axios from 'axios';
import eventList  from '../../components/Hero/events.json';

interface ErrorCode {
  code?: number | string,
  message: string
}

interface HelperReturnType {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  text: string
}

const Event = () => {
  let { eventName } = useParams();
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
    const url = `https://lz6glqwonfyx5dcmfjtlbqd6hm0fnrrd.lambda-url.us-east-1.on.aws?netid=${netId}&eventid=${eventName}`;
    axios.get(url).then(response => {
      console.log(response);
      window.location.replace(response.data);
    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 422) {
          const errorObj = error.response.data;
          setErrorMessage({
            code: errorObj.details[0].issue,
            message: errorObj.details[0].description
          });
          setErrorMessageVisible(true);
        } else if (error.response.status === 400) {
          const errorObj = error.response.data.errors;
          setErrorMessage({
            code: 400,
            message: errorObj[0].msg + ' for ' + errorObj[0].param
          });
          setErrorMessageVisible(true);
        } else if (error.response.status === 404) {
          const errorObj = error.response.data.errors;
          setErrorMessage({
            code: "We could not issue you a ticket",
            message: error.response.data
          });
          setErrorMessageVisible(true);
        } else {
          setErrorMessage({
            code: 500,
            message: 'Internal server error: ' + error.response.data
          });
          setErrorMessageVisible(true);
        }
      }
    });
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
              {eventName} Signup
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            <Text>
              {/* Temporary, will replace with event API eventually */}
              Join ACM and meet your fellow members as we visit Murphy's, KAMS, Joe's, and Legends on our semesterly bar crawl. Get a free t-shirt with sign-up. Alcohol will be provided by ACM to members over 21 wearing bar crawl t-shirts. However, this ticket does not pay for cover at the bars.
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
            <Button disabled={!validated} onPress={purchaseHandler}>Purchase for $10 (member) / $13 (nonmember)</Button>
          </Card.Body>
        </Card>
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

export default Event;
