'use client';
import Image from 'next/image';
import Moment from 'moment';
import {
  FaBell,
  FaDiscord,
  FaInstagram
} from 'react-icons/fa';

import EventCard from '@/components/Card/EventCard';
import './Hero.css';

import eventList  from './events.json';
import headerJpg from './header.jpg';
import headerWebp from './header.webp';

function toHumanDate(date: string) {
  Moment.locale('en');
  return Moment(date).format("MMMM Do, h:mm A");
}

export default function Hero() {
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
        <div className="pt-16 pb-24 grid gap-4 grid-cols-1 lg:grid-cols-3">
          {eventList.sort((a, b) => {
            return (Moment(a.date).unix() - Moment(b.date).unix());
          }).map((object, i) => {
            if (i > 2) { return null; }
            return (
              <EventCard
                key={i}
                title={object.title}
                description={object.description}
                date={toHumanDate(object.date)}
                repeats={(object as any)?.repeats}
                location={object.location}
                locationLink={object.locationLink}
                paidEventId={object.paidEventId}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};