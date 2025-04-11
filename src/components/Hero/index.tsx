'use client';
import Image from 'next/image';
import moment from 'moment-timezone';
import {
  FaBell,
  FaCalendar,
  FaCalendarPlus,
  FaDiscord,
  FaInstagram
} from 'react-icons/fa';

import EventCard from '@/components/Card/EventCard';
import './hero.css';

import headerJpg from './header.jpg';
import headerWebp from './header.webp';
import { IEvent } from '@/components/Events/events';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, useDisclosure } from "@heroui/react";
import config from '../../config.json'



interface HeroProps {
  upcomingEvents: IEvent[];
  eventsLoading: boolean;
}

export default function Hero({ upcomingEvents, eventsLoading }: HeroProps) {
  const [featuredEvents, setFeaturedEvents] = useState<IEvent[]>([]);
  const [numEvents, setNumEvents] = useState(3);
  
  useEffect(() => {
    if (eventsLoading) return;

    // Filter out events that have already passed or are not featured
    const now = moment();
    const filteredEvents = upcomingEvents.filter((event) => {
      return moment(event.start).isAfter(now) && event.featured !== false;
    });

    // Max 3 events
    const firstFilteredEvents = filteredEvents.slice(0, 3);
    setFeaturedEvents(firstFilteredEvents);
    setNumEvents(Math.min(firstFilteredEvents.length, 3));
  }, [upcomingEvents, eventsLoading]);

  const featuredEventsHTML = (featuredEvents.length > 0) ? (
  <div className={`pt-1 grid gap-4 grid-rows-1 md:grid-cols-${numEvents} lg:grid-cols-${numEvents}`}>
    {featuredEvents.map((object, i) => {
      return (
        <EventCard
        key={object.id}
        event={object}
        />
      );
    })}
  </div>
  ) : (
    eventsLoading ? <Skeleton className="col-span-1 p-4 rounded-3xl bg-surface-050 hover:shadow-lg hover:-translate-y-1 transition-all">
      <EventCard
        key={0}
      />
    </Skeleton> : <div className='text-white'>No featured events coming up</div>
  )
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCalPlatform, setCalPlatform] = useState<"google"|"ical"|null>(null);
  const calPlatformKeyMapping = {
    "google": "Google Calendar",
    "ical": "Other"
  }

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
            <p className="text-xl ">
              For over 50 years, ACM@UIUC has been a hub for innovation and
              leadership for students everywhere. Our inclusivity has created a
              strong network of students and alumni, bringing their diverse
              interests to ACM.
            </p>
            <div className="flex flex-col max-sm:items-center sm:flex-row gap-4 mb-8">
              <a
                className="flex flex-col w-full sm:w-fit md:px-10 px-12 py-3 items-center text-white text-center text-2xl rounded-full bg-primary hover:bg-secondary transition-all"
                href="/join"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Now
              </a>
              <div className="flex flex-row gap-4">
              <a
                  className="flex flex-col w-full sm:w-fit px-8 xl:ml-20 py-3 items-center text-primary text-center text-2xl rounded-full bg-surface-000 hover:bg-surface-150 transition-all"
                  href="https://go.acm.illinois.edu/donate"
                  title="Donate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donate
                </a>
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
          {featuredEventsHTML}

          <div className={`flex flex-row justify-start pt-4`} style={{gap: '1vw'}}>
          <a
            className="inline-flex flex-row grow-0 items-center gap-2 px-4 py-2 text-white rounded-2xl bg-primary hover:bg-secondary transition-all"
            href="/calendar"
          >
            <FaCalendar className="shrink-0" />
            <span>View all events</span>
          </a>
          <button
            className="inline-flex flex-row grow-0 items-center gap-2 px-4 py-2 text-white rounded-2xl bg-primary hover:bg-secondary transition-all"
            onClick={onOpen}
          >
            <FaCalendarPlus className="shrink-0" />
            <span>Subscribe to calendar</span>
          </button>
          </div>
        </div>
      </section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Subscribe to ACM@UIUC's Events Calendar</ModalHeader>
            <ModalBody>
              <p>Adding this calendar will display ACM@UIUC's major events on your calendar. Select your preferred calendar platform to continue.</p>
              {selectedCalPlatform === 'ical' && <strong>If your calendar software supports it, set the calendar refresh interval to "Every day" to ensure your calendar is up to date.</strong>}
              <Dropdown>
                <DropdownTrigger>
                  <Button>
                    {selectedCalPlatform ? `${calPlatformKeyMapping[selectedCalPlatform]}` : 'Select an option'}            
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => setCalPlatform(key as any)}>
                  {/* Dropdown Items */}
                  <DropdownItem key="google">Google Calendar</DropdownItem>
                  <DropdownItem key="ical">Other</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" disabled={!selectedCalPlatform} onPress={() => {
                if (!selectedCalPlatform) {
                  return;
                }
                const url = config['addCalendarLinks']['majorEvents'][selectedCalPlatform];
                window.open(url, '_blank')?.focus();
              }}>
                Subscribe
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </div>

  );
};
