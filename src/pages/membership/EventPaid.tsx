import Layout from './Layout';
import { Container, Modal, Text } from '@nextui-org/react';
import successAnimation from './success.json';
import Lottie from 'lottie-react';

const EventPaid = () => {

  return (
    <Layout>
      <Container xs css={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Modal aria-labelledby='success-title' open={true} onClose={() => {window.location.replace("https://acm.illinois.edu")}}
               closeButton>
          <Modal.Header>
            <Text h4 id='success-title'>You've successfully joined the event. Check your email for a ticket.</Text>
          </Modal.Header>
          <Modal.Body css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Lottie animationData={successAnimation} loop={false} style={{ width: '10em' }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default EventPaid;
