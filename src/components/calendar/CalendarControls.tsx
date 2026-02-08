import { add, format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentChildren } from 'preact';
import type { View } from 'react-big-calendar';
import { dateFnsLocalizer, Views } from 'react-big-calendar';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
});

const MAX_FORWARD_YEARS = 1;

interface CalendarControlsProps {
  displayDate: Date;
  setDisplayDate: (d: Date) => void;
  view: View;
  setView: (v: View) => void;
  children?: ComponentChildren;
}

export default function CalendarControls({
  displayDate,
  setDisplayDate,
  view,
  setView,
  children,
}: CalendarControlsProps) {
  const maxDate = add(new Date(), { years: MAX_FORWARD_YEARS });
  const nextDisabled = displayDate >= maxDate;

  function changeDate(offset: number) {
    const unit = view === Views.AGENDA ? Views.MONTH : view;
    const candidate = localizer.add(displayDate, offset, unit as string);
    if (candidate > maxDate) {
      setDisplayDate(maxDate);
    } else {
      setDisplayDate(candidate);
    }
  }

  function extractLabel(): string {
    if (view === Views.DAY) {
      return displayDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    return displayDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div class="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="text-xl font-bold">{extractLabel()}</div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setDisplayDate(new Date())}
          class="hidden rounded-md bg-navy-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-navy-700 md:block"
        >
          Today
        </button>
        <div class="flex">
          <button
            onClick={() => changeDate(-1)}
            class="rounded-l-md bg-navy-800 p-2 text-white hover:bg-navy-700"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => changeDate(1)}
            disabled={nextDisabled}
            class="rounded-r-md bg-navy-800 p-2 text-white hover:bg-navy-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <select
          value={view}
          onChange={(e) =>
            setView((e.target as HTMLSelectElement).value as View)
          }
          class="rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value={Views.DAY}>Day View</option>
          <option value={Views.WEEK} class="hidden md:block">
            Week View
          </option>
          <option value={Views.MONTH}>Month View</option>
          <option value={Views.AGENDA}>Agenda View</option>
        </select>
        {children}
      </div>
    </div>
  );
}
