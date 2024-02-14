import React from 'react';
import Carousel from './Carousel';
import EventCard from '@/components/Card/EventCard';
import Moment from 'moment';

function toHumanDate(date: string) {
    Moment.locale('en');
    return Moment(date).format("MMMM Do, h:mm A");
  }

interface EventCarouselProps {
  eventList: Event[];
  numEventsPerSlide?: number;
}

const EventCarousel: React.FC<EventCarouselProps> = ({ eventList, numEventsPerSlide = 3 }) => {
  // Your event sorting and chunking logic here
  const sortedEvents = eventList.sort((a, b) => Moment(a.date).unix() - Moment(b.date).unix());

  // Chunk the sortedEvents array into sub-arrays of size numEventsPerSlide
  const chunkedEvents = chunkArray(sortedEvents, numEventsPerSlide);

  // A utility function to chunk an array into sub-arrays of a specific length
  function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }


  return (
    <div>
      <h1>My Carousel</h1>
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
