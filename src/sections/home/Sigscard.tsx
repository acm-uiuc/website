'use client';

import Card from '@/components/Card/Card';
import { IEvent } from '@/components/Events/events';
import { IOrgData } from '@/utils/organizations';

interface SigscardProps {
  upcomingEvents: IEvent[];
  eventsLoading: boolean;
  sigs: IOrgData[];
}

export default function Sigscard({ upcomingEvents, eventsLoading, sigs }: SigscardProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sigs.map(({ title, description, links }) => (
        <Card
          key={title}
          events={upcomingEvents.filter((event) => event.host === title)}
          title={title}
          description={description}
          links={links}
        /> 
      ))}
    </div>
  );
};
