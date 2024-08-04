'use client';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStylesOverride.css';
import { EventIntroProps } from '../../app/(main)/calendar/page';
import { View, NavigateAction } from 'react-big-calendar';
import { Organization } from '../LazyImage';

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
    paidEventId?: string;
}


export interface CalendarEvent extends BigCalendarEvent {
    title: string;
    location: string;
    description: string;
    host?: Organization;
}

export interface EventsProps {
  events: IEvent[];
  updateEvent: React.Dispatch<React.SetStateAction<EventIntroProps>>;
  displayDate: Date;
  filter: string;
  dayFilter: string;
}


const localizer = momentLocalizer(moment);

const Events: React.FC<EventsProps> = ({ events, updateEvent, displayDate, filter, dayFilter }) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        setCalendarHeight(window.innerHeight * 0.7);
    }, []);

    const selectEvent = (event: CalendarEvent) => {
        const newEvent: EventIntroProps = {
            title: event.title,
            location: event.location,
            description: event.description,
            host: event.host,
        };
        updateEvent(newEvent);
    };

    const dummyNav = (newDate: Date, view: View, action: NavigateAction) => { return; }

    useEffect(() => {
        // Filter events based on the filter prop
        const filteredEvents = events.filter(event =>
          event.title.toLowerCase().includes(filter.toLowerCase()) &&
          (dayFilter ? moment(event.start).format('dddd') === dayFilter : true)
        );
        // Convert the events to the format required by react-big-calendar
        const formattedEvents: CalendarEvent[] = filteredEvents.flatMap(event => {
            // Repeat the event for a year out
            if (event.repeats === 'weekly' || event.repeats === 'biweekly') {
                const repeatFrequency = event.repeats === 'weekly' ? 1 : 2;
                return Array.from({ length: 52 / repeatFrequency }, (_, i) => {
                    const newStart = moment(event.start).add(i * repeatFrequency, 'weeks').toDate();
                    const newEnd = event.end ? moment(event.end).add(i * repeatFrequency, 'weeks').toDate() : newStart;

                    return {
                        title: event.title,
                        start: newStart,
                        end: newEnd,
                        category: event.category,
                        location: event.location,
                        locationLink: event.locationLink,
                        dateLink: event.dateLink,
                        description: event.description,
                        repeats: event.repeats,
                        paidEventId: event.paidEventId,
                    };
                })
            }

            return [{
                title: event.title,
                start: new Date(event.start),
                end: event.end ? new Date(event.end) : new Date(event.start),
                category: event.category,
                location: event.location,
                locationLink: event.locationLink,
                dateLink: event.dateLink,
                description: event.description,
                repeats: event.repeats,
                paidEventId: event.paidEventId,
            }];
        });
        setFilteredEvents(formattedEvents);
    }, [events, filter, dayFilter]);

    // Filter events based on the filter prop

    console.log({ filteredEvents })

    return (
        <Calendar
            dayLayoutAlgorithm='no-overlap'
            date={displayDate}
            onNavigate={dummyNav}
            localizer={localizer}
            events={filteredEvents}
            onSelectEvent={selectEvent}
            style={{ height: calendarHeight }}
        />
    );
};

export default Events;
