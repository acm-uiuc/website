'use client';
import LeadSection from '../../../sections/about/LeadershipSection';
import Events, {CustomEventType} from '../../../components/Events/events'
import fakeEvents from '../../../components/Events/fakeEvents'

import EventInfo from '../../../components/EventInfo/EventInfo';
import {useState} from 'react';
import CalendarControls from '@/components/CalendarControls';
/*
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
*/

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
  const [offset, setOffset] = useState<number>(0);
  return (
    <>
      <section className="container">
      <h1 className='mt-0 pt-0 mb-4'>Our Events</h1>
      <CalendarControls currOffset={offset} updateOffset={setOffset}></CalendarControls>
      <div className='flex justify-between pb-10'> 
          <Events events={fakeEvents} updateEvent={setEvent} offset={offset}/>
          <EventInfo 
          title = {event.title}
          location = {event.location}
          date = {event.date}
          description = {event.description}
          host = {event.host}>
          </EventInfo>      
      </div>
      </section>
    </>
  );
};

export default Calendar;


/*

        <EventInfo 
        title = {event.title}
        location = {event.location}
        date = {event.date}
        description = {event.description}
        host = {event.host}
         ></EventInfo>

*/