import React, { useState } from 'react';

const config = {
  enabled: true,
  visibleStartUtc: Date.parse('2025-09-02T17:00:00Z'), // UTC time
  visibleEndUtc: Date.parse('2025-09-03T02:00:00Z'), // UTC time
  title: "ACM Open House is happening from 6PM to 9PM today!",
  link: '/open-house', // relative path to the page
  linkTitle: 'View booth information.',
  bgColor: '#000000',
};

const CloseButton = () => {
  return (
    <>
      <span className="sr-only">Close menu</span>
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </>
  );
};

const StickyHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!config.enabled) return null;
  if (!isVisible) return null;
  const date = new Date();
  const started = +date - config.visibleStartUtc < 0;
  const ended = +date - config.visibleEndUtc > 0;
  const prod = Boolean(process.env.NEXT_PUBLIC_RUN_ENV === 'prod');

  if (prod && (started || ended)) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Main Sticky Header */}
      <div
        className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 flex items-center justify-center"
        style={{ background: config.bgColor, zIndex: 1000 }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl">
          <div className="flex-1"></div>
          <div>
            {config.title}{' '}
            <a
              href={config.link}
              target="_blank"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {config.linkTitle}
            </a>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close banner"
            >
              <CloseButton />
            </button>
          </div>
        </div>
      </div>

      {!prod && (started || ended) && (
        <div className="absolute top-10 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium">
          The event banner will not be shown in Prod due to start or end time.
        </div>
      )}

      <div className="h-16"></div>
    </div>
  );
};

export default StickyHeader;
