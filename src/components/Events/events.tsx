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
import { howManyUnitInYear, repeatMapping, validRepeats } from '@/utils/dateutils';

export type Frequency = 'weekly' | 'biweekly';

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
    repeats?: Frequency;
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
            // Repeat the event for a year out or until it ends, whichever comes first
            if (event.repeats && validRepeats.includes(event.repeats)) {
                const {increment, unit} = repeatMapping[event.repeats];
                const repeatEnd = moment(event.repeatEnds) || moment.max();
                return Array.from({ length: howManyUnitInYear({increment, unit}) / increment }, (_, i) => {
                    const newStart = moment(event.start).add(i * increment, unit);
                    const newEnd = event.end ? moment(event.end).add(i * increment, unit) : newStart;
                    if (newEnd.isAfter(repeatEnd)) {
                        return null;
                    }
                    return {
                        ...event,
                        start: newStart.toDate(),
                        end: newEnd.toDate(),
                    }
                })
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
