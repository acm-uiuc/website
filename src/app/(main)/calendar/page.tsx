'use client';
import Events, { IEvent } from '../../../components/Events/events'
import allEvents from 'public/events.json'
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'
import EventInfo from '../../../components/EventInfo/EventInfo';
import {useState} from 'react';
import CalendarControls from '@/components/CalendarControls';

export interface EventIntroProps {
  title?: string;
  location?: string;
  start?: string;
  host?: string;
  description: string;
}

const defaultEvent: EventIntroProps = {
  description: "N/A",
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
          <Events events={allEvents} updateEvent={setEvent} filter={filter} displayDate={displayDate} dayFilter={dayFilter}/>
          <EventInfo
            title={event.title}
            location={event.location}
            date={event.start}
            description={event.description}
            host={event.host}
          />
        </div>
      </section>
    </>
  );
};

export default Calendar;