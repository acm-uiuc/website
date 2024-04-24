import React, { useState } from "react";
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Input,
    Button,
    useDisclosure,
    Checkbox
} from "@nextui-org/react";
import {DatePicker} from "@nextui-org/react";

const AddEventModal = () => {
    const [eventData, setEventData] = useState({
      title: '',
      dateLink: '',
      location: '',
      locationLink: '',
      description: '',
      paidEventId: '',
      host: '',
      startDate: '',
      endDate: '',
      repeats: false,
    });
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // location: string;
    //   locationLink?: string;
    //   dateLink?: string;
    //   title: string;
    //   description: string;
    //   repeats?: string | boolean;
    //   paidEventId?: string;
    //   host: string;
    //   startDate: string;
    //   endDate: string;
  
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const { name, value } = e.target;
    //   setEventData((prevData) => ({
    //     ...prevData,
    //     [name]: value,
    //   }));
    // };
  
    // const handleDateChange = (date: Date | null) => {
    //   setEventData((prevData) => ({
    //     ...prevData,
    //     eventDate: date ? date.toISOString() : '',
    //   }));
    // };
  
    // const handleSubmit = (e: React.FormEvent) => {
    //   e.preventDefault();

    //   // delete this
    //   console.log('Event Data:', eventData);

    //   setEventData({
    //     title: '',
    //     dateLink: '',
    //     location: '',
    //     locationLink: '',
    //     description: '',
    //     paidEventId: '',
    //     host: '',
    //     startDate: '',
    //     endDate: '',
    //     repeats: false,
    //   });
    // };
  
    return (
        <>
            <Button onPress={onOpen} color="primary">Add Event</Button>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
                size="2xl"
            >
                {/* <form onSubmit={handleSubmit}> */}
                <ModalContent>
                    {/* <Input
                    label="Event Name"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                    fullWidth
                    mb
                    />
                    <DatePicker
                    label="Event Date"
                    name="dateLink"
                    value={eventData.dateLink}
                    onChange={handleDateChange}
                    required
                    fullWidth
                    mb
                    />
                    <Input
                    label="Location"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    fullWidth
                    mb
                    />
                    <Input
                    label="Description"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    fullWidth
                    mb
                    />
                    <Input
                    label="Host"
                    name="host"
                    value={eventData.host}
                    onChange={handleChange}
                    fullWidth
                    mb
                    /> */}

                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Event</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    isRequired
                                    label="Event Name"
                                    placeholder="i.e. Bar Crawl"
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    label="Host"
                                    placeholder="i.e. ACM Infra"
                                    variant="bordered"
                                />
                                <DatePicker
                                    isRequired
                                    label="Event Date"
                                    variant="bordered"
                                />
                                <DatePicker
                                    isRequired
                                    label="Start Date"
                                    variant="bordered"
                                />
                                <DatePicker
                                    isRequired
                                    label="End Date"
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    label="Location"
                                    placeholder="i.e. CIF 4018"
                                    variant="bordered"
                                />
                                <Input
                                    label="Location Link"
                                    placeholder="???????????"
                                    variant="bordered"
                                />
                                <Input
                                    isRequired
                                    label="Event Description"
                                    placeholder="i.e. Join us for fried chicken!"
                                    variant="bordered"
                                />
                                <Input
                                    label="Paid Event Id"
                                    placeholder="i.e. ????????"
                                    variant="bordered"
                                />
                                <Checkbox
                                    classNames={{
                                    label: "text-small",
                                    }} >
                                    Event Repeats
                                </Checkbox>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                Cancel
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
                {/* </form> */}
            </Modal>
        </>
    );
  };
  
  export default AddEventModal;