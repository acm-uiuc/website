import { FaLocationArrow, FaRegCalendarAlt, FaSignInAlt } from 'react-icons/fa';
import { BsArrowRepeat } from 'react-icons/bs';
import { getOrganizationImage } from '@/components/LazyImage';
import { getRepeatString } from '@/utils/dateutils';
import { getEventURL, IEvent, toHumanDate } from '@/components/Events/events';

interface EventProps {
  event?: IEvent;
  compact?: boolean;
}

export function EventDetail({
  href,
  children,
  compact = false,
}: {
  href?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const text = (
    <span className={`flex flex-row items-center gap-2 min-w-0 ${compact
      ? 'text-xs font-medium'
      : 'text-sm font-medium'
      }`}>
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-all duration-200"
      >
        {text}
      </a>
    );
  }
  return text;
}

export default function EventCard({ event, compact = false }: EventProps) {
  const {
    title,
    description,
    locationLink,
    dateLink,
    repeats,
    paidEventId,
    host,
    location,
  } = event || {};

  const link = event ? getEventURL(event) : '';
  const date = event ? toHumanDate(event.start) : '';

  if (compact) {
    // Compact mode for "Coming Up" list - mini cards
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer flex items-center justify-between overflow-hidden h-12">
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">
            <a href={link} className="hover:underline">
              {title}
            </a>
          </div>
          <div className="text-white/70 text-xs truncate">
            {date} {repeats && `- Repeats ${repeats}`}
          </div>
        </div>
        <div className="ml-2 flex items-center gap-2 flex-shrink-0">
          {host && (
            <div className="w-8 h-8">
              {getOrganizationImage(host, 'w-8 h-8 ring-1 ring-white/20 rounded-full')}
            </div>
          )}
          {paidEventId && (
            <div className="w-2 h-2 bg-cambridge_blue-300 rounded-full"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer h-64">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-white font-semibold text-2xl mb-2 group-hover:text-secondary-200 transition-colors leading-tight">
            <a href={link} className="hover:underline block">
              {title}
            </a>
          </h3>
          {description && (
            <p className="text-white/80 text-base leading-relaxed line-clamp-3 mb-2">
              {description}
            </p>
          )}
        </div>
        {host && (
          <div className="flex-shrink-0">
            {getOrganizationImage(host, 'w-10 h-10 ring-2 ring-white/20 rounded-full')}
          </div>
        )}
      </div>

      {/* Featured Details */}
      <div className="space-y-2 mb-4">
        {location && (
          <EventDetail href={locationLink}>
            <FaLocationArrow className="shrink-0 text-white/60 w-4 h-4" />
            <span className="text-white/90">{location}</span>
          </EventDetail>
        )}
        <EventDetail href={dateLink}>
          <FaRegCalendarAlt className="shrink-0 text-white/60 w-4 h-4" />
          <span className="text-white/90">{date}</span>
        </EventDetail>
        {repeats && (
          <EventDetail href={dateLink}>
            <BsArrowRepeat className="shrink-0 text-white/60 w-4 h-4" />
            <span className="text-white/90">{getRepeatString(repeats)}</span>
          </EventDetail>
        )}
      </div>

      {/* Featured Register Button */}
      {paidEventId && (
        <div className="flex justify-end">
          <a
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-cambridge_blue-300 hover:bg-cambridge_blue-500 transition-all duration-300 transform hover:scale-105 shadow-sm"
            href={
              paidEventId.startsWith('merch:')
                ? '/merch?id=' + paidEventId.slice(6)
                : '/event?id=' + paidEventId
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSignInAlt className="shrink-0 h-4 w-4" />
            <span>Register</span>
          </a>
        </div>
      )}
    </div>
  );
}
