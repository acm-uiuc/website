import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { Button, Card, Container, Input, Modal, Spacer, Text } from '@nextui-org/react';
import axios from 'axios';


interface ErrorCode {
  code?: number | string,
  message: string,
  title?: string
}

interface HelperReturnType {
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error',
  text: string
}

const baseUrl = 'https://ticketing.acm.illinois.edu';
const Event = () => {
  const { eventName } = useParams();
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorCode | null>(null);

  const [netId, setNetId] = useState('');
  const [netIdConfirm, setNetIdConfirm] = useState('');
  const [validated, setValidated] = useState(false);
  const [paidEventList, setPaidEventList] = useState<Record<string, any>>({});

  const errorMessageCloseHandler = () => {
    setErrorMessageVisible(false);
    setErrorMessage(null);
  };
  const metaLoader = async () => {
    const url = `${baseUrl}/api/v1/event/details?eventid=${eventName}`;
    axios.get(url).then(response => {
      setPaidEventList(response.data);
      setErrorMessageVisible(false);
      setIsLoading(false)
      console.log(response.data)
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
          setErrorMessageVisible(true);
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
    const url = `${baseUrl}/api/v1/checkout/session?netid=${netId}&eventid=${eventName}`;
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
  if (Object.keys(paidEventList).length === 0) {
    return <Layout name="Event Signup"></Layout>;
  } else {
    const dateString = new Date(paidEventList['event_time'] * 1000)
    const isRunningOut = (paidEventList['tickets_sold']/paidEventList['event_capacity'] > 0.75)
    return ( 
      <Layout name = {paidEventList["event_name"]}>
        <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card css={{ margin: '2em' }}>
            <Card.Header>
              <Text b>
                {paidEventList["event_name"]} Signup
              </Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body>
              {paidEventList["eventImage"] ? <img alt={paidEventList["event_name"] + " image."} src={paidEventList["eventImage"]}></img> : null}
              <Text>
                { paidEventList["eventDetails"]}
              </Text>
              <Spacer />
              <Text><b>Date:</b> {dateString.toLocaleString([], {
                'year': 'numeric',
                'month': 'long',
                'day': 'numeric',
                'hour12': true,
                'hour': 'numeric',
                'minute': '2-digit',
                "timeZoneName": "short"
              })}.</Text>
              <Spacer />
              <Text><b>Cost:</b> ${paidEventList["eventCost"]["paid"]} for paid ACM@UIUC members, ${paidEventList["eventCost"]["others"]} for all other participants.</Text>
              <Spacer />
              <Text>{isRunningOut ? <><i>Tickets are running out, order soon!</i><Spacer /></> : null}</Text>
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
              <Text h4 id='error-title'>{(errorMessage && errorMessage.title) || 'Verification Failed'}</Text>
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
  }
 
};

export default Event;
