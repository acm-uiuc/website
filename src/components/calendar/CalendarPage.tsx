import { AllOrganizationNameList } from '@acm-uiuc/js-shared';
import { useEffect, useState } from 'preact/hooks';
import type { View } from 'react-big-calendar';
import { Views } from 'react-big-calendar';

import { eventsApiClient } from '../../api';
import { transformEventsApiDates } from '../../api/events';
import type { Event } from '../../types/events';
import CalendarControls from './CalendarControls';
import CalendarEventDetail from './CalendarEventDetail';
import CalendarGrid, { type ExpandedEvent } from './CalendarGrid';

interface CalendarPageProps {
  initialEvents: Event[];
}

export default function CalendarPage({ initialEvents }: CalendarPageProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [displayDate, setDisplayDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [filter, setFilter] = useState('');
  const [hostFilter, setHostFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStart, setSelectedStart] = useState<Date | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>();

  // Refresh events at runtime
  useEffect(() => {
    (async () => {
      try {
        const data = await eventsApiClient.apiV1EventsGet();
        setEvents(transformEventsApiDates(data));
      } catch (e) {
        console.error('Failed to fetch calendar, falling back to SSR.');
      }
    })();
  }, []);

  // Read host filter from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const host = params.get('host');
    if (host) {
      setHostFilter(host);
    }
  }, []);

  const handleSelectEvent = (expanded: ExpandedEvent) => {
    setSelectedEvent(expanded as unknown as Event);
    setSelectedStart(expanded._start);
    setSelectedEnd(expanded._end);
  };

  return (
    <section class="mx-auto w-full px-2 py-8 lg:px-14 mt-20">
      <h1 class="mb-3 text-3xl font-bold">Calendar</h1>
      <div class="mb-2">
        <CalendarControls
          displayDate={displayDate}
          setDisplayDate={setDisplayDate}
          view={view}
          setView={setView}
        >
          <select
            value={hostFilter}
            onChange={(e) =>
              setHostFilter((e.target as HTMLSelectElement).value)
            }
            class="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">Select host</option>
            {AllOrganizationNameList.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search events"
            value={filter}
            onInput={(e) => setFilter((e.target as HTMLInputElement).value)}
            class="hidden rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-navy-500 focus:outline-none md:block"
          />
        </CalendarControls>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-10">
        <div class="xl:col-span-3 xl:order-last">
          <CalendarEventDetail
            event={selectedEvent}
            start={selectedStart}
            end={selectedEnd}
          />
        </div>
        <div class="xl:col-span-7 min-w-0 w-full">
          <CalendarGrid
            events={events}
            filter={filter}
            hostFilter={hostFilter}
            displayDate={displayDate}
            view={view}
            setView={setView}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      </div>
    </section>
  );
}
