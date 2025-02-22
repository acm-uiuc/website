import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import moment, { max } from 'moment-timezone'
import { momentLocalizer, View, Views } from 'react-big-calendar'
import {Unit} from 'date-arithmetic'
import { useEffect, useState } from "react";
import next from "next";

interface CalendarControlProps {
  currDisplayDate: Date,
  updateDisplayDate: React.Dispatch<React.SetStateAction<Date>>
  currView: View,
  updateCurrView: React.Dispatch<React.SetStateAction<View>>
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const localizer = momentLocalizer(moment);

export const maxRenderDistance = moment().add(1, 'year').endOf('month');
export default function CalendarControls({currDisplayDate, updateDisplayDate, currView, updateCurrView} : CalendarControlProps) {
    const [nextDisabled, setNextDisabled] = useState(moment(currDisplayDate).isSameOrAfter(maxRenderDistance));
    
    function changeDate(offset: number, unit: string): void {
      if (unit == Views.AGENDA) {
        unit = Views.MONTH;
      }
      const candidateDate = localizer.add(currDisplayDate, offset, unit as Unit)
      const clamping = candidateDate > maxRenderDistance.toDate();
      setNextDisabled(clamping);
      updateDisplayDate(clamping ? maxRenderDistance.toDate() : candidateDate);
    }

    function resetDate(): void {
      updateDisplayDate(moment().local().toDate());
    }

    function extractMonthAndYear(currDate : Date) : string {
      return currDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    function getCurrentDate(currDate: Date): string {
      return currDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }
    return (
    <>
    <div className="grid lg:grid-cols-12 grid-cols-8 w-full">
      <div className="flex col-span-3 md:col-span-4 lg:col-span-6 items-center">
        <div className="text-xl font-bold">{currView == Views.DAY ? getCurrentDate(currDisplayDate) : extractMonthAndYear(currDisplayDate)}</div>
      </div>
        <div className="flex items-center justify-end ml-4 gap-x-4 col-span-5 md:col-span-4 lg:col-span-6">
          <Button onPress={()=> {resetDate()}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer hidden md:block">Today</Button>
          <ButtonGroup>
              <Button isIconOnly onPress={() => {changeDate(-1, currView)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer "><FaArrowLeft /></Button>
              <Button disabled={nextDisabled} isIconOnly onPress={() => {changeDate(1, currView)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer" ><FaArrowRight /></Button>
          </ButtonGroup>
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="bordered" 
                >
                  {capitalizeFirstLetter(currView)} View
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Set calendar view" 
                onAction={(key) => updateCurrView(key as View)}
              >
                <DropdownItem key={Views.DAY}>Day View</DropdownItem>
                <DropdownItem key={Views.WEEK} className="hidden md:block">Week View</DropdownItem>
                <DropdownItem key={Views.MONTH}>Month View (default)</DropdownItem>
                <DropdownItem key={Views.AGENDA}>Agenda View</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
    </div>
    </>
    )
}