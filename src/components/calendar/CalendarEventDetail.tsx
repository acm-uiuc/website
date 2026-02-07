import { MapPin, Calendar, LogIn, User } from 'lucide-react';
import type { Event } from '../../types/events';

interface CalendarEventDetailProps {
  event: Event | null;
  start?: Date;
  end?: Date;
}

export default function CalendarEventDetail({
  event,
  start,
  end,
}: CalendarEventDetailProps) {
  if (!event) {
    return (
      <p class="mt-2 pt-5 text-center text-gray-500">
        Click on an event to see more details!
      </p>
    );
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeFmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz,
    timeZoneName: 'short',
  });

  const calendar =
    start && end && start.getTime() !== end.getTime()
      ? `${timeFmt.format(start)} - ${timeFmt.format(end)}`
      : start
        ? timeFmt.format(start)
        : '';

  const paidEventHref = event.paidEventId
    ? `/store/item?id=${event.paidEventId}`
    : undefined;

  return (
    <div class="mt-2 flex flex-col break-words rounded-2xl border-2 border-navy-800/10 border-t-transparent">
      <div class="rounded-t-2xl bg-navy-800 px-4 py-2 text-center text-xl font-semibold text-white">
        Event Information
      </div>
      <div class="space-y-2 p-5">
        <h4 class="text-lg font-semibold">{event.title}</h4>

        <div class="flex items-center gap-2 text-sm text-gray-700">
          <MapPin size={16} className="shrink-0" />
          {event.locationLink ? (
            <a
              href={event.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              class="text-navy-600 hover:underline"
            >
              {event.location}
            </a>
          ) : (
            <span>{event.location}</span>
          )}
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-700">
          <Calendar size={16} className="shrink-0" />
          <span>{calendar}</span>
        </div>

        {event.host && (
          <div class="flex items-center gap-2 text-sm text-gray-700">
            <User size={16} className="shrink-0" />
            <span>{event.host}</span>
          </div>
        )}

        <p class="text-sm text-gray-600">{event.description}</p>

        {paidEventHref && (
          <a
            href={paidEventHref}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-md bg-navy-800 px-4 py-2 text-white hover:bg-navy-700"
          >
            <LogIn size={16} className="shrink-0" />
            <span>Register</span>
          </a>
        )}
      </div>
    </div>
  );
}
