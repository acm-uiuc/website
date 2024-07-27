import React, { useEffect, useState } from 'react';
import Carousel from './Carousel';
import EventCard from '@/components/Card/EventCard';
import Moment from 'moment';

function toHumanDate(date: string) {
    Moment.locale('en');
    return Moment(date).format("MMMM Do, h:mm A");
  }

interface Event {
  location: string;
  locationLink?: string;
  date: string;
  dateLink?: string;
  title: string;
  description: string;
  repeats?: string | boolean;
  paidEventId?: string;
};

interface EventCarouselProps {
  eventList: Event[];
  numEventsPerSlide?: number;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ eventList, numEventsPerSlide = 3 }) => {
  
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {

      setMobile(window.innerWidth < 1024);

      const updateMedia = () => {
        setMobile(window.innerWidth < 1024);
      };

      window.addEventListener('resize', updateMedia);

      return () => {
        window.removeEventListener('resize', updateMedia);
      };

  }, []);

  const sortedEvents = eventList.sort((a, b) => Moment(a.date).unix() - Moment(b.date).unix());

  // chunk the sortedEvents array into sub-arrays of size numEventsPerSlide if not mobile
  const chunkedEvents = isMobile ? (sortedEvents.map((elem: Event) => [elem]))  : chunkArray(sortedEvents, numEventsPerSlide);

  // chunk an array into sub-arrays of a specific length
  function chunkArray(array : Event[], chunkSize : number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  return (
    <Carousel>
      {chunkedEvents.map((group: any[], index: React.Key | null | undefined) => (
        <div key={index} className={"grid flex-[0_0_100%] justify-between gap-[1%] w-full mt-[25px] mb-[50px] " + (isMobile ? "" : "grid-cols-[repeat(3,1fr)]")}>
          {group.map((object: { title: string; description: string; date: string; repeats: string | boolean | undefined; location: string; locationLink: string | undefined; paidEventId: string | undefined; }, i: React.Key | null | undefined) => (
          <EventCard
              key={i}
              title={object.title}
              description={object.description}
              date={toHumanDate(object.date)}
              repeats={object.repeats}
              location={object.location}
              locationLink={object.locationLink}
              paidEventId={object.paidEventId}
              />
          ))}
        </div>
      ))}
    </Carousel>
  );
};

export default EventCarousel;
function useMediaQuery(arg0: { query: string; }) {
  throw new Error('Function not implemented.');
}

