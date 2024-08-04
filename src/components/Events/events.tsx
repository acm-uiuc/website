'use client';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStylesOverride.css';
import { EventIntroProps } from '../../app/(main)/calendar/page';
import { View, NavigateAction } from 'react-big-calendar';

export interface IEvent {
    title: string;
    start: string;
    end?: string;
    category?: string;
    location: string;
    locationLink?: string;
    dateLink?: string;
    description: string;
    repeats?: string;
    paidEventId?: string;
}

export interface EventsProps {
  events: IEvent[];
  updateEvent: React.Dispatch<React.SetStateAction<EventIntroProps>>;
  displayDate: Date;
  filter: string;
  dayFilter: string; // Add this line
}


const localizer = momentLocalizer(moment);

const Events: React.FC<EventsProps> = ({ events, updateEvent, displayDate, filter, dayFilter }) => {
    const [calendarHeight, setCalendarHeight] = useState(0);

    useEffect(() => {
        setCalendarHeight(window.innerHeight * 0.7);
    }, []);

    const selectEvent = (event: IEvent) => {
        const newEvent: EventIntroProps = {
            title: event.title,
            location: event.location,
            date: event.start.toLocaleString(),
            description: event.description,
            host: "None",
        };
        updateEvent(newEvent);
    };


    const dummyNav = (newDate: Date, view: View, action: NavigateAction) => { return; }


    // Filter events based on the filter prop
    const filteredEvents = events.filter(event =>
      event.title.toLowerCase().includes(filter.toLowerCase()) &&
      (dayFilter ? moment(event.start).format('dddd') === dayFilter : true)
    );

    return (
        <Calendar
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
