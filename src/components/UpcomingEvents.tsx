import { Calendar, Repeat } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

import { eventsApiClient } from '../api';
import { transformEventsApiDates } from '../api/events';
import type { Event } from '../types/events';
import { Temporal } from 'temporal-polyfill';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const EventCard = ({ event }: { event: Event }) => {
  // Format the date for the URL query parameter (YYYY-MM-DD)
  const dateParam = new Date(event.start).toISOString().split('T')[0];
  const cardUrl = `/calendar?id=${event.id}&date=${dateParam}`;

  return (
    <article className="group hover:border-navy-300 relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-md transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex flex-col h-full">
      {/* STRETCHED LINK:
        This invisible link covers the entire card relative to the <article>.
        It effectively makes the whole card clickable without nesting <a> tags.
      */}
      <a
        href={cardUrl}
        className="absolute inset-0 z-0"
        aria-label={`View details for ${event.title}`}
      ></a>

      <h3 className="text-navy-900 group-hover:text-navy-700 line-clamp-2 text-lg font-semibold transition-colors">
        {event.title}
      </h3>

      {event.host && event.host !== 'ACM' && (
        <span className={`text-wisteria-300 text-sm mb-1`}>
          Hosted by {event.host}
        </span>
      )}

      {event.description && (
        <p className="mb-4 line-clamp-7 lg:line-clamp-4 text-md text-gray-600">
          {event.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-auto">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="text-tangerine-500 shrink-0" size={16} />
          <span className="whitespace-nowrap">{formatDate(event.start)}</span>
          <span className="text-gray-300">·</span>
          <span className="whitespace-nowrap">
            {formatTime(event.start)}
            {event.end && ` - `}
          </span>
          {event.end && formatDate(event.start) !== formatDate(event.end) && (
            <>
              <span className="whitespace-nowrap">{formatDate(event.end)}</span>
              <span className="text-gray-300">·</span>
            </>
          )}
          {event.end && (
            <span className="whitespace-nowrap">{formatTime(event.end)}</span>
          )}
        </div>

        {event.repeats && (
          <div className="flex items-center gap-1.5 text-gray-500">
            <Repeat className="text-tangerine-500 shrink-0" size={16} />
            <span className="capitalize">{event.repeats}</span>
          </div>
        )}

        {event.location && (
          /* relative z-10 ensures this container sits ON TOP of the stretched link.
            This allows the location link to be clicked without triggering the card link.
          */
          <div className="flex items-center gap-1.5 text-gray-500 relative z-10">
            <svg
              className="h-4 w-4 text-teal-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>

            {event.locationLink ? (
              <a
                href={event.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-[250px] truncate hover:text-navy-700 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevents clicking the card background
              >
                {event.location}
              </a>
            ) : (
              <span className="max-w-[250px] truncate">{event.location}</span>
            )}
          </div>
        )}
      </div>

      <div className="absolute top-5 right-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg
          className="text-navy-400 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 bg-gray-200 p-5 h-full min-h-[200px]" />
);

const UpcomingEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = (
          await eventsApiClient.apiV1EventsGet({
            upcomingOnly: true,
            featuredOnly: true,
          })
        )
          .filter((x) => x.featured)
          .sort((a, b) => {
            const aStart = Temporal.PlainDateTime.from(a.start);
            const bStart = Temporal.PlainDateTime.from(b.start);
            return Temporal.PlainDateTime.compare(aStart, bStart);
          })
          .slice(0, 3);
        setFeaturedEvents(transformEventsApiDates(response));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 ${featuredEvents.length == 2 && 'md:grid-cols-2'} lg:grid-cols-${Math.min(featuredEvents.length, 3)}`}
    >
      {featuredEvents.map((event) => (
        <EventCard event={event} />
      ))}
    </div>
  );
};

export default UpcomingEvents;
