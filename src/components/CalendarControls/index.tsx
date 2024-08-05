import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import moment from 'moment'
import { momentLocalizer, View, Views } from 'react-big-calendar'
import {Unit} from 'date-arithmetic'

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
export default function CalendarControls({currDisplayDate, updateDisplayDate, currView, updateCurrView} : CalendarControlProps) {

    function changeDate(offset: number, unit: string): void {
      updateDisplayDate(localizer.add(currDisplayDate, offset, unit as Unit))
    }

    function resetDate(): void {
      updateDisplayDate(localizer.startOf(new Date(), 'month'));
    }

    function extractMonthAndYear(currDate : Date) : string {
      return currDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }
    function getCurrentDate(currDate: Date): string {
      return currDate.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    }

    return (
    <>
    <div className="grid grid-cols-12 w-full">
      <div className="flex col-span-4 lg:col-span-5">
        <h3>{extractMonthAndYear(currDisplayDate)}</h3>
      </div>
        <div className="flex items-center ml-4 gap-x-4 col-span-6 lg:col-span-6 flex-wrap">
          <Button onPress={()=> {resetDate()}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer">Today</Button>
          <ButtonGroup>
              <Button isIconOnly onPress={() => {changeDate(-1, currView)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer "><FaArrowLeft /></Button>
              <Button isIconOnly onPress={() => {changeDate(1, currView)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer" ><FaArrowRight /></Button>
          </ButtonGroup>
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
              <DropdownItem key={Views.WEEK}>Week View</DropdownItem>
              <DropdownItem key={Views.MONTH}>Month View (default)</DropdownItem>
              <DropdownItem key={Views.AGENDA}>Agenda View</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
    </div>
    <a style={{paddingRight: '3vw'}}>{currView == Views.DAY ? getCurrentDate(currDisplayDate): null}</a> 
    </>
    )
}