'use client';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStylesOverride.css';
import { CalendarEventDetailProps } from '@/components/CalendarEventDetail/CalendarEventDetail';
import { View, NavigateAction } from 'react-big-calendar';
import { Organization } from '../LazyImage';
import { Skeleton } from '@nextui-org/react';
import { howManyUnitInYear, repeatMapping, RepeatMappingEntry, ValidRepeat, validRepeats } from '@/utils/dateutils';
import { maxRenderDistance } from '../CalendarControls';


/*
    The type definition for a JSON event.
    Does not need to line up with the format of react-big-calendar
*/
export interface IEvent {
    title: string;
    start: string;
    end?: string;
    category?: string;
    location: string;
    locationLink?: string;
    dateLink?: string;
    description: string;
    repeats?: ValidRepeat;
    repeatEnds?: string;
    paidEventId?: string;
    host?: Organization;
    featured?: boolean;
}


export interface CalendarEvent extends BigCalendarEvent {
    title: string;
    location: string;
    locationLink?: string;
    description: string;
    host?: Organization;
    paidEventId?: string;
}

export interface EventsProps {
  events: IEvent[] | null;
  updateEventDetails: React.Dispatch<React.SetStateAction<CalendarEventDetailProps>>;
  displayDate: Date;
  updateDisplayDate: React.Dispatch<React.SetStateAction<Date>>;
  filter: string;
  hostFilter: string;
  view: View,
  setView: React.Dispatch<React.SetStateAction<View>>;
}


const localizer = momentLocalizer(moment);


function createRecurringEvents(event: IEvent, repeatEntry: RepeatMappingEntry, repeatEnd: any) {
    const events = [];
    let start = moment(event.start);
    let end = event.end ? moment(event.end) : null;
    while (start?.isSameOrBefore(maxRenderDistance)) {
        const repeatCond = end || start;
        if (repeatCond.isSameOrAfter(repeatEnd)) {
            break;
        }
        events.push({
            ...event,
            start: start.toDate(),
            end: end ? end.toDate() : undefined,
        });
        start.add(repeatEntry.increment, repeatEntry.unit);
        if (end) {
            end.add(repeatEntry.increment, repeatEntry.unit);
        }
    }
    return events;
}

const Events: React.FC<EventsProps> = ({ events, updateEventDetails, displayDate, updateDisplayDate, filter, hostFilter, view, setView }) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
    useEffect(() => {
        setCalendarHeight(window.innerHeight * 0.7);
    }, []);

    const selectEvent = (event: CalendarEvent) => {
        const newEvent: CalendarEventDetailProps = {
            title: event.title,
            location: event.location,
            locationLink: event.locationLink,
            description: event.description,
            host: event.host,
            start: event.start,
            end: event.end,
            paidEventId: event.paidEventId
        };
        updateEventDetails(newEvent);
    };

    const dummyNav = (newDate: Date, view: View, action: NavigateAction) => { return; }

    useEffect(() => {
        // Filter events based on the filter prop
        if (!events) {
            return;
        }
        const filteredEvents = events.filter(event =>
          event.title.toLowerCase().includes(filter.toLowerCase()) &&
          (hostFilter ? event.host?.toLowerCase() === hostFilter.toLowerCase() : true)
        );
        // Convert the events to the format required by react-big-calendar
        const formattedEvents: (CalendarEvent | null)[] = filteredEvents.flatMap(event => {
            // Repeat the event for a year out or until it ends, whichever comes first)
            if (event.repeats && validRepeats.includes(event.repeats)) {
                const repeatEnd = event.repeatEnds ? moment(event.repeatEnds) : maxRenderDistance;
                return createRecurringEvents(event, repeatMapping[event.repeats], repeatEnd);
            }

            return [{
                ...event,
                start: moment(event.start).toDate(),
                end: event.end ? moment(event.end).toDate() : moment(event.start).toDate(),
            }];
        });
        const filteredFormattedEvents: CalendarEvent[] = formattedEvents.filter((event) => event !== null)
        setFilteredEvents(filteredFormattedEvents);
    }, [events, filter, hostFilter]);
    return (
        <Skeleton isLoaded={calendarHeight != 0 || !events} style={{width: '100%', minHeight: '70vh'}} className="rounded-lg">
            <Calendar
                dayLayoutAlgorithm='no-overlap'
                date={displayDate}
                onNavigate={dummyNav}
                localizer={localizer}
                events={filteredEvents}
                onSelectEvent={selectEvent}
                view={view}
                onView={setView}
                onDrillDown={(e, view) => {updateDisplayDate(e); setView(view);}}
                style={{ height: calendarHeight }}
            />
        </Skeleton>
    );
};

export default Events;
