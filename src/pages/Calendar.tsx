import styled from 'styled-components';
import Header from '../components/Header/Header';
import Text from '../components/Text/Text';
import Navbar from '../components/Navbar/Navbar';
import Content from '../components/Content/Content';
import Transition from '../components/Transition/Transition';
import Footersection from '../sections/Footersection';
import LeadSection from '../sections/about/LeadershipSection';
import { NavLink } from 'react-router-dom';
import Events, {CustomEventType} from '../components/Events/events'
import fakeEvents from '../components/Events/fakeEvents'

import EventInfo from '../components/EventInfo/EventInfo';
import {useState} from 'react';

const PaddedNav = styled(Navbar)`
  padding-bottom: 20px;
`;




const FlexContainer = styled.div `
  display: flex;
  justify-content: space-between;
  padding-top: 0.5%;
  margin-top: 2%;
  padding-bottom: 40px;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;  
  }
`

const SectionTitle = styled(Header)`
    margin-top: 0px;
    padding-top: 0px;
    margin-bottom: 3%;
    color: ${(props) => props.theme.colors.acmDark};
`;


export interface EventIntroProps {
  title?: string;
  location?: string;
  date?: string;
  description: string;
  host: string;

}

    

const defaultEvent: EventIntroProps = {
  description: "N/A",
  host: "",
};



const Calendar = () => {
  const [event, setEvent] = useState<EventIntroProps>(defaultEvent);

  return (
    <>
      <PaddedNav />
      <Transition to="#fff" />
      <Content as="section">
      <SectionTitle level={1}>Our Events</SectionTitle>
      <FlexContainer> 
        <Events events={fakeEvents} updateEvent={setEvent} />
        <EventInfo 
        title = {event.title}
        location = {event.location}
        date = {event.date}
        description = {event.description}
        host = {event.host}
         ></EventInfo>
       </FlexContainer>
      </Content>
      <Footersection/>
    </>
  );
};

export default Calendar;