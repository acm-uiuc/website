'use client';
import LeadSection from '../../../sections/about/LeadershipSection';
import Events, {CustomEventType} from '../../../components/Events/events'
import fakeEvents from '../../../components/Events/fakeEvents'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import EventInfo from '../../../components/EventInfo/EventInfo';
import {useState} from 'react';
import CalendarControls from '@/components/CalendarControls';
import AddEventModal from '@/components/Events/AddEventModal';
import { Button } from '@nextui-org/react';
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


const localizer = momentLocalizer(moment);
const Calendar = () => {
  const [event, setEvent] = useState<EventIntroProps>(defaultEvent);
  const [displayDate, setDisplayDate] = useState<Date>(localizer.startOf(new Date(), 'month'));

  const [filter, setFilter] = useState(''); // Added filter state

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [dayFilter, setDayFilter] = useState('');


  // Function to handle filter changes, moved from Events.tsx
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <>
      <section className="container">
        <h1 className='mt-0 pt-0 mb-4'>Our Events</h1>
        <div className="flex items-center justify-between mb-4"> 
          <CalendarControls currDisplayDate={displayDate} updateDisplayDate={setDisplayDate} />
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-md mr-2" // Styling for the dropdown
            >
            <option value="">Filter by day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search events"
            value={filter}
            onChange={handleFilterChange}
            className="ml-4 border-2 border-gray-300 focus:border-blue-500 rounded-md" // Updated styling
          />
        </div>
        <div className='flex justify-between pb-10'> 
          <Events events={fakeEvents} updateEvent={setEvent} filter={filter} displayDate={displayDate} dayFilter={dayFilter}/>
          <EventInfo
            title={event.title}
            location={event.location}
            date={event.date}
            description={event.description}
            host={event.host}
          />
        </div>
        <div>
          {/* <Button
            onClick={() => setIsAddModalOpen(true)}
            className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer"
          >
            Add Event
          </Button>
          {isAddModalOpen && <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />} */}
          <AddEventModal />
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