import styled, {css} from 'styled-components';
import { FaLocationArrow, FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import Text from '../Text/Text';
import Header from '../Header/Header';
import { EventIntroProps } from '../../pages/Calendar';

const EventContainer = styled.div`
    width: 25%;
    border: 1px solid;
    border-top: 1rem solid;
    padding: 15px;

    @media (max-width: 600px) {
        margin-top: 15px;
        width: 100%;
    }
`

const EventTitle = styled(Header)`
    margin-top: 0px;
    padding-top: 0px;
    margin-bottom: 5px;
    color: ${(props) => props.theme.fontColors.default};
`
const EventInfoPlusIcon = styled(Text)`
    margin-bottom: 5px;
    margin-top: 0px;
    display: flex;
`

const  EventDescription = styled(Text)`
    margin-bottom: 25px;
    margin-top: 0px;
`

const IconImage = css`
  width: 15px;
  height: 15px;
  margin-top: 5px;
  padding-right: 10px;
`;

const IconLocation = styled(FaLocationArrow)`
    ${IconImage}
`;

const IconCalendar = styled(FaRegCalendarAlt)`
    ${IconImage}
`;

const IconUser = styled(FaUser)`
    ${IconImage}
`;



function EventInfo({
    title,
    location,
    date,
    description,
    host,}: EventIntroProps) {
    if (title === undefined) {
        return (
            <EventContainer>
                <EventDescription>Click on an Event to see more details!</EventDescription>
            </EventContainer>
        )
    } else {
        return (
            <EventContainer>
                <EventTitle level={3}>{title}</EventTitle>
                <EventDescription>{description}</EventDescription>
                <EventInfoPlusIcon level = {6}>
                    <IconCalendar/> {date || "TBD"}
                </EventInfoPlusIcon>
                <EventInfoPlusIcon level = {6}>
                    <IconLocation/> {location || "TBD"}
                </EventInfoPlusIcon> 
                <EventInfoPlusIcon level = {6}>
                    <IconUser/> {host}
                </EventInfoPlusIcon>  
            </EventContainer>
        )
    }
}
export default EventInfo