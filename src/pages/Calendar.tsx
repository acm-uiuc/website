import styled from 'styled-components';
import Header from '../components/Header/Header';
import Text from '../components/Text/Text';
import Navbar from '../components/Navbar/Navbar';
import Content from '../components/Content/Content';
import Transition from '../components/Transition/Transition';
import Footersection from '../sections/Footersection';
import LeadSection from '../sections/about/LeadershipSection';
import { NavLink } from 'react-router-dom';
import EventInfo from '../components/EventInfo/EventInfo';
import {useState} from 'react';

const PaddedNav = styled(Navbar)`
  padding-bottom: 20px;
`;


const CalendarDiv = styled.div`
  width: 70%;
  height: 720px;
  border: solid;
  
`


const FlexContainer = styled.div `
  display: flexbox;
  justify-content: center;
  gap: 5%;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`


export interface EventProps {
  title?: string;
  location?: string;
  date?: string;
  description: string;
  host: string;
}

const defaultEvent: EventProps = {
  title: "Event Title",
  description: "N/A",
  host: "N/A"
};


const Calendar = () => {
  const [event, setEvent] = useState(defaultEvent);
  
  return (
    <>
      <PaddedNav />
      <Transition to="#fff" />
      <Content as="section">
      <FlexContainer>
        <CalendarDiv> Calendar goes here </CalendarDiv>
        <EventInfo 
        title = {event.title}
        location = {event.location}
        date = {event.date}
        description = {event.description}
        host = {event.host}
         ></EventInfo>
       </FlexContainer>
      </Content>
      {/* <Footersection /> */}
    </>
  );
};

export default Calendar;