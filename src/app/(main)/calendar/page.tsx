'use client';
import Events, { IEvent } from '@/components/Events/events'
import allEvents from 'public/events.json'
import moment from 'moment-timezone'
import { momentLocalizer } from 'react-big-calendar'
import EventDetail, { CalendarEventDetailProps } from '@/components/CalendarEventDetail/CalendarEventDetail';
import {useState} from 'react';
import CalendarControls from '@/components/CalendarControls';
import { OrganizationList } from '@/components/LazyImage';
const defaultEvent: CalendarEventDetailProps = {
  description: "N/A",
};

const allEventsTyped = allEvents as IEvent[];

const localizer = momentLocalizer(moment);
const Calendar = () => {
  const [eventDetail, setEventDetail] = useState<CalendarEventDetailProps>(defaultEvent);
  const [displayDate, setDisplayDate] = useState<Date>(localizer.startOf(new Date(), 'month'));

  const [filter, setFilter] = useState(''); // Added filter state

  const [hostFilter, setHostFilter] = useState('');


  // Function to handle filter changes, moved from Events.tsx
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };
  return (
    <>
      <section className="container">
        <h1 className='mt-0 pt-0 mb-4'>Our Events</h1>
        <div className="flex"> 
          <CalendarControls currDisplayDate={displayDate} updateDisplayDate={setDisplayDate} />
          <div className="hidden lg:flex">
          <select
            value={hostFilter}
            onChange={(e) => setHostFilter(e.target.value)}
            className="border-2 border-gray-300 rounded-md mr-2 px-2" // Styling for the dropdown
            >
            <option value="">Filter by host</option>
            {OrganizationList.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
          </div>
          <div className="hidden lg:flex">
          <input
            type="text"
            placeholder="Search events"
            value={filter}
            onChange={handleFilterChange}
            className="ml-4 px-2 border-2 border-gray-300 focus:border-blue-500 rounded-md" // Updated styling
            />
          </div>
        </div>
        <div className='grid justify-between pb-10 gap-4 grid-cols-8'>
          <div className="flex lg:order-last col-span-8 lg:col-span-3">
            <EventDetail
              title={eventDetail.title}
              location={eventDetail.location}
              locationLink={eventDetail.locationLink}
              start={eventDetail.start}
              end={eventDetail.end}
              description={eventDetail.description}
              host={eventDetail.host}
            />
          </div>
          <div className="flex col-span-8 lg:col-span-5">
            <Events events={allEventsTyped} updateEventDetails={setEventDetail} filter={filter} displayDate={displayDate} hostFilter={hostFilter}/>
          </div>
        </div>
      </section>
    </>
  );
};

export default Calendar;