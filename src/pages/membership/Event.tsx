import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { Button, Card, Container, Input, Modal, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';

const paidEventList : {[key: string]: any} = require("./paidEvents.json");

interface ErrorCode {
  code?: number | string,
  message: string
}

interface HelperReturnType {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  text: string
}

const Event = () => {
  const { eventName } = useParams();
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const [netId, setNetId] = useState('');
  const [netIdConfirm, setNetIdConfirm] = useState('');
  const [validated, setValidated] = useState(false);

  const errorMessageCloseHandler = () => {
    setErrorMessageVisible(false);
    setErrorMessage(null);
  };

  const purchaseHandler = () => {
    setIsLoading(true);
    const url = `https://lz6glqwonfyx5dcmfjtlbqd6hm0fnrrd.lambda-url.us-east-1.on.aws?netid=${netId}&eventid=${eventName}`;
    axios.get(url).then(response => {
      window.location.replace(response.data);
    }).catch((error) => {
      if (!error.response) {
        setErrorMessageVisible(true);
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
      setErrorMessageVisible(true);
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
      text: isValid ? '' : 'Enter a valid NetID',
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
      text: isValid ? (netId === netIdConfirm ? '' : 'Your NetIDs did not match') : 'Enter a valid NetID',
      color: (isValid && netId === netIdConfirm) ? 'success' : 'error'
    };
  }, [netIdConfirm, netId]);

  const eventNameStr : string = typeof eventName === "undefined" ? "" : eventName;

  return (
    <Layout name = {paidEventList[eventNameStr]["eventFullTitle"]}>
      <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card css={{ margin: '2em' }}>
          <Card.Header>
            <Text b>
              {paidEventList[eventNameStr]["eventFullTitle"]} Signup
            </Text>
          </Card.Header>
          <Card.Divider />
          <Card.Body>
            {paidEventList[eventNameStr]["eventImage"] ? <img src={paidEventList[eventNameStr]["eventImage"]}></img> : null}
            <Text>
              {/* Temporary, will replace with event API eventually */}
              { paidEventList[eventNameStr]["eventDetails"]}
            </Text>
            <Text><b>Cost:</b> ${paidEventList[eventNameStr]["eventCost"]["paid"]} for paid ACM members, ${paidEventList[eventNameStr]["eventCost"]["others"]} for all other participants.</Text>
            <Spacer />
            <Input
              color={netidHelper.color}
              helperColor={netidHelper.color}
              helperText={netidHelper.text}
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              placeholder='NetID'
              labelRight='@illinois.edu'
              aria-label='Enter Illinois NetID'
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
              aria-label='Confirm Illinois NetID'
              bordered />
            <Spacer />
            <Button disabled={(!validated) || isLoading} onPress={purchaseHandler}>{isLoading ? 'Verifying information...' : 'Purchase now'}</Button>
          </Card.Body>
        </Card>
        <Modal aria-labelledby='error-title' open={errorMessageVisible} onClose={errorMessageCloseHandler} closeButton>
          <Modal.Header>
            <Text h4 id='error-title'>Verification Failed</Text>
          </Modal.Header>
          <Modal.Body>
            <Text b>Error: {errorMessage && errorMessage.code}</Text>
            <Text>{errorMessage && errorMessage.message}</Text>
          </Modal.Body>
          <Card.Divider/>
          <Modal.Footer>
            {errorMessage && errorMessage.code && (<Text>
              If you believe you are recieving this message in error, contact the <a href='mailto:infra@acm.illinois.edu'>ACM Infrastructure Team
              </a> with the error code. Otherwise, feel free to try again.
            </Text>)}
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Event;
