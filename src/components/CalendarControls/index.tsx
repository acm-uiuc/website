import { Button, ButtonGroup } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'

interface CalendarControlProps {
  currDisplayDate: Date,
  updateDisplayDate: React.Dispatch<React.SetStateAction<Date>>
};

const localizer = momentLocalizer(moment);
export default function CalendarControls({currDisplayDate, updateDisplayDate} : CalendarControlProps) {

    function changeDate(offset : number): void {
      updateDisplayDate(localizer.add(currDisplayDate, offset, "month"))
      console.log(currDisplayDate);
    }

    function resetDate(): void {
      updateDisplayDate(localizer.startOf(new Date(), 'month'));
    }

    function extractMonthAndYear(currDate : Date) : string {
      return currDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }

    return (
    <div className="w-2/3 flex items-center justify-between">
        <h3>{extractMonthAndYear(currDisplayDate)}</h3>

        <div className="flex items-center gap-x-4">
          <Button onPress={()=> {resetDate()}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer">Today</Button>
          <ButtonGroup>
              <Button isIconOnly onPress={() => {changeDate(-1)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer "><FaArrowLeft /></Button>
              <Button isIconOnly onPress={() => {changeDate(1)}} variant="bordered" className="border-surface-000 border-1 bg-primary text-white hover:cursor-pointer" ><FaArrowRight /></Button>
          </ButtonGroup>
        </div>
        
    </div>
    )
}