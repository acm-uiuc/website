'use client';
import Image from 'next/image';
import Moment from 'moment';
import {
  FaBell,
  FaCalendar,
  FaDiscord,
  FaInstagram
} from 'react-icons/fa';

import EventCard from '@/components/Card/EventCard';
import './hero.css';

import eventList from 'public/events.json';
import headerJpg from './header.jpg';
import headerWebp from './header.webp';
import { IEvent } from '@/components/Events/events';
import { useEffect, useState } from 'react';

function toHumanDate(date: string) {
  Moment.locale('en');
  return Moment(date).format("MMMM Do, h:mm A");
}

const sortedEvents = eventList.sort((a, b) => {
  return (Moment(a.start).unix() - Moment(b.start).unix());
});

export default function Hero() {
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const [numEvents, setNumEvents] = useState(3);

  useEffect(() => {
    // Filter out events that have already passed
    const now = Moment();
    const filteredEvents = sortedEvents.filter((event) => {
      return Moment(event.start).isAfter(now);
    });

    // Max 3 events
    const firstFilteredEvents = filteredEvents.slice(0, 3);
    console.log(firstFilteredEvents);
    setUpcomingEvents(firstFilteredEvents);
    setNumEvents(Math.min(firstFilteredEvents.length, 3));
  }, []);

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
          <h3 className='text-white'>Upcoming Events</h3>
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
                />
              );
            })}
          </div>
          <div className={`flex flex-row justify-end pt-4`}>
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