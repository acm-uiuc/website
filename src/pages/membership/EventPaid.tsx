import Layout from './Layout';
import { Container, Modal, Text } from '@nextui-org/react';
import successAnimation from './success.json';
import Lottie from 'lottie-react';
import { useParams } from 'react-router-dom';


const paidEventList : {[key: string]: any} = require("./paidEvents.json");

const EventPaid = () => {
  const { eventName } = useParams();
  const eventNameStr: string = typeof eventName === "undefined" ? "" : eventName;

  return (
    <Layout>
      <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Modal aria-labelledby='success-title' open={true} onClose={() => {window.location.replace("https://acm.illinois.edu")}}
               closeButton>
          <Modal.Header>
            <Text h4 id='success-title'>You've successfully registered for {paidEventList[eventNameStr]['eventFullTitle']}.</Text>
          </Modal.Header>
          <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text h5 id='success-lower'>Your ticket has been sent to your Illinois email.</Text>
            <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default EventPaid;
