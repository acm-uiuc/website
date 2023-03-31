import styled from 'styled-components';
import Header from '../components/Header/Header';
import Text from '../components/Text/Text';
import Navbar from '../components/Navbar/Navbar';
import Content from '../components/Content/Content';
import Transition from '../components/Transition/Transition';
import Footersection from '../sections/Footersection';
import LeadSection from '../sections/about/LeadershipSection';
import { NavLink } from 'react-router-dom';

const PaddedNav = styled(Navbar)`
  padding-bottom: 20px;
`;

const AboutHeader = styled(Header)`
  margin-top: 00px;
  padding-top: 0px;
  margin-bottom: 20px;
`;



const Calendar = () => {
  return (
    <>
      <PaddedNav />
      <Transition to="#fff" />
      <Content as="section">
       
       
    
      </Content>
      {/* <Footersection /> */}
    </>
  );
};

export default Calendar;