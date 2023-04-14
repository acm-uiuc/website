import moment from 'moment'
import React, { useState, useEffect, useRef } from 'react'
import { Calendar, momentLocalizer, Event } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {EventIntroProps} from '../../pages/Calendar'
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
}

const localizer = momentLocalizer(moment)

const Events: React.FC<EventsProps> = ({ events,  updateEvent}) => {

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


    return (
        <div >
                <h1 className="text-center">Our Events</h1>
                <p className="text-center">
                    Take a look at our fancy calendar. An updated google calendar of events is in the works!
                </p >
                <div >
                    <div>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            // startAccessor="start"
                            // endAccessor="end"
                            onSelectEvent={selectEvent}
                            style={{ height: 500 }}
                        />
                    </div>
                    
                </div>
        </div>
    )
}


export default Events