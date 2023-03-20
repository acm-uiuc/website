import { useState, useEffect } from 'react';
import Layout from './Layout';
import { Container, Modal, Text } from '@nextui-org/react';
import successAnimation from './success.json';
import Lottie from 'lottie-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventPaid = () => {
  const { eventName } = useParams();
  const eventNameStr: string = typeof eventName === "undefined" ? "" : eventName;
  const [paidEventList, setPaidEventList] = useState<Record<string, any>>({});


  const metaLoader = async () => {
    const url = `https://peakaueyvejduwiijhydvpwa640ehekr.lambda-url.us-east-1.on.aws/?eventid=${eventName}`;
    axios.get(url).then(response => {
      setPaidEventList(response.data);
    })
  }

  useEffect(() => {
    metaLoader();
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (Object.keys(paidEventList).length === 0) {
    return <Layout name="Event Signup"></Layout>;
  } else {
    return (
      <Layout name={paidEventList['event_name']}>
        <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Modal aria-labelledby='success-title' open={true} onClose={() => {window.location.replace("https://acm.illinois.edu")}}
                closeButton>
            <Modal.Header>
              <Text h4 id='success-title'>You've successfully registered for {paidEventList['event_name']}.</Text>
            </Modal.Header>
            <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Text h5 id='success-lower'>Your ticket has been sent to your Illinois email.</Text>
              <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
            </Modal.Body>
          </Modal>
        </Container>
      </Layout>
    );
  }
};

export default EventPaid;
