'use client';
import Image from 'next/image';
import moment from 'moment-timezone';
import {
  FaBell,
  FaCalendar,
  FaDiscord,
  FaInstagram
} from 'react-icons/fa';

import EventCard from '@/components/Card/EventCard';
import './hero.css';

import headerJpg from './header.jpg';
import headerWebp from './header.webp';
import { IEvent } from '@/components/Events/events';
import { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/react';
import { transformApiDates } from '@/utils/dateutils';

function toHumanDate(date: string) {
  return moment(date).tz(moment.tz.guess()).format("MMMM Do, h:mm A z");
}

export default function Hero() {
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const [numEvents, setNumEvents] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If event repeats, get the first date after current time
    const doStuff = async () => {
      setIsLoading(true);
      const baseurl = process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL;
      if (!baseurl) {
        return;
      }
      async function fetcher() {
        try {
          const response = await fetch(`${baseurl}/api/v1/events`);
          const rval = transformApiDates((await response.json()) as IEvent[]);
          console.log(rval)
          return rval;
        } catch (err: any) {
          return [];
        }
      }
      const typedEventList = await fetcher();
      console.log(typedEventList)
      const now = moment();
      const eventsAfterNow = typedEventList.map((event) => {
        if (event.repeats && ['weekly','biweekly'].includes(event.repeats)) {
          const start = moment(event.start);
          const end = event.end ? moment(event.end) : null;
          const increment = {'weekly': 1, 'biweekly': 2}[event.repeats];
          while (!start.isAfter(now)) {
            start.add(increment, 'weeks');
            if (end) {
              end.add(increment, 'weeks');
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

      const sortedEvents = eventsAfterNow.sort((a, b) => {
        return (moment(a.start).unix() - moment(b.start).unix());
      });

      // Filter out events that have already passed or are not featured
      const filteredEvents = sortedEvents.filter((event) => {
        return moment(event.start).isAfter(now) && event.featured !== false;
      });

      // Max 3 events
      const firstFilteredEvents = filteredEvents.slice(0, 3);
      setUpcomingEvents(firstFilteredEvents);
      setNumEvents(Math.min(firstFilteredEvents.length, 3));
      setIsLoading(false);
    }
    doStuff();
  }, []);

  const upcomingEventsHTML = (upcomingEvents.length > 0) ? (
  <div className={`pt-1 grid gap-4 grid-rows-1 md:grid-cols-${numEvents} lg:grid-cols-${numEvents}`}>
    {upcomingEvents.map((object, i) => {
      return (
        <EventCard
        key={i}
        title={object.title}
        description={object.description}
        date={toHumanDate(object.start)}
        repeats={(object as any)?.repeats}
        location={object.location}
        locationLink={object.locationLink}
        paidEventId={object.paidEventId}
        host={object.host}
        />
      );
    })}
  </div>
  ) : (
    isLoading ? <Skeleton className="col-span-1 p-4 rounded-3xl bg-surface-050 hover:shadow-lg hover:-translate-y-1 transition-all">
      <EventCard
        key={0}
        title={""}
        description={""}
        date={"August 30th, 6:00 PM EDT"}
        repeats={"weekly"}
        location={""}
        locationLink={'https://google.com'}
        host={"ACM"}
      />
    </Skeleton> : <div className='text-white'>No featured events coming up</div>
  )
  return (
    <div className="hero-background">
      <section className="container">
        <div className="flex flex-col gap-4 lg:flex-row pt-8">
          <div className="h-fit rounded-3xl bg-surface-050 shadow-lg overflow-hidden lg:order-last lg:basis-1/2">
            <picture>
              <source type="image/webp" srcSet={headerWebp.src} />
              <Image src={headerJpg} alt="ACM@UIUC" />
            </picture>
          </div>
          <div className="flex flex-col gap-4 text-white lg:basis-1/2">
            <h1 className="text-white leading-[4rem]">
              UIUC&apos;s Largest Computer Science Organization
            </h1>
            <p className="text-xl mb-8">
              For over 50 years, ACM@UIUC has been a hub for innovation and
              leadership for students everywhere. Our inclusivity has created a
              strong network of students and alumni, bringing their diverse
              interests to ACM.
            </p>
            <div className="flex flex-col max-sm:items-center sm:flex-row gap-4">
              <a
                className="flex flex-col w-full sm:w-fit px-16 py-3 items-center text-white text-center text-2xl rounded-full bg-primary hover:bg-secondary transition-all"
                href="/membership"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Now
              </a>
              <div className="flex flex-row gap-4">
                <a
                  className="flex flex-col p-3 items-center text-primary text-center rounded-full bg-surface-000 hover:bg-surface-150 transition-all"
                  href="https://instagram.com/acm.uiuc"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="h-8 w-8" />
                </a>
                <a
                  className="flex flex-col p-3 items-center text-primary text-center rounded-full bg-surface-000 hover:bg-surface-150 transition-all"
                  href="https://go.acm.illinois.edu/discord"
                  title="Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="h-8 w-8" />
                </a>
                <a
                  className="lg:hidden flex flex-col p-3 items-center text-primary text-center rounded-full bg-surface-000 hover:bg-surface-150 transition-all"
                  href="https://forms.gle/PqRkNtyuPGDwkomK9"
                  title="Mailing List"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaBell className="h-8 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`pb-20`}>
          <h3 className='text-white'>Featured Events</h3>
          {upcomingEventsHTML}

          <div className={`flex flex-row justify-start pt-4`}>
          <a
            className="inline-flex flex-row grow-0 items-center gap-2 px-4 py-2 text-white rounded-2xl bg-primary hover:bg-secondary transition-all"
            href="/calendar"
          >
            <FaCalendar className="shrink-0" />
            <span>View all events</span>
          </a>
          </div>
        </div>
      </section>
    </div>
  );
};