import React, { useRef } from 'react';

interface CarouselProps {
  children: React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  function RightButton() {
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
      <button className="bg-transparent cursor-pointer flex items-center justify-center p-2 border-[none]" onClick={scrollRight}>
        <svg height="50px" width="50px" version="1.1" id="Capa_1" 
        viewBox="0 0 185.343 185.343" className="fill-[white] transition-transform duration-[0.2s] ease-[ease-in-out] hover:translate-x-0.5">
          <g>
            <g>
            <path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175
			l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934
			c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"/>
            </g>
          </g>
        </svg>
      </button>
    );
  }

  function LeftButton() {
    const scrollLeft = () => {
      if (carouselRef.current) {
        const firstChild = carouselRef.current.firstChild as HTMLDivElement;
        const carouselWidth = carouselRef.current.offsetWidth;
        const columnGap = carouselWidth * 0.01;
        const scrollWidth = firstChild.offsetWidth + columnGap;
        carouselRef.current.scrollLeft -= scrollWidth;
      }
    };
    return (
      <button className="bg-transparent cursor-pointer flex items-center justify-center p-2 border-[none]" onClick={scrollLeft}>
        <svg height="50px" width="50px" version="1.1" id="Capa_1" 
        viewBox="0 0 185.343 185.343" className="fill-[white] transition-transform duration-[0.2s] ease-[ease-in-out] hover:translate-x-0.5">
          <g>
            <g>
              <path d="m133.6 185.3c2.8 0 5.5-1 7.6-3.1 4.2-4.2 4.2-11 0-15.2l-74.3-74.3 74.3-74.4c4.2-4.2 4.2-11 0-15.2-4.2-4.1-11-4.1-15.2 0l-81.9 82c-4.2 4.2-4.2 11 0 15.2l81.9 81.9c2.1 2.1 4.9 3.1 7.6 3.1z"/>
            </g>
          </g>
        </svg>
      </button>
    );
  }
  


  return (
    <div className="flex items-center overflow-hidden">
      <LeftButton/>
      <div className="flex overflow-x-auto scroll-smooth gap-x-[1%] w-[90%] p-0" ref={carouselRef}>
        {children}
      </div>
      <RightButton/>
    </div>
  );
};

export default Carousel;
