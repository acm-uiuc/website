'use client';
import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarStylesOverride.css';
import { CalendarEventDetailProps } from '@/components/CalendarEventDetail/CalendarEventDetail';
import { View, NavigateAction } from 'react-big-calendar';
import { Organization, SIG, SIGList } from '@/utils/organizations';
import { Skeleton } from '@nextui-org/react';
import { repeatMapping, RepeatMappingEntry, ValidRepeat, validRepeats } from '@/utils/dateutils';
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
    id: string;
}


export interface CalendarEvent extends BigCalendarEvent {
    title: string;
    location: string;
    locationLink?: string;
    description: string;
    host?: Organization;
    paidEventId?: string;
    id: string;
    repeats?: ValidRepeat;
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

const getEventColor = (event: CalendarEvent) => {
    if (SIGList.includes(event.host as SIG)) {
        if (event.repeats) {
          return '#3e486f'; // repeating SIG events
        } 
        return '#4B006E'
    } else {
        return '#F23F43'; // non-repeating SIG events
        // return '#4577f8'; // ACM events
    }
}

export const getEventURL = (event: CalendarEvent | IEvent) => {
    const urlParams = new URLSearchParams(window?.location?.search);
    urlParams.set('id', event.id);
    if (event.start) {
        urlParams.set('date', moment(event.start).format('YYYY-MM-DD'));
    }
    const baseURL = window ? window.location.origin : 'https://acm.illinois.edu';
    return baseURL + '/calendar?' + urlParams.toString();
}
const localizer = momentLocalizer(moment);

export function toHumanDate(date: string) {
    return moment(date).tz(moment.tz.guess()).format("MMMM Do, h:mm A z");
}
// https://stackoverflow.com/a/13532993
function shadeColor(color: string, percent: number) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

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
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const selectEvent = (event: CalendarEvent) => {
        const newEvent: CalendarEventDetailProps = {
            title: event.title,
            location: event.location,
            locationLink: event.locationLink,
            description: event.description,
            host: event.host,
            start: event.start,
            end: event.end,
            paidEventId: event.paidEventId,
        };
        updateEventDetails(newEvent);
        setSelectedEvent(event);
        window.history.replaceState(null, '', getEventURL(event));
    };

    useEffect(() => {
        setCalendarHeight(window.innerHeight * 0.7);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const date = urlParams.get('date');
        if (id && filteredEvents) {
            const event = filteredEvents.find((event) => {
                if (date) {
                    return event.id === id && moment(event.start).format('YYYY-MM-DD') === date;
                }
                return event.id === id;
            })
            if (event) {
                selectEvent(event);
                if (event.start) {
                    updateDisplayDate(event.start);
                }
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredEvents]);


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
            { calendarHeight ? <Calendar
                dayLayoutAlgorithm='no-overlap'
                date={displayDate}
                onNavigate={dummyNav}
                localizer={localizer}
                events={filteredEvents}
                onSelectEvent={selectEvent}
                selected={selectedEvent}
                view={view}
                onView={setView}
                popup
                style={{ height: calendarHeight }}
                eventPropGetter={(event, start, end, isSelected) => {
                    const color = getEventColor(event);
                    const darkerColor = shadeColor(color, -20);
                    return { style: { backgroundColor: isSelected ? darkerColor : color, borderRadius: '0.375rem', 'fontSize': '12px' } } // '#4577F8' } }
                }}
            /> : <div></div> }
        </Skeleton>
    );
};

export default Events;
