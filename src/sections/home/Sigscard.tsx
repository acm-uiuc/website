'use client';

import Card from '@/components/Card/Card';
import { IEvent } from '@/components/Events/events';
import { IOrgData } from '@/sections/home/SigData';

interface SigscardProps {
  upcomingEvents: IEvent[];
  eventsLoading: boolean;
  sigs: IOrgData[];
}

export default function Sigscard({ upcomingEvents, eventsLoading, sigs }: SigscardProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sigs.map(({ title, description, link1, linktext1, linktext2, link2, linktext3, link3 }) => (
        <Card
          key={title}
          events={upcomingEvents.filter((event) => event.host === title)}
          title={title}
          description={description}
          link1={link1}
          link2={link2}
          linktext1={linktext1}
          linktext2={linktext2}
          link3={link3}
          linktext3={linktext3}
        /> 
      ))}
    </div>
  );
};
