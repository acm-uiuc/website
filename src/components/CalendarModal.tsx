import { useEffect, useState } from 'preact/hooks';

interface Props {
  googleUrl: string;
  icalUrl: string;
}

const CalendarModal = ({ googleUrl, icalUrl }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        class="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add to Calendar
      </button>

      {isOpen && (
        <div class="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div class="relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white p-10 shadow-2xl animate-[popIn_200ms_ease-out]">
            {/* Close button */}
            <button
              onClick={handleClose}
              class="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close modal"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div class="mb-6 text-center">
              <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tangerine-100">
                <svg
                  class="h-6 w-6 text-tangerine-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-navy-900">
                Subscribe to our calendar
              </h2>
              <p class="mt-2 text-gray-600">Never miss an ACM event!</p>
            </div>

            {/* Options */}
            <div class="space-y-3">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-tangerine-500 hover:bg-tangerine-50"
              >
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500">
                  <svg
                    class="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.5 22h-15A2.5 2.5 0 012 19.5v-15A2.5 2.5 0 014.5 2H9v2H4.5a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5V15h2v4.5a2.5 2.5 0 01-2.5 2.5z" />
                    <path d="M18 2h-4v2h2.59L10 10.59 11.41 12 18 5.41V8h2V2z" />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-semibold text-navy-900">Google Calendar</h3>
                  <p class="text-sm text-gray-500">
                    Add to your Google Calendar
                  </p>
                </div>
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              <a
                href={icalUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-tangerine-500 hover:bg-tangerine-50"
              >
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-700">
                  <svg
                    class="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-semibold text-navy-900">Apple / iCal</h3>
                  <p class="text-sm text-gray-500">Subscribe via iCal feed</p>
                </div>
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
            <p className={'text-xs mt-2 text-gray-500 text-center'}>
              Not using one of these clients? Add{' '}
              <a
                href={icalUrl}
                class="text-navy-600 border-b-2 border-tangerine-300 transition-all hover:text-navy-800 hover:border-tangerine-500"
              >
                {icalUrl}
              </a>{' '}
              to your calendar application.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarModal;
