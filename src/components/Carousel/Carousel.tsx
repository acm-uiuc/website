import React, { useRef } from 'react';
import './Carousel.css';

interface CarouselProps {
  children: React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const firstChild = carouselRef.current.firstChild as HTMLDivElement;
      const carouselWidth = carouselRef.current.offsetWidth;
      const columnGap = carouselWidth * 0.01;
      const scrollWidth = firstChild.offsetWidth + columnGap;
      carouselRef.current.scrollLeft -= scrollWidth;
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const firstChild = carouselRef.current.firstChild as HTMLDivElement;
      const carouselWidth = carouselRef.current.offsetWidth;
      const columnGap = carouselWidth * 0.01;
      const scrollWidth = firstChild.offsetWidth + columnGap;
      carouselRef.current.scrollLeft += scrollWidth;
    }
  };

  return (
    <div className="carousel-container">
      <button onClick={scrollLeft}>Left</button>
      <div className="carousel" ref={carouselRef}>
        {children}
      </div>
      <button onClick={scrollRight}>Right</button>
    </div>
  );
};

export default Carousel;
