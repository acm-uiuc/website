import { useState, useEffect } from 'preact/hooks';
import { eventsApiClient } from '../api';
import type { Event } from '../types/events';
import { transformEventsApiDates } from '../api/events';
import { Calendar } from 'lucide-react';

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
    <article class="group hover:border-navy-300 relative cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-md flex flex-col h-full">
      {/* STRETCHED LINK:
        This invisible link covers the entire card relative to the <article>.
        It effectively makes the whole card clickable without nesting <a> tags.
      */}
      <a
        href={cardUrl}
        class="absolute inset-0 z-0"
        aria-label={`View details for ${event.title}`}
      ></a>

      {event.host && event.host !== 'ACM' && (
        <span
          class={`bg-navy-100 text-navy-700 mb-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium self-start relative z-10`}
        >
          {event.host}
        </span>
      )}

      <h3 class="text-navy-900 group-hover:text-navy-700 mb-2 line-clamp-2 text-lg font-semibold transition-colors">
        {event.title}
      </h3>

      {event.description && (
        <p class="mb-4 line-clamp-2 text-sm text-gray-600">
          {event.description}
        </p>
      )}

      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-auto">
        <div class="flex items-center gap-1.5 text-gray-500">
          <Calendar className="text-tangerine-500" size={16} />
          <span>{formatDate(event.start)}</span>
          <span class="text-gray-300">·</span>
          <span>{formatTime(event.start)}</span>
          {event.end && (
            <>
              <span class="text-gray-300">-</span>
              {formatDate(event.start) !== formatDate(event.end) && (
                <>
                  <span>{formatDate(event.end)}</span>
                </>
              )}
              <span>{formatTime(event.end)}</span>
            </>
          )}
        </div>

        {event.location && (
          /* relative z-10 ensures this container sits ON TOP of the stretched link.
            This allows the location link to be clicked without triggering the card link.
          */
          <div class="flex items-center gap-1.5 text-gray-500 relative z-10">
            <svg
              class="h-4 w-4 text-teal-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clip-rule="evenodd"
              />
            </svg>

            {event.locationLink ? (
              <a
                href={event.locationLink}
                target="_blank"
                rel="noopener noreferrer"
                class="max-w-[250px] truncate hover:text-navy-700 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()} // Prevents clicking the card background
              >
                {event.location}
              </a>
            ) : (
              <span class="max-w-[250px] truncate">{event.location}</span>
            )}
          </div>
        )}
      </div>

      <div class="absolute top-5 right-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <svg
          class="text-navy-400 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </article>
  );
};

const SkeletonCard = () => (
  <div class="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
    <div class="mb-4 h-5 w-20 rounded bg-gray-200" />
    <div class="mb-3 h-6 w-4/5 rounded bg-gray-200" />
    <div class="mb-4 h-4 w-3/5 rounded bg-gray-200" />
    <div class="flex gap-3">
      <div class="h-4 w-24 rounded bg-gray-200" />
      <div class="h-4 w-20 rounded bg-gray-200" />
    </div>
  </div>
);

const UpcomingEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = (
          await eventsApiClient.apiV1EventsGet({ upcomingOnly: true })
        )
          .filter((x) => x.featured)
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
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div
      class={`grid grid-cols-1 gap-6 sm:grid-cols-${Math.min(featuredEvents.length, 2)} lg:grid-cols-${Math.min(featuredEvents.length, 3)}`}
    >
      {featuredEvents.map((event) => (
        <EventCard event={event} />
      ))}
    </div>
  );
};

export default UpcomingEvents;
