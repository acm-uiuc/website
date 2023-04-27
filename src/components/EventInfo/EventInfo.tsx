import styled, {css} from 'styled-components';
import { FaLocationArrow, FaUser, FaRegCalendarAlt } from 'react-icons/fa';
import Text from '../Text/Text';
import Header from '../Header/Header';
import { EventIntroProps } from '../../pages/Calendar';

const EventContainer = styled.div`
    width: 27%;
    background-color: #fafafa;
    border: 2px solid rgba(62, 72, 111, 0.1);
    /*border-top: 2rem solid ${(props) => props.theme.colors.acmDark};*/
    border-radius: 18px;
    border-top: 0px;
    
    overflow-wrap: break-word;

    background-color: ${(props) => props.theme.colors.white};
    align-self: bottom;
    @media (max-width: 600px) {
        width: 100%;
        margin-top: 15px;
    }

    filter: grayscale(35%);
    &:hover {
        filter: grayscale(0%) drop-shadow(0 4px 12px rgb(104 112 118 / 0.08)) drop-shadow(0 20px 8px rgb(104 112 118 / 0.04));
        transform: translateY(-1px);
        background-color: white;
    }
`

const EventTitle = styled(Header)`
    margin-top: 10px;
    margin-bottom: 10px;
    color: ${(props) => props.theme.fontColors.default};
    
`;

const EventInfoPlusIcon = styled.div`
    margin-bottom: 0px;
    margin-top: 0px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.fontColors.default};
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSizes.body * 0.9}px;
`

const EventDescription = styled(Text)`
    margin-bottom: 25px;
    margin-top: 10px;
    @media (max-width: 600px) {
        width: 100%;
        margin-top: 15px;
    }
`

const EventDescriptionEmpty = styled(EventDescription)`
    width: 22%;
    text-align: center;
    @media (max-width: 600px) {
        margin-top: 10%;
        width: 100%;
        
    }
`
const EventInfoHeader = styled.div`
    background-color: ${(props) => props.theme.colors.acmDark};
    border-radius: 18px 18px 0px 0px;
    text-align: center;
    padding: 5% 0%;
    color: ${(props) => props.theme.fontColors.bodyLight};
    font-family: ${(props) => props.theme.fonts.body};
    font-size: ${(props) => props.theme.fontSizes.h4}px;
    font-weight: bold;

`

const PaddingWrapper = styled.div`
    padding: 5%;
    padding-top: 0.5%;
`

const IconImage = css`
  width: 15px;
  height: 15px;
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
                <EventDescriptionEmpty>Click on an event to see more details!</EventDescriptionEmpty>
        )
    } else {
        return (
                <EventContainer>
                    <EventInfoHeader>Event Information</EventInfoHeader>
                    <PaddingWrapper>
                        <EventTitle level={4}>{title}</EventTitle>
                        <EventInfoPlusIcon>
                            <IconLocation/> {location || "TBD"}
                        </EventInfoPlusIcon> 
                        <EventInfoPlusIcon>
                            <IconCalendar/> {date || "TBD"}
                        </EventInfoPlusIcon>
                        <EventInfoPlusIcon>
                            <IconUser/> {host}
                        </EventInfoPlusIcon> 
                        <EventDescription>{description}</EventDescription> 
                    </PaddingWrapper>
                </EventContainer>
        )
    }
}
export default EventInfo