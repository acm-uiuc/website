import React from 'react';
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

  const sortedEvents = eventList.sort((a, b) => Moment(a.date).unix() - Moment(b.date).unix());

  // chunk the sortedEvents array into sub-arrays of size numEventsPerSlide
  const chunkedEvents = chunkArray(sortedEvents, numEventsPerSlide);

  // chunk an array into sub-arrays of a specific length
  function chunkArray(array : Event[], chunkSize : number) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }


  return (
    <div>
      <Carousel>
        {chunkedEvents.map((group, index) => (
            <div key={index} className="card-group">
                {group.map((object, i) => (
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
    </div>
  );
};

export default EventCarousel;
