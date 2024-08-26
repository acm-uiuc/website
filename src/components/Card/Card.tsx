import { getOrganizationImage, LazyImageProps, Organization } from '@/components/LazyImage';
import { IEvent } from '../Events/events';
import { getEstimatedOccurrencesInYear } from '@/utils/dateutils';
import { BsArrowRepeat } from 'react-icons/bs';
import { IOrgData } from '@/sections/home/SigData';


interface CardProps extends IOrgData {
  events: IEvent[]
};

export default function Card({ 
  title,
  description,
  links,
  events
}: CardProps) {
  // Calculate number of events in next year
  const eventTotal = events.map((event) => {
    if (event.repeats) {
      return getEstimatedOccurrencesInYear(event.repeats);
    }
    return 1;
  }).reduce((a, b) => a + b, 0);
  
  const eventsPerWeek = Math.round(eventTotal / 52);
  return (
    <div className="flex flex-col p-4 items-center rounded-3xl border-2 border-surface-150 hover:bg-surface-000 hover:border-transparent hover:shadow-xl hover:-translate-y-[1px] transition-all">
      {getOrganizationImage(title)}
      <div className="flex flex-col grow mb-4">
        <h2 className="text-center">{title}</h2>
        <p className="leading-6">{description}</p>
        {eventsPerWeek > 0 && 
        <div className="flex pt-1 flex-row items-center gap-2 text-base">
          <BsArrowRepeat className="shrink-0" />
          <span>Meets ~{eventsPerWeek} meetings / week</span>
        </div>
        }
      </div>
      <div className="flex flex-row w-full justify-between items-end">
        {links.map(({ link, text }) => (
          <a
            key={text}
            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        ))}
      </div>
    </div>
  );
};