import { Button, ButtonGroup } from "@nextui-org/react";
import styles from './index.module.css';
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";



function SortDropDown1() { // replace name with smth that makes sense
    return (
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="bordered" 
            >
              Open Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">Option 1</DropdownItem>
            <DropdownItem key="copy">Option 2</DropdownItem>
            <DropdownItem key="edit">Option 3</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger"> Option Red</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
}


interface CalendarControlProps {
  currOffset:number,
  updateOffset: React.Dispatch<React.SetStateAction<number>>
};

export default function CalendarControls({currOffset, updateOffset} : CalendarControlProps) {
    const currDate = "March 2024";
    const incrementDate = () => {
      updateOffset(currOffset+1);
    }
    const decrementDate = () => {
      updateOffset(currOffset-1);
    }
    return (
    <div>
        <text>{currDate}</text>
        <ButtonGroup>
            <Button className="bg-primary text-white hover:cursor-pointer">Today</Button>
            <Button onPress={decrementDate} className="bg-primary text-white hover:cursor-pointer">Back</Button>
            <Button onPress={incrementDate} className="bg-primary text-white hover:cursor-pointer" >Next</Button>
        </ButtonGroup>
        <SortDropDown1></SortDropDown1>
    </div>
    )
}