'use client';
import Image from 'next/image';
import moment from 'moment-timezone';
import {
  FaBell,
  FaCalendar,
  FaCalendarPlus,
  FaDiscord,
  FaInstagram,
  FaArrowRight,
  FaUsers,
  FaTrophy,
  FaCode,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import EventCard from '@/components/Card/EventCard';

import headerJpg from './header.jpg';
import headerWebp from './header.webp';
import { IEvent } from '@/components/Events/events';
import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from '@heroui/react';
import config from '../../config.json';
import { AllOrganizationList } from '@acm-uiuc/js-shared';

interface HeroProps {
  upcomingEvents: IEvent[];
  eventsLoading: boolean;
}

export const buttonStyles =
  'bg-cambridge_blue-300 hover:bg-cambridge_blue-500 transform hover:scale-105 hover:shadow-xl';

export default function Hero({ upcomingEvents, eventsLoading }: HeroProps) {
  upcomingEvents = upcomingEvents.slice(0, 3);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const hasAnimated = useRef(false);
  const prevEventsLoading = useRef(eventsLoading);

  useEffect(() => {
    if (prevEventsLoading.current === true && eventsLoading === false) {
      hasAnimated.current = true;
    }
    prevEventsLoading.current = eventsLoading;
  }, [eventsLoading]);

  const nextEvent = () => {
    setCurrentEventIndex(prev => (prev + 1) % upcomingEvents.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex(
      prev => (prev - 1 + upcomingEvents.length) % upcomingEvents.length
    );
  };

  useEffect(() => {
    if (upcomingEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentEventIndex(prev => (prev + 1) % upcomingEvents.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [upcomingEvents.length]);

  const featuredEvent = upcomingEvents[currentEventIndex];
  const upcomingEventsFiltered = upcomingEvents
    .filter((_, index) => index !== currentEventIndex)
    .slice(0, 3);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCalPlatform, setCalPlatform] = useState<
    'google' | 'ical' | null
  >(null);
  const calPlatformKeyMapping = {
    google: 'Google Calendar',
    ical: 'Other',
  };

  // Skeleton component for the events section
  const EventsSkeleton = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-fit max-h-[55vh]">
      {/* Header with skeleton navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">
          Featured Events
        </h3>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full bg-white/20">
            <div className="h-8 w-8 bg-white/20"></div>
          </Skeleton>
          <Skeleton className="h-8 w-8 rounded-full bg-white/20">
            <div className="h-8 w-8 bg-white/20"></div>
          </Skeleton>
        </div>
      </div>

      {/* Featured event skeleton */}
      <div className="mb-4">
        <Skeleton className="h-64 w-full rounded-xl bg-white/20">
          <div className="h-64 w-full bg-white/20"></div>
        </Skeleton>
      </div>

      {/* Event indicators skeleton */}
      <div className="flex justify-center gap-2 mb-4">
        <Skeleton className="h-2 w-8 rounded-full bg-white/20">
          <div className="h-2 w-8 bg-white/20"></div>
        </Skeleton>
        {[...Array(2)].map((_, index) => (
          <Skeleton key={index} className="h-2 w-2 rounded-full bg-white/20">
            <div className="h-2 w-2 bg-white/20"></div>
          </Skeleton>
        ))}
      </div>

      {/* Upcoming events skeleton */}
      <div className="mb-4">
        <div className="grid grid-cols-1 gap-2">
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg bg-white/20">
              <div className="h-12 w-full bg-white/20"></div>
            </Skeleton>
          ))}
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3">
        <Skeleton className="flex-1 h-12 rounded-xl bg-white/20">
          <div className="h-12 w-full bg-white/20"></div>
        </Skeleton>
        <Skeleton className="flex-1 h-12 rounded-xl bg-white/20">
          <div className="h-12 w-full bg-white/20"></div>
        </Skeleton>
      </div>
    </div>
  );

  return (
    <div className="relative bg-primary-300 overflow-hidden lg:max-h-[70vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-cambridge_blue-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <section className="container relative z-10 h-full">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 py-8 min-h-[60vh]">
          <div
            className="flex flex-col justify-center gap-4 text-white"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-secondary-600 to-secondary-800 bg-clip-text text-transparent pb-2">
                UIUC's Largest Computer Science Organization
              </h1>

              <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl">
                ACM @ UIUC is dedicated to exploring almost every aspect of
                computer science. We serve to advance the field of CS at the
                University of Illinois by providing hands-on projects,
                workshops, and networking opportunities for students of all
                skill levels.
              </p>
            </div>

            {/* Enhanced Stats Row */}
            <div className="flex flex-wrap gap-6 py-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
                  <FaUsers className="text-secondary-700 text-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{config.numMembers}+</div>
                  <div className="text-white/70 text-xs">Members</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
                  <FaTrophy className="text-secondary-700 text-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-white/70 text-xs">Years</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
                  <FaCode className="text-secondary-700 text-sm" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {AllOrganizationList.length}
                  </div>
                  <div className="text-white/70 text-xs">SIGs + Committees</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-start sm:flex-row gap-3">
              <a
                className={`group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-white text-lg font-semibold rounded-full ${buttonStyles} transition-all duration-300 shadow-lg`}
                href="/join"
                rel="noopener noreferrer"
              >
                <span>Join ACM</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex flex-row gap-2 w-full sm:w-auto">
                <a
                  className="flex items-center justify-center px-5 py-3 text-primary text-lg font-semibold rounded-full bg-white hover:bg-white/90 transition-all duration-300 shadow-lg transform hover:scale-105"
                  href={config.donateUrl}
                  title="Donate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donate
                </a>

                {/* Social Icons */}
                <div className="flex gap-2">
                  <a
                    className="flex items-center justify-center p-3 text-primary rounded-full bg-white hover:bg-white/90 transition-all duration-300 shadow-lg transform hover:scale-110"
                    href={config.instagramPage}
                    title="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </a>
                  <a
                    className="flex items-center justify-center p-3 text-primary rounded-full bg-white hover:bg-white/90 transition-all duration-300 shadow-lg transform hover:scale-110"
                    href={config.discordInvite}
                    title="Discord"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDiscord className="h-5 w-5" />
                  </a>
                  <a
                    className="lg:hidden flex items-center justify-center p-3 text-primary rounded-full bg-white hover:bg-white/90 transition-all duration-300 shadow-lg transform hover:scale-110"
                    href={config.mailingListSignup}
                    title="Mailing List"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaBell className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            {eventsLoading ? (
              <EventsSkeleton />
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-fit max-h-[55vh]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    Featured Events
                  </h3>
                  {upcomingEvents.length > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={prevEvent}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 h-8 w-8"
                      >
                        <FaChevronLeft className="h-4 w-4 mx-2" />
                      </button>
                      <button
                        onClick={nextEvent}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 h-8 w-8"
                      >
                        <FaChevronRight className="h-4 w-4 mx-2" />
                      </button>
                    </div>
                  )}
                </div>

                {upcomingEvents.length > 0 ? (
                  <div className="mb-4">
                    <div className="w-full">
                      <EventCard event={featuredEvent} compact={false} />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="w-full h-32 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 text-white/90">
                        <FaCalendar className="text-white/70 text-xl" />
                        <span>No events scheduled</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event indicators - only show if more than 1 event */}
                {upcomingEvents.length > 1 && (
                  <div className="flex justify-center gap-2 mb-4">
                    {upcomingEvents.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentEventIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentEventIndex
                          ? 'bg-white w-8'
                          : 'bg-white/40 hover:bg-white/60 w-2'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Upcoming Events List */}
                {upcomingEventsFiltered.length > 0 && (
                  <div className="mb-4">
                    <div className="overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {upcomingEventsFiltered.map(event => (
                          <div key={event.id} className="w-full flex-shrink-0">
                            <EventCard event={event} compact={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Calendar Action Buttons */}
                <div className="flex gap-3">
                  <a
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-xl bg-cambridge_blue-300 hover:bg-cambridge_blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    href="/calendar"
                  >
                    <FaCalendar className="h-4 w-4" />
                    <span className='text-base'>View All</span>
                  </a>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-white text-sm font-medium rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    onClick={onOpen}
                  >
                    <FaCalendarPlus className="h-4 w-4" />
                    <span className='text-base'>Subscribe</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal remains the same */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Subscribe to ACM@UIUC's Events Calendar
              </ModalHeader>
              <ModalBody>
                <p>
                  Adding this calendar will display ACM@UIUC's major events on
                  your calendar. Select your preferred calendar platform to
                  continue.
                </p>
                {selectedCalPlatform === 'ical' && (
                  <strong>
                    If your calendar software supports it, set the calendar
                    refresh interval to "Every day" to ensure your calendar is
                    up to date.
                  </strong>
                )}
                <Dropdown>
                  <DropdownTrigger>
                    <Button>
                      {selectedCalPlatform
                        ? `${calPlatformKeyMapping[selectedCalPlatform]}`
                        : 'Select an option'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={key => setCalPlatform(key as any)}>
                    <DropdownItem key="google">Google Calendar</DropdownItem>
                    <DropdownItem key="ical">Other</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  disabled={!selectedCalPlatform}
                  onPress={() => {
                    if (!selectedCalPlatform) {
                      return;
                    }
                    const url =
                      config['addCalendarLinks']['majorEvents'][
                      selectedCalPlatform
                      ];
                    window.open(url, '_blank')?.focus();
                  }}
                >
                  Subscribe
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <style jsx>{`
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
