import { useState, useEffect, useMemo } from 'preact/hooks';
import {
  Calendar,
  dateFnsLocalizer,
  type View,
  type NavigateAction,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/calendar-overrides.css';
import type { Event } from '../../types/events';
import { createRecurringEvents } from '../../api/dateutils';
import { OrgType, getOrgsByType } from '@acm-uiuc/js-shared';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const sigNames = new Set<string>(
  getOrgsByType(OrgType.SIG).map((s) => s.name),
);

interface ExpandedEvent {
  _start: Date;
  _end: Date;
  id: string;
  title: string | null;
  location: string;
  locationLink?: string;
  description: string | null;
  host?: string;
  paidEventId?: string | null;
  repeats?: string;
  start: string;
  end?: string;
}

function getEventColor(event: ExpandedEvent) {
  if (event.host && sigNames.has(event.host)) {
    return event.repeats ? 'var(--color-tangerine-500)' : 'var(--color-rose-500)';
  }
  // ACM events use navy
  return 'var(--color-navy-700)';
}

function getEventSelectedColor(event: ExpandedEvent) {
  if (event.host && sigNames.has(event.host)) {
    return event.repeats ? 'var(--color-tangerine-600)' : 'var(--color-rose-600)';
  }
  // ACM events use navy
  return 'var(--color-navy-800)';
}


interface CalendarGridProps {
  events: Event[];
  filter: string;
  hostFilter: string;
  displayDate: Date;
  view: View;
  setView: (v: View) => void;
  onSelectEvent: (event: ExpandedEvent) => void;
}

export type { ExpandedEvent };

export default function CalendarGrid({
  events,
  filter,
  hostFilter,
  displayDate,
  view,
  setView,
  onSelectEvent,
}: CalendarGridProps) {
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setCalendarHeight(window.innerHeight * 0.7);
  }, []);

  const filteredEvents = useMemo(() => {
    const filtered = events.filter(
      (e) =>
        e.title && e.title.toLowerCase().includes(filter.toLowerCase()) &&
        (hostFilter ? e.host?.toLowerCase() === hostFilter.toLowerCase() : true),
    );

    return filtered.flatMap((event) => createRecurringEvents(event));
  }, [events, filter, hostFilter]);

  // Auto-select event from URL on mount
  useEffect(() => {
    if (filteredEvents.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const date = params.get('date');
    if (!id) return;

    const match = filteredEvents.find((e) => {
      if (date) {
        return (
          e.id === id &&
          e._start.toISOString().slice(0, 10) === date
        );
      }
      return e.id === id;
    });
    if (match && match.title !== null) {
      setSelectedId(match.id + match._start.toISOString());
      onSelectEvent(match);
    }
  }, [filteredEvents]);

  const handleSelect = (event: ExpandedEvent) => {
    setSelectedId(event.id + event._start.toISOString());
    onSelectEvent(event);

    const params = new URLSearchParams(window.location.search);
    params.set('id', event.id);
    params.set('date', event._start.toISOString().slice(0, 10));
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}?${params.toString()}`,
    );
  };

  const dummyNav = (_newDate: Date, _view: View, _action: NavigateAction) => { };

  if (!calendarHeight) {
    return <div class="min-h-[70vh] animate-pulse rounded-lg bg-gray-200" />;
  }

  return (
    // @ts-ignore — react-big-calendar types expect React, Preact compat works at runtime
    <Calendar
      dayLayoutAlgorithm="no-overlap"
      date={displayDate}
      onNavigate={dummyNav}
      localizer={localizer}
      events={filteredEvents}
      startAccessor="_start"
      endAccessor="_end"
      onSelectEvent={handleSelect}
      view={view}
      onView={setView}
      popup
      showAllEvents
      style={{ height: calendarHeight, width: "100%" }}
      eventPropGetter={(event: ExpandedEvent) => {
        const isSelected =
          selectedId === event.id + event._start.toISOString();
        const color = isSelected ? getEventSelectedColor(event) : getEventColor(event);
        return {
          style: {
            backgroundColor: color,
            borderRadius: '0.375rem',
            fontSize: '13px',
            color: 'white',
          },
        };
      }}
    />
  );
}
