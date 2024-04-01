'use client';
import moment from 'moment'
import React, {useState, useEffect} from 'react'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarStylesOverride.css'
import {EventIntroProps} from '../../app/(main)/calendar/page'
import { View, NavigateAction } from 'react-big-calendar';
// import './events.css'


export interface CustomEventType {
    id: number,
    title: string,
    start: Date,
    end: Date,
    category: string,
    // Add any other properties you need for your custom event object
    location: string,
    locationLink?: string,
    date: string,
    dateLink?: string,
    description: string,
    repeats?: string,
    paidEventId?: string,
} 

export interface EventsProps {
    events: CustomEventType[],
    updateEvent: React.Dispatch<React.SetStateAction<EventIntroProps>>,
    displayDate: Date
}

const localizer = momentLocalizer(moment)
const Events: React.FC<EventsProps> = ({ events, updateEvent, displayDate}) => {
    const [calendarHeight, setCalendarHeight] = useState(0);
    useEffect(() => {
        setCalendarHeight(window.innerHeight * 0.7);
    }, []);

    const selectEvent = (event: CustomEventType) => {
        const newEvent: EventIntroProps = {
            title: event.title,
            location: event.location,
            date: event.start.toLocaleString(),
            description: event.description,
            host: "None",
        }
        updateEvent(newEvent)
    }

    // really stupid declaration we need so react big-calendar doesn't yell at us
    const dummyNav = (newDate: Date, view: View, action: NavigateAction) => { return; }

    return (
        <Calendar
        date={displayDate}
        onNavigate={dummyNav}
        localizer={localizer}
        events={events}
        onSelectEvent={selectEvent}
        style={{ height: calendarHeight}}
        />
    )
}


export default Events