'use client';

import Script from 'next/script';
import Hero from '@/components/Hero';
import NewsletterPopup from '@/components/NewsletterPopup';
import Sponsors from '@/components/Sponsors';
import Transition from '@/components/Transition';
import Sigscard from '@/sections/home/Sigscard';
import { useEffect, useState } from 'react';
import { IEvent } from '@/components/Events/events';
import moment from 'moment';
import { repeatMapping, transformApiDates, validRepeats } from '@/utils/dateutils';
import { maxRenderDistance } from '@/components/CalendarControls';
import { AllSigData } from '@/sections/home/SigData';

export default function Home() {
    const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    // If event repeats, get the first date after current time
    useEffect(() => {
      const doStuff = async () => {
        setEventsLoading(true);
        const baseurl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
        if (!baseurl) {
          return;
        }
        async function fetcher() {
          try {
            const response = await fetch(`${baseurl}/api/v1/events?upcomingOnly=true`);
            const rval = transformApiDates((await response.json()) as IEvent[]);
            return rval;
          } catch (err: any) {
            return [];
          }
        }
        const typedEventList = await fetcher();
        const now = moment();
        const eventsAfterNow = typedEventList.map((event) => {
          if (event.repeats && validRepeats.includes(event.repeats)) {
            const start = moment(event.start);
            let repeatEnds;
            try {
              repeatEnds = moment(event.repeatEnds) || maxRenderDistance
            } catch {
              repeatEnds = maxRenderDistance;
            }
            const end = event.end ? moment(event.end) : null;
            const comparisonEnd = end || moment(event.end).add(1, 'hour'); // used for comparing against repeat as a "fake end time"
            const {increment, unit} = repeatMapping[event.repeats];
  
            while (start.isBefore(now)) { // find the most recent iteration
              if (repeatEnds.isSameOrBefore(comparisonEnd)) { // skip
                return null;
              }
              start.add(increment, unit);
              if (end) {
                end.add(increment, unit);
              }
            }
            return {
              ...event,
              start: start.toISOString(),
              end: end ? end.toISOString() : undefined,
            };
          }
          return event;
        });
  
        const definedEvents = eventsAfterNow.filter((event) => {
          return (event !== null);
        });
        
        const sortedEvents = definedEvents.sort((a, b) => {
          return (moment(a.start).unix() - moment(b.start).unix());
        });

        setUpcomingEvents(sortedEvents);
        setEventsLoading(false);
    };
    doStuff();
    }, []);
  return (
    <>
      {/* Redirects old hash router links to normal routes (e.g. /#/membership -> /membership) */}
      <Script id="redirect-hash-router">
        {`if(window.location.hash.includes('#/')){window.location.replace(window.location.hash.replace('#',''));}`}
      </Script>
      <NewsletterPopup/>
      <Hero upcomingEvents={upcomingEvents} eventsLoading={eventsLoading} />
      <Transition bgClass="bg-surface-050"/>
      <section id="sighighlight" className="bg-surface-050 pt-6 pb-24">
        <div className="container flex flex-col gap-6">
          <h1>
            Special Interest Groups
          </h1>
          <p className="text-xl max-w-prose">
            SIGs, or Special Interest Groups, are student-run groups exploring
            different areas of computer science, from theory and algorithms to
            competitive programming. All our SIGs are beginner-friendly and are a
            great way to meet other members and explore computer science.
          </p>
          <Sigscard upcomingEvents={upcomingEvents} eventsLoading={eventsLoading} sigs={AllSigData} />
        </div>
      </section>
      <Sponsors />
    </>
  );
};