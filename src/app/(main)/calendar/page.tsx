'use client';
import Events, { IEvent } from '@/components/Events/events';
import moment from 'moment-timezone';
import EventDetail, {
  CalendarEventDetailProps,
} from '@/components/CalendarEventDetail/CalendarEventDetail';
import { Suspense, useEffect, useState } from 'react';
import CalendarControls from '@/components/CalendarControls';
import { View, Views } from 'react-big-calendar';
import { transformApiDates } from '@/utils/dateutils';
import { AllOrganizationList as OrganizationList } from '@acm-uiuc/js-shared';
import { useSearchParams } from 'next/navigation';

const defaultEvent: CalendarEventDetailProps = {
  description: 'N/A',
};

const Calendar = () => {
  const searchParams = useSearchParams();
  const host = searchParams.get('host') || '';
  const [eventDetail, setEventDetail] =
    useState<CalendarEventDetailProps>(defaultEvent);
  const [displayDate, setDisplayDate] = useState<Date>(
    moment().local().toDate(),
  );
  const [view, setView] = useState<View>(Views.MONTH); // Default view is month
  const [filter, setFilter] = useState(''); // Added filter state
  const [hostFilter, setHostFilter] = useState(
    OrganizationList.includes(host) ? host : '',
  );
  const [allEvents, setAllEvents] = useState<IEvent[] | null>(null);
  const [validOrganizations, setValidOrganizations] =
    useState<string[]>(OrganizationList);
  useEffect(() => {
    const baseurl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
    if (!baseurl) {
      return setAllEvents([]);
    }
    async function fetcher() {
      const urls = [
        `${baseurl}/api/v1/events`,
        `${baseurl}/api/v1/organizations`,
      ];

      try {
        const [eventsResponse, organizationsResponse] =
          await Promise.allSettled(urls.map((url) => fetch(url)));
        if (eventsResponse.status === 'fulfilled') {
          const eventsData = await eventsResponse.value.json();
          setAllEvents(transformApiDates(eventsData as IEvent[]));
        } else {
          setAllEvents([]); // Handle error for events fetch
        }

        // Handle organizations response
        if (organizationsResponse.status === 'fulfilled') {
          const organizationsData = await organizationsResponse.value.json();
          setValidOrganizations(organizationsData as string[]);
          if (!organizationsData.includes(hostFilter)) {
            setHostFilter('');
          }
        } else {
          setValidOrganizations(OrganizationList);
        }
      } catch (err) {
        console.error('Error in processing fetch results:', err);
        setAllEvents([]); // Fallback error handling for critical failure
        setValidOrganizations(OrganizationList);
      }
    }
    fetcher();
  }, []);

  // Function to handle filter changes, moved from Events.tsx
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  // Label text showing on the filter box
  const filterLabel =
    typeof window !== 'undefined' && window.innerWidth >= 460
      ? 'Filter by host'
      : 'Filter';

  return (
    <Suspense>
      <section className="container">
        <h1 className="mt-0 pt-0 mb-4">Our Events</h1>
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-8 w-full gap-x-6">
          <div className="flex sm:col-span-2 md:col-span-1 xl:col-span-5">
            <CalendarControls
              currDisplayDate={displayDate}
              updateDisplayDate={setDisplayDate}
              currView={view}
              updateCurrView={setView}
            />
          </div>
          <div className="flex h-[2.5rem] mt-auto sm:col-span-1 md:col-span-1 lg:mt-0 xl:col-span-3 w-full gap-x-4 justify-end">
            <div className="flex md:w-1/2 lg:w-2/5">
              <select
                value={hostFilter}
                onChange={(e) => {
                  setHostFilter(e.target.value);
                  const baseURL = window
                    ? window.location.origin
                    : 'https://acm.illinois.edu';
                  if (e.target.value === '') {
                    window.history.replaceState(
                      null,
                      '',
                      baseURL + `/calendar`,
                    );
                  } else {
                    window.history.replaceState(
                      null,
                      '',
                      baseURL +
                      `/calendar?host=${e.target.value.replaceAll(' ', '+')}`,
                    );
                  }
                }}
                className="px-2 border-2 border-gray-300 rounded-md w-full h-full" // Styling for the dropdown
              >
                <option value="">{filterLabel}</option>
                {validOrganizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden md:flex md:w-1/2 lg:w-3/5">
              <input
                type="text"
                placeholder="Search events"
                value={filter}
                onChange={handleFilterChange}
                className="px-2 border-2 border-gray-300 focus:border-blue-500 rounded-md w-full h-full" // Updated styling
              />
            </div>
          </div>
        </div>
        <div className="grid justify-between pb-10 gap-x-6 grid-cols-8">
          <div className="flex xl:order-last col-span-8 xl:col-span-3">
            <EventDetail
              title={eventDetail.title}
              location={eventDetail.location}
              locationLink={eventDetail.locationLink}
              paidEventId={eventDetail.paidEventId}
              start={eventDetail.start}
              end={eventDetail.end}
              description={eventDetail.description}
              host={eventDetail.host}
            />
          </div>
          <div className="flex col-span-8 xl:col-span-5">
            <Events
              view={view}
              setView={setView}
              events={allEvents}
              updateEventDetails={setEventDetail}
              filter={filter}
              displayDate={displayDate}
              updateDisplayDate={setDisplayDate}
              hostFilter={hostFilter}
            />
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Calendar;
