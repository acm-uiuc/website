import {
  FaLocationArrow,
  FaRegCalendarAlt,
  FaSignInAlt,
} from 'react-icons/fa';
import { BsArrowRepeat } from 'react-icons/bs';

interface EventProps {
  location: string;
  locationLink?: string;
  date: string;
  dateLink?: string;
  title: string;
  description: string;
  repeats?: string | boolean;
  paidEventId?: string;
};

function EventDetail({ href, children }: { href?: string, children: React.ReactNode }) {
  const text = (
    <span className="flex flex-row items-center gap-2 text-base font-bold">
      {children}
    </span>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
        {text}
      </a>
    );
  }
  return text;
}

export default function EventCard({
  location,
  date,
  title,
  description,
  locationLink,
  dateLink,
  repeats,
  paidEventId
}: EventProps) {
  return (
    <div className="flex flex-col p-4 rounded-3xl bg-surface-050 hover:shadow-lg hover:-translate-y-1 transition-all">
      <p className="text-2xl font-bold">
        {title}
      </p>
      <p className="flex grow leading-6 pb-4">
        {description}
      </p>
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-col">
          <EventDetail href={locationLink}>
            <FaLocationArrow className="shrink-0" />
            <span>{location}</span>
          </EventDetail>
          <EventDetail href={dateLink}>
            <FaRegCalendarAlt className="shrink-0" />
            <span>{date}</span>
          </EventDetail>
          {repeats ? (
            <EventDetail href={dateLink}>
              <BsArrowRepeat className="shrink-0" />
              <span>Every {repeats}</span>
            </EventDetail>
          ) : null}
        </div>
        {paidEventId ? (
          <a
            className="inline-flex flex-row grow-0 items-center gap-2 px-4 py-2 text-white rounded-2xl bg-primary hover:bg-secondary transition-all"
            href={paidEventId.startsWith("merch:") ? "/merch?id=" + paidEventId.slice(6) :"/event?id=" + paidEventId}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSignInAlt className="shrink-0" />
            <span>Register</span>
          </a>
        ) : null}
      </div>
    </div>
  );
};